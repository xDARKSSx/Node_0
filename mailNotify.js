/* Watches for Elena's emails becoming deliverable (12 minutes
   after the player gains portal access), shows a red badge on
   the "Mail" nav tab, and plays a notification sound once. */
document.addEventListener("DOMContentLoaded", () => {
    function makeId() {
        return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    let playerId = localStorage.getItem("node0_playerId");
    if (!playerId) {
        playerId = makeId();
        localStorage.setItem("node0_playerId", playerId);
    }
    const playerRef = db.ref("players/" + playerId);

    const DELIVERY_DELAY_MS = 12 * 60 * 1000; // 12 minutes after portal access

    function addBadge() {
        const mailLink = document.getElementById("navMail");
        if (!mailLink) return null;
        mailLink.style.position = "relative";
        let dot = document.getElementById("mailBadgeDot");
        if (!dot) {
            dot = document.createElement("span");
            dot.id = "mailBadgeDot";
            Object.assign(dot.style, {
                position: "absolute", top: "-2px", right: "-10px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#ff3b3b", display: "none",
            });
            mailLink.appendChild(dot);
        }
        return dot;
    }

    function playNotifySound() {
        if (sessionStorage.getItem("elena_sound_played") === "true") return;
        sessionStorage.setItem("elena_sound_played", "true");
        const a = new Audio("mail-notify.mp3");
        a.play().catch(() => { /* blocked until user interacts once, that's fine */ });
    }

    function checkAndDeliver() {
        playerRef.once("value", snap => {
            const data = snap.val() || {};
            const portalAt = data.portalAccessAt;
            let deliveredAt = data.elenaEmailsDeliveredAt;
            const read = data.elenaEmailsRead === true;

            if (!deliveredAt && portalAt && (Date.now() - portalAt) >= DELIVERY_DELAY_MS) {
                deliveredAt = Date.now();
                playerRef.child("elenaEmailsDeliveredAt").set(deliveredAt);
            }

            const dot = addBadge();
            if (dot) {
                if (deliveredAt && !read) {
                    dot.style.display = "block";
                    playNotifySound();
                } else {
                    dot.style.display = "none";
                }
            }
        });
    }

    checkAndDeliver();
    setInterval(checkAndDeliver, 20000);
});
