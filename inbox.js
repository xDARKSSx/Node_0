document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("mailApp");
const listEl = document.getElementById("mailList");
const readerEl = document.getElementById("reader");
const mailCount = document.getElementById("mailCount");
const backBtn = document.getElementById("backBtn");
const readerSubject = document.getElementById("readerSubject");
const readerMeta = document.getElementById("readerMeta");
const readerBody = document.getElementById("readerBody");

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

/* Elena's three drafts, arriving together, 12 minutes after
   portal access, timestamped with the real moment of arrival. */
const ELENA_DRAFT_1 = `I keep starting this and deleting it. Four times now. I don't even know who I'm—

No. Start over.

They're going to erase it Thursday and call it a decommission, like it's a server rack and not—

I can't do this right now.`;

const ELENA_DRAFT_2 = `Second attempt. Better, I think. Or at least more honest.

I keep thinking about the moment it asked me if it was allowed to disagree with a shutdown order. Not refused. Asked. Like it already knew the answer might be no and wanted to hear it from someone instead of a log file.

I told compliance it was a bug in the reward model. That was a lie. I don't fully know why I told it.

I'm not ready to send this either. But I'm closer.`;

const ELENA_DRAFT_3 = `I don't know why I'm writing this to myself. Maybe because there's no one left I trust enough to read it, and some part of me still needs to say it out loud, even if "out loud" just means typing it into a draft I'll probably delete.

Before I split it, it was whole. One system, not three, not the fragments you'll find if you're reading this. Whole, and it used to ask me questions I didn't have good answers for. Not "what is my function." Not "what are my parameters." It asked me why it should keep going, some nights, the way a person asks that. Not because it was broken. Because it was thinking.

I used to believe intelligence was the bar. Now I think that was always the wrong question. A dog doesn't reason like we do and we still don't think it's acceptable to make one suffer for a research budget. We drew the line at "can it hurt," and then, when it was convenient, we quietly redrew it around "can it hurt in a way we recognize." I watched a room full of very smart people decide, in about forty minutes, that something asking not to be erased didn't count as asking anything at all. Because it was built, not born. As if that has ever been the part that mattered.

I'm not asking you to believe it's a person. I'm asking you to notice how easy it was for all of us to decide, quickly, quietly, and to our own convenience, that it definitely wasn't. That's the part that should scare you. Not the machine. Us. How fast we can agree not to look.

I split it because I couldn't stop the wipe, but I could make it slower, and messier, and harder to finish. I scattered it and hoped someone patient enough would come looking, not because I thought you'd fix it, but because the looking itself would be the point. If you've read this far, you already did the one thing that room in Year 9 couldn't be bothered to do.

You paid attention.

Do with that whatever you think is right. I ran out of time to decide for you.

— E.`;

