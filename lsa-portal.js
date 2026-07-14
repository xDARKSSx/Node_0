document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const portalEl = document.getElementById("portal");
const numInput = document.getElementById("numInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");
const resultMsg = document.getElementById("resultMsg");

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

let myChapter = 1;
function updateVisibility() {
    playerRef.child("personalChapter").once("value", snap => {
        myChapter = snap.val() || 1;
        if (myChapter >= 4) {
            lockedEl.style.display = "none";
            portalEl.style.display = "block";
        } else {
            lockedEl.style.display = "block";
            portalEl.style.display = "none";
        }
    });
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

const PASSWORD = "onlyone";
let alreadyAccessed = localStorage.getItem("researchers_access") === "true";

if (alreadyAccessed) {
    resultMsg.className = "success";
    resultMsg.innerHTML = "Access already granted on this session.<br><br>Staff systems: <a href='hr-home.html'>hr-home.html</a>";
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
            resultMsg.innerHTML = "ACCESS GRANTED. Case file transferred to the network.<br><br>Staff systems: <a href='hr-home.html'>hr-home.html</a><br><br>...one more page, torn loose: <a href='fragment3.html'>fragment3.html</a>";
            db.ref("world/solvedBy4").set(playerId);
            playerRef.child("portalAccessAt").set(firebase.database.ServerValue.TIMESTAMP);
            if (myChapter === 4) {
                playerRef.child("personalChapter").set(5);
                myChapter = 5;
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
