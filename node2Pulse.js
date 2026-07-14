/* Animated iris for NODE_2 -- the cold observer/recorder.
   Blue-gray, no organic breathing pulse -- instead a rotating
   radar sweep with data-tick markers, clinical and detached. */
(function () {
    const canvas = document.getElementById("pulse2");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const COLOR = "140,170,200"; // cold blue-gray
    const maxR = 100;

    const ticks = [];
    for (let i = 0; i < 48; i++) {
        ticks.push({
            angle: (i / 48) * Math.PI * 2,
            r: maxR - 6,
            len: (i % 4 === 0) ? 10 : 5,
        });
    }

    let sweepAngle = 0;

    function draw() {
        sweepAngle += 0.018;

        ctx.clearRect(0, 0, W, H);

        // static concentric grid, no pulsing
        [30, 55, 78, maxR].forEach(r => {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COLOR},0.14)`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
        });

        // tick marks around the rim, like a scanner dial
        ticks.forEach(tk => {
            const x1 = cx + Math.cos(tk.angle) * tk.r;
            const y1 = cy + Math.sin(tk.angle) * tk.r;
            const x2 = cx + Math.cos(tk.angle) * (tk.r - tk.len);
            const y2 = cy + Math.sin(tk.angle) * (tk.r - tk.len);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${COLOR},0.35)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // the rotating sweep wedge
        const grad = ctx.createConicGradient
            ? ctx.createConicGradient(sweepAngle - Math.PI / 2, cx, cy)
            : null;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, sweepAngle - 0.5, sweepAngle);
        ctx.closePath();
        const sweepGrad = ctx.createLinearGradient(
            cx + Math.cos(sweepAngle - 0.5) * maxR, cy + Math.sin(sweepAngle - 0.5) * maxR,
            cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR
        );
        sweepGrad.addColorStop(0, `rgba(${COLOR},0)`);
        sweepGrad.addColorStop(1, `rgba(${COLOR},0.28)`);
        ctx.fillStyle = sweepGrad;
        ctx.fill();
        ctx.restore();

        // static core -- unblinking, always the same, watching
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.strokeStyle = "#0b0f14";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR},0.75)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},0.9)`;
        ctx.fill();

        requestAnimationFrame(draw);
    }
    draw();
})();
