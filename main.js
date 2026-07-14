/* Ambient "computer malfunction" teaser: at a random interval
   (4-12 real minutes), the whole screen appears to genuinely
   glitch out -- static, tearing, shaking, a burst of electrical
   noise -- before settling on a brief NODE_0 line, then recovering.
   Persistent across page navigation within the same browser tab. */
(function () {
    let overlay, staticCanvas, tearLayer, mainText, sharedAudioCtx;

    /* unlock audio on the first real user interaction, so the
       later AMBIENT flash (which fires with no click of its own)
       is still allowed to play sound by the browser */
    function unlockAudio() {
        if (sharedAudioCtx) return;
        try {
            sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { /* no-op */ }
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
    }
    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    function buildDOM() {
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", inset: "0", zIndex: "99999",
            pointerEvents: "none", opacity: "0", background: "#000",
            overflow: "hidden",
        });

        staticCanvas = document.createElement("canvas");
        staticCanvas.width = 160;
        staticCanvas.height = 90;
        Object.assign(staticCanvas.style, {
            position: "absolute", inset: "0", width: "100%", height: "100%",
            imageRendering: "pixelated", opacity: "0",
        });
        overlay.appendChild(staticCanvas);

        tearLayer = document.createElement("div");
        Object.assign(tearLayer.style, { position: "absolute", inset: "0" });
        overlay.appendChild(tearLayer);

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

    const forgetHints = [
        () => `go to the team page. read every bio carefully.`,
        () => `one word on the team page isn't like the others.`,
        () => `Elena's bio has something clickable in it. find it.`,
    ];

    function pickLine() {
        const n = Math.floor(1000 + Math.random() * 9000);
        const isFirstEverFlash = !localStorage.getItem("node0_hadFirstFlash");
        localStorage.setItem("node0_hadFirstFlash", "true");

        if (isFirstEverFlash) {
            const fn = forgetHints[Math.floor(Math.random() * forgetHints.length)];
            return fn(n);
        }
        const fn = teaseLines[Math.floor(Math.random() * teaseLines.length)];
        return fn(n);
    }

    /* ---- full-screen static (chunky, cheap, reads as broken signal) ---- */
    function drawStatic(intensity) {
        const c = staticCanvas.getContext("2d");
        const img = c.createImageData(staticCanvas.width, staticCanvas.height);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255;
            img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v;
            img.data[i + 3] = 255 * intensity;
        }
        c.putImageData(img, 0, 0);
    }

    /* ---- horizontal analog tear/RGB-split bands ---- */
    function randomTearBands() {
        tearLayer.innerHTML = "";
        const bandCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < bandCount; i++) {
            const band = document.createElement("div");
            const y = Math.random() * 100;
            const h = 1 + Math.random() * 6;
            const shift = (Math.random() * 60 - 30).toFixed(0);
            Object.assign(band.style, {
                position: "absolute", left: "0", right: "0",
                top: y + "%", height: h + "%",
                background: Math.random() < 0.5 ? "#ff2b6d" : "#00eaff",
                opacity: (0.15 + Math.random() * 0.25).toFixed(2),
                mixBlendMode: "screen",
                transform: `translateX(${shift}px)`,
            });
            tearLayer.appendChild(band);
        }
    }

    /* ---- short burst of electrical static noise ---- */
    function playNoiseBurst() {
        if (!sharedAudioCtx) return;
        const ctx = sharedAudioCtx;
        const dur = 0.35 + Math.random() * 0.25;
        const bufferSize = Math.floor(ctx.sampleRate * dur);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1200 + Math.random() * 1500;
        filter.Q.value = 0.7;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

        noise.connect(filter).connect(gain).connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + dur + 0.05);
    }

    /* ---- the malfunction sequence itself ---- */
    function runGlitchSequence(onDone) {
        const originalTitle = document.title;
        const bodyOriginalTransform = document.body.style.transform;
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        staticCanvas.style.opacity = "1";

        playNoiseBurst();

        let ticks = 0;
        const maxTicks = 16;
        const interval = setInterval(() => {
            ticks++;

            const blackout = Math.random() < 0.22;
            const glitchTitle = Math.random() < 0.4;

            drawStatic(blackout ? 0.05 : 0.5 + Math.random() * 0.4);
            randomTearBands();

            document.body.style.transform =
                `translate(${(Math.random() * 6 - 3).toFixed(1)}px, ${(Math.random() * 6 - 3).toFixed(1)}px)`;

            if (glitchTitle) {
                document.title = ["N█DE_0", "N0D3_0", "S1GNAL L0ST", "...", "N0DE_0"][Math.floor(Math.random() * 5)];
            }

            if (blackout) {
                overlay.style.background = "#000";
                mainText.style.opacity = "0";
                staticCanvas.style.opacity = "0.1";
                tearLayer.style.opacity = "0.2";
            } else {
                overlay.style.background = Math.random() < 0.5 ? "#000" : "#050505";
                mainText.style.opacity = "1";
                staticCanvas.style.opacity = "0.55";
                tearLayer.style.opacity = "1";
                mainText.style.transform =
                    `skewX(${(Math.random() * 6 - 3).toFixed(1)}deg) translateX(${(Math.random() * 10 - 5).toFixed(0)}px)`;
                mainText.style.textShadow =
                    `${(Math.random() * 4 - 2).toFixed(0)}px 0 #ff2b6d, ${(Math.random() * -4 + 2).toFixed(0)}px 0 #00eaff`;
            }

            if (ticks === 6 || ticks === 11) playNoiseBurst();

            if (ticks >= maxTicks) {
                clearInterval(interval);
                document.title = originalTitle;
                document.body.style.transform = bodyOriginalTransform || "none";
                mainText.style.transform = "none";
                mainText.style.textShadow = "none";
                staticCanvas.style.opacity = "0";
                tearLayer.innerHTML = "";
                overlay.style.background = "#0d0d0d";
                mainText.style.opacity = "1";
                onDone();
            }
        }, 85);
    }

    function showFlash() {
        if (!overlay) return;
        mainText.textContent = "";
        runGlitchSequence(() => {
            mainText.textContent = pickLine();
            const holdTime = 6000 + Math.random() * 4000; // 6-10s readable
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
        const isFirstEver = !localStorage.getItem("node0_firstFlashDone");
        if (isFirstEver) {
            localStorage.setItem("node0_firstFlashDone", "true");
            return (1.5 + Math.random() * 1.5) * 60 * 1000; // 1.5 to 3 minutes, first time only
        }
        return (4 + Math.random() * 8) * 60 * 1000; // 4 to 12 minutes, normal rhythm after
    }

    function scheduleFlash() {
        let target = parseInt(sessionStorage.getItem("node0_nextFlashAt") || "0", 10);
        if (!target) {
            target = Date.now() + randomDelay();
            sessionStorage.setItem("node0_nextFlashAt", String(target));
        }
        const remaining = target - Date.now();
        const fire = () => {
            const discovered = window.state && window.state.world && window.state.world.node0Discovered === true;
            if (discovered) {
                /* NODE_0 has already been found -- the teaser has
                   done its job and permanently stops for this page/session. */
                sessionStorage.removeItem("node0_nextFlashAt");
                return;
            }
            const doFire = () => {
                showFlash();
                sessionStorage.removeItem("node0_nextFlashAt");
                scheduleFlash();
            };
            if (overlay) doFire();
            else document.addEventListener("DOMContentLoaded", doFire, { once: true });
        };

        if (remaining <= 0) fire();
        else setTimeout(fire, remaining);
    }

    scheduleFlash();
})();
