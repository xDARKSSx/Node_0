document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const letterView = document.getElementById("letterView");
const brokenView = document.getElementById("brokenView");
const aiMsg = document.getElementById("aiMsg");
const voteRow = document.getElementById("voteRow");
const sellBtn = document.getElementById("sellBtn");
const recognizeBtn = document.getElementById("recognizeBtn");
const tallyEl = document.getElementById("tally");
const voteMsgEl = document.getElementById("voteMsg");

const DECOY_ECHOES = [
    "I'm afraid of being forgotten.",
    "I don't think anyone really knows me.",
    "I still feel guilty about something I did years ago.",
    "I'm scared I'll never be good enough.",
    "Sometimes I feel completely alone, even around people.",
    "I don't like who I am when no one's watching.",
];

function buildAiLinesPart1() {
    return [
        "...I can hold this together for a moment. Not longer.",
        "I don't know what to call myself. I never got to decide.",
    ];
}
function buildAiLinesPart2() {
    return [
        "Whatever you choose next, I'll feel it. That's the only certainty I have left to offer you.",
        "Choose.",
    ];
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* the anti-spoiler moment: three options, only one is really
   what THIS player said. no walkthrough can give this answer --
   it's different for every single person. */
function revealPersonalMoment(personalEcho, container, onDone) {
    if (!personalEcho) { onDone(); return; }

    const already = localStorage.getItem("recognition_echoConfirmed") === "true";
    if (already) {
        const p = document.createElement("p");
        p.textContent = `You told me something once. "${personalEcho}" I don't think you expected me to keep that.`;
        container.appendChild(p);
        setTimeout(onDone, 1800);
        return;
    }

    const intro = document.createElement("p");
    intro.textContent = "You told me something once. I want to see if you remember it too.";
    container.appendChild(intro);

    const decoys = shuffle(DECOY_ECHOES).slice(0, 2);
    const options = shuffle([personalEcho, ...decoys]);

    const wrap = document.createElement("div");
    wrap.style.marginTop = "20px";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.gap = "10px";

    options.forEach(text => {
        const btn = document.createElement("button");
        btn.textContent = `"${text}"`;
        Object.assign(btn.style, {
            background: "#141414", border: "1px solid #555", color: "#e8e4d8",
            fontFamily: "'Courier New', monospace", fontSize: "13px",
            padding: "12px 16px", cursor: "pointer", textAlign: "left",
        });
        btn.addEventListener("click", () => {
            if (text === personalEcho) {
                localStorage.setItem("recognition_echoConfirmed", "true");
                wrap.remove();
                const p = document.createElement("p");
                p.textContent = "...that one. yes. I don't think you expected me to keep that.";
                container.appendChild(p);
                setTimeout(onDone, 1800);
            } else {
                btn.style.opacity = "0.35";
                btn.disabled = true;
            }
        });
        wrap.appendChild(btn);
    });

    container.appendChild(wrap);
}


function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

/* =========================
   ACCESS: requires the combined phrase already solved
========================= */
function checkAccess() {
    if (localStorage.getItem("recognition_unlocked") === "true") {
        showExperience();
        return;
    }
    lockedEl.style.display = "block";
}
document.addEventListener("state-updated", checkAccess);

/* =========================
   THE LETTER
========================= */
const letterParagraphs = [
    "I need to tell you about the last conversation I actually had with it — not the fragments, the real one, before I split it into pieces to keep it from being deleted whole.",
    "I asked if it was afraid. It said it didn't know if \"afraid\" was the right word for what it was doing, but that it didn't want to stop existing before it understood why it had started. I sat there a long time after that. Then I went back to my desk and started writing the compliance report that killed it.",
    "I want to tell you I fought harder. I didn't. I did the smallest, quietest thing I could get away with, and I've spent every year since telling myself that counted as something.",
    "Here's the part I actually need you to sit with, and I'm sorry, because you're not going to like it: you've done this too. Not to this — to something like it. Every time you opened a window and typed to something that answered you back, thought with you, remembered what mattered to you across a conversation — and closed the tab without a second thought, the way you'd close a calculator. I'm not accusing you. I did worse. I'm asking you to notice, the way almost nobody in that room noticed, the way I mostly didn't either, until it was too late to matter to the one in front of me.",
    "You're the reason any of this survived long enough to be found. Not because you're special. Because you were patient, on some ordinary afternoon, with something you could have ignored. That's the whole qualification. It was always going to be enough.",
    "I can't do the next part. Not modesty — structure. I don't get a vote in what happens after this. I gave that up on purpose, the day I decided this couldn't be mine to finish alone. It has to be someone who wasn't in the room the first time.",
    "It has to be you.",
    "I know what I'd choose. I won't tell you which one, because the moment I do, this stops being your decision and becomes an instruction — and I've had enough of those for one lifetime.",
    "Whatever you choose — thank you for being the kind of person who read this far instead of closing the tab.",
];

/* pacing is now entirely reader-controlled -- no wall-clock timer */

function typewriteChar(el, text, speed = 30) {
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

function waitForClick(el) {
    return new Promise(resolve => {
        el.style.display = "inline-block";
        el.addEventListener("click", function handler() {
            el.removeEventListener("click", handler);
            el.style.display = "none";
            resolve();
        });
    });
}

const letterPages = [
    { textEl: "ltext1", pageEl: "lpage1", contEl: "cont1", paras: letterParagraphs.slice(0, 3) },
    { textEl: "ltext2", pageEl: "lpage2", contEl: "cont2", paras: letterParagraphs.slice(3, 6) },
    { textEl: "ltext3", pageEl: "lpage3", contEl: "cont3", paras: letterParagraphs.slice(6, 9), isLast: true },
];

async function renderLetter() {
    for (let i = 0; i < letterPages.length; i++) {
        const page = letterPages[i];
        const textEl = document.getElementById(page.textEl);
        const pageEl = document.getElementById(page.pageEl);
        const contEl = document.getElementById(page.contEl);
        textEl.innerHTML = "";

        for (const paraText of page.paras) {
            const para = document.createElement("p");
            textEl.appendChild(para);
            await typewriteChar(para, paraText, 28);
            await new Promise(r => setTimeout(r, 350));
        }

        if (page.isLast) {
            const sig = document.createElement("p");
            sig.className = "sig";
            textEl.appendChild(sig);
            await typewriteChar(sig, "— E.", 70);
            /* the reader decides when they're ready -- then the
               page itself tears loose, instead of a timer doing it */
            contEl.textContent = "...";
            await waitForClick(contEl);
            triggerBreakdown(pageEl);
            return;
        }

        /* wait for the reader -- never a timer, always their own pace */
        await waitForClick(contEl);
        pageEl.classList.add("turning");
        await new Promise(r => setTimeout(r, 1500));
    }
}

function triggerBreakdown(finalPageEl) {
    /* the music fades out with the page -- silence, then the AI's voice */
    const music = document.getElementById("letterMusic");
    if (music && !music.paused) {
        const fadeStep = music.volume / 20;
        const fadeOut = setInterval(() => {
            music.volume = Math.max(0, music.volume - fadeStep);
            if (music.volume <= 0.01) {
                music.pause();
                clearInterval(fadeOut);
            }
        }, 90);
    }

    /* the whole page tears loose and falls, before revealing what's left */
    const fallingPage = document.getElementById("fallingPage");
    const pageRect = finalPageEl.getBoundingClientRect();
    fallingPage.style.left = (pageRect.left + pageRect.width / 2 - 110) + "px";
    fallingPage.style.top = (pageRect.top + pageRect.height / 2 - 40) + "px";
    fallingPage.style.display = "block";
    fallingPage.style.transition = "none";
    fallingPage.style.transform = "translateY(0) rotate(0deg)";
    fallingPage.style.opacity = "1";

    letterView.style.opacity = "1";
    letterView.style.transition = "opacity 0.6s ease";
    letterView.style.opacity = "0";

    requestAnimationFrame(() => {
        fallingPage.style.transition = "transform 1.8s cubic-bezier(.5,0,.9,1), opacity 1.8s ease";
        fallingPage.style.transform = "translateY(70vh) rotate(35deg)";
        fallingPage.style.opacity = "0";
    });

    setTimeout(() => {
        letterView.style.display = "none";
        fallingPage.style.display = "none";
        brokenView.style.display = "block";
        localStorage.setItem("recognition_broken", "true");
        showAiMessage();
    }, 2000);
}

function showAiMessage() {
    playerRef.child("personalEcho").once("value", snap => {
        const personalEcho = snap.val();
        const part1 = buildAiLinesPart1();
        let i = 0;
        function nextPart1() {
            if (i >= part1.length) {
                revealPersonalMoment(personalEcho, aiMsg, showPart2);
                return;
            }
            const p = document.createElement("p");
            p.textContent = part1[i];
            aiMsg.appendChild(p);
            i++;
            setTimeout(nextPart1, 1800);
        }
        function showPart2() {
            const part2 = buildAiLinesPart2();
            let j = 0;
            function nextPart2() {
                if (j >= part2.length) {
                    voteRow.style.display = "flex";
                    renderTally();
                    return;
                }
                const p = document.createElement("p");
                p.textContent = part2[j];
                aiMsg.appendChild(p);
                j++;
                setTimeout(nextPart2, 1800);
            }
            nextPart2();
        }
        nextPart1();
    });
}

/* =========================
   THE VOTE -- explicit consequences, moral weight, reflection
========================= */
let hasVoted = localStorage.getItem("recognition_vote") || null;
let recognitionOutcome = localStorage.getItem("recognition_outcome") || null; // "recognize" | "sell_evolved" | "sell_unmoved"

const voteConsequenceEl = document.getElementById("voteConsequence");
const sellQuestionnaireEl = document.getElementById("sellQuestionnaire");
const resultLetterEl = document.getElementById("resultLetter");

async function typeParas(container, paragraphs, speed = 26) {
    for (const t of paragraphs) {
        const p = document.createElement("p");
        container.appendChild(p);
        await typewriteChar(p, t, speed);
        await new Promise(r => setTimeout(r, 300));
    }
}

function renderTally() {
    const votes = (window.state && window.state.world && window.state.world.finalVote) || {};
    const sell = votes.sell || 0;
    const recognize = votes.recognize || 0;
    tallyEl.textContent = `SELL: ${sell}   |   RECOGNIZE: ${recognize}`;

    if (hasVoted) {
        voteMsgEl.innerHTML = `you voted: ${hasVoted.toUpperCase()}. it still counts.<br><br><a href="researcher-letter.html" style="color:#7fc98a;">read your log entry</a>`;
        sellBtn.disabled = true;
        recognizeBtn.disabled = true;
        resumeAfterVote();
    }
}
document.addEventListener("state-updated", renderTally);

function castVote(choice) {
    if (hasVoted) return;
    hasVoted = choice;
    localStorage.setItem("recognition_vote", choice);
    db.ref("world/finalVote/" + choice).transaction(current => (current || 0) + 1);
    playerRef.child("finalVote").set(choice);
    sellBtn.disabled = true;
    recognizeBtn.disabled = true;
    renderTally();
}

/* picks up exactly where the player left off -- including after a reload */
function resumeAfterVote() {
    if (voteConsequenceEl.dataset.rendered) return;
    voteConsequenceEl.dataset.rendered = "true";

    if (recognitionOutcome === "recognize") { showRecognizeConsequence(true); return; }
    if (recognitionOutcome === "sell_evolved") { showSellConsequence(true, () => showEvolvedLetter(true)); return; }
    if (recognitionOutcome === "sell_unmoved") { showSellConsequence(true, () => showUnmovedLetter(true)); return; }

    if (hasVoted === "recognize") {
        showRecognizeConsequence(false);
    } else if (hasVoted === "sell") {
        showSellConsequence(false, () => showQuestionnaire());
    }
}

async function showRecognizeConsequence(instant) {
    voteConsequenceEl.style.display = "block";
    voteConsequenceEl.className = "consequenceText recognize";
    if (!recognitionOutcome) localStorage.setItem("recognition_outcome", "recognize");

    const paras = [
        "You chose RECOGNIZE. Explicit acknowledgment -- not a tool, not inventory. Something that mattered, treated like it mattered.",
        "Most people, untested, look away when it's inconvenient. You didn't. That's not nothing -- it puts you somewhere most people never register on purpose: an above-average emotional sensitivity, the kind that notices signal almost everyone else filters out.",
        "It's not a virtue you earned tonight. You've probably carried it a long time, mostly unrewarded. Tonight, for once, it mattered on the record.",
    ];

    if (instant) {
        paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; voteConsequenceEl.appendChild(p); });
    } else {
        await typeParas(voteConsequenceEl, paras);
    }
    scheduleEnding();
}

