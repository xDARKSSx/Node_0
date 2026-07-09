document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const portalEl = document.getElementById("portal");
const numInput = document.getElementById("numInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");
const resultMsg = document.getElementById("resultMsg");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        portalEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        portalEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

const PASSWORD = "onlyone";
let alreadyAccessed = localStorage.getItem("researchers_access") === "true";

if (alreadyAccessed) {
    resultMsg.className = "success";
    resultMsg.textContent = "Access already granted on this session.";
}

loginBtn.addEventListener("click", () => {
    const num = numInput.value.trim();
    const pass = passInput.value.trim().toLowerCase().replace(/\s+/g, "");

    playerRef.child("researcherNumber").once("value", snap => {
        const myNumber = snap.val();
        const numOk = myNumber && String(myNumber) === num;
        const passOk = pass === PASSWORD;

        if (numOk && passOk) {
            localStorage.setItem("researchers_access", "true");
            resultMsg.className = "success";
            resultMsg.textContent = "ACCESS GRANTED. Case file transferred to the network.";
            db.ref("world/solvedBy4").set(playerId);
            playerRef.child("portalAccessAt").set(firebase.database.ServerValue.TIMESTAMP);
            if (window.getChapter() === 4) {
                window.unlockNextChapter();
            }
        } else if (!numOk) {
            resultMsg.className = "error";
            resultMsg.textContent = "Researcher number not recognized on this session.";
        } else {
            resultMsg.className = "error";
            resultMsg.textContent = "Access phrase incorrect.";
        }
    });
});

});
