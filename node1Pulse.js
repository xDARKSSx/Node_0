/* Animated circuit iris for NODE_1 -- angry, disconnected.
   Red/amber, jagged and erratic instead of smooth breathing --
   sudden spikes, irregular flicker, occasional full stutter. */
(function () {
    const canvas = document.getElementById("pulse1");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const COLOR = "224,74,58"; // red-amber

    const rings = [30, 50, 72, 95];
    const traces = [];
    for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const ringIdx = i % rings.length;
        traces.push({
            angle,
            r1: rings[ringIdx],
            r2: rings[ringIdx] + 14 + Math.random() * 18,
            phase: Math.random() * Math.PI * 2,
            speed: 1.2 + Math.random() * 3, // faster, more agitated than NODE_0
        });
    }

    let t = 0;
    let stutter = 0; // occasional full-frame jolt

    function draw() {
        t += 0.03;

        // random stutters -- a spike that doesn't follow the smooth curve
        if (Math.random() < 0.02) stutter = 1;
        stutter *= 0.85;

        ctx.clearRect(0, 0, W, H);

        // jagged pulse: normal sine plus sharp random noise, not a clean breathe
        const base = 0.5 + 0.5 * Math.sin(t * 2.2);
        const jag = (Math.random() - 0.5) * 0.3;
        const pulse = Math.max(0, Math.min(1, base + jag + stutter * 0.6));

        rings.forEach((r, i) => {
            const jitter = stutter > 0.1 ? (Math.random() - 0.5) * 4 : 0;
            ctx.beginPath();
            ctx.arc(cx + jitter, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COLOR},${0.15 + 0.15 * Math.abs(Math.sin(t * 1.5 + i))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        traces.forEach(tr => {
            const flicker = Math.random() < 0.08
                ? 1 // sudden full flare on this trace
                : 0.2 + 0.6 * Math.abs(Math.sin(t * tr.speed + tr.phase));
            const x1 = cx + Math.cos(tr.angle) * tr.r1;
            const y1 = cy + Math.sin(tr.angle) * tr.r1;
            const x2 = cx + Math.cos(tr.angle) * tr.r2;
            const y2 = cy + Math.sin(tr.angle) * tr.r2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${COLOR},${Math.min(flicker, 1)})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
        });

        const coreR = 20 + pulse * 9;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.4);
        grad.addColorStop(0, `rgba(${COLOR},${0.55 + pulse * 0.45})`);
        grad.addColorStop(1, `rgba(${COLOR},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = "#160a08";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR},${0.65 + pulse * 0.35})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(draw);
    }
    draw();
})();
