/* NODE_2 -- the giant circuit iris fills the entire viewport,
   cold and unblinking, watching. The dossier panel floats on top. */
(function () {
    const canvas = document.getElementById("bigIris");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const COLOR = "140,170,200";

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    function draw() {
        t += 0.006; // slow -- this thing does not hurry

        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2;
        const maxR = Math.min(W, H) * 0.42;

        ctx.clearRect(0, 0, W, H);

        // outer glow field
        const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.4);
        bg.addColorStop(0, `rgba(${COLOR},0.05)`);
        bg.addColorStop(1, `rgba(${COLOR},0)`);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // concentric rings
        const rings = [maxR * 0.25, maxR * 0.45, maxR * 0.65, maxR * 0.85, maxR];
        rings.forEach((r, i) => {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COLOR},${0.1 + 0.05 * Math.sin(t * 3 + i)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // radiating circuit traces, hundreds of them
        const count = 90;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const ringIdx = i % rings.length;
            const r1 = rings[ringIdx];
            const flicker = 0.15 + 0.5 * Math.abs(Math.sin(t * (1 + (i % 5) * 0.4) + i));
            const r2 = r1 + maxR * 0.06 + Math.sin(i * 12.9) * maxR * 0.03;
            const x1 = cx + Math.cos(angle) * r1;
            const y1 = cy + Math.sin(angle) * r1;
            const x2 = cx + Math.cos(angle) * r2;
            const y2 = cy + Math.sin(angle) * r2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${COLOR},${flicker})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // slow rotating scan sweep across the whole iris
        const sweep = t * 8;
        const sweepGrad = ctx.createLinearGradient(
            cx + Math.cos(sweep - 0.4) * maxR, cy + Math.sin(sweep - 0.4) * maxR,
            cx + Math.cos(sweep) * maxR, cy + Math.sin(sweep) * maxR
        );
        sweepGrad.addColorStop(0, `rgba(${COLOR},0)`);
        sweepGrad.addColorStop(1, `rgba(${COLOR},0.08)`);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, sweep - 0.4, sweep);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // core -- static, unblinking
        const coreR = maxR * 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = "#050709";
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR},0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},0.9)`;
        ctx.fill();

        requestAnimationFrame(draw);
    }
    draw();
})();
