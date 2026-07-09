/* Self-contained ambient teaser: shows a NODE_0-style
   flash overlay at a random interval (5-15 real minutes)
   on ANY page that includes this script. No dependencies. */
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
    ];

    function showFlash() {
        const n = Math.floor(1000 + Math.random() * 9000);
        const fn = teaseLines[Math.floor(Math.random() * teaseLines.length)];
        inner.textContent = fn(n);
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        setTimeout(() => {
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
        }, 10000);
    }

    function scheduleNext() {
        const delay = (5 + Math.random() * 10) * 60 * 1000; // 5 to 15 minutes
        setTimeout(() => { showFlash(); scheduleNext(); }, delay);
    }
    scheduleNext();
})();
