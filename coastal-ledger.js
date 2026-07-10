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
   Each has a real, full body now -- not a stub.
   #7 in Year -2 is the real fragment.
========================= */
const archive = {
5: [
  { n:1, h:"City Council Approves New Library Wing", by:"S. Park", s:"Construction is expected to begin this spring after a unanimous vote Tuesday night.",
    body:"The council voted 7-0 Tuesday night to approve construction of a new wing for the downtown library branch, ending nearly two years of public debate over funding. The addition will include a dedicated children's reading room and a small community meeting space, both cited by residents as long overdue during public comment sessions. Library director Anne Faulk called the vote 'the best news this building has had in a decade.' Construction is expected to begin in early spring, with completion targeted before the next school year begins." },
  { n:2, h:"Local Bakery Marks 50 Years in Business", by:"S. Park", s:"Three generations of the same family have run the shop since it opened downtown.",
    body:"Corner Loaf Bakery celebrated its 50th anniversary this weekend with free samples and a line that stretched down the block by mid-morning. Founded by Eleanor Voss's grandfather in a converted storefront, the shop has stayed in family hands through three generations, weathering two recessions and a fire that gutted the original kitchen in its twentieth year. 'People keep asking when we're going to modernize,' said current owner Tom Reyna, laughing. 'I keep telling them the recipe hasn't changed since 1974 and neither will the oven.'" },
  { n:3, h:"School Board Debates Budget Shortfall", by:"R. Alvarez", s:"Officials say cuts may affect after-school programs unless new funding is found.",
    body:"The school board spent nearly three hours Monday debating how to close a projected $340,000 budget gap for next year, with after-school programs and elective arts courses named as likely targets if no new revenue is identified. Superintendent Marcy Holt urged the board to consider a bond measure rather than program cuts, warning that eliminating after-school offerings could disproportionately affect working families. No final decision was made; the board will revisit the issue at its next regular meeting." },
  { n:4, h:"Weather: Coldest March in a Decade", by:"Wire report", s:"Forecasters say the cold snap should ease by the weekend.",
    body:"Temperatures across the region dropped to their lowest March readings in ten years this week, prompting the county to open two emergency warming shelters. The National Weather Service attributed the cold snap to an unusually persistent northern air mass and said conditions should moderate by the weekend, with highs returning to seasonal norms by Monday. Local utilities reported a spike in heating-related outages but no major service disruptions." },
  { n:5, h:"High School Debate Team Advances to Regionals", by:"S. Park", s:"The team credits early-morning practices for their strongest season yet.",
    body:"The debate team's varsity pair punched their ticket to the regional tournament after a decisive win at last weekend's district meet, capping the program's strongest season in recent memory. Coach Diane Osei credited a shift to 6 a.m. practices — unpopular at first, she admitted — for the team's improved performance under time pressure. Team captain Wei Chen said the early mornings 'stopped being a punishment and started being the reason we win.' Regionals begin next month." },
  { n:6, h:"Downtown Parking Changes Spark Complaints", by:"S. Park", s:"Business owners say the new meters are driving customers away.",
    body:"New parking meters installed along Main Street last month have drawn sharp criticism from downtown merchants, who say the change is costing them foot traffic. Under the new system, the first thirty minutes remain free, but rates rise steeply after that — a structure several shop owners called poorly suited to a district built around browsing and lingering. City officials defended the change as necessary to fund sidewalk repairs and said they would review complaint data after ninety days." },
  { n:7, h:"Obituary: Longtime Postmaster Remembered", by:"Staff", s:"He served the community for over three decades before retiring last year.",
    body:"Frank Delgado, who served as the town's postmaster for more than thirty years before retiring last spring, passed away Sunday at the age of 74. Colleagues remembered him as a man who knew nearly every resident's name and, in several cases, their entire family history. 'Frank ran that post office like it was his living room,' said former deputy postmaster Ruth Alvarez. He is survived by his wife, two children, and four grandchildren. A memorial service is planned for next weekend." },
  { n:8, h:"Farmers Market Returns for Spring Season", by:"S. Park", s:"Vendors say early turnout was the best in years despite the chilly morning.",
    body:"The seasonal farmers market returned to the town square Saturday with its largest vendor lineup in years, drawing steady crowds despite temperatures hovering just above freezing at opening. Organizers added six new stalls this season, including the town's first dedicated flower vendor. 'People showed up bundled in coats and didn't care,' said market coordinator Alicia Ferreira. 'That told us everything about how much this was missed.' The market will run weekly through October." },
  { n:9, h:"County Fair Attendance Hits Record High", by:"T. Nguyen", s:"Organizers credit a new concert lineup for the boost in visitors.",
    body:"This year's county fair drew an estimated 28,000 visitors over its five-day run, breaking the previous attendance record by a wide margin, fair board officials announced this week. Organizers pointed to an expanded evening concert series as the primary driver, along with unusually favorable weather throughout the run. Vendors reported strong sales across the board, and board chair Denise Ruiz said planning for next year's fair would begin within the month to capitalize on the momentum." },
  { n:10, h:"New Crosswalk Signal Installed on Fifth Street", by:"S. Park", s:"The change follows years of requests from nearby parents and school staff.",
    body:"A new pedestrian signal is now active at the Fifth Street crossing near the elementary school, following years of requests from parents and staff concerned about traffic speeds during drop-off and pickup. The signal includes a countdown timer and an audible alert for visually impaired pedestrians. Principal Grace Tanaka called it 'a change that should have happened a decade ago' but said she was grateful the city finally acted. City engineers said the project was funded through a state safety grant." },
  { n:11, h:"Letters to the Editor: Traffic Concerns Persist", by:"Readers", s:"Several residents wrote in this week regarding the Fifth Street intersection.",
    body:"Several readers wrote in this week to voice continued concerns about traffic safety near the Fifth Street school crossing, even following the installation of a new signal. One resident described near-misses during afternoon pickup and called for a reduced speed limit along the corridor. Another praised the new signal but urged the city to add a crossing guard during peak hours. The editorial board welcomes continued reader input on local traffic and safety issues." },
  { n:12, h:"Local Choir Wins State Competition", by:"S. Park", s:"It's the group's first state title in over a decade.",
    body:"The community choir brought home its first state championship in eleven years after a commanding performance at last weekend's statewide competition, director Paul Ibarra announced Monday. The forty-member group, which draws singers from across three counties, performed an original arrangement that judges singled out for its ambition. 'We took a risk nobody else was taking,' Ibarra said. 'It paid off.' The choir will represent the region at next year's regional invitational." },
],
4: [
  { n:1, h:"Mayor Announces Reelection Bid", by:"R. Alvarez", s:"The announcement came during a press conference at City Hall Monday morning.",
    body:"Mayor Diane Costa formally announced her bid for a second term Monday morning, citing infrastructure investment and downtown revitalization as the cornerstones of her campaign. Speaking at a brief City Hall press conference, Costa acknowledged the town's ongoing budget pressures but pointed to the newly funded library expansion as evidence her administration could deliver results despite fiscal constraints. No challengers have formally entered the race as of press time, though local political observers expect at least one contested primary." },
  { n:2, h:"Manufacturing Plant Adds 40 Jobs", by:"S. Park", s:"Officials say the expansion reflects renewed demand in the sector.",
    body:"Coastal Fabrication announced plans to add 40 positions at its regional plant this quarter, citing increased demand from infrastructure contractors across the state. Plant manager Diego Ruiz said the hiring push would begin immediately, with an emphasis on skilled machinists and quality control staff. County economic development officials called the announcement a welcome sign after two years of relatively flat manufacturing employment in the region." },
  { n:3, h:"Op-Ed: What We Owe Each Other in Small Towns", by:"S. Park", s:"A reflection on community, obligation, and the stories that go unwritten.",
    body:"There's a version of small-town journalism that only covers ribbon cuttings and score results, and there's a version that asks harder questions about who gets left out of the story entirely. I've spent four years trying to write closer to the second kind, not always successfully.\n\nWhat I keep coming back to is this: a community isn't just the people who show up to council meetings. It's also the ones who can't — the ones working two jobs, the ones who've given up expecting anyone to listen. I don't have a tidy way to fix that gap in coverage. I just think it's worth naming out loud, regularly, so it doesn't quietly become normal." },
  { n:4, h:"Bridge Repairs to Close Main Street for a Month", by:"S. Park", s:"Detour routes have been posted along the north side of downtown.",
    body:"The Main Street bridge will close to all traffic for approximately four weeks beginning next Monday as crews complete structural repairs identified during a routine safety inspection, the city announced Wednesday. Detour signage has been posted along Elm and Harbor streets, and downtown merchants have been notified of the expected impact on foot traffic. City engineer Priya Anand said the repairs were 'preventive rather than urgent' but could not be safely delayed past this construction season." },
  { n:5, h:"High School Football Wins Division Title", by:"T. Nguyen", s:"It's the program's first title since the stadium was rebuilt.",
    body:"The high school football team claimed its first division title since the stadium's reconstruction five years ago, defeating their closest rival 24-17 in Friday night's championship game. Senior quarterback Malik Turner threw for two touchdowns and ran for a third, capping a breakout season. Head coach Ray Delgado, in his second year with the program, called the win 'a long time coming for a town that never stopped showing up on Friday nights.'" },
  { n:6, h:"Water Main Break Disrupts Downtown Businesses", by:"S. Park", s:"Crews worked through the night to restore service by morning.",
    body:"A ruptured water main beneath Second Avenue left several downtown businesses without service for roughly twelve hours overnight, public works officials confirmed Thursday. Crews worked through the night under emergency lighting to locate and repair the break, restoring full service by 7 a.m. Several restaurant owners reported having to close for the breakfast rush, and the city said it would review compensation requests on a case-by-case basis." },
  { n:7, h:"New Zoning Rules Debated at Town Hall", by:"S. Park", s:"Residents packed the meeting to voice concerns over density limits.",
    body:"More than 150 residents packed Tuesday's town hall meeting to weigh in on a proposed zoning overhaul that would raise density limits in three downtown-adjacent neighborhoods. Supporters argued the change was necessary to address a growing housing shortage, while opponents warned of strain on parking and school capacity. The planning commission took no vote Tuesday, opting instead to schedule a second hearing next month after incorporating public feedback into a revised draft." },
  { n:8, h:"Local Author Publishes Debut Novel", by:"Staff", s:"The book draws heavily on the author's childhood in the region.",
    body:"Local writer Miriam Ashe released her debut novel this week, a coming-of-age story set in a thinly fictionalized version of the town where she grew up. Ashe said many of the book's settings, including a diner and a defunct movie theater, were drawn directly from memory. Early reviews have praised the novel's sense of place. A book signing is scheduled for next Saturday at the downtown bookstore." },
  { n:9, h:"Winter Storm Causes Widespread Power Outages", by:"Wire report", s:"Crews expect full restoration by the end of the week.",
    body:"A winter storm that dumped nearly ten inches of snow across the region left roughly 4,200 households without power at its peak, utility officials said Tuesday. Downed lines and fallen tree limbs were cited as the primary causes of the outages. Crews from three neighboring counties were called in to assist with restoration efforts, and officials said they expected full service to be restored by the end of the week." },
  { n:10, h:"Hospital Expansion Breaks Ground", by:"S. Park", s:"The new wing will add forty beds to the regional facility.",
    body:"Regional Medical Center broke ground Thursday on a new wing that will add forty beds and a dedicated pediatric wing to the facility, addressing capacity concerns raised during a difficult flu season two years ago. Hospital administrator Grace Muthoni called the expansion 'the most significant investment in this building in a generation.' The project is expected to take eighteen months to complete and is funded through a combination of state grants and a hospital bond measure approved by voters last year." },
  { n:11, h:"Editorial: The Slow Death of Local News", by:"S. Park", s:"A meditation on shrinking newsrooms and the stories that go untold as a result.",
    body:"This paper's newsroom is half the size it was when I started. That's not a complaint about my own workload — it's an observation about what disappears when nobody's left to notice it. Council meetings go uncovered. Court records go unread. Small, slow-moving stories that only become obvious in hindsight never get written at all, because nobody had the hours to sit through the boring meeting where the decision actually got made.\n\nI don't know how to fix the economics of this industry. I just think readers deserve to know what they're losing before it's gone entirely, not after." },
  { n:12, h:"Community Garden Project Seeks Volunteers", by:"S. Park", s:"Organizers hope to double the plot count by next season.",
    body:"Organizers of the community garden project are seeking volunteers ahead of next season's expansion, which aims to double the number of available plots from twenty to forty. The garden, now in its third year, has become a fixture for several dozen families who lack yard space of their own. Coordinator Beth Okafor said the group is especially in need of help with soil preparation and fencing before planting season begins next month." },
],
3: [
  { n:1, h:"County Budget Passes After Late-Night Vote", by:"S. Park", s:"The final tally came just before midnight after hours of debate.",
    body:"The county budget passed on a 4-3 vote just before midnight Tuesday, following nearly six hours of debate over proposed cuts to the parks department. The approved budget restores roughly two-thirds of the funding originally slated for elimination, a compromise that satisfied neither side completely. Commissioner Alan Reyes, who voted against the final measure, called it 'a patch, not a plan.' The budget takes effect at the start of the new fiscal year." },
  { n:2, h:"Tech Startup Relocates Headquarters to Region", by:"S. Park", s:"Officials say the move could bring dozens of new jobs within the year.",
    body:"A logistics software startup announced plans to relocate its headquarters to the region this week, citing lower operating costs and access to the area's growing pool of engineering talent. Company founders said the move could bring as many as sixty new jobs within the year, though initial hiring will focus on a smaller core team. Economic development officials called the relocation a sign the region was becoming increasingly competitive for tech investment." },
  { n:3, h:"Investigation: Where Did the Grant Money Go?", by:"S. Park", s:"Public records reveal gaps in how a $2 million grant was ultimately spent.",
    body:"A months-long review of public spending records has revealed significant gaps in how the county accounted for a $2 million state infrastructure grant awarded three years ago. Nearly $400,000 in expenditures could not be matched to any specific completed project in records provided under a public records request. County finance director Wendell Osei acknowledged 'documentation shortfalls' but denied any funds were misused, attributing the gaps to incomplete recordkeeping during a period of staff turnover. The county has committed to a third-party audit." },
  { n:4, h:"Local Diner Featured in National Magazine", by:"Staff", s:"The owners say business has doubled since the article ran.",
    body:"The Coastal Diner has seen business roughly double since a national food magazine featured its pancake breakfast in a regional dining roundup last month, owner Theo Marsh said this week. Lines now regularly stretch outside on weekend mornings, a first in the diner's eighteen-year history. Marsh said the family has no plans to expand or raise prices, calling the attention 'nice, but not the point of why we do this.'" },
  { n:5, h:"School Redistricting Plan Draws Criticism", by:"S. Park", s:"Parents on both sides of the boundary line say the plan is unfair.",
    body:"A proposed redistricting plan aimed at balancing enrollment between the district's two middle schools has drawn criticism from parents on both sides of the new boundary line, with some calling the plan disruptive and others saying it doesn't go far enough. The school board is expected to vote on a final version next month after two additional public comment sessions. Superintendent Marcy Holt said no plan would satisfy everyone but that enrollment imbalances had become 'untenable' under the current lines." },
  { n:6, h:"Op-Ed: Who Gets to Decide What's News", by:"S. Park", s:"On editorial judgment, public interest, and the lines reporters draw.",
    body:"Every day, someone in this newsroom decides what goes on the front page and what gets cut for space. That decision is never neutral, even when we tell ourselves it is. A council meeting about zoning gets three column inches. A high school football win gets a photo above the fold. Neither choice is wrong, exactly, but neither is inevitable either.\n\nI think about this more than readers probably assume. Editorial judgment is a kind of power, and like any power, it deserves more scrutiny than it usually gets — including, and maybe especially, from the people exercising it." },
  { n:7, h:"Volunteer Fire Department Marks Centennial", by:"T. Nguyen", s:"A ceremony Saturday will honor a century of service to the county.",
    body:"The volunteer fire department will mark its hundredth anniversary Saturday with a community ceremony honoring a century of service, including a display of retired equipment dating back to the department's founding. Fire Chief Owen Delacroix said the department currently operates with fewer volunteers than at any point in its history, a trend he called 'the real story behind the celebration.' Recruitment materials will be distributed at Saturday's event." },
  { n:8, h:"Rising Rents Push Out Longtime Tenants", by:"S. Park", s:"Several downtown residents say they've been priced out after decades in the same building.",
    body:"Several longtime residents of the Harbor View apartment building say they've been effectively priced out after a new ownership group raised rents by as much as 40 percent over the past two years. Tenant Ruth Alvarez, who has lived in the building for eighteen years, said she was told to sign a new lease at the higher rate or vacate within sixty days. Building ownership did not respond to multiple requests for comment. Tenant advocacy groups say the pattern is becoming increasingly common downtown." },
  { n:9, h:"City Hall Delays Public Records Request, Again", by:"S. Park", s:"This marks the third extension granted on the same request since spring.",
    body:"A public records request filed by this paper in March regarding city contractor payments has been delayed for the third time since spring, with the city citing 'the volume of responsive documents' as the reason for the latest extension. State law allows limited extensions under specific circumstances, but transparency advocates say repeated delays on the same request raise concerns. City spokesperson Elena Vance said the request would be fulfilled 'as soon as practicable' but declined to provide a specific date." },
  { n:10, h:"Regional Airport Adds New Flight Route", by:"Wire report", s:"The new service begins next month with twice-weekly flights.",
    body:"The regional airport announced a new twice-weekly flight route to a major hub city, beginning next month, in what officials called a significant step toward improving the region's air travel options. Airport director Sam Whitfield said the route reflects growing passenger demand and could pave the way for daily service if ridership meets projections during its first year." },
  { n:11, h:"Youth Center Reopens After Renovation", by:"S. Park", s:"The center had been closed for repairs since a roof collapse last winter.",
    body:"The downtown youth center reopened its doors Saturday after nearly a year of repairs following a partial roof collapse during last winter's heavy snowfall. The renovated space includes a new gymnasium floor and updated after-school program rooms, funded through a combination of insurance payouts and community fundraising. Director Alicia Ferreira said the closure had been 'the hardest year in the center's history' but that Saturday's reopening drew the largest crowd she'd ever seen at the building." },
  { n:12, h:"Letters: Readers React to Redistricting Coverage", by:"Readers", s:"Responses were split roughly evenly for and against the proposed boundary.",
    body:"This week's letters section reflects a community sharply divided over the proposed middle school redistricting plan, with responses running roughly evenly for and against the new boundary lines. Several parents wrote in praising the plan's goal of balancing enrollment, while others argued it would break up longstanding friend groups and lengthen bus routes unnecessarily. The board is expected to make a final decision at next month's meeting." },
],
2: [
  { n:1, h:"Corporate Layoffs Hit Regional Plant", by:"S. Park", s:"Roughly 120 workers were affected in the second round of cuts this year.",
    body:"Roughly 120 workers at the regional manufacturing plant were laid off this week in the company's second round of cuts this year, employees confirmed, though corporate leadership declined to comment beyond a brief statement citing 'ongoing efficiency measures.' Affected workers said they received severance packages but little advance notice. County labor officials said they were monitoring the situation and would offer job placement resources through the regional workforce center." },
  { n:2, h:"New Mayor Sworn In After Runoff Election", by:"R. Alvarez", s:"The ceremony drew a larger crowd than in previous years.",
    body:"Newly elected mayor Carlos Ibarra was sworn in Monday following a closely contested runoff election, drawing a ceremony crowd notably larger than in recent years. In brief remarks, Ibarra pledged to prioritize infrastructure repair and affordable housing during his term. Outgoing mayor Diane Costa, who did not seek reelection, praised the peaceful transition and wished her successor well." },
  { n:3, h:"Drought Conditions Worsen Across County", by:"Wire report", s:"Officials have asked residents to voluntarily reduce water usage.",
    body:"County water officials issued a voluntary conservation request this week as reservoir levels dropped to their lowest point in six years amid worsening drought conditions. Residents are being asked to limit outdoor watering to two days per week. Officials stopped short of mandatory restrictions but warned that further declines could trigger stricter measures later this summer." },
  { n:4, h:"Local Nonprofit Marks 20 Years of Service", by:"S. Park", s:"The organization has provided meals to thousands of families since its founding.",
    body:"The Coastal Community Kitchen marked twenty years of operation this week, having served an estimated 400,000 meals to families across the county since its founding in a church basement two decades ago. Executive director Grace Muthoni said the organization now operates out of a dedicated facility and partners with three regional food banks. 'We started because six people wanted to help their neighbors,' Muthoni said. 'I don't think any of us imagined this.'" },
  { n:5, h:"School Lunch Program Faces Funding Cuts", by:"S. Park", s:"Administrators say they are exploring alternate funding sources.",
    body:"The district's subsidized lunch program faces a funding shortfall next year after a state grant that has supported it for the past five years was not renewed, administrators confirmed this week. Officials said they are exploring alternate funding sources, including a partnership with a regional food bank, to avoid reducing meal availability. Roughly 1,100 students across the district currently rely on the subsidized program." },
  { n:6, h:"Downtown Revitalization Plan Unveiled", by:"S. Park", s:"The proposal includes new pedestrian walkways and mixed-use zoning.",
    body:"City planners unveiled a long-awaited downtown revitalization plan Tuesday, proposing new pedestrian walkways, mixed-use zoning along Second Avenue, and incentives for ground-floor retail. The plan, developed over eighteen months with community input, will require council approval before any implementation begins. Planning director Priya Anand called it 'a framework, not a finished product,' and said further public comment sessions are planned before a final vote." },
  { n:7, h:"When Silence Becomes the Story", by:"S. Park", s:"An opinion piece on institutions, disclosure, and the questions worth asking anyway.",
    body:"There's a particular kind of quiet that settles over a newsroom when everyone already knows the answer to a question nobody's officially asked yet. I've been sitting with that quiet for two weeks now, trying to decide whether to write this column at all.\n\nA local business — I won't name it here, because naming it isn't the point — spent the better part of a year not lying, exactly, but not saying anything either. Every request I sent came back with the same careful non-answer. Every source went quiet the moment I got close to something real. Nothing illegal happened, as far as I can tell. That's almost the more unsettling part.\n\nI keep coming back to something a mentor told me early in this job: silence is a choice too. An organization that says nothing is still saying something — it's just betting that nobody will notice, or that by the time they do, it won't matter anymore.\n\nI don't have a tidy conclusion for this one. I just think somebody should have written it down, so that later, when people ask whether anyone noticed at the time, the answer is yes. Somebody did.\n\n— S. Park" },
  { n:8, h:"High School Robotics Team Heads to Nationals", by:"T. Nguyen", s:"It's the team's first national qualification in program history.",
    body:"The high school robotics team secured its first national qualification in program history after a strong showing at last weekend's regional championship, coach Devin Achebe announced Monday. The team's autonomous navigation module, designed largely by junior Mei Lin, drew particular praise from judges. The team will travel to nationals next month with support from a community fundraising campaign that exceeded its goal within a week." },
  { n:9, h:"Op-Ed Response: In Defense of Difficult Questions", by:"Readers", s:"A reader response to last week's column on institutional silence.",
    body:"In response to last week's column on institutional silence, one reader wrote: 'It's easy to criticize an organization for saying nothing, but the people asking questions have obligations too — to be fair, to be accurate, and to know when a question has actually been answered even if the answer wasn't what they wanted.' The editorial board welcomes continued responses on this and other recent columns." },
  { n:10, h:"Regional Hospital Cited for Safety Violations", by:"S. Park", s:"State inspectors flagged several issues during a routine review.",
    body:"State health inspectors cited Regional Medical Center for several safety violations following a routine review last month, including inadequate staffing ratios on two overnight shifts. Hospital administration said corrective measures were already underway and expressed confidence the facility would pass a follow-up inspection within ninety days. The violations do not affect the hospital's operating license, officials said." },
  { n:11, h:"New Housing Development Approved Despite Objections", by:"S. Park", s:"The vote passed 4-3 after nearly three hours of public comment.",
    body:"The planning commission approved a 140-unit housing development on the town's north side Tuesday night, passing on a narrow 4-3 vote after nearly three hours of public comment largely opposed to the project's scale. Supporters argued the development was necessary to address the region's housing shortage, while opponents cited traffic and school capacity concerns. Construction is expected to begin within the year." },
  { n:12, h:"Farewell Column: Twenty Years Behind This Desk", by:"Staff", s:"Our longtime editor reflects on two decades of covering this community.",
    body:"After twenty years as editor of this paper, Daniel Whitcombe is stepping down at the end of the month, marking the end of an era for the newsroom. In a farewell column, Whitcombe reflected on two decades of covering the community through recessions, elections, and countless council meetings that ran past midnight. 'The stories change,' he wrote. 'The obligation to tell them honestly doesn't.' A search for his successor is underway." },
],
1: [
  { n:1, h:"Local Reporter Departs for Corporate Communications Role", by:"Staff", s:"S. Park leaves the paper after several years covering local government and business.",
    body:"Sarah Park, a reporter with this paper for the past five years, is departing to take a communications role with a private company, editor Daniel Whitcombe announced this week. Park's coverage of local government and business, including a widely cited investigation into county grant spending, earned two regional journalism awards during her tenure. 'This newsroom is smaller without her,' Whitcombe said. 'That's true of every good reporter who leaves, but it's especially true this time.'" },
  { n:2, h:"City Approves New Transit Line", by:"R. Alvarez", s:"Construction on the new route is expected to begin next spring.",
    body:"The city council approved funding for a new cross-town transit line Tuesday, connecting the downtown corridor to the regional hospital and manufacturing district for the first time. Construction is expected to begin next spring, with service targeted to launch within eighteen months. Transit director Owen Delacroix called the route 'the missing link' in the city's public transportation network." },
  { n:3, h:"Op-Ed: What I Learned Asking Hard Questions", by:"S. Park", s:"A farewell reflection on a career spent asking the questions no one wanted to answer.",
    body:"This is my last column for this paper, and I've rewritten it more times than anything I've published here. What I keep landing on is this: nearly every important story I've written started with someone telling me, politely, that there wasn't one.\n\nI've learned that institutions are very good at sounding cooperative while giving you nothing. I've learned that silence, followed carefully, usually leads somewhere. And I've learned that asking a hard question doesn't make you an adversary — it makes you someone who still believes the answer matters.\n\nI don't know exactly what comes next for me. I know I'm taking that belief with me, whatever I end up doing with it.\n\n— S. Park" },
  { n:4, h:"Regional Manufacturing Sees Growth", by:"T. Nguyen", s:"Industry analysts point to renewed investment across the sector.",
    body:"Regional manufacturing employment grew for the third consecutive quarter, according to state labor data released this week, with analysts pointing to renewed investment in infrastructure-adjacent industries as the primary driver. Local plant managers said hiring has been steady but selective, with demand concentrated in skilled technical roles rather than general labor." },
  { n:5, h:"New Public Health Initiative Launched", by:"S. Park", s:"The program targets underserved communities across the county.",
    body:"The county health department launched a new outreach initiative this week aimed at improving access to preventive care in underserved communities, funded through a three-year state grant. The program will place mobile health units in six locations currently more than twenty minutes from the nearest clinic. Health director Wendell Osei called it 'a first step, not a complete solution' to longstanding access gaps." },
  { n:6, h:"Council Votes to Increase Transparency Requirements", by:"S. Park", s:"The new rules require faster response times on public records requests.",
    body:"The city council voted unanimously Tuesday to adopt new transparency requirements mandating faster response times on public records requests, following months of criticism over repeated delays on several high-profile requests. Under the new policy, the city must respond within fifteen business days, down from the previous thirty. Council member Alan Reyes, who sponsored the measure, called it 'overdue, but still worth doing.'" },
  { n:7, h:"Local School Wins State Science Fair", by:"Staff", s:"Three students took top honors in the statewide competition.",
    body:"Three students from the regional middle school took top honors at the statewide science fair this week, with their project on water filtration earning first place in the environmental science category. The students, all eighth-graders, said they plan to continue developing the project with a local engineering firm that has offered mentorship support." },
  { n:8, h:"Housing Prices Continue Upward Trend", by:"S. Park", s:"Analysts say the region shows no signs of the trend slowing.",
    body:"Median home prices in the region rose another 6 percent over the past year, according to a regional real estate report released this week, continuing a multi-year upward trend that analysts say shows no signs of slowing. First-time buyers are increasingly being priced out of the market, the report found, a trend local housing advocates say will require policy intervention to address." },
  { n:9, h:"Editorial: Local News Needs Your Support", by:"Editorial Board", s:"A call to readers as the paper faces another difficult budget year.",
    body:"This paper, like many local newsrooms, faces another difficult budget year. We are not writing this to alarm readers, but to be honest with you, the same way we try to be honest in every story we publish. Subscriptions and local advertising remain the backbone of what we do, and both have declined steadily for years.\n\nWe believe local journalism matters — not as an abstraction, but as the difference between a community that knows what its institutions are doing and one that doesn't. If you value that, we'd ask you to consider a subscription. If you already have one, thank you. We mean that more than the phrase usually conveys." },
  { n:10, h:"Community Reacts to Longtime Reporter's Departure", by:"Staff", s:"Readers shared memories of stories that shaped how the town saw itself.",
    body:"News of Sarah Park's departure from the paper drew an unusually large response from readers this week, many sharing memories of specific stories that shaped how the community understood itself. Several cited her investigation into county grant spending as a turning point in local accountability reporting. 'She asked the questions the rest of us were afraid to,' one longtime reader wrote. Park has not publicly commented beyond a brief thank-you note published in this edition." },
  { n:11, h:"Weather: Mild Winter Expected This Year", by:"Wire report", s:"Forecasters cite unusual regional patterns behind the milder outlook.",
    body:"The National Weather Service is forecasting a milder than average winter for the region this year, citing unusual regional atmospheric patterns. Officials cautioned that mild forecasts can still include isolated severe weather events and urged residents to maintain normal winter preparedness regardless of the seasonal outlook." },
  { n:12, h:"Letters: Readers Bid Farewell to S. Park", by:"Readers", s:"Several longtime readers wrote in to mark the end of an era for the paper.",
    body:"Several longtime readers wrote in this week to mark departing reporter Sarah Park's final byline with this paper. 'I didn't always agree with her conclusions, but I never doubted she'd done the work,' one reader wrote. Another simply thanked her 'for making this town's small stories feel like they mattered.' The editorial board thanks all readers who wrote in and wishes Ms. Park well in her next chapter." },
],
};

const SPECIAL_YEAR = "2";
const SPECIAL_NUM = 7;

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

    readerBody.innerHTML = article.body
        .split("\n\n")
        .map(p => `<p>${p}</p>`)
        .join("");

    if (year === SPECIAL_YEAR && article.n === SPECIAL_NUM) {
        if (typeof db !== "undefined") {
            db.ref("world/sarahFragmentFoundBy").set(playerId);
            db.ref("world/sarahFragmentFoundAt").set(firebase.database.ServerValue.TIMESTAMP);
        }
    }
}

backBtn.addEventListener("click", () => {
    reader.style.display = "none";
    listView.style.display = "block";
});

showYear("5");

});
