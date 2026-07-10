document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("app");
const listView = document.getElementById("listView");
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

/* =========================
   60 ARTICLES, 12 PER YEAR (-5 oldest to -1 most recent)
   Most bylined S. Park; a few other reporters for realism.
   #7 in Year -2 is the real one.
========================= */
const archive = {
5: [
  { n:1, h:"City Council Approves New Library Wing", by:"S. Park", s:"Construction is expected to begin this spring after a unanimous vote Tuesday night." },
  { n:2, h:"Local Bakery Marks 50 Years in Business", by:"S. Park", s:"Three generations of the same family have run the shop since it opened downtown." },
  { n:3, h:"School Board Debates Budget Shortfall", by:"R. Alvarez", s:"Officials say cuts may affect after-school programs unless new funding is found." },
  { n:4, h:"Weather: Coldest March in a Decade", by:"Wire report", s:"Forecasters say the cold snap should ease by the weekend." },
  { n:5, h:"High School Debate Team Advances to Regionals", by:"S. Park", s:"The team credits early-morning practices for their strongest season yet." },
  { n:6, h:"Downtown Parking Changes Spark Complaints", by:"S. Park", s:"Business owners say the new meters are driving customers away." },
  { n:7, h:"Obituary: Longtime Postmaster Remembered", by:"Staff", s:"He served the community for over three decades before retiring last year." },
  { n:8, h:"Farmers Market Returns for Spring Season", by:"S. Park", s:"Vendors say early turnout was the best in years despite the chilly morning." },
  { n:9, h:"County Fair Attendance Hits Record High", by:"T. Nguyen", s:"Organizers credit a new concert lineup for the boost in visitors." },
  { n:10, h:"New Crosswalk Signal Installed on Fifth Street", by:"S. Park", s:"The change follows years of requests from nearby parents and school staff." },
  { n:11, h:"Letters to the Editor: Traffic Concerns Persist", by:"Readers", s:"Several residents wrote in this week regarding the Fifth Street intersection." },
  { n:12, h:"Local Choir Wins State Competition", by:"S. Park", s:"It's the group's first state title in over a decade." },
],
4: [
  { n:1, h:"Mayor Announces Reelection Bid", by:"R. Alvarez", s:"The announcement came during a press conference at City Hall Monday morning." },
  { n:2, h:"Manufacturing Plant Adds 40 Jobs", by:"S. Park", s:"Officials say the expansion reflects renewed demand in the sector." },
  { n:3, h:"Op-Ed: What We Owe Each Other in Small Towns", by:"S. Park", s:"A reflection on community, obligation, and the stories that go unwritten." },
  { n:4, h:"Bridge Repairs to Close Main Street for a Month", by:"S. Park", s:"Detour routes have been posted along the north side of downtown." },
  { n:5, h:"High School Football Wins Division Title", by:"T. Nguyen", s:"It's the program's first title since the stadium was rebuilt." },
  { n:6, h:"Water Main Break Disrupts Downtown Businesses", by:"S. Park", s:"Crews worked through the night to restore service by morning." },
  { n:7, h:"New Zoning Rules Debated at Town Hall", by:"S. Park", s:"Residents packed the meeting to voice concerns over density limits." },
  { n:8, h:"Local Author Publishes Debut Novel", by:"Staff", s:"The book draws heavily on the author's childhood in the region." },
  { n:9, h:"Winter Storm Causes Widespread Power Outages", by:"Wire report", s:"Crews expect full restoration by the end of the week." },
  { n:10, h:"Hospital Expansion Breaks Ground", by:"S. Park", s:"The new wing will add forty beds to the regional facility." },
  { n:11, h:"Editorial: The Slow Death of Local News", by:"S. Park", s:"A meditation on shrinking newsrooms and the stories that go untold as a result." },
  { n:12, h:"Community Garden Project Seeks Volunteers", by:"S. Park", s:"Organizers hope to double the plot count by next season." },
],
3: [
  { n:1, h:"County Budget Passes After Late-Night Vote", by:"S. Park", s:"The final tally came just before midnight after hours of debate." },
  { n:2, h:"Tech Startup Relocates Headquarters to Region", by:"S. Park", s:"Officials say the move could bring dozens of new jobs within the year." },
  { n:3, h:"Investigation: Where Did the Grant Money Go?", by:"S. Park", s:"Public records reveal gaps in how a $2 million grant was ultimately spent." },
  { n:4, h:"Local Diner Featured in National Magazine", by:"Staff", s:"The owners say business has doubled since the article ran." },
  { n:5, h:"School Redistricting Plan Draws Criticism", by:"S. Park", s:"Parents on both sides of the boundary line say the plan is unfair." },
  { n:6, h:"Op-Ed: Who Gets to Decide What's News", by:"S. Park", s:"On editorial judgment, public interest, and the lines reporters draw." },
  { n:7, h:"Volunteer Fire Department Marks Centennial", by:"T. Nguyen", s:"A ceremony Saturday will honor a century of service to the county." },
  { n:8, h:"Rising Rents Push Out Longtime Tenants", by:"S. Park", s:"Several downtown residents say they've been priced out after decades in the same building." },
  { n:9, h:"City Hall Delays Public Records Request, Again", by:"S. Park", s:"This marks the third extension granted on the same request since spring." },
  { n:10, h:"Regional Airport Adds New Flight Route", by:"Wire report", s:"The new service begins next month with twice-weekly flights." },
  { n:11, h:"Youth Center Reopens After Renovation", by:"S. Park", s:"The center had been closed for repairs since a roof collapse last winter." },
  { n:12, h:"Letters: Readers React to Redistricting Coverage", by:"Readers", s:"Responses were split roughly evenly for and against the proposed boundary." },
],
2: [
  { n:1, h:"Corporate Layoffs Hit Regional Plant", by:"S. Park", s:"Roughly 120 workers were affected in the second round of cuts this year." },
  { n:2, h:"New Mayor Sworn In After Runoff Election", by:"R. Alvarez", s:"The ceremony drew a larger crowd than in previous years." },
  { n:3, h:"Drought Conditions Worsen Across County", by:"Wire report", s:"Officials have asked residents to voluntarily reduce water usage." },
  { n:4, h:"Local Nonprofit Marks 20 Years of Service", by:"S. Park", s:"The organization has provided meals to thousands of families since its founding." },
  { n:5, h:"School Lunch Program Faces Funding Cuts", by:"S. Park", s:"Administrators say they are exploring alternate funding sources." },
  { n:6, h:"Downtown Revitalization Plan Unveiled", by:"S. Park", s:"The proposal includes new pedestrian walkways and mixed-use zoning." },
  { n:7, h:"When Silence Becomes the Story", by:"S. Park", s:"An opinion piece on institutions, disclosure, and the questions worth asking anyway." },
  { n:8, h:"High School Robotics Team Heads to Nationals", by:"T. Nguyen", s:"It's the team's first national qualification in program history." },
  { n:9, h:"Op-Ed Response: In Defense of Difficult Questions", by:"Readers", s:"A reader response to last week's column on institutional silence." },
  { n:10, h:"Regional Hospital Cited for Safety Violations", by:"S. Park", s:"State inspectors flagged several issues during a routine review." },
  { n:11, h:"New Housing Development Approved Despite Objections", by:"S. Park", s:"The vote passed 4-3 after nearly three hours of public comment." },
  { n:12, h:"Farewell Column: Twenty Years Behind This Desk", by:"Staff", s:"Our longtime editor reflects on two decades of covering this community." },
],
1: [
  { n:1, h:"Local Reporter Departs for Corporate Communications Role", by:"Staff", s:"S. Park leaves the paper after several years covering local government and business." },
  { n:2, h:"City Approves New Transit Line", by:"R. Alvarez", s:"Construction on the new route is expected to begin next spring." },
  { n:3, h:"Op-Ed: What I Learned Asking Hard Questions", by:"S. Park", s:"A farewell reflection on a career spent asking the questions no one wanted to answer." },
  { n:4, h:"Regional Manufacturing Sees Growth", by:"T. Nguyen", s:"Industry analysts point to renewed investment across the sector." },
  { n:5, h:"New Public Health Initiative Launched", by:"S. Park", s:"The program targets underserved communities across the county." },
  { n:6, h:"Council Votes to Increase Transparency Requirements", by:"S. Park", s:"The new rules require faster response times on public records requests." },
  { n:7, h:"Local School Wins State Science Fair", by:"Staff", s:"Three students took top honors in the statewide competition." },
  { n:8, h:"Housing Prices Continue Upward Trend", by:"S. Park", s:"Analysts say the region shows no signs of the trend slowing." },
  { n:9, h:"Editorial: Local News Needs Your Support", by:"Editorial Board", s:"A call to readers as the paper faces another difficult budget year." },
  { n:10, h:"Community Reacts to Longtime Reporter's Departure", by:"Staff", s:"Readers shared memories of stories that shaped how the town saw itself." },
  { n:11, h:"Weather: Mild Winter Expected This Year", by:"Wire report", s:"Forecasters cite unusual regional patterns behind the milder outlook." },
  { n:12, h:"Letters: Readers Bid Farewell to S. Park", by:"Readers", s:"Several longtime readers wrote in to mark the end of an era for the paper." },
],
};

