/* Reveals the "Mail" and "Researchers" nav tabs once
   chapter 4 has been reached, on every corporate page. */
document.addEventListener("DOMContentLoaded", () => {
    function update() {
        if (!window.getChapter) return;
        const show5 = window.getChapter() >= 5;
        const arch = document.getElementById("navArchive");
        const net = document.getElementById("navNetwork");
        if (arch) arch.style.display = show5 ? "inline" : "none";
        if (net) net.style.display = show5 ? "inline" : "none";
    }
    document.addEventListener("state-updated", update);
    update();
});
