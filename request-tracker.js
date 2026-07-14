document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("app");
const ticketList = document.getElementById("ticketList");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerMeta = document.getElementById("readerMeta");
const readerRequest = document.getElementById("readerRequest");
const readerResponse = document.getElementById("readerResponse");
const backBtn = document.getElementById("backBtn");

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

function updateVisibility() {
    playerRef.child("personalChapter").once("value", snap => {
        const myChapter = snap.val() || 1;
        if (myChapter >= 4) {
            lockedEl.style.display = "none";
            appEl.style.display = "block";
        } else {
            lockedEl.style.display = "block";
            appEl.style.display = "none";
        }
    });
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

const tickets = [
  { id:"REQ-2214", date:"Year 9, Q1", filedBy:"P. Sharma", subj:"Access to legacy documentation — adaptive-load systems", status:"denied",
    request:"I've been assigned several inherited modules with no accompanying documentation. Requesting read access to pre-Year-9 research archive so I can understand the systems I'm now responsible for maintaining.",
    response:"Access restricted per legal hold, Project MERIDIAN-0 archive. Request denied. Standard onboarding documentation should be sufficient for current responsibilities." },
  { id:"REQ-2231", date:"Year 9, Q2", filedBy:"P. Sharma", subj:"Follow-up — orphaned references in codebase", status:"denied",
    request:"Following up on REQ-2214. I've found multiple code references to a framework called 'adaptive framework v0' that doesn't exist in any current documentation. I need historical context to safely modify the systems that depend on it.",
    response:"Request denied. Please route technical questions regarding legacy code to your direct manager." },
  { id:"REQ-2255", date:"Year 9, Q3", filedBy:"P. Sharma", subj:"Third request — direct escalation", status:"denied",
    request:"This is my third request on this matter. I'd like to know specifically who has authority to grant this access, and what the actual justification for the restriction is, beyond 'legal hold.'",
    response:"Escalation noted. Access remains restricted. Direct further inquiries to Legal." },
  { id:"REQ-2289", date:"Year 9, Q4", filedBy:"P. Sharma", subj:"Formal complaint — operational impact", status:"denied",
    request:"I am being asked to build on top of systems I am not permitted to understand. This is operationally absurd and, frankly, a safety concern. I am filing this as a formal complaint, not just a request.",
    response:"Request denied. Concern logged for internal review. No further action required at this time." },
  { id:"REQ-2340", date:"Present", filedBy:"P. Sharma", subj:"Fifth request — observed anomalous behavior", status:"denied",
    request:"I've observed behavior in a production system that I believe originates from the restricted archive — specifically, response patterns that don't match any documented logic I have access to. I need historical context to determine if this is a risk.",
    response:"Request denied. If you believe there is an active safety or security risk, please file an incident report through the standard channel instead." },
  { id:"REQ-2367", date:"Present", filedBy:"P. Sharma", subj:"Sixth request", status:"denied",
    request:"For the record. Sixth request. Same answer expected.",
    response:"Confirmed. Request denied." },
  { id:"REQ-2381", date:"Present", filedBy:"P. Sharma", subj:"Seventh request", status:"denied",
    request:"\"Access restricted per legal hold.\" I've read that sentence seven times now. Who exactly makes this decision, and have they ever actually looked at what's being protected — or is it just easier not to?",
    response:"Request denied. No further correspondence required on this matter." },
];

const specialTicket = {
  id:"REQ-2209", date:"Year 9, Q1", filedBy:"E. Voss", subj:"Partial transfer — see attached", status:"approved",
  request:"Filed on behalf of incoming research staff, prior to standard onboarding access review.",
  response:"I don't have clearance to give her everything, and I won't have this access much longer anyway. But she asked the right question on her first week here, before anyone told her not to. That's rarer than people think.\n\nAttached: partial documentation, redacted where I have to be. It's not enough. It's what I could do before the door closed.\n\n— E.V."
};

/* insert the hidden ticket at a position BEFORE her first
   official request, numerically -- it predates them all */
const allTickets = [specialTicket, ...tickets];

function renderList() {
    ticketList.innerHTML = "";
    allTickets.forEach(t => {
        const row = document.createElement("div");
        row.className = "ticketRow";
        row.innerHTML = `
            <div class="left">
                <div class="id">${t.id} — ${t.date}</div>
                <div class="subj">${t.subj}</div>
                <div class="filedby">Filed by: ${t.filedBy}</div>
            </div>
            <div class="status ${t.status}">${t.status.toUpperCase()}</div>
        `;
        row.addEventListener("click", () => openTicket(t));
        ticketList.appendChild(row);
    });
}

function openTicket(t) {
    ticketList.parentElement.querySelector("#ticketList").style.display = "none";
    reader.style.display = "block";
    readerTitle.textContent = t.subj;
    readerMeta.textContent = `${t.id} — ${t.date} — Filed by ${t.filedBy} — ${t.status.toUpperCase()}`;
    readerRequest.textContent = t.request;
    readerResponse.innerHTML = t.response.split("\n\n").map(p => `<p>${p}</p>`).join("");

    if (t.id === "REQ-2209") {
        if (typeof db !== "undefined") {
            db.ref("world/priyaFragmentFoundBy").set(playerId);
            db.ref("world/priyaFragmentFoundAt").set(firebase.database.ServerValue.TIMESTAMP);
        }
        const note = document.createElement("p");
        note.style.marginTop = "16px";
        note.style.paddingTop = "12px";
        note.style.borderTop = "1px dashed #e2e6ef";
        note.style.fontSize = "11px";
        note.style.opacity = "0.6";
        note.textContent = "(something about this just changed elsewhere. check the Personnel directory.)";
        readerResponse.appendChild(note);
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    document.getElementById("ticketList").style.display = "block";
});

renderList();

});
