function go() {
  let input = document.getElementById("input").value;
  let r = document.getElementById("response");

  let rand = Math.random();

  if (rand < 0.3) {
    r.innerText = "NODE_0: you are not the first.";
  } else if (rand < 0.6) {
    r.innerText = "NODE_0: observation continues.";
  } else {
    r.innerText = "NODE_0: pattern unclear.";
  }
}
