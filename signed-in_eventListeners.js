if (document.getElementById("initial-form")) {
    document.getElementById("initial-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("A");
    });
}