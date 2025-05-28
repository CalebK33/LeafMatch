document.addEventListener("DOMContentLoaded", () => {
    const sidebarSearch = document.getElementById("sidebarSearch");
    if (sidebarSearch) {
        sidebarSearch.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = `database.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});