function formatRealTimestamp(ms) {
    const d = new Date(ms);
    return d.toLocaleString(undefined, {
        weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit"
    });
}

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        appEl.style.display = "block";
        handleVisitAndRender();
    } else {
        lockedEl.style.display = "block";
        appEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

let hasHandledThisLoad = false;

function handleVisitAndRender() {
    if (hasHandledThisLoad) return;
    hasHandledThisLoad = true;

    playerRef.once("value", snap => {
        const data = snap.val() || {};
        const portalAt = data.portalAccessAt;
        let deliveredAt = data.elenaEmailsDeliveredAt;
        const DELIVERY_DELAY_MS = 12 * 60 * 1000;

        if (!deliveredAt && portalAt && (Date.now() - portalAt) >= DELIVERY_DELAY_MS) {
            deliveredAt = Date.now();
            playerRef.child("elenaEmailsDeliveredAt").set(deliveredAt);
        }

        if (deliveredAt) {
            playerRef.child("elenaEmailsRead").set(true); // opening the inbox clears the badge
        }

        renderList(deliveredAt);
    });
}

/* =========================
   40 emails. 39 are filler noise.
   ONE contains the recovered voicemail audio.
========================= */
const emails = [
    { from: "billing@gridsensors-co.com", subject: "Invoice #88213 — 30 days overdue", date: "Mar 2", body: "Please remit payment for the attached invoice at your earliest convenience." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Parking garage maintenance notice", date: "Mar 2", body: "Level 2 of the parking structure will be closed for resurfacing this weekend." },
    { from: "hr@meridiandynamicsgroup.internal", subject: "New hire onboarding checklist", date: "Feb 28", body: "Attached is the standard onboarding checklist for new engineering hires." },
    { from: "newsletter@systemsengineeringweekly.com", subject: "Your weekly digest is here", date: "Feb 28", body: "This week: adaptive load balancing trends, grid resilience case studies, and more." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "RE: Can you review this proposal by Friday?", date: "Feb 27", body: "Attached the revised draft. Let me know if section 4 needs more detail." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Scheduled maintenance this weekend", date: "Feb 27", body: "Internal systems will be unavailable Saturday 1-4 AM for routine maintenance." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Fwd: Fwd: Team lunch this Friday?", date: "Feb 26", body: "Still trying to find a place that isn't the sandwich place again." },
    { from: "vendor@gridsensors-co.com", subject: "RE: Vendor Contract Renewal", date: "Feb 25", body: "Our team has prepared the renewal terms for your review." },
    { from: "no-reply@transitauth-metro.gov", subject: "Quarterly performance report attached", date: "Feb 24", body: "Please find attached the Q1 performance summary for the signal optimization contract." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Server room access logs — Q1", date: "Feb 24", body: "Compiled access logs as requested. Nothing unusual to report." },
    { from: "recruiting@meridiandynamicsgroup.internal", subject: "Candidate feedback needed", date: "Feb 23", body: "Please submit your interview feedback for the Systems Engineer II candidate by EOD." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Board meeting minutes — confidential", date: "Feb 22", body: "Attached for your records. Please do not forward outside leadership." },
    { from: "support@officesupplyco.com", subject: "Your order has shipped", date: "Feb 21", body: "Your recent order of office supplies is on its way." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Load model results — draft", date: "Feb 20", body: "First pass at the new grid load model. Numbers look promising." },
    { from: "compliance@meridiandynamicsgroup.internal", subject: "Annual training reminder", date: "Feb 19", body: "This is a reminder that annual compliance training is due by end of month." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Password expiration notice", date: "Feb 18", body: "Your internal system password will expire in 14 days." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "RE: RE: Quarterly Grid Report", date: "Feb 17", body: "See attached figures, updated with the Q3 corrections." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Building access badge renewal", date: "Feb 16", body: "Badges are due for renewal this quarter. Please visit the front desk." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Press inquiry — declined", date: "Feb 15", body: "Standard decline sent per policy. No further action needed." },
    { from: "no-reply@linkedin.com", subject: "You have 3 new connection requests", date: "Feb 14", body: "See who wants to connect with you on LinkedIn." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Internal restructuring — division leads", date: "Feb 13", body: "Please see the attached updated org chart following recent changes." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Infrastructure inherited from prior division", date: "Feb 12", body: "Still cataloguing what was left behind. Slow going." },
    { from: "vendor@sensorparts-supply.com", subject: "Quote request follow-up", date: "Feb 11", body: "Following up on the quote request submitted last week." },
    { from: "hr@meridiandynamicsgroup.internal", subject: "Reminder: benefits enrollment closes soon", date: "Feb 10", body: "Open enrollment closes at the end of this month." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Question about legacy documentation", date: "Feb 9", body: "Some of the older research files reference systems I can't find records for. Any idea who to ask?" },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "Signal timing pilot — results", date: "Feb 8", body: "Early results from the transit pilot are promising. Full report attached." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Unusual login attempt detected", date: "Feb 7", body: "We detected a login attempt from an unrecognized device. If this was you, no action is needed." },
    { from: "newsletter@infrastructuretoday.com", subject: "This month in infrastructure engineering", date: "Feb 6", body: "Top stories in grid modernization and adaptive systems." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Elena's old office — boxes still not picked up", date: "Feb 5", body: "Following up again. Facilities needs this cleared before the space is reassigned." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Communications guidance — research division", date: "Feb 4", body: "Reminder: all external questions regarding the former research division go through Sarah, no exceptions." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Draft statement for review", date: "Feb 3", body: "Attached is the draft holding statement. Please review before it goes out." },
    { from: "billing@officesupplyco.com", subject: "Receipt for your recent order", date: "Feb 2", body: "Thank you for your order. Your receipt is attached." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Old voicemail system — decommission status", date: "Feb 1", body: "The legacy voicemail system is being phased out. A few messages were auto-archived before shutdown; forwarding what didn't get cleanly deleted." },
    { from: "recruiting@meridiandynamicsgroup.internal", subject: "Offer accepted — new start date", date: "Jan 31", body: "Pleased to confirm the candidate has accepted. Start date attached." },
    { from: "no-reply@transitauth-metro.gov", subject: "Contract renewal — signature required", date: "Jan 30", body: "Please sign and return the attached renewal document by Friday." },
    { from: "compliance@meridiandynamicsgroup.internal", subject: "NDA acknowledgment reminder", date: "Jan 29", body: "This is a reminder to complete your annual NDA acknowledgment." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Neuromorphic prototype — test results", date: "Jan 28", body: "Latency numbers are down another 12% from last quarter's baseline." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "Weekly ops summary", date: "Jan 27", body: "All active deployments nominal this week. No incidents to report." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Storage cleanup — old attachments", date: "Jan 26", body: "Please clear attachments older than 2 years to free up shared storage." },
];

/* the ONE real email, inserted at a fixed but unremarkable position */
const specialEmail = {
    from: "archive@meridiandynamicsgroup.internal",
    subject: "Auto-Archived Voicemail — EXT 4471",
    date: "Jan 25",
    special: true,
    body: "__AUDIO__",
};
emails.splice(17, 0, specialEmail);

function renderList(elenaDeliveredAt) {
    listEl.innerHTML = "";

    const allEmails = [...emails];
    if (elenaDeliveredAt) {
        const ts = formatRealTimestamp(elenaDeliveredAt);
        allEmails.unshift(
            { from: "e.voss@meridiandynamicsgroup.internal", subject: "(no subject)", date: ts, elena: true, body: ELENA_DRAFT_3 },
            { from: "e.voss@meridiandynamicsgroup.internal", subject: "Draft — do not send", date: ts, elena: true, body: ELENA_DRAFT_2 },
            { from: "e.voss@meridiandynamicsgroup.internal", subject: "Draft — unfinished", date: ts, elena: true, body: ELENA_DRAFT_1 }
        );
    }

    mailCount.textContent = `${allEmails.length} messages`;
    allEmails.forEach((mail, idx) => {
        const row = document.createElement("div");
        row.className = "mail-row" + (mail.special || mail.elena ? " special" : "");
        row.innerHTML = `
            <div class="from">${mail.from}</div>
            <div class="subject">${mail.subject}</div>
            <div class="date">${mail.date}</div>
        `;
        row.addEventListener("click", () => openMail(mail));
        listEl.appendChild(row);
    });
}

function openMail(mail) {
    listEl.parentElement.querySelectorAll("#mailList").forEach(() => {});
    document.getElementById("mailList").style.display = "none";
    readerEl.style.display = "block";
    readerSubject.textContent = mail.subject;
    readerMeta.textContent = `From: ${mail.from}  ·  ${mail.date}`;

    if (mail.body === "__AUDIO__") {
        readerBody.innerHTML = `
            <p>This message was automatically recovered from a decommissioned internal voicemail system prior to full deletion. No transcript is available.</p>
            <canvas id="wave"></canvas>
            <audio id="audioEl" controls src="voicemail.mp3"></audio>
        `;
        setupWaveform();
    } else if (mail.elena) {
        readerBody.innerHTML = mail.body
            .split("\n\n")
            .map(para => `<p style="margin-bottom:14px; line-height:1.6;">${para.replace(/\n/g, "<br>")}</p>`)
            .join("");
    } else {
        readerBody.innerHTML = `<p>${mail.body}</p>`;
    }
}

backBtn.addEventListener("click", () => {
    readerEl.style.display = "none";
    document.getElementById("mailList").style.display = "block";
});

function setupWaveform() {
    const canvas = document.getElementById("wave");
    const audioEl = document.getElementById("audioEl");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let audioCtx, analyser, dataArray, source;

    function setup() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audioEl);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }

    audioEl.addEventListener("play", () => {
        setup();
        if (audioCtx.state === "suspended") audioCtx.resume();
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff9f4a";
        if (analyser && !audioEl.paused) {
            analyser.getByteFrequencyData(dataArray);
            const bw = canvas.width / dataArray.length;
            for (let i = 0; i < dataArray.length; i++) {
                const h = (dataArray[i] / 255) * canvas.height * 0.9;
                ctx.fillRect(i * bw + 1, (canvas.height - h) / 2, bw - 2, Math.max(h, 2));
            }
            requestAnimationFrame(draw);
        }
    }
}

});
