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
    playerRef.child("personalChapter").once("value", snap => {
        const myChapter = snap.val() || 1;
        if (myChapter >= 4) {
            lockedEl.style.display = "none";
            appEl.style.display = "block";
            handleVisitAndRender();
        } else {
            lockedEl.style.display = "block";
            appEl.style.display = "none";
        }
    });
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
    { from: "billing@gridsensors-co.com", subject: "Invoice #88213 — 30 days overdue", date: "Mar 2", body: "This is a follow-up regarding invoice #88213, originally issued January 30th for the Q4 sensor calibration service. Our records show this remains unpaid as of today, now 30 days past terms.\n\nPlease remit payment at your earliest convenience, or contact our billing department if there's a discrepancy on our end. A late fee of 1.5% will apply after 45 days per our standard service agreement." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Parking garage maintenance notice", date: "Mar 2", body: "Level 2 of the parking structure will be closed for resurfacing this weekend, Saturday through Sunday. Please use Level 1 or the overflow lot on the east side of the building.\n\nBadge access will still work at the east entrance during the closure. Contact facilities if you have a reserved spot on Level 2 and need alternate arrangements." },
    { from: "hr@meridiandynamicsgroup.internal", subject: "New hire onboarding checklist", date: "Feb 28", body: "Attached is the standard onboarding checklist for new engineering hires starting next month. Please review and confirm your team's IT equipment requests have been submitted by Friday.\n\nAs a reminder, all new hires require a completed background check and signed NDA before their first day of badge access. Reach out to HR directly with any questions about the process." },
    { from: "newsletter@systemsengineeringweekly.com", subject: "Your weekly digest is here", date: "Feb 28", body: "This week in Systems Engineering Weekly: adaptive load balancing trends across three continents, a deep dive into grid resilience case studies from the Nordic region, and an interview with a panel of infrastructure engineers on the future of self-correcting networks. Read the full digest on our site, or unsubscribe using the link below." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "RE: Can you review this proposal by Friday?", date: "Feb 27", body: "Attached the revised draft. Let me know if section 4 needs more detail — I wasn't sure how deep the client wants us to go on the load projection methodology.\n\nAlso flagging that the timeline in section 6 might be optimistic given the current staffing situation. Worth a quick call before we send this out?" },
    { from: "it@meridiandynamicsgroup.internal", subject: "Scheduled maintenance this weekend", date: "Feb 27", body: "Internal systems will be unavailable Saturday 1-4 AM for routine maintenance, including email, the internal file share, and the VPN. No action is required on your part.\n\nIf you experience continued issues after 4 AM Saturday, please submit a ticket through the usual channel and someone from IT will follow up Monday morning." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Fwd: Fwd: Team lunch this Friday?", date: "Feb 26", body: "Still trying to find a place that isn't the sandwich place again. Marcus suggested the Thai place on 5th but I think it's closed for renovations. Open to suggestions — reply-all if you have a preference, otherwise I'll just pick something by Thursday." },
    { from: "vendor@gridsensors-co.com", subject: "RE: Vendor Contract Renewal", date: "Feb 25", body: "Our team has prepared the renewal terms for your review, attached as a PDF. Pricing is unchanged from last year with the exception of the calibration service tier, which increased 4% due to material costs.\n\nWe'd appreciate a response by end of month if possible, as our current agreement lapses March 31st. Happy to jump on a call if you'd like to discuss any of the terms." },
    { from: "no-reply@transitauth-metro.gov", subject: "Quarterly performance report attached", date: "Feb 24", body: "Please find attached the Q1 performance summary for the signal optimization contract. Overall commute delay reduction held steady at 18% compared to baseline, consistent with the previous quarter.\n\nOne intersection (5th & Main) showed anomalous readings during the second week of the reporting period; our team flagged it for review but it self-corrected without intervention. Full technical appendix attached for your engineering team." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Server room access logs — Q1", date: "Feb 24", body: "Compiled access logs as requested. Nothing unusual to report for the quarter overall — badge activity matches expected patterns for the maintenance and ops teams.\n\nOne thing worth noting: there are a handful of after-hours entries under a badge that should have been deactivated back in Year 9. I've flagged it to facilities but wanted you aware in case it comes up." },
    { from: "recruiting@meridiandynamicsgroup.internal", subject: "Candidate feedback needed", date: "Feb 23", body: "Please submit your interview feedback for the Systems Engineer II candidate by end of day. We're trying to get an offer out before they accept elsewhere — I know timing has been tight this week.\n\nThe feedback form is the same one as always, should take five minutes. Thanks for making time given everything else going on." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Board meeting minutes — confidential", date: "Feb 22", body: "Attached for your records. Please do not forward outside leadership.\n\nAs discussed, item 4 on the agenda regarding the research division's remaining assets has been tabled until next quarter pending further review. No further action needed from your team at this time." },
    { from: "support@officesupplyco.com", subject: "Your order has shipped", date: "Feb 21", body: "Your recent order of office supplies (order #4471-B) is on its way and should arrive within 3-5 business days. You can track the shipment using the link below.\n\nThank you for your continued business. If any items arrive damaged, our returns process is outlined on our website." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Load model results — draft", date: "Feb 20", body: "First pass at the new grid load model. Numbers look promising — we're seeing a 6% improvement in peak prediction accuracy over the previous version, though the sample size is still small.\n\nI want to run it against another two weeks of live data before we present anything to the client. Will have a fuller writeup by end of next week." },
    { from: "compliance@meridiandynamicsgroup.internal", subject: "Annual training reminder", date: "Feb 19", body: "This is a reminder that annual compliance training is due by end of month. The training covers data handling policy, workplace conduct, and this year includes a new module on third-party vendor security.\n\nIt takes approximately 45 minutes to complete. Please reach out to compliance if you're unable to finish before the deadline due to scheduling conflicts." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Password expiration notice", date: "Feb 18", body: "Your internal system password will expire in 14 days. Please update it through the usual portal before the deadline to avoid being locked out.\n\nAs a reminder, passwords must be at least 12 characters and cannot match any of your last 5 passwords. Contact IT support if you run into issues during the reset process." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "RE: RE: Quarterly Grid Report", date: "Feb 17", body: "See attached figures, updated with the Q3 corrections you flagged last week. I think this version resolves the discrepancy in the peak-load column — turned out to be a unit conversion error on our end, not a data issue.\n\nLet me know if this looks right before it goes to the client." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Building access badge renewal", date: "Feb 16", body: "Badges are due for renewal this quarter. Please visit the front desk with photo ID any time this week to have your badge reissued.\n\nThe process takes about five minutes. Badges not renewed by the end of the month will be deactivated automatically per security policy." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Press inquiry — declined", date: "Feb 15", body: "Standard decline sent per policy. No further action needed on your end.\n\nFor what it's worth, this is the third inquiry this quarter referencing the old research division by name. I don't think it's anything, but wanted to keep a paper trail in case it becomes a pattern." },
    { from: "no-reply@linkedin.com", subject: "You have 3 new connection requests", date: "Feb 14", body: "You have 3 new connection requests waiting for your response. See who wants to connect with you on LinkedIn and grow your professional network.\n\nTo manage your notification preferences, visit your account settings." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Internal restructuring — division leads", date: "Feb 13", body: "Please see the attached updated org chart following recent changes. David will now report directly to me rather than through the former research division structure, effective immediately.\n\nThis shouldn't affect day-to-day operations for most teams, but flag any questions to your direct manager." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Infrastructure inherited from prior division", date: "Feb 12", body: "Still cataloguing what was left behind. Slow going — a lot of the older systems don't have documentation, and some of the naming conventions don't match anything in our current inventory.\n\nI'll have a fuller report by end of month, but wanted to flag early that a few server allocations don't currently trace back to any active project. Might just be legacy cruft, might be worth a closer look." },
    { from: "vendor@sensorparts-supply.com", subject: "Quote request follow-up", date: "Feb 11", body: "Following up on the quote request submitted last week for the replacement sensor units. Attached is our formal quote, valid for 30 days.\n\nHappy to discuss bulk pricing if you're considering an order beyond the initial 12 units mentioned in your request." },
    { from: "hr@meridiandynamicsgroup.internal", subject: "Reminder: benefits enrollment closes soon", date: "Feb 10", body: "Open enrollment closes at the end of this month. If you haven't reviewed your benefits selections yet, now is the time — changes cannot be made outside this window except for qualifying life events.\n\nThe benefits portal link and a summary of this year's plan changes are attached." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Question about legacy documentation", date: "Feb 9", body: "Some of the older research files reference systems I can't find records for — specifically a few file paths that mention something called 'adaptive framework v0' that doesn't match anything in our current architecture docs.\n\nAny idea who I should ask? David wasn't sure either. Not urgent, just trying to close a gap in my understanding of the legacy codebase before I keep building on top of it." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "Signal timing pilot — results", date: "Feb 8", body: "Early results from the transit pilot are promising. Full report attached, but the short version: average delay reduction of 14% in the first two weeks, slightly ahead of our projections.\n\nThe transit authority wants a call next week to discuss expanding to two more intersections. Let me know your availability." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Unusual login attempt detected", date: "Feb 7", body: "We detected a login attempt from an unrecognized device on your account. If this was you, no action is needed.\n\nIf you don't recognize this activity, please reset your password immediately and contact IT security. The attempt originated from outside our usual geographic range and was automatically blocked." },
    { from: "newsletter@infrastructuretoday.com", subject: "This month in infrastructure engineering", date: "Feb 6", body: "Top stories in grid modernization and adaptive systems this month: three utilities announce joint AI-assisted maintenance pilots, a look at aging infrastructure investment across the sector, and our annual roundup of firms to watch. Full issue available on our website." },
    { from: "facilities@meridiandynamicsgroup.internal", subject: "Elena's old office — boxes still not picked up", date: "Feb 5", body: "Following up again on the boxes still sitting in the office previously assigned to Dr. Voss. Facilities needs this space cleared before it's reassigned to the new hire starting next month.\n\nPer the last email, HR indicated no one has claimed the personal items. We'll move them to storage by end of week if no one responds." },
    { from: "j.reyes@meridiandynamicsgroup.internal", subject: "Communications guidance — research division", date: "Feb 4", body: "Reminder: all external questions regarding the former research division go through Sarah, no exceptions. This includes casual inquiries from former colleagues, journalists, or anyone claiming to represent a research institution.\n\nI know this has come up a few times recently. Appreciate everyone's discretion while we finalize how we're handling this going forward." },
    { from: "s.park@meridiandynamicsgroup.internal", subject: "Draft statement for review", date: "Feb 3", body: "Attached is the draft holding statement in case press interest continues. Kept it short and non-committal per our usual approach — doesn't confirm or deny anything specific about the division's closure.\n\nPlease review before it goes live on the press page. Legal has already signed off, just need your final read." },
    { from: "billing@officesupplyco.com", subject: "Receipt for your recent order", date: "Feb 2", body: "Thank you for your order. Your receipt is attached for your records. Total charged: $214.87, billed to the account on file.\n\nIf you have any questions about this charge, contact our billing team using the information below." },
    { from: "d.okafor@meridiandynamicsgroup.internal", subject: "Old voicemail system — decommission status", date: "Feb 1", body: "The legacy voicemail system is being phased out as part of the infrastructure cleanup. A few messages were auto-archived before shutdown rather than deleted outright — the migration script apparently missed some entries in the queue.\n\nForwarding what didn't get cleanly deleted to internal mail for the record, per standard retention policy. Let me know if you want the raw archive files instead of just the auto-generated summaries." },
    { from: "recruiting@meridiandynamicsgroup.internal", subject: "Offer accepted — new start date", date: "Jan 31", body: "Pleased to confirm the candidate has accepted the offer for the Systems Engineer II role. Start date is set for the 15th of next month, pending final background check clearance.\n\nIT equipment request has been submitted. Please loop in the team for a proper onboarding schedule before their first day." },
    { from: "no-reply@transitauth-metro.gov", subject: "Contract renewal — signature required", date: "Jan 30", body: "Please sign and return the attached renewal document by Friday to avoid any lapse in the current service agreement. All terms remain unchanged from the previous cycle.\n\nContact our office if you have questions about the renewal process or need an extension on the signature deadline." },
    { from: "compliance@meridiandynamicsgroup.internal", subject: "NDA acknowledgment reminder", date: "Jan 29", body: "This is a reminder to complete your annual NDA acknowledgment through the compliance portal. This applies to all active employees regardless of role or tenure.\n\nThe acknowledgment takes less than five minutes. Deadline is end of month; overdue acknowledgments are flagged automatically to your manager." },
    { from: "p.sharma@meridiandynamicsgroup.internal", subject: "Neuromorphic prototype — test results", date: "Jan 28", body: "Latency numbers are down another 12% from last quarter's baseline on the neuromorphic prototype. The new circuit layout seems to be paying off, though we're still seeing some thermal throttling under sustained load.\n\nFull test data attached. Want to sync early next week before we decide whether to move to the next fabrication round." },
    { from: "m.kim@meridiandynamicsgroup.internal", subject: "Weekly ops summary", date: "Jan 27", body: "All active deployments nominal this week. No incidents to report across the grid balancing or transit signal contracts.\n\nOne minor note: the sensor network on the north loop had a brief connectivity gap Tuesday afternoon, resolved automatically within four minutes. Logged for the record but no action required." },
    { from: "it@meridiandynamicsgroup.internal", subject: "Storage cleanup — old attachments", date: "Jan 26", body: "Please clear attachments older than 2 years from your inbox to free up shared storage. We're approaching capacity on the mail server again.\n\nIf you need to retain older files for compliance reasons, move them to the archive drive instead of deleting — instructions attached." },
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
        readerBody.innerHTML = mail.body
            .split("\n\n")
            .map(para => `<p style="margin-bottom:12px;">${para}</p>`)
            .join("");
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
