/* Reveals nav tabs once THIS PLAYER has personally reached
   the matching chapter -- Meridian becomes a permanent hub
   back to everything already unlocked, even after closing tabs. */
document.addEventListener("DOMContentLoaded", () => {
    function makeId() {
        return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    let playerId = localStorage.getItem("node0_playerId");
    if (!playerId) {
        playerId = makeId();
        localStorage.setItem("node0_playerId", playerId);
    }

    function update() {
        if (typeof db === "undefined") return;
        db.ref("players/" + playerId + "/personalChapter").once("value", snap => {
            const myChapter = snap.val() || 1;
            const show4 = myChapter >= 4;
            const show5 = myChapter >= 5;
            const lsa = document.getElementById("navLsa");
            const staff = document.getElementById("navStaff");
            const arch = document.getElementById("navArchive");
            const net = document.getElementById("navNetwork");
            if (lsa) lsa.style.display = show4 ? "inline" : "none";
            if (staff) staff.style.display = show4 ? "inline" : "none";
            if (arch) arch.style.display = show5 ? "inline" : "none";
            if (net) net.style.display = show5 ? "inline" : "none";
        });
    }
    document.addEventListener("state-updated", update);
    update();
});
