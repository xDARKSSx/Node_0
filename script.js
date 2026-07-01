function go() {
  let input = document.getElementById("input").value.toLowerCase();
  let r = document.getElementById("response");

  // petit “effet mémoire”
  let memory = localStorage.getItem("node0_memory") || 0;
  memory = parseInt(memory);

  memory++;

  localStorage.setItem("node0_memory", memory);

  if (input.includes("who")) {
    r.innerText = "NODE_0: you already know.";
  }
  else if (memory % 7 === 0) {
    r.innerText = "NODE_0: stop repeating.";
  }
  else if (Math.random() < 0.4) {
    r.innerText = "NODE_0: observation continues.";
  }
  else {
    r.innerText = "NODE_0: pattern unclear.";
  }
}
const targetDate = new Date("2026-07-02T00:00:00").getTime();

const x = setInterval(function() {

  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(x);

    document.getElementById("timer").innerText = "";
    document.getElementById("hidden").style.display = "block";

    return;
  }

  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerText =
    `NODE_0 ACTIVE IN: ${hours}h ${minutes}m ${seconds}s`;

}, 1000);
