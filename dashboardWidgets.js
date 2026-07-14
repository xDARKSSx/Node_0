/* Small decorative live widgets surrounding NODE_0's chat panel --
   pure Canvas 2D, each independent, teal palette to match the core. */
(function () {
    const COLOR = "127,232,204";

    function setup(id) {
        const c = document.getElementById(id);
        if (!c || !c.getContext) return null;
        return { c, ctx: c.getContext("2d") };
    }

    /* ===== orbiting dots array ===== */
    (function orbit() {
        const w = setup("wOrbit"); if (!w) return;
        const { c, ctx } = w;
        const cx = c.width / 2, cy = c.height / 2;
        const rings = [
            { r: 20, n: 3, speed: 0.02 },
            { r: 40, n: 5, speed: -0.014 },
            { r: 58, n: 7, speed: 0.009 },
        ];
        let t = 0;
        function draw() {
            t += 1;
            ctx.clearRect(0, 0, c.width, c.height);
            rings.forEach(ring => {
                ctx.beginPath();
                ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${COLOR},0.12)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                for (let i = 0; i < ring.n; i++) {
                    const a = (i / ring.n) * Math.PI * 2 + t * ring.speed;
                    const x = cx + Math.cos(a) * ring.r;
                    const y = cy + Math.sin(a) * ring.r;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${COLOR},0.8)`;
                    ctx.fill();
                }
            });
            requestAnimationFrame(draw);
        }
        draw();
    })();

    /* ===== bar chart, fluctuating ===== */
    function makeBars(id, barCount) {
        const w = setup(id); if (!w) return;
        const { c, ctx } = w;
        const bars = Array.from({ length: barCount }, () => ({
            v: Math.random(), target: Math.random(),
        }));
        function draw() {
            ctx.clearRect(0, 0, c.width, c.height);
            const bw = c.width / barCount;
            bars.forEach((b, i) => {
                b.v += (b.target - b.v) * 0.06;
                if (Math.abs(b.target - b.v) < 0.02) b.target = Math.random();
                const h = b.v * (c.height - 20);
                ctx.fillStyle = `rgba(${COLOR},${0.25 + b.v * 0.5})`;
                ctx.fillRect(i * bw + 3, c.height - h, bw - 6, h);
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
    makeBars("wBars1", 14);

    /* ===== scrolling waveform ===== */
    (function wave() {
        const w = setup("wWave"); if (!w) return;
        const { c, ctx } = w;
        let t = 0;
        function draw() {
            t += 0.12;
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.beginPath();
            for (let x = 0; x < c.width; x++) {
                const y = c.height / 2
                    + Math.sin(x * 0.05 + t) * 14
                    + Math.sin(x * 0.13 + t * 1.7) * 6;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(${COLOR},0.7)`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
            requestAnimationFrame(draw);
        }
        draw();
    })();

    /* ===== radar / connected scatter points ===== */
    (function radar() {
        const w = setup("wRadar"); if (!w) return;
        const { c, ctx } = w;
        const pts = Array.from({ length: 9 }, () => ({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
        }));
        let sweep = 0;
        function draw() {
            sweep += 0.02;
            ctx.clearRect(0, 0, c.width, c.height);
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 70) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(${COLOR},${0.15 * (1 - d / 70)})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
            }
            pts.forEach((p, i) => {
                const glow = 0.4 + 0.4 * Math.abs(Math.sin(sweep * 2 + i));
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${COLOR},${glow})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    })();

    /* ===== donut / state pie, slow rotation ===== */
    (function pie() {
        const w = setup("wPie"); if (!w) return;
        const { c, ctx } = w;
        const cx = c.width / 2, cy = c.height / 2, r = Math.min(c.width, c.height) / 2 - 10;
        const segs = [0.35, 0.22, 0.28, 0.15];
        let rot = 0;
        function draw() {
            rot += 0.004;
            ctx.clearRect(0, 0, c.width, c.height);
            let a = rot;
            segs.forEach((s, i) => {
                const a2 = a + s * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, a, a2);
                ctx.closePath();
                ctx.fillStyle = `rgba(${COLOR},${0.15 + i * 0.13})`;
                ctx.fill();
                ctx.strokeStyle = "#020504";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                a = a2;
            });
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = "#050807";
            ctx.fill();
            requestAnimationFrame(draw);
        }
        draw();
    })();
})();
