document.addEventListener("DOMContentLoaded", () => {

/* =========================
   TAB SWITCHING
========================= */
const tabButtons = document.querySelectorAll("nav.tabs button");
const cats = document.querySelectorAll(".cat");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        cats.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("cat-" + btn.dataset.cat).classList.add("active");
    });
});

/* =========================
   THE HIDDEN PUZZLE (unchanged logic)
========================= */
const commentInput = document.getElementById("commentInput");
const commentSubmit = document.getElementById("commentSubmit");
const commentMsg = document.getElementById("commentMsg");
const hiddenPost = document.getElementById("hiddenPost");

const ANSWER = "obsolete"; // [79,66,83,79,76,69,84,69] decoded

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}

if (localStorage.getItem("david_fragment_found") === "true") {
    hiddenPost.style.display = "block";
    commentMsg.style.color = "#9a7fc4";
    commentMsg.textContent = "you already found this one.";
}

commentSubmit.addEventListener("click", () => {
    const attempt = commentInput.value.trim().toLowerCase();
    if (attempt === ANSWER) {
        localStorage.setItem("david_fragment_found", "true");
        commentMsg.style.color = "#9a7fc4";
        commentMsg.textContent = "> comment approved.";
        hiddenPost.style.display = "block";
        if (typeof db !== "undefined") {
            db.ref("world/davidFragmentFoundBy").set(playerId);
        }
    } else {
        commentMsg.style.color = "#e08a8a";
        commentMsg.textContent = "hm. that's not it.";
    }
});

});
