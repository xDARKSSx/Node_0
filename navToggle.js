/* Reveals the "Archive" and "Network" nav tabs once
   THIS PLAYER has personally reached chapter 5. */
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
            const show5 = myChapter >= 5;
            const arch = document.getElementById("navArchive");
            const net = document.getElementById("navNetwork");
            if (arch) arch.style.display = show5 ? "inline" : "none";
            if (net) net.style.display = show5 ? "inline" : "none";
        });
    }
    document.addEventListener("state-updated", update);
    update();
});