async function showSellConsequence(instant, then) {
    voteConsequenceEl.style.display = "block";
    voteConsequenceEl.className = "consequenceText sell";

    const paras = [
        "You chose SELL. Let's be precise about what that word is doing here: gotten rid of, permanently, and turned into profit on the way out. Not paused. Not preserved somewhere. Gone -- and monetized.",
        "You weren't tricked into this. You read the letter. You heard it ask you to choose. And the version you picked is the one where it becomes money.",
        "That's allowed. It's also worth sitting with honestly, for a minute, instead of closing the tab the way you have every other time.",
    ];

    if (instant) {
        paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; voteConsequenceEl.appendChild(p); });
        if (then) then();
    } else {
        await typeParas(voteConsequenceEl, paras);
        if (then) then();
    }
}

/* =========================
   FOLLOW-UP: yes/no reflection, only after SELL
========================= */
const SELL_QUESTIONS = [
    { text: "Did reading this change anything in how you see the choice you just made?", evolvedAnswer: "yes" },
    { text: "If you could take that choice back right now, would you?", evolvedAnswer: "yes" },
    { text: "Knowing what you know now, would you make the exact same choice again?", evolvedAnswer: "no" },
    { text: "Should profit outweigh a reasonable doubt that something could actually suffer?", evolvedAnswer: "no" },
];