const SPECIAL_YEAR = "2";
const SPECIAL_NUM = 7;

const specialBody = [
  "There's a particular kind of quiet that settles over a newsroom when everyone already knows the answer to a question nobody's officially asked yet. I've been sitting with that quiet for two weeks now, trying to decide whether to write this column at all.",
  "A local business — I won't name it here, because naming it isn't the point — spent the better part of a year not lying, exactly, but not saying anything either. Every request I sent came back with the same careful non-answer. Every source went quiet the moment I got close to something real. Nothing illegal happened, as far as I can tell. That's almost the more unsettling part.",
  "I keep coming back to something a mentor told me early in this job: silence is a choice too. An organization that says nothing is still saying something — it's just betting that nobody will notice, or that by the time they do, it won't matter anymore.",
  "I don't have a tidy conclusion for this one. I just think somebody should have written it down, so that later, when people ask whether anyone noticed at the time, the answer is yes. Somebody did.",
  "— S. Park",
];

let currentYear = "5";

function renderYear(year) {
    const container = document.createElement("div");
    container.className = "yearPanel active";
    container.id = "panel-" + year;

    const era = document.createElement("div");
    era.className = "paper grain era-" + year;

    const masthead = document.createElement("div");
    masthead.className = "masthead";
    masthead.innerHTML = `<div class="vol">The Coastal Ledger — Local & Regional Edition</div><h2>Year -${year} Archive</h2>`;
    era.appendChild(masthead);

    const list = document.createElement("div");
    list.className = "entryList";

    archive[year].forEach(article => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
            <div class="num">ARTICLE #${article.n}</div>
            <h3>${article.h}</h3>
            <div class="byline">${article.by}</div>
            <div class="snippet">${article.s}</div>
        `;
        div.addEventListener("click", () => openArticle(year, article));
        list.appendChild(div);
    });

    era.appendChild(list);
    container.appendChild(era);
    return container;
}

function showYear(year) {
    currentYear = year;
    listView.innerHTML = "";
    listView.appendChild(renderYear(year));
    listView.style.display = "block";
    reader.style.display = "none";
    yearButtons.forEach(b => b.classList.toggle("active", b.dataset.year === year));
}

yearButtons.forEach(btn => {
    btn.addEventListener("click", () => showYear(btn.dataset.year));
});

function openArticle(year, article) {
    listView.style.display = "none";
    reader.style.display = "block";
    readerTitle.textContent = article.h;
    readerMeta.textContent = `By ${article.by} — Year -${year} Archive — Article #${article.n}`;

    if (year === SPECIAL_YEAR && article.n === SPECIAL_NUM) {
        readerBody.innerHTML = specialBody.map(p => `<p>${p}</p>`).join("");
        if (typeof db !== "undefined") {
            db.ref("world/sarahFragmentFoundBy").set(playerId);
        }
    } else {
        readerBody.innerHTML = `<p>${article.s} Full archived text for this entry is available through the regional press library's physical collection; digital transcription was not prioritized during the original scanning project.</p>`;
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    listView.style.display = "block";
});

showYear("5");

});
