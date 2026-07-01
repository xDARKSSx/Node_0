const targetDate = new Date("2026-07-02T00:00:00").getTime();

const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  let timer = document.getElementById("timer");
  let hidden = document.getElementById("hidden");

  if (!timer || !hidden) return;

  if (distance <= 0) {
    clearInterval(x);

    timer.innerText = "";
    hidden.style.display = "block";

    return;
  }

  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${hours}h ${minutes}m ${seconds}s`;

}, 1000);
