document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("app");
const tableEl = document.getElementById("expenseTable");
const expenseBody = document.getElementById("expenseBody");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerMeta = document.getElementById("readerMeta");
const readerBody = document.getElementById("readerBody");
const backBtn = document.getElementById("backBtn");
const yearButtons = document.querySelectorAll("nav.years button");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        appEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        appEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}

const expenses = {
7: [
  { date:"Jan 14", cat:"Software", desc:"Annual license renewal — project mgmt suite", amt:"$3,200", by:"M. Kim",
    note:"Renewal processed on schedule. No change in seat count from previous year. Approved under standing IT budget line, no additional sign-off required." },
  { date:"Feb 02", cat:"Travel", desc:"Site visit — regional grid partner", amt:"$890", by:"M. Kim",
    note:"Two-day trip to review load-balancing deployment progress with partner engineering team. Mileage and one overnight stay included. No incidents to report." },
  { date:"Feb 19", cat:"Office", desc:"Replacement monitors, ops floor", amt:"$1,140", by:"M. Kim",
    note:"Six units replaced following flickering complaints logged with facilities. Old units disposed of per e-waste policy." },
  { date:"Mar 08", cat:"Contractor", desc:"Temp staffing, Q1 surge", amt:"$6,750", by:"M. Kim",
    note:"Three-week staffing bridge to cover ops floor during onboarding of two permanent hires. Rate matches standard agency contract terms." },
  { date:"Apr 22", cat:"Travel", desc:"Conference — infrastructure engineering summit", amt:"$2,100", by:"M. Kim",
    note:"Attendance approved for continuing education credit. Summary notes on adaptive load-balancing sessions filed separately with engineering." },
  { date:"May 30", cat:"Client Entertainment", desc:"Dinner — transit authority renewal discussion", amt:"$310", by:"M. Kim",
    note:"Standard relationship maintenance dinner ahead of Q3 contract renewal cycle. Two attendees from partner side, one from ours." },
  { date:"Jun 11", cat:"Office", desc:"Ops floor furniture replacement", amt:"$2,400", by:"M. Kim",
    note:"Replacement of chairs flagged in annual ergonomic review. Vendor selected per existing facilities contract." },
  { date:"Jul 25", cat:"Software", desc:"Compliance tracking tool, annual fee", amt:"$1,800", by:"M. Kim",
    note:"Renewal of existing compliance dashboard subscription. No functional changes from prior contract year." },
  { date:"Sep 09", cat:"Travel", desc:"Site audit — northern sensor network", amt:"$650", by:"M. Kim",
    note:"Routine annual audit visit, no findings requiring escalation. Report filed with engineering." },
  { date:"Nov 03", cat:"Contractor", desc:"Year-end infrastructure review, external firm", amt:"$8,900", by:"M. Kim",
    note:"Standard annual third-party review, consistent with prior years. Summary findings presented at year-end ops meeting." },
],
8: [
  { date:"Jan 20", cat:"Software", desc:"License renewal — project mgmt suite", amt:"$3,350", by:"M. Kim",
    note:"Routine renewal, minor rate increase from vendor. Approved under standing budget line." },
  { date:"Feb 14", cat:"Travel", desc:"Regional partner site visit", amt:"$720", by:"M. Kim",
    note:"Follow-up visit on prior year's deployment. No issues identified during review." },
  { date:"Mar 05", cat:"Client Entertainment", desc:"Lunch — vendor contract negotiation", amt:"$185", by:"M. Kim",
    note:"Working lunch during annual sensor vendor contract renegotiation. Terms finalized separately." },
  { date:"Apr 17", cat:"Contractor", desc:"Spring staffing surge, ops floor", amt:"$7,100", by:"M. Kim",
    note:"Seasonal staffing bridge, consistent with prior spring cycles. Standard agency rate." },
  { date:"May 02", cat:"Office", desc:"Standing desks, ops floor", amt:"$1,950", by:"M. Kim",
    note:"Requested by ops staff following ergonomic review recommendations. Installed without incident." },
  { date:"Jun 28", cat:"Travel", desc:"Conference — adaptive systems summit", amt:"$2,300", by:"M. Kim",
    note:"Attendance for continuing education. Notes on session content filed with engineering leadership." },
  { date:"Aug 11", cat:"Software", desc:"Analytics dashboard, annual license", amt:"$2,600", by:"M. Kim",
    note:"Upgrade from prior reporting tool. Migration completed without data loss." },
  { date:"Sep 19", cat:"Client Entertainment", desc:"Dinner — municipal contract renewal", amt:"$275", by:"M. Kim",
    note:"Standard renewal-cycle dinner with municipal transit contact. Contract renewed on standard terms shortly after." },
  { date:"Oct 30", cat:"Contractor", desc:"Q4 external audit support", amt:"$5,400", by:"M. Kim",
    note:"Support hours for year-end compliance audit. No findings requiring further action." },
  { date:"Dec 12", cat:"Office", desc:"Year-end supply restock", amt:"$980", by:"M. Kim",
    note:"Routine annual restock ahead of Q1. No deviation from prior years' spend." },
],
9: [
  { date:"Jan 08", cat:"Software", desc:"License renewal — project mgmt suite", amt:"$3,400", by:"M. Kim",
    note:"Routine renewal. No changes from prior contract terms." },
  { date:"Jan 22", cat:"Contractor", desc:"Cost review support, external consultant", amt:"$9,200", by:"M. Kim",
    note:"Engaged ahead of Q1 budget review cycle to support cost-savings analysis across active contracts, including the research division line items under review that quarter." },
  { date:"Feb 03", cat:"Client Entertainment", desc:"Riverside Boat Club — dinner", amt:"$4,700", by:"M. Kim",
    note:"" },
  { date:"Feb 27", cat:"Travel", desc:"Regional partner site visit", amt:"$600", by:"M. Kim",
    note:"Routine visit, no findings requiring escalation." },
  { date:"Mar 14", cat:"Office", desc:"Ops floor supply restock", amt:"$740", by:"M. Kim",
    note:"Standard quarterly restock." },
  { date:"Apr 09", cat:"Contractor", desc:"Post-restructuring transition support", amt:"$6,100", by:"M. Kim",
    note:"Support hours for reallocating responsibilities following the research division's closure. Primarily administrative and inventory work." },
  { date:"May 21", cat:"Software", desc:"Reduced-tier analytics license", amt:"$1,200", by:"M. Kim",
    note:"Downgraded from previous license tier as part of broader post-restructuring cost reduction." },
  { date:"Jul 15", cat:"Travel", desc:"Regional infrastructure conference", amt:"$1,850", by:"M. Kim",
    note:"Standard attendance for continuing education. No changes from prior years." },
  { date:"Sep 02", cat:"Office", desc:"Ops floor reorganization, furniture", amt:"$1,600", by:"M. Kim",
    note:"Reconfiguration following headcount changes earlier in the year." },
  { date:"Nov 18", cat:"Contractor", desc:"Year-end compliance review", amt:"$4,900", by:"M. Kim",
    note:"Standard annual review. No findings requiring escalation." },
],
};

