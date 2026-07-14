/* NODE_1 -- a cinematic scene: a giant glowing circuit-face
   looms above, flanked by mechanical arms, with small dark
   silhouettes standing below, facing up toward it. Red/amber,
   angrier and more agitated than NODE_0 or NODE_2. */
(function () {
    const canvas = document.getElementById("scene");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const COLOR = "224,110,58";

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* silhouettes -- simple dark figures standing near the bottom */
    let figures = [];
    function layoutFigures() {
        const W = canvas.width, H = canvas.height;
        const n = 6;
        figures = [];
        for (let i = 0; i < n; i++) {
            figures.push({
                x: W * (0.15 + (i / (n - 1)) * 0.7) + (Math.random() * 20 - 10),
                scale: 0.8 + Math.random() * 0.4,
            });
        }
    }
    layoutFigures();
    window.addEventListener("resize", layoutFigures);

    let t = 0;
    function draw() {
        t += 0.02;

        const W = canvas.width, H = canvas.height;
        const faceX = W / 2, faceY = H * 0.36;
        const faceR = Math.min(W, H) * 0.28;

        ctx.clearRect(0, 0, W, H);

        // ambient background wash
        ctx.fillStyle = "#0c0605";
        ctx.fillRect(0, 0, W, H);
        const glow = ctx.createRadialGradient(faceX, faceY, faceR * 0.2, faceX, faceY, faceR * 2.2);
        glow.addColorStop(0, `rgba(${COLOR},0.16)`);
        glow.addColorStop(1, `rgba(${COLOR},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        /* ===== mechanical arms, flanking left/right ===== */
        function drawArm(fromX, baseY, mirrored) {
            const dir = mirrored ? -1 : 1;
            const sway = Math.sin(t * 0.6) * 6;
            const j1 = { x: fromX, y: baseY };
            const j2 = { x: fromX + dir * W * 0.14, y: baseY - H * 0.16 + sway };
            const j3 = { x: faceX + dir * faceR * 1.3, y: faceY + faceR * 0.3 };

            ctx.strokeStyle = "rgba(40,30,28,0.9)";
            ctx.lineWidth = 14;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(j1.x, j1.y);
            ctx.lineTo(j2.x, j2.y);
            ctx.lineTo(j3.x, j3.y);
            ctx.stroke();

            ctx.strokeStyle = `rgba(${COLOR},0.35)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(j1.x, j1.y);
            ctx.lineTo(j2.x, j2.y);
            ctx.lineTo(j3.x, j3.y);
            ctx.stroke();

            [j1, j2, j3].forEach(j => {
                ctx.beginPath();
                ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
                ctx.fillStyle = "#1a1210";
                ctx.fill();
                ctx.strokeStyle = `rgba(${COLOR},0.5)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });
        }
        drawArm(W * 0.06, H * 0.95, false);
        drawArm(W * 0.94, H * 0.95, true);

        /* ===== the giant face ===== */
        const rings = [faceR * 0.3, faceR * 0.55, faceR * 0.8, faceR];
        rings.forEach((r, i) => {
            ctx.beginPath();
            ctx.arc(faceX, faceY, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COLOR},${0.12 + 0.08 * Math.abs(Math.sin(t * 1.5 + i))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        const traceCount = 70;
        for (let i = 0; i < traceCount; i++) {
            const angle = (i / traceCount) * Math.PI * 2;
            const ringIdx = i % rings.length;
            const r1 = rings[ringIdx];
            const spike = Math.random() < 0.04 ? 1 : 0.2 + 0.6 * Math.abs(Math.sin(t * (1.5 + (i % 4)) + i));
            const r2 = r1 + faceR * 0.08;
            const x1 = faceX + Math.cos(angle) * r1;
            const y1 = faceY + Math.sin(angle) * r1;
            const x2 = faceX + Math.cos(angle) * r2;
            const y2 = faceY + Math.sin(angle) * r2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${COLOR},${Math.min(spike, 1)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        const coreR = faceR * 0.22 + Math.sin(t * 2) * faceR * 0.02;
        const coreGlow = ctx.createRadialGradient(faceX, faceY, 0, faceX, faceY, coreR * 2);
        coreGlow.addColorStop(0, `rgba(${COLOR},0.6)`);
        coreGlow.addColorStop(1, `rgba(${COLOR},0)`);
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(faceX, faceY, coreR * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(faceX, faceY, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = "#0c0605";
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(faceX, faceY, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR},0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        /* ===== silhouettes, standing below, facing up ===== */
        figures.forEach(f => {
            const s = f.scale;
            const baseY = H * 0.98;
            const headR = 9 * s;
            const bodyW = 22 * s, bodyH = 46 * s;

            const rim = 0.25 + 0.1 * Math.abs(Math.sin(t + f.x));
            ctx.fillStyle = "#08050408";
            ctx.fillStyle = "#0a0605";
            ctx.fillRect(f.x - bodyW / 2, baseY - bodyH, bodyW, bodyH);
            ctx.beginPath();
            ctx.arc(f.x, baseY - bodyH - headR, headR, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(${COLOR},${rim})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(f.x - bodyW / 2, baseY - bodyH, bodyW, bodyH);
            ctx.beginPath();
            ctx.arc(f.x, baseY - bodyH - headR, headR, 0, Math.PI * 2);
            ctx.stroke();
        });

        requestAnimationFrame(draw);
    }
    draw();
})();
