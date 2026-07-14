/* Ambient background effect for NODE_0: continuous digital rain,
   with the page periodically attempting to "lock itself down"
   and failing -- a red flicker that stutters and gives up.
   Fully random timing, layered behind the chat UI, never blocks it. */
(function () {
    const canvas = document.getElementById("matrixRain");
    const flash = document.getElementById("lockdownFlash");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテト$#%&";
    const fontSize = 15;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function resetColumns() {
        columns = Math.floor(canvas.width / fontSize);
        drops = new Array(columns).fill(1);
    }
    window.addEventListener("resize", resetColumns);

    function drawRain() {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff9f";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(drawRain);
    }
    requestAnimationFrame(drawRain);

    /* random, failed "lockdown" attempts -- a red pulse that
       stutters a few times then gives up, fully unpredictable timing */
    function attemptLockdown() {
        const stutters = 3 + Math.floor(Math.random() * 4);
        let count = 0;
        const iv = setInterval(() => {
            flash.style.opacity = (Math.random() * 0.35).toFixed(2);
            count++;
            if (count >= stutters) {
                clearInterval(iv);
                flash.style.transition = "opacity 0.8s ease";
                flash.style.opacity = "0";
                setTimeout(() => { flash.style.transition = "none"; }, 850);
            }
        }, 90 + Math.random() * 120);
    }

    function scheduleNextLockdown() {
        const delay = (60 + Math.random() * 180) * 1000; // 1 to 4 minutes, less frequent
        setTimeout(() => {
            attemptLockdown();
            scheduleNextLockdown();
        }, delay);
    }
    scheduleNextLockdown();
})();
