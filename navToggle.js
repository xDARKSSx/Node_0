/* Reveals the "Mail" and "Researchers" nav tabs once
   chapter 4 has been reached, on every corporate page. */
document.addEventListener("DOMContentLoaded", () => {
    function update() {
        if (!window.getChapter) return;
        const show4 = window.getChapter() >= 4;
        const show5 = window.getChapter() >= 5;
        const mail = document.getElementById("navMail");
        const res = document.getElementById("navResearchers");
        const arch = document.getElementById("navArchive");
        if (mail) mail.style.display = show4 ? "inline" : "none";
        if (res) res.style.display = show4 ? "inline" : "none";
        if (arch) arch.style.display = show5 ? "inline" : "none";
    }
    document.addEventListener("state-updated", update);
    update();
});
