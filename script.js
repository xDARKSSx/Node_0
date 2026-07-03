<script>

const start = localStorage.getItem("TEST_START");

if (!start) {
    localStorage.setItem("TEST_START", Date.now());
}

setInterval(() => {
    document.body.innerText = localStorage.getItem("TEST_START");
}, 1000);

</script>