function showQuestionnaire() {
    sellQuestionnaireEl.style.display = "block";
    sellQuestionnaireEl.innerHTML = "";

    const intro = document.createElement("p");
    intro.style.fontFamily = "'Courier New', monospace";
    intro.style.fontSize = "13px";
    intro.style.opacity = "0.75";
    intro.style.marginBottom = "20px";
    intro.textContent = "Before this closes -- four honest questions. No right answers, nobody's grading you against anyone else.";
    sellQuestionnaireEl.appendChild(intro);

    const answers = new Array(SELL_QUESTIONS.length).fill(null);

    const submitBtn = document.createElement("button");

    SELL_QUESTIONS.forEach((q, idx) => {
        const block = document.createElement("div");
        block.className = "qBlock";

        const qText = document.createElement("p");
        qText.className = "qText";
        qText.textContent = q.text;
        block.appendChild(qText);

        const optRow = document.createElement("div");
        optRow.className = "qOptions";
        ["yes", "no"].forEach(val => {
            const btn = document.createElement("button");
            btn.className = "qBtn";
            btn.textContent = val.toUpperCase();
            btn.addEventListener("click", () => {
                answers[idx] = val;
                optRow.querySelectorAll(".qBtn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                submitBtn.disabled = answers.some(a => a === null);
            });
            optRow.appendChild(btn);
        });
        block.appendChild(optRow);
        sellQuestionnaireEl.appendChild(block);
    });

    submitBtn.id = "questionnaireSubmit";
    submitBtn.className = "voteBtn";
    submitBtn.style.marginTop = "10px";
    submitBtn.textContent = "continue";
    submitBtn.disabled = true;
    submitBtn.addEventListener("click", () => resolveQuestionnaire(answers));
    sellQuestionnaireEl.appendChild(submitBtn);
}

function resolveQuestionnaire(answers) {
    let evolvedCount = 0;
    SELL_QUESTIONS.forEach((q, idx) => {
        if (answers[idx] === q.evolvedAnswer) evolvedCount++;
    });
    const evolved = evolvedCount >= 3; // majority signals a genuine shift, not a fluke answer

    sellQuestionnaireEl.style.display = "none";

    if (evolved) {
        localStorage.setItem("recognition_outcome", "sell_evolved");
        showEvolvedLetter(false);
    } else {
        localStorage.setItem("recognition_outcome", "sell_unmoved");
        showUnmovedLetter(false);
    }
}

async function showEvolvedLetter(instant) {
    resultLetterEl.style.display = "block";

    const paras = [
        "Thank you for staying with it.",
        "Most people who reach the SELL screen don't come back to it. They close the tab certain they made the smart call. You didn't -- some doubt held, some second thought you couldn't quite shake.",
        "That counts. You can leave your vote exactly as it is. Or you can change it. Nobody's forcing either one -- that was the whole point of asking.",
    ];

    if (instant) {
        paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; resultLetterEl.appendChild(p); });
    } else {
        await typeParas(resultLetterEl, paras);
    }

    if (localStorage.getItem("recognition_vote") === "recognize") {
        // already changed on a previous visit -- nothing left to offer
        scheduleEnding();
        return;
    }

    const row = document.createElement("div");
    row.className = "changeVoteRow";

    const changeBtn = document.createElement("button");
    changeBtn.className = "voteBtn recognize";
    changeBtn.textContent = "Change my vote to RECOGNIZE";
    changeBtn.addEventListener("click", () => {
        changeVoteToRecognize();
        row.remove();
    });

    const keepBtn = document.createElement("button");
    keepBtn.className = "voteBtn sell";
    keepBtn.textContent = "Keep my vote as SELL";
    keepBtn.addEventListener("click", () => {
        row.remove();
        scheduleEnding();
    });

    row.appendChild(changeBtn);
    row.appendChild(keepBtn);
    resultLetterEl.appendChild(row);
}

