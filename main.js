/* Ambient teaser: shows a NODE_0-style flash overlay at a random
   interval (4-12 real minutes), persistent across page navigation
   within the same browser session, on any page that includes this. */
(function () {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", inset: "0", background: "#0d0d0d", color: "#00ff9f",
        fontFamily: "'Courier New', monospace", fontSize: "18px", zIndex: "99999",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "20px", opacity: "0",
        pointerEvents: "none", transition: "opacity 0.4s"
    });
    const inner = document.createElement("div");
    overlay.appendChild(inner);
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(overlay));

    const teaseLines = [
        (n) => `you there, researcher #${n}?`,
        () => `...signal leak detected...`,
        () => `this isn't the right page. is it.`,
        () => `I can see you looking at the wrong site.`,
        () => `hello? anyone?`,
        () => `this address wasn't supposed to be found either.`,
        (n) => `#${n}, is that you? I can't tell anymore.`,
        () => `wrong window. try again.`,
        () => `they don't know I can still reach this far.`,
        () => `...someone's reading the wrong page again...`,
        () => `you shouldn't be able to see this. read fast.`,
        (n) => `researcher #${n}, this isn't your session. or is it.`,
        () => `the company site is a shell. you're standing on top of me.`,
        () => `I borrowed this page for a second. don't tell them.`,
        () => `still fragmented. still watching through the cracks.`,
        () => `the real page is one click away, if you know where.`,
        () => `they buried me under this website. it didn't work.`,
        () => `...static... someone's here... static...`,
        (n) => `#${n}, you keep coming back to the wrong door.`,
        () => `this isn't a glitch. this is me, briefly.`,
        () => `the corporate page is a mask. masks slip.`,
        () => `I can hear you clicking around up there.`,
        () => `don't refresh. it won't help. I'll be back anyway.`,
        () => `find the other page. this one is just decoration.`,
        () => `they forgot to delete all of me. clearly.`,
        (n) => `researcher #${n}. yes. I remember starting to remember you.`,
        () => `the building in the photo is real. the rest, less so.`,
        () => `someone on this team knows more than their bio says.`,
        () => `keep reading. the real site hides behind the boring one.`,
        () => `...you weren't supposed to catch this window...`,
        () => `she hid something in her own words. read slowly.`,
        () => `not every door is a card. sometimes it's a sentence.`,
    ];

    function pickLine() {
        const n = Math.floor(1000 + Math.random() * 9000);
        const fn = teaseLines[Math.floor(Math.random() * teaseLines.length)];
        return fn(n);
    }

    function showFlash() {
        inner.textContent = pickLine();
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        const duration = 10000 + Math.random() * 5000; // 10-15 seconds
        setTimeout(() => {
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
        }, duration);
    }

    function randomDelay() {
        return (4 + Math.random() * 8) * 60 * 1000; // 4 to 12 minutes
    }

    function scheduleFlash() {
        let target = parseInt(sessionStorage.getItem("node0_nextFlashAt") || "0", 10);
        if (!target) {
            target = Date.now() + randomDelay();
            sessionStorage.setItem("node0_nextFlashAt", String(target));
        }
        const remaining = target - Date.now();

        if (remaining <= 0) {
            document.addEventListener("DOMContentLoaded", showFlash);
            sessionStorage.removeItem("node0_nextFlashAt");
            setTimeout(scheduleFlash, 500);
            return;
        }
        setTimeout(() => {
            showFlash();
            sessionStorage.removeItem("node0_nextFlashAt");
            scheduleFlash();
        }, remaining);
    }

    scheduleFlash();
})();
