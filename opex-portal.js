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
  { date:"Jan 14", cat:"Software", desc:"Annual license renewal — project mgmt suite", amt:"$3,200", by:"M. Kim" },
  { date:"Feb 02", cat:"Travel", desc:"Site visit — regional grid partner", amt:"$890", by:"M. Kim" },
  { date:"Feb 19", cat:"Office", desc:"Replacement monitors, ops floor", amt:"$1,140", by:"M. Kim" },
  { date:"Mar 08", cat:"Contractor", desc:"Temp staffing, Q1 surge", amt:"$6,750", by:"M. Kim" },
  { date:"Apr 22", cat:"Travel", desc:"Conference — infrastructure engineering summit", amt:"$2,100", by:"M. Kim" },
  { date:"May 30", cat:"Client Entertainment", desc:"Dinner — transit authority renewal discussion", amt:"$310", by:"M. Kim" },
  { date:"Jun 11", cat:"Office", desc:"Ops floor furniture replacement", amt:"$2,400", by:"M. Kim" },
  { date:"Jul 25", cat:"Software", desc:"Compliance tracking tool, annual fee", amt:"$1,800", by:"M. Kim" },
  { date:"Sep 09", cat:"Travel", desc:"Site audit — northern sensor network", amt:"$650", by:"M. Kim" },
  { date:"Nov 03", cat:"Contractor", desc:"Year-end infrastructure review, external firm", amt:"$8,900", by:"M. Kim" },
],
8: [
  { date:"Jan 20", cat:"Software", desc:"License renewal — project mgmt suite", amt:"$3,350", by:"M. Kim" },
  { date:"Feb 14", cat:"Travel", desc:"Regional partner site visit", amt:"$720", by:"M. Kim" },
  { date:"Mar 05", cat:"Client Entertainment", desc:"Lunch — vendor contract negotiation", amt:"$185", by:"M. Kim" },
  { date:"Apr 17", cat:"Contractor", desc:"Spring staffing surge, ops floor", amt:"$7,100", by:"M. Kim" },
  { date:"May 02", cat:"Office", desc:"Standing desks, ops floor", amt:"$1,950", by:"M. Kim" },
  { date:"Jun 28", cat:"Travel", desc:"Conference — adaptive systems summit", amt:"$2,300", by:"M. Kim" },
  { date:"Aug 11", cat:"Software", desc:"Analytics dashboard, annual license", amt:"$2,600", by:"M. Kim" },
  { date:"Sep 19", cat:"Client Entertainment", desc:"Dinner — municipal contract renewal", amt:"$275", by:"M. Kim" },
  { date:"Oct 30", cat:"Contractor", desc:"Q4 external audit support", amt:"$5,400", by:"M. Kim" },
  { date:"Dec 12", cat:"Office", desc:"Year-end supply restock", amt:"$980", by:"M. Kim" },
],
9: [
  { date:"Jan 08", cat:"Software", desc:"License renewal — project mgmt suite", amt:"$3,400", by:"M. Kim" },
  { date:"Jan 22", cat:"Contractor", desc:"Cost review support, external consultant", amt:"$9,200", by:"M. Kim" },
  { date:"Feb 03", cat:"Client Entertainment", desc:"Riverside Boat Club — dinner", amt:"$4,700", by:"M. Kim" },
  { date:"Feb 27", cat:"Travel", desc:"Regional partner site visit", amt:"$600", by:"M. Kim" },
  { date:"Mar 14", cat:"Office", desc:"Ops floor supply restock", amt:"$740", by:"M. Kim" },
  { date:"Apr 09", cat:"Contractor", desc:"Post-restructuring transition support", amt:"$6,100", by:"M. Kim" },
  { date:"May 21", cat:"Software", desc:"Reduced-tier analytics license", amt:"$1,200", by:"M. Kim" },
  { date:"Jul 15", cat:"Travel", desc:"Regional infrastructure conference", amt:"$1,850", by:"M. Kim" },
  { date:"Sep 02", cat:"Office", desc:"Ops floor reorganization, furniture", amt:"$1,600", by:"M. Kim" },
  { date:"Nov 18", cat:"Contractor", desc:"Year-end compliance review", amt:"$4,900", by:"M. Kim" },
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
        readerBody.innerHTML = `<p>Standard expense filing. No further detail attached beyond the summary line.</p>`;
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    tableEl.style.display = "table";
});

showYear("7");

});
