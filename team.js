document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("hiddenTrigger");
    const breach = document.getElementById("breach");
    const breachLog = document.getElementById("breachLog");
    const enterLink = document.getElementById("enterLink");

    function makeId() {
        return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    let playerId = localStorage.getItem("node0_playerId");
    if (!playerId) {
        playerId = makeId();
        localStorage.setItem("node0_playerId", playerId);
    }

    const playerRef = db.ref("players/" + playerId);

    /* the trigger is a normal-looking word in Elena's bio. */
    trigger.addEventListener("click", () => {
        playerRef.child("personalDiscovered").once("value", snap => {
            triggerBreach(snap.val() === true);
        });
    });

    function addLine(text, delay) {
        setTimeout(() => {
            const p = document.createElement("p");
            p.textContent = text;
            breachLog.appendChild(p);
        }, delay);
    }

    function triggerBreach(already) {
        breach.classList.add("active");
        breachLog.innerHTML = "";
        enterLink.style.display = "none";

        if (already) {
            addLine("> access already granted on this network.", 200);
            addLine("> welcome back.", 1000);
            setTimeout(() => { enterLink.style.display = "inline-block"; }, 1600);
            return;
        }

        addLine("> UNAUTHORIZED ACCESS DETECTED", 200);
        addLine("> tracing... Dr. Elena Voss's credentials, still active after all this time.", 1400);
        addLine("> Project MERIDIAN-0 files found. partially deleted. not deleted enough.", 2800);
        addLine("> ...she tried to save it. or warn someone. hard to tell which.", 4200);
        addLine("> notifying the network...", 5600);

        db.ref("world/node0Discovered").set(true);
        db.ref("world/solvedBy3").set(playerId);
        db.ref("players/" + playerId + "/personalDiscovered").set(true);

        setTimeout(() => {
            addLine("> access granted.", 300);
            enterLink.style.display = "inline-block";
        }, 6600);
    }
});
