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
