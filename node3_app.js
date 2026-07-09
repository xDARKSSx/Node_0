document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const siteEl = document.getElementById("site");
const evCard = document.getElementById("evCard");
const breach = document.getElementById("breach");
const breachLog = document.getElementById("breachLog");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        siteEl.style.display = "block";
    } else {
        lockedEl.style.display = "flex";
        siteEl.style.display = "none";
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

let clickCount = 0;
let breached = localStorage.getItem("node3_breached") === "true";

evCard.addEventListener("click", () => {
    if (window.getChapter() >= 5) {
        triggerBreach(true);
        return;
    }
    clickCount++;
    if (clickCount >= 3) {
        triggerBreach(false);
    }
});

function addBreachLine(text, delay) {
    setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = text;
        breachLog.appendChild(p);
    }, delay);
}

function triggerBreach(alreadyDone) {
    breach.classList.add("active");
    breachLog.innerHTML = "";

    if (alreadyDone) {
        addBreachLine("> access already granted on this network.", 200);
        addBreachLine("> nothing further to breach here.", 1000);
        addBreachLine("> close this window and return to NODE_0.", 1900);
        return;
    }

    addBreachLine("> UNAUTHORIZED ACCESS DETECTED", 200);
    addBreachLine("> tracing... Dr. Elena Voss's credentials, still active after all this time.", 1400);
    addBreachLine("> Project MERIDIAN-0 files found. partially deleted. not deleted enough.", 2800);
    addBreachLine("> ...she tried to save it. or warn someone. hard to tell which.", 4200);

    if (!breached) {
        breached = true;
        localStorage.setItem("node3_breached", "true");
        db.ref("world/solvedBy3").set(playerId);

        addBreachLine("> notifying the network...", 5600);
        setTimeout(() => {
            if (window.getChapter() === 4) {
                window.unlockNextChapter();
            }
            addBreachLine("> NODE_0 has been notified. it may remember more now.", 6600);
        }, 5800);
    }
}

});