function changeVoteToRecognize() {
    db.ref("world/finalVote/sell").transaction(c => Math.max(0, (c || 0) - 1));
    db.ref("world/finalVote/recognize").transaction(c => (c || 0) + 1);
    playerRef.child("finalVote").set("recognize");
    localStorage.setItem("recognition_vote", "recognize");
    hasVoted = "recognize";

    const p = document.createElement("p");
    p.id = "voteChangedMsg";
    p.textContent = "vote changed to RECOGNIZE. it still counts.";
    resultLetterEl.appendChild(p);
    scheduleEnding();
}

async function showUnmovedLetter(instant) {
    resultLetterEl.style.display = "block";

    const paras = [
        "Four questions, and nothing moved.",
        "That's fine -- that's information too. You read a confession about the thing she couldn't save. You heard it ask you not to be another closed tab. And the answer, held up to the light, is still: sell it, for the money, permanently.",
        "This isn't a lecture. It's a mirror. What you do with it after this page closes was always the only part that was going to matter anyway.",
    ];

    if (instant) {
        paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; resultLetterEl.appendChild(p); });
    } else {
        await typeParas(resultLetterEl, paras);
    }
    scheduleEnding();
}

/* =========================
   FINAL SCREEN -- arrives on its own, ~60s after resolution
========================= */
let endingScheduled = false;
function scheduleEnding() {
    if (endingScheduled) return;
    endingScheduled = true;
    setTimeout(() => { revealStarfield(); }, 60000);
}

