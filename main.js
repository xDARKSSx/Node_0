/* Ambient "malfunction" teaser: at a random interval (4-12 real
   minutes), the page briefly appears to glitch/corrupt like a
   failing screen, then flashes a NODE_0-style line, then recovers.
   Persistent across page navigation within the same browser tab. */
(function () {
    let overlay, glitchLayer, mainText;

    function buildDOM() {
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", inset: "0", zIndex: "99999",
            pointerEvents: "none", opacity: "0",
            background: "#000",
        });

        glitchLayer = document.createElement("div");
        Object.assign(glitchLayer.style, {
            position: "absolute", inset: "0",
            backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.04) 3px)",
            mixBlendMode: "overlay",
        });
        overlay.appendChild(glitchLayer);

        const textWrap = document.createElement("div");
        Object.assign(textWrap.style, {
            position: "absolute", inset: "0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Courier New', monospace", fontSize: "18px",
            textAlign: "center", padding: "20px",
        });

        mainText = document.createElement("div");
        mainText.style.position = "relative";
        mainText.style.color = "#00ff9f";
        textWrap.appendChild(mainText);
        overlay.appendChild(textWrap);

        document.body.appendChild(overlay);
    }
    document.addEventListener("DOMContentLoaded", buildDOM);

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

    /* rapid, jarring visual malfunction -- brief and unsettling,
       meant to read as "is this MY computer breaking?" */
    function runGlitchSequence(onDone) {
        const originalTitle = document.title;
        document.title = "N0DE_0";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";

        let ticks = 0;
        const maxTicks = 14;
        const glitchInterval = setInterval(() => {
            ticks++;
            const hue = Math.floor(Math.random() * 360);
            const skew = (Math.random() * 6 - 3).toFixed(1);
            const blackout = Math.random() < 0.18;

            if (blackout) {
                overlay.style.background = "#000";
                mainText.style.opacity = "0";
                glitchLayer.style.opacity = "0";
            } else {
                overlay.style.background = Math.random() < 0.5 ? "#000" : "#050505";
                mainText.style.opacity = "1";
                glitchLayer.style.opacity = "1";
                mainText.style.transform = `skewX(${skew}deg) translateX(${(Math.random() * 10 - 5).toFixed(0)}px)`;
                mainText.style.filter = `hue-rotate(${hue}deg) contrast(${1 + Math.random() * 2})`;
                mainText.style.textShadow =
                    `${(Math.random() * 4 - 2).toFixed(0)}px 0 #ff2b6d, ${(Math.random() * -4 + 2).toFixed(0)}px 0 #00eaff`;
            }

            if (ticks >= maxTicks) {
                clearInterval(glitchInterval);
                document.title = originalTitle;
                mainText.style.transform = "none";
                mainText.style.filter = "none";
                mainText.style.textShadow = "none";
                overlay.style.background = "#0d0d0d";
                mainText.style.opacity = "1";
                glitchLayer.style.opacity = "1";
                onDone();
            }
        }, 90);
    }

    function showFlash() {
        if (!overlay) return;
        mainText.textContent = "";
        runGlitchSequence(() => {
            mainText.textContent = pickLine();
            const holdTime = 6000 + Math.random() * 4000; // readable line, 6-10s
            setTimeout(() => {
                overlay.style.transition = "opacity 0.6s ease";
                overlay.style.opacity = "0";
                setTimeout(() => {
                    overlay.style.transition = "none";
                    overlay.style.pointerEvents = "none";
                }, 650);
            }, holdTime);
        });
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
        const fire = () => {
            const doFire = () => {
                showFlash();
                sessionStorage.removeItem("node0_nextFlashAt");
                scheduleFlash();
            };
            if (document.readyState === "complete" || document.readyState === "interactive") {
                if (overlay) doFire();
                else document.addEventListener("DOMContentLoaded", doFire, { once: true });
            } else {
                document.addEventListener("DOMContentLoaded", doFire, { once: true });
            }
        };

        if (remaining <= 0) {
            fire();
        } else {
            setTimeout(fire, remaining);
        }
    }

    scheduleFlash();
})();
