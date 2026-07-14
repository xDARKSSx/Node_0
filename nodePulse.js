/* Animated circuit iris for NODE_0 -- pure Canvas 2D, no engine.
   Cyan/teal, breathing pulse, flickering radial circuit traces.
   Exposes window.pulseIntensify() so app.js can trigger a
   brief flare whenever NODE_0 speaks. */
(function () {
    const canvas = document.getElementById("fracture");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const COLOR = "95,214,196"; // teal

    const rings = [42, 65, 90, 118];
    const traces = [];
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const ringIdx = i % rings.length;
        traces.push({
            angle,
            r1: rings[ringIdx],
            r2: rings[ringIdx] + 18 + Math.random() * 22,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
        });
    }

    let t = 0;
    let flare = 0; // temporary intensity boost, decays over time

    window.pulseIntensify = function () {
        flare = 1;
    };

    function draw() {
        t += 0.02;
        flare *= 0.96; // decay

        ctx.clearRect(0, 0, W, H);

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4) + flare * 0.5;

        /* pseudo-3D rotating rings: squash the ellipse's vertical
           radius with a sine wave to fake perspective rotation --
           a classic 2D trick, no real 3D involved */
        rings.forEach((r, i) => {
            const squash = Math.cos(t * 0.5 + i * 0.7); // -1 to 1, simulates spin
            const ry = r * Math.max(0.15, Math.abs(squash));
            ctx.beginPath();
            ctx.ellipse(cx, cy, r, ry, 0, 0, Math.PI * 2);
            const depth = squash > 0 ? 1 : 0.4; // "front" half brighter than "back" half
            ctx.strokeStyle = `rgba(214,190,255,${(0.18 + 0.12 * Math.sin(t * 0.8 + i)) * depth})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        traces.forEach(tr => {
            const flicker = 0.25 + 0.75 * Math.abs(Math.sin(t * tr.speed + tr.phase)) + flare * 0.3;
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

        const coreR = 28 + pulse * 8;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
        grad.addColorStop(0, `rgba(${COLOR},${0.5 + pulse * 0.5})`);
        grad.addColorStop(1, `rgba(${COLOR},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = "#0a1414";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR},${0.6 + pulse * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(draw);
    }
    draw();
})();