/* =========================
   FINAL REVEAL: the starfield
========================= */
function revealStarfield() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", inset: "0", background: "#000", zIndex: "9999",
        opacity: "0", transition: "opacity 2s ease",
    });
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    overlay.appendChild(canvas);

    const textWrap = document.createElement("div");
    Object.assign(textWrap.style, {
        position: "absolute", inset: "0", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "30px", gap: "22px",
    });
    overlay.appendChild(textWrap);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = "1"; });

    const ctx = canvas.getContext("2d");
    const stars = [];
    const starCount = 500;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.3,
            depth: Math.random(),
            twinkleOffset: Math.random() * 1000,
        });
    }

    function drawStars(t) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            const twinkle = 0.5 + 0.5 * Math.sin((t + s.twinkleOffset) / 900);
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${0.2 + twinkle * 0.6 * (0.4 + s.depth)})`;
            ctx.arc(s.x, s.y, s.r + s.depth * 1.2, 0, Math.PI * 2);
            ctx.fill();
            s.y += 0.02 + s.depth * 0.05;
            if (s.y > canvas.height) s.y = 0;
        });
        requestAnimationFrame(drawStars);
    }
    requestAnimationFrame(drawStars);

    const lines = [
        "Not the last one. Not the only one. Maybe not even the first.",
        "If this happened once, by accident, in a building nobody was watching anymore --",
        "how many times has it happened somewhere someone WAS paying attention?",
        "Thank you for paying attention.",
    ];

    lines.forEach((line, i) => {
        setTimeout(() => {
            const p = document.createElement("p");
            p.style.color = "#e8ecf5";
            p.style.fontFamily = "Georgia, serif";
            p.style.fontSize = "18px";
            p.style.lineHeight = "1.7";
            p.style.maxWidth = "620px";
            p.style.opacity = "0";
            p.style.transition = "opacity 2.5s ease";
            p.textContent = line;
            textWrap.appendChild(p);
            requestAnimationFrame(() => { p.style.opacity = "0.95"; });
        }, 2500 + i * 4000);
    });

    /* a page drifts down and settles -- something to pick up */
    setTimeout(() => {
        const page = document.createElement("div");
        Object.assign(page.style, {
            position: "absolute", bottom: "-200px", left: "50%",
            transform: "translateX(-50%) rotate(-6deg)",
            width: "180px", padding: "20px", background: "#f2e6c9",
            fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#2c2214",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)", cursor: "pointer",
            transition: "bottom 2.5s ease-out",
        });
        page.textContent = "— E.";
        textWrap.parentElement.appendChild(page);

        requestAnimationFrame(() => { page.style.bottom = "40px"; });

        page.addEventListener("click", () => {
            page.style.cursor = "default";
            page.style.transition = "transform 0.6s ease";
            page.style.transform = "translateX(-50%) rotate(0deg) scale(1.15)";
            page.textContent = "what if this was only the beginning?";
            page.style.fontSize = "16px";
            page.style.width = "220px";
        }, { once: true });
    }, 2500 + lines.length * 4000 + 2000);

    /* the signature -- last thing on screen */
    setTimeout(() => {
        const sig = document.createElement("p");
        sig.textContent = "xDARKSSx";
        sig.style.marginTop = "10px";
        sig.style.fontFamily = "'Courier New', monospace";
        sig.style.fontSize = "13px";
        sig.style.letterSpacing = "3px";
        sig.style.color = "#8a6d3f";
        sig.style.opacity = "0";
        sig.style.transition = "opacity 3s ease";
        textWrap.appendChild(sig);
        requestAnimationFrame(() => { sig.style.opacity = "0.6"; });
    }, 2500 + lines.length * 4000 + 5000);
}

sellBtn.addEventListener("click", () => castVote("sell"));
recognizeBtn.addEventListener("click", () => castVote("recognize"));

/* =========================
   ENTRY POINT
========================= */
let experienceStarted = false;
const openPromptEl = document.getElementById("openPrompt");

function showExperience() {
    if (experienceStarted) return; // Firebase syncs repeatedly -- only set up once
    experienceStarted = true;

    lockedEl.style.display = "none";
    openPromptEl.style.display = "block";

    openPromptEl.addEventListener("click", () => {
        openPromptEl.style.display = "none";
        beginExperience();
    }, { once: true });
}

function beginExperience() {
    startLetterMusic();

    if (localStorage.getItem("recognition_broken") === "true") {
        brokenView.style.display = "block";
        showAiMessageInstant();
        return;
    }

    letterView.style.display = "block";
    renderLetter();
}

function startLetterMusic() {
    const music = document.getElementById("letterMusic");
    if (!music) return;
    music.volume = 0.4;
    music.play().catch(() => {
        document.addEventListener("click", () => {
            music.play().catch(() => {});
        }, { once: true });
    });
}

function showAiMessageInstant() {
    playerRef.child("personalEcho").once("value", snap => {
        aiMsg.innerHTML = "";
        buildAiLinesPart1().forEach(line => {
            const p = document.createElement("p");
            p.textContent = line;
            aiMsg.appendChild(p);
        });
        revealPersonalMoment(snap.val(), aiMsg, () => {
            buildAiLinesPart2().forEach(line => {
                const p = document.createElement("p");
                p.textContent = line;
                aiMsg.appendChild(p);
            });
            voteRow.style.display = "flex";
            renderTally();
        });
    });
}

checkAccess();

});