const SPECIAL_YEAR = "9";
const SPECIAL_DATE = "Feb 03";

const specialBody = [
  "Filed under client entertainment because there's no line item for what this actually was.",
  "I sat across from someone on the review committee, and by the end of that dinner I'd told them everything they needed to make the recommendation the easy choice. I'm not going to pretend the timing wasn't good for me personally — the marker at the boat club was already six weeks overdue by then, and \"found $2.3M in unnecessary research spend\" looks very different on a résumé than \"requested a salary advance.\"",
  "I don't know if it was thinking, the way people keep asking now. I know it was expensive, and expensive things get cut, and I was the one who put the number in front of the room that made it look small enough that nobody asked harder questions about what it actually was.",
  "My kid doesn't know any of this. She thinks Dad's job is \"spreadsheets.\" Some days I think that's the most honest job title anyone in this building actually has.",
  "— M.K.",
];

let currentYear = "7";

function renderYear(year) {
    expenseBody.innerHTML = "";
    expenses[year].forEach(exp => {
        const tr = document.createElement("tr");
        tr.className = "expenseRow";
        tr.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.cat}</td>
            <td>${exp.desc}</td>
            <td>${exp.amt}</td>
            <td>${exp.by}</td>
        `;
        tr.addEventListener("click", () => openExpense(year, exp));
        expenseBody.appendChild(tr);
    });
}

function showYear(year) {
    currentYear = year;
    renderYear(year);
    tableEl.style.display = "table";
    reader.style.display = "none";
    yearButtons.forEach(b => b.classList.toggle("active", b.dataset.year === year));
}

yearButtons.forEach(btn => {
    btn.addEventListener("click", () => showYear(btn.dataset.year));
});

function openExpense(year, exp) {
    tableEl.style.display = "none";
    reader.style.display = "block";
    readerTitle.textContent = exp.desc;
    readerMeta.textContent = `${exp.date}, Year ${year} — ${exp.cat} — ${exp.amt} — filed by ${exp.by}`;

    if (year === SPECIAL_YEAR && exp.date === SPECIAL_DATE) {
        readerBody.innerHTML = specialBody.map(p => `<p>${p}</p>`).join("");
        if (typeof db !== "undefined") {
            db.ref("world/marcusFragmentFoundBy").set(playerId);
            db.ref("world/marcusFragmentFoundAt").set(firebase.database.ServerValue.TIMESTAMP);
        }
    } else {
        readerBody.innerHTML = `<p><strong>Approval note:</strong> ${exp.note}</p>`;
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    tableEl.style.display = "table";
});

showYear("7");

});
