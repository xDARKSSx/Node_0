document.addEventListener("DOMContentLoaded", () => {
    const lockedEl = document.getElementById("locked");
    const bookEl = document.getElementById("bookCover");
    const numSlot = document.getElementById("numSlot");
    const letterBody = document.getElementById("letterBody");

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
        playerRef.once("value", snap => {
            const data = snap.val() || {};
            const voted = localStorage.getItem("recognition_vote");
            if (!voted) {
                lockedEl.style.display = "block";
                bookEl.style.display = "none";
                return;
            }
            lockedEl.style.display = "none";
            bookEl.style.display = "block";
            render(data);
        });
    }
    document.addEventListener("state-updated", updateVisibility);
    updateVisibility();

    function render(data) {
        numSlot.textContent = data.researcherNumber || "----";

        const paras = [];
        paras.push("I had a strange dream last night. I don't remember most of it, but pieces stayed with me — a building that looked like nothing, a voice that kept apologizing without quite saying for what.");

        if (data.personalEcho) {
            paras.push(`At some point someone asked me something, and I answered without thinking: <span class="quoted">"${escapeHtml(data.personalEcho)}"</span>`);
        }
        if (data.fragment1Echo) {
            paras.push(`Later — or maybe earlier, dreams don't keep order — I was asked to sit with a question, and what came out of me was: <span class="quoted">"${escapeHtml(data.fragment1Echo)}"</span>`);
        }
        if (data.fragment2Echo) {
            paras.push(`I remember answering something else too, half-asleep: <span class="quoted">"${escapeHtml(data.fragment2Echo)}"</span>`);
        }
        if (data.fragment3Echo) {
            paras.push(`And near the end of it, whatever it was: <span class="quoted">"${escapeHtml(data.fragment3Echo)}"</span>`);
        }

        paras.push(`I voted ${(localStorage.getItem("recognition_vote") || "").toUpperCase()}, in the dream, or after it. I'm not sure anymore where the dream stopped and the rest of it started.`);
        paras.push("I woke up at my computer. I don't know why any of it felt as important as it did. It still does, actually.");
        paras.push("— Researcher #" + (data.researcherNumber || "----"));

        letterBody.innerHTML = paras.map(p => `<p>${p}</p>`).join("");
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }
});
