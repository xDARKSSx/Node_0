console.log("NODE_0 JS IS RUNNING");

setInterval(() => {
  const timer = document.getElementById("timer");
  if (timer) {
    timer.innerText = "TEST OK - TIMER ALIVE";
  }
}, 1000);
