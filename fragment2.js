document.addEventListener("DOMContentLoaded", () => {
    const lockedEl = document.getElementById("locked");
    const bookEl = document.getElementById("bookCover");
    const submitBtn = document.getElementById("submitBtn");
    const input = document.getElementById("reflectionInput");
    const thanksMsg = document.getElementById("thanksMsg");

    function makeId() {
        return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    let playerId = localStorage.getItem("node0_playerId");
    if (!playerId) {
        playerId = makeId();
        localStorage.setItem("node0_playerId", playerId);
    }
    const playerRef = db.ref("players/" + playerId);

    function updateVisibility() {
        playerRef.child("personalChapter").once("value", snap => {
            const myChapter = snap.val() || 1;
            if (myChapter >= 4) {
                lockedEl.style.display = "none";
                bookEl.style.display = "block";
            } else {
                lockedEl.style.display = "block";
                bookEl.style.display = "none";
            }
        });
    }
    document.addEventListener("state-updated", updateVisibility);
    updateVisibility();

    submitBtn.addEventListener("click", () => {
        const v = input.value.trim();
        if (v) playerRef.child("fragment2Echo").set(v);
        input.style.display = "none";
        submitBtn.style.display = "none";
        thanksMsg.style.display = "block";
    });
});
