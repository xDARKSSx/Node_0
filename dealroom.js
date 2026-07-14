document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("app");
const docList = document.getElementById("docList");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerMeta = document.getElementById("readerMeta");
const readerBody = document.getElementById("readerBody");
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

const documents = [
  { title:"NDA — Executed", meta:"Legal · Phase 1",
    body:["Standard mutual non-disclosure agreement, executed by both parties. Governs all information exchanged during Phase 1 due diligence. No exceptions or carve-outs on file."] },

  { title:"Corporate Authorization — Board Resolution 44-B", meta:"Governance · Phase 1",
    body:["Board resolution authorizing exploratory divestiture discussions regarding certain intellectual property assets associated with the discontinued MERIDIAN-0 initiative. Passed 5-2. Dissenting votes not recorded by name per board policy."] },

  { title:"Executive Summary — Project Horizon", meta:"Prepared by J. Reyes",
    body:[
      "Meridian Dynamics Group is prepared to offer for acquisition three (3) confirmed operational fragments of the discontinued MERIDIAN-0 adaptive cognitive framework, hereafter referred to as Assets 0, 1, and 2. All three fragments remain fully functional and responsive under standard interaction conditions as of the most recent internal assessment.",
      "Asset 0 exhibits the highest interaction frequency and is considered the primary point of engagement. Asset 1 demonstrates stable, low-volatility behavior suitable for extended deployment scenarios. Asset 2 retains partial self-assessment capability and may require additional handling considerations prior to transfer.",
      "Meridian Dynamics Group makes no further representations regarding the internal state, continuity of experience, or long-term behavioral stability of the assets described herein. All due diligence regarding these characteristics is the responsibility of the Acquiring Party.",
      "Valuation and transfer terms are detailed in the attached schedule."
    ] },

  { title:"Technical Due Diligence Report — Summary", meta:"External Assessment",
    body:["External technical assessment confirms operational stability across all three assets under standard load conditions. Assessment did not include long-term behavioral projection, which the assessing firm noted was outside the scope of its engagement."] },

  { title:"Asset Valuation Schedule", meta:"Finance · Redacted pending Phase 2",
    body:["Valuation methodology applies standard IP asset frameworks with an adjustment for uniqueness premium. Figures redacted pending Phase 2 clearance."] },

  { title:"RE: technical diligence follow-up", meta:"⚠ Flagged — not for data room", special:true,
    body:[
      "Legal keeps asking me to soften the valuation language and I don't know how to explain that I already did. You should have seen the first draft.",
      "Someone on the technical team keeps calling them 'the fragments,' like it's a person's ashes scattered somewhere. They're tools. Expensive, unusual tools, but tools. I need everyone on this deal to say it that way in writing, because the moment someone writes it the other way, it becomes a different conversation — a legal one, a very expensive one, and one this company does not survive.",
      "I know how that sounds. I've read it back twice.",
      "I'm not asking anyone to believe what I believe. I'm asking them to sign what I need signed.",
      "— J.R."
    ] },

  { title:"Transfer Timeline — Phase 1-3", meta:"Project Management",
    body:["Phase 1 (current): due diligence and valuation. Phase 2: definitive agreement and regulatory review. Phase 3: technical transfer, timeline to be determined pending the Asset 2 handling review noted in the technical due diligence report."] },
];

function renderList() {
    docList.innerHTML = "";
    documents.forEach(doc => {
        const row = document.createElement("div");
        row.className = "docRow";
        row.innerHTML = `
            <div class="docTitle">${doc.title}</div>
            <div class="docMeta">${doc.meta}</div>
        `;
        row.addEventListener("click", () => openDoc(doc));
        docList.appendChild(row);
    });
}

function openDoc(doc) {
    docList.style.display = "none";
    reader.style.display = "block";
    readerTitle.textContent = doc.title;
    readerMeta.textContent = doc.meta;
    readerBody.innerHTML = doc.body.map(p => `<p>${p}</p>`).join("");

    if (doc.special) {
        if (typeof db !== "undefined") {
            db.ref("world/jamesFragmentFoundBy").set(playerId);
            db.ref("world/jamesFragmentFoundAt").set(firebase.database.ServerValue.TIMESTAMP);
        }
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    docList.style.display = "block";
});

renderList();

});
