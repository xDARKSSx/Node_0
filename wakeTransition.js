/* Plays only right after arriving from prologue.html --
   simulates slowly waking up: blur pulses like blinking
   eyes, clearing gradually until the page is fully in focus. */
(function () {
    if (sessionStorage.getItem("wakingUp") !== "true") return;
    sessionStorage.removeItem("wakingUp");

    document.addEventListener("DOMContentLoaded", () => {
        document.body.style.transition = "filter 0.45s ease";
        document.body.style.filter = "blur(16px)";

        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", inset: "0", background: "#000",
            opacity: "0.55", transition: "opacity 0.45s ease",
            pointerEvents: "none", zIndex: "99999",
        });
        document.body.appendChild(overlay);

        const stages = [
            { delay: 300,  blur: 7,  dark: 0.20 },  // half open, blurry glimpse
            { delay: 1200, blur: 12, dark: 0.40 },  // blink closed again
            { delay: 1750, blur: 3,  dark: 0.08 },  // opens more, clearer
            { delay: 2700, blur: 6,  dark: 0.20 },  // one last soft blink
            { delay: 3200, blur: 0,  dark: 0.0  },  // fully awake
        ];

        stages.forEach(s => {
            setTimeout(() => {
                document.body.style.filter = `blur(${s.blur}px)`;
                overlay.style.opacity = String(s.dark);
            }, s.delay);
        });

        setTimeout(() => {
            overlay.remove();
            document.body.style.transition = "";
            document.body.style.filter = "";
            lockAndPlayWakeVoice();
        }, 3800);

        function lockAndPlayWakeVoice() {
            const blockOverlay = document.createElement("div");
            Object.assign(blockOverlay.style, {
                position: "fixed", inset: "0", zIndex: "99998",
                cursor: "not-allowed", background: "transparent",
            });
            document.body.appendChild(blockOverlay);

            let unlocked = false;
            function unlock() {
                if (unlocked) return;
                unlocked = true;
                blockOverlay.remove();
            }

            const yawn = new Audio("yawn-sfx.mp3");
            const voiceover = new Audio("wake-voiceover.mp3");
            let voiceoverStarted = false;

            function tryPlayVoiceover() {
                if (voiceoverStarted) return;
                voiceoverStarted = true;
                voiceover.addEventListener("ended", unlock);
                voiceover.play().catch(() => {
                    voiceoverStarted = false; // allow a retry on next click
                });
            }

            yawn.play().catch(() => {});

            /* if autoplay is blocked, the very first click anywhere
               (on this full-screen overlay) retries both sounds */
            blockOverlay.addEventListener("click", e => {
                e.stopPropagation();
                yawn.currentTime === 0 && yawn.play().catch(() => {});
                tryPlayVoiceover();
            });
            blockOverlay.addEventListener("mousedown", e => e.stopPropagation());

            setTimeout(() => {
                tryPlayVoiceover();
                if (!voiceoverStarted) setTimeout(unlock, 2500); // still blocked -- unlock anyway
            }, 2400);

            /* absolute safety net: never leave a player stuck, even
               if both audio files are missing or fail entirely.
               Voiceover: ~11s, starting 2.4s after this point. */
            setTimeout(unlock, 14900);
        }
    });
})();
