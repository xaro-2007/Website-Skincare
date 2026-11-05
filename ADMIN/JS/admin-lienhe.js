function initContactMessages() {
    const tableBody = document.getElementById("contact-list");
    const searchInput = document.getElementById("contact-search");
    const statusFilter = document.getElementById("contact-status-filter");
    const emptyMessage = document.getElementById("empty-contacts");
    const dialog = document.getElementById("contact-dialog");
    const detail = document.getElementById("contact-detail");

    function getContacts() {
        const contacts = readStorage(CONTACT_KEY, []);
        return Array.isArray(contacts) ? contacts : [];
    }

    function renderContacts() {
        const contacts = getContacts();
        const keyword = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        const pending = contacts.filter(function (contact) {
            return contact.trangThai !== "Đã xử lý";
        }).length;

        document.getElementById("total-messages").textContent = contacts.length;
        document.getElementById("pending-messages").textContent = pending;
        document.getElementById("resolved-messages").textContent =
            contacts.length - pending;

        const filtered = contacts
            .map(function (contact, index) {
                return { contact: contact, index: index };
            })
            .filter(function (item) {
                const contact = item.contact;
                const searchable = [
                    contact.ten,
                    contact.email,
                    contact.chuDe,
                    contact.noiDung
                ].join(" ").toLowerCase();
                const status = contact.trangThai || "Chưa xử lý";

                return searchable.includes(keyword) &&
                    (selectedStatus === "all" || status === selectedStatus);
            })
            .reverse();

        tableBody.innerHTML = filtered.map(function (item) {
            const contact = item.contact;
            const status = contact.trangThai || "Chưa xử lý";

            return (
                "<tr>" +
                    "<td>" + escapeHTML(contact.ten || "Chưa cung cấp") + "</td>" +
                    "<td>" + escapeHTML(contact.email || "Chưa cung cấp") + "</td>" +
                    "<td>" + escapeHTML(contact.chuDe || "Khác") + "</td>" +
                    "<td>" + escapeHTML(formatDate(contact.ngayGui, true) || "Không rõ") + "</td>" +
                    '<td><span class="contact-status' +
                        (status === "Đã xử lý" ? " is-resolved" : "") + '">' +
                        escapeHTML(status) + "</span></td>" +
                    "<td>" +
                        '<button class="small" type="button" data-action="view" data-index="' +
                            item.index + '">Xem</button> ' +
                        (status === "Đã xử lý" ? "" :
                            '<button class="small" type="button" data-action="resolve" data-index="' +
                                item.index + '">Đã xử lý</button>') +
                    "</td>" +
                "</tr>"
            );
        }).join("");

        emptyMessage.hidden = filtered.length !== 0;
    }

    function showContact(contact) {
        document.getElementById("contact-dialog-title").textContent =
            "Tin nhắn từ " + (contact.ten || "khách hàng");
        detail.innerHTML =
            "<p><strong>Họ và tên:</strong> " + escapeHTML(contact.ten || "Chưa cung cấp") + "</p>" +
            "<p><strong>Email:</strong> " + escapeHTML(contact.email || "Chưa cung cấp") + "</p>" +
            "<p><strong>Chủ đề:</strong> " + escapeHTML(contact.chuDe || "Khác") + "</p>" +
            "<p><strong>Ngày gửi:</strong> " +
                escapeHTML(formatDate(contact.ngayGui, true) || "Không rõ") + "</p>" +
            '<div class="contact-message"><strong>Nội dung:</strong><p>' +
                escapeHTML(contact.noiDung || "Không có nội dung") + "</p></div>";
        dialog.showModal();
    }

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const index = Number(button.dataset.index);
        const contacts = getContacts();
        const contact = contacts[index];

        if (!contact) {
            renderContacts();
            return;
        }

        if (button.dataset.action === "view") {
            showContact(contact);
            return;
        }

        contact.trangThai = "Đã xử lý";

        if (saveStorage(CONTACT_KEY, contacts)) {
            addActivity('Đã xử lý tin nhắn liên hệ từ "' +
                (contact.ten || "khách hàng") + '"');
            renderContacts();
        }
    });

    document.getElementById("close-contact-dialog").addEventListener("click", function () {
        dialog.close();
    });

    searchInput.addEventListener("input", renderContacts);
    statusFilter.addEventListener("change", renderContacts);
    window.addEventListener("storage", function (event) {
        if (event.key === CONTACT_KEY) {
            renderContacts();
        }
    });

    renderContacts();
}

initContactMessages();
