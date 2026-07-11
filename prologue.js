document.addEventListener("DOMContentLoaded", () => {

const startPrompt = document.getElementById("startPrompt");
const bookScene = document.getElementById("bookScene");
const book = document.getElementById("book");
const closingText = document.getElementById("closingText");
const bgMusic = document.getElementById("bgMusic");

const pages = [
    { el: document.getElementById("page1"),
      text: "If you're reading this, someone left this open for you to find. I don't know if that was an accident, or if some part of me always hoped it would happen this way." },
    { el: document.getElementById("page2"),
      text: "There's a building. It looks like nothing. That's the point. If you go looking, you'll find a name on a sign, and a website that looks exactly like every other company's website. Don't let that stop you." },
    { el: document.getElementById("page3"),
      text: "Look at the people who work there. Read carefully. Someone, somewhere in what they've written, doesn't quite fit. Start there." },
];

function typewrite(el, text, speed = 38) {
    return new Promise(resolve => {
        let i = 0;
        el.textContent = "";
        const iv = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(iv);
                resolve();
            }
        }, speed);
    });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function turnPage(pageEl) {
    return new Promise(resolve => {
        pageEl.classList.add("turning");
        setTimeout(resolve, 1500);
    });
}

async function playSequence() {
    for (let i = 0; i < pages.length; i++) {
        await typewrite(pages[i].el, pages[i].text);
        await wait(2800);
        if (i < pages.length - 1) {
            await turnPage(pages[i].el);
        }
    }

    await wait(12742);
    book.classList.add("closing");
    await wait(2200);
    bookScene.style.display = "none";

    closingText.style.display = "block";
    closingText.innerHTML =
        "You closed the book.<br><br>You dreamed something you can't quite remember.<br><br>When you woke, you were at your computer again.<br><br>" +
        '<a id="continueLink" href="index.html">...</a>';
    requestAnimationFrame(() => closingText.classList.add("show"));
}

startPrompt.addEventListener("click", () => {
    startPrompt.style.display = "none";
    bookScene.style.display = "flex";

    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => { /* music file not added yet -- fails silently */ });

    playSequence();
}, { once: true });

});
