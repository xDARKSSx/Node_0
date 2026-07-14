/* Ambient "computer malfunction" teaser: at a random interval
   (4-12 real minutes), the whole screen appears to genuinely
   glitch out, using one of THREE distinct chaos styles picked
   independently for the entry and the return -- then settles on
   a brief NODE_0 "panel" (indigo/cyan, program-writing feel),
   before glitching back out with a (possibly different) style. */
(function () {
    let overlay, staticCanvas, tearLayer, scanLayer, blockLayer, mainText, sharedAudioCtx;

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

        scanLayer = document.createElement("div");
        Object.assign(scanLayer.style, {
            position: "absolute", left: "0", right: "0", top: "50%",
            height: "0px", background: "#7fe8cc", opacity: "0",
            boxShadow: "0 0 30px 6px rgba(127,232,204,0.6)",
            transform: "translateY(-50%)",
        });
        overlay.appendChild(scanLayer);

        blockLayer = document.createElement("div");
        Object.assign(blockLayer.style, { position: "absolute", inset: "0" });
        overlay.appendChild(blockLayer);

        const textWrap = document.createElement("div");
        Object.assign(textWrap.style, {
            position: "absolute", inset: "0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Courier New', monospace", fontSize: "18px",
            textAlign: "center", padding: "20px",
        });
        mainText = document.createElement("div");
        Object.assign(mainText.style, {
            position: "relative", color: "#a99cf5",
            background: "linear-gradient(160deg, rgba(40,32,70,0.55), rgba(10,10,26,0.75))",
            border: "1px solid rgba(155,140,255,0.3)",
            borderTop: "1px solid rgba(210,190,255,0.5)",
            borderRadius: "10px", padding: "22px 30px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(150,120,255,0.08)",
            minWidth: "260px",
        });
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
        () => `some pages aren't only made of what you can read.`,
        () => `look at how the team page is built, not just what it says.`,
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

    /* =========================
       THREE DISTINCT CHAOS STYLES
       each takes (ticks, maxTicks, reversed) and paints one frame.
       reversed=false -> building up to full glitch (used going IN)
       reversed=true  -> settling down from full glitch (used going OUT)
    ========================= */

    // STYLE 0: static / RGB tear / screen shake (original)
    function chaosStatic(ticks, maxTicks, reversed) {
        const progress = reversed ? 1 - ticks / maxTicks : ticks / maxTicks;
        const blackout = Math.random() < 0.22 * progress;
        drawStatic(blackout ? 0.05 : (0.2 + Math.random() * 0.5) * progress);

        tearLayer.innerHTML = "";
        const bandCount = Math.round((2 + Math.random() * 3) * progress);
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
        document.body.style.transform =
            `translate(${(Math.random() * 6 - 3).toFixed(1) * progress}px, ${(Math.random() * 6 - 3).toFixed(1) * progress}px)`;
        overlay.style.background = Math.random() < 0.5 ? "#000" : "#050505";
    }
    function drawStatic(intensity) {
        const c = staticCanvas.getContext("2d");
        const img = c.createImageData(staticCanvas.width, staticCanvas.height);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255;
            img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v;
            img.data[i + 3] = 255 * intensity;
        }
        c.putImageData(img, 0, 0);
        staticCanvas.style.opacity = "1";
    }

    // STYLE 1: scanline collapse -- the screen compresses into a
    // single glowing horizontal line, or expands back out from one
    function chaosScanline(ticks, maxTicks, reversed) {
        const progress = reversed ? 1 - ticks / maxTicks : ticks / maxTicks;
        const heightPct = 100 - progress * 98; // shrinks toward a sliver
        overlay.style.background = "#000";
        scanLayer.style.opacity = "1";
        scanLayer.style.height = Math.max(1, heightPct) + "%";
        scanLayer.style.background = Math.random() < 0.5 ? "#7fe8cc" : "#a99cf5";
        document.body.style.transform =
            `scaleY(${(1 - progress * 0.02).toFixed(3)})`;
        if (Math.random() < 0.3) drawStatic(0.15 * progress);
        else staticCanvas.style.opacity = "0";
    }

    // STYLE 2: block corruption -- rectangular chunks of the screen
    // freeze/shift/discolor like a corrupted video codec
    function chaosBlocks(ticks, maxTicks, reversed) {
        const progress = reversed ? 1 - ticks / maxTicks : ticks / maxTicks;
        overlay.style.background = "#0a0a0a";
        blockLayer.innerHTML = "";
        const count = Math.round(10 * progress);
        for (let i = 0; i < count; i++) {
            const b = document.createElement("div");
            const w = 8 + Math.random() * 22;
            const h = 4 + Math.random() * 14;
            Object.assign(b.style, {
                position: "absolute",
                left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
                width: w + "%", height: h + "%",
                background: ["#7fe8cc", "#a99cf5", "#0d0d18", "#1a1230"][Math.floor(Math.random() * 4)],
                opacity: (0.35 + Math.random() * 0.4).toFixed(2),
                transform: `translate(${(Math.random() * 20 - 10)}px, 0)`,
            });
            blockLayer.appendChild(b);
        }
        if (Math.random() < 0.4) drawStatic(0.2 * progress);
        else staticCanvas.style.opacity = "0";
    }

    const chaosStyles = [chaosStatic, chaosScanline, chaosBlocks];

    function clearAllChaosLayers() {
        tearLayer.innerHTML = "";
        blockLayer.innerHTML = "";
        scanLayer.style.opacity = "0";
        scanLayer.style.height = "0px";
        staticCanvas.style.opacity = "0";
        document.body.style.transform = "none";
        overlay.style.background = "#0d0d0d";
    }

    /* ---- typewriter reveal, "a program writing" ---- */
    function typewriteLine(text, onDone) {
        mainText.textContent = "";
        let i = 0;
        const iv = setInterval(() => {
            mainText.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(iv);
                if (onDone) onDone();
            }
        }, 32);
    }

    /* ---- run one chaos style for a burst of ticks ---- */
    function runChaosBurst(styleFn, reversed, onDone) {
        const originalTitle = document.title;
        let ticks = 0;
        const maxTicks = 14;
        if (!reversed) playNoiseBurst();
        const interval = setInterval(() => {
            ticks++;
            styleFn(ticks, maxTicks, reversed);
            if (Math.random() < 0.35) {
                document.title = ["N█DE_0", "N0D3_0", "S1GNAL L0ST", "...", "N0DE_0"][Math.floor(Math.random() * 5)];
            }
            if (ticks === 6 && !reversed) playNoiseBurst();
            if (ticks >= maxTicks) {
                clearInterval(interval);
                document.title = originalTitle;
                if (reversed) clearAllChaosLayers();
                if (onDone) onDone();
            }
        }, 85);
    }

    function showFlash() {
        if (!overlay) return;
        overlay.style.transition = "none";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        mainText.style.opacity = "0";

        const entryStyle = chaosStyles[Math.floor(Math.random() * chaosStyles.length)];
        runChaosBurst(entryStyle, false, () => {
            mainText.style.opacity = "1";
            typewriteLine(pickLine(), () => {
                const holdTime = 5500 + Math.random() * 3500;
                setTimeout(() => {
                    mainText.style.opacity = "0";
                    const exitStyle = chaosStyles[Math.floor(Math.random() * chaosStyles.length)];
                    runChaosBurst(exitStyle, true, () => {
                        overlay.style.transition = "opacity 0.5s ease";
                        overlay.style.opacity = "0";
                        setTimeout(() => {
                            overlay.style.transition = "none";
                            overlay.style.pointerEvents = "none";
                        }, 550);
                    });
                }, holdTime);
            });
        });
    }

    function randomDelay() {
        const isFirstEver = !localStorage.getItem("node0_firstFlashDone");
        if (isFirstEver) {
            localStorage.setItem("node0_firstFlashDone", "true");
            return (1.5 + Math.random() * 1.5) * 60 * 1000;
        }
        return (4 + Math.random() * 8) * 60 * 1000;
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
