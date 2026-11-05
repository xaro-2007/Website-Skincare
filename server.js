const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = __dirname;
const PRODUCTS_FILE = path.join(ROOT, "data", "products.json");
const MAX_BODY_BYTES = 1024 * 1024;
const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
};

function sendJSON(response, statusCode, data) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
    });
    response.end(JSON.stringify(data));
}

async function readRequestBody(request) {
    const chunks = [];
    let size = 0;

    for await (const chunk of request) {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
            const error = new Error("Request body is too large.");
            error.statusCode = 413;
            throw error;
        }
        chunks.push(chunk);
    }

    return Buffer.concat(chunks).toString("utf8");
}

function validateProducts(products) {
    if (!Array.isArray(products)) {
        return "Danh sách sản phẩm phải là một mảng.";
    }

    const ids = new Set();
    for (const product of products) {
        if (!product || typeof product !== "object" || Array.isArray(product)) {
            return "Thông tin sản phẩm không hợp lệ.";
        }
        if (!Number.isFinite(Number(product.id)) || Number(product.id) < 1) {
            return "Mã sản phẩm không hợp lệ.";
        }
        if (ids.has(String(product.id))) {
            return "Mã sản phẩm bị trùng.";
        }
        ids.add(String(product.id));

        if (typeof product.name !== "string" || !product.name.trim() || product.name.length > 100) {
            return "Tên sản phẩm không hợp lệ.";
        }
        if (typeof product.category !== "string" || !product.category.trim()) {
            return "Danh mục sản phẩm không hợp lệ.";
        }
        if (!Number.isFinite(Number(product.price)) || Number(product.price) < 0) {
            return "Giá sản phẩm không hợp lệ.";
        }
        if (!Number.isFinite(Number(product.stock)) || Number(product.stock) < 0) {
            return "Số lượng tồn kho không hợp lệ.";
        }
        if (typeof product.img !== "string" || !product.img.trim()) {
            return "Đường dẫn hình ảnh không hợp lệ.";
        }
    }

    return null;
}

async function serveProductsAPI(request, response) {
    if (request.method === "GET") {
        try {
            const contents = await fs.readFile(PRODUCTS_FILE, "utf8");
            sendJSON(response, 200, JSON.parse(contents));
        } catch (error) {
            console.error("Không đọc được data/products.json:", error);
            sendJSON(response, 500, { error: "Không đọc được danh sách sản phẩm." });
        }
        return;
    }

    if (request.method !== "PUT") {
        response.writeHead(405, { Allow: "GET, PUT" });
        response.end("Method Not Allowed");
        return;
    }

    try {
        const products = JSON.parse(await readRequestBody(request));
        const validationError = validateProducts(products);
        if (validationError) {
            sendJSON(response, 400, { error: validationError });
            return;
        }

        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4) + "\n", "utf8");
        sendJSON(response, 200, products);
    } catch (error) {
        if (error.statusCode) {
            sendJSON(response, error.statusCode, { error: error.message });
            return;
        }
        if (error instanceof SyntaxError) {
            sendJSON(response, 400, { error: "Dữ liệu JSON không hợp lệ." });
            return;
        }

        console.error("Không ghi được data/products.json:", error);
        sendJSON(response, 500, { error: "Không thể lưu danh sách sản phẩm." });
    }
}

async function serveStaticFile(request, response, pathname) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(pathname);
    } catch (error) {
        response.writeHead(400);
        response.end("Bad Request");
        return;
    }

    if (decodedPath === "/") {
        response.writeHead(302, { Location: "/USER/PAGES/trangchu.html" });
        response.end();
        return;
    }

    const filePath = path.resolve(ROOT, "." + decodedPath);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    try {
        const contents = await fs.readFile(filePath);
        response.writeHead(200, {
            "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        });
        response.end(request.method === "HEAD" ? undefined : contents);
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EISDIR") {
            response.writeHead(404);
            response.end("Not Found");
            return;
        }
        console.error("Không thể đọc tệp:", error);
        response.writeHead(500);
        response.end("Internal Server Error");
    }
}

const server = http.createServer(async function (request, response) {
    const url = new URL(request.url, "http://127.0.0.1");

    if (url.pathname === "/api/products") {
        await serveProductsAPI(request, response);
        return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method Not Allowed");
        return;
    }

    await serveStaticFile(request, response, url.pathname);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, "127.0.0.1", function () {
    console.log("Jinie Skin is running at http://127.0.0.1:" + port);
});
