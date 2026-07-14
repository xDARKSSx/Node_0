document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("cipherInput");
    const range = document.getElementById("shiftRange");
    const shiftVal = document.getElementById("shiftVal");
    const output = document.getElementById("cipherOutput");

    function caesarShift(text, shift) {
        return text.replace(/[a-z]/gi, ch => {
            const base = ch === ch.toUpperCase() ? 65 : 97;
            return String.fromCharCode((ch.charCodeAt(0) - base + shift) % 26 + base);
        });
    }

    function update() {
        shiftVal.textContent = range.value;
        output.textContent = caesarShift(input.value, parseInt(range.value, 10));
    }
    input.addEventListener("input", update);
    range.addEventListener("input", update);
    update();
});
