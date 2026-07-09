/* Reveals the "Mail" and "Researchers" nav tabs once
   chapter 4 has been reached, on every corporate page. */
document.addEventListener("DOMContentLoaded", () => {
    function update() {
        if (!window.getChapter) return;
        const show = window.getChapter() >= 4;
        const mail = document.getElementById("navMail");
        const res = document.getElementById("navResearchers");
        if (mail) mail.style.display = show ? "inline" : "none";
        if (res) res.style.display = show ? "inline" : "none";
    }
    document.addEventListener("state-updated", update);
    update();
});
