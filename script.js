// 🎯 Countdown NODE_0 -> NODE_1 (7 jours)

const targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime();

const x = setInterval(function () {

  const now = new Date().getTime();
  const distance = targetDate - now;

  let timer = document.getElementById("timer");
  let hidden = document.getElementById("hidden");

  // sécurité si éléments absents
  if (!timer || !hidden) return;

  // quand le temps est écoulé
  if (distance <= 0) {
    clearInterval(x);

    timer.innerText = "";
    hidden.style.display = "block";

    return;
  }

  // calcul du temps restant
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timer.innerText =
    `NODE_0 ACTIVE IN: ${days}d ${hours}h ${minutes}m ${seconds}s`;

}, 1000);
