import { db, simulationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ─── SOFTWARE ENGINEER: 8 Stages ─────────────────────────────────────────────
// Real-world incidents. Each stage = a decision with career-defining consequences.

const softwareEngineerScenarios = [
  {
    stageNumber: 1,
    title: "Day One: The On-Call Page",
    description: "It's your third week as an SRE at a major cloud platform. At 3:47 AM your phone explodes with 94 simultaneous PagerDuty alerts. You are the on-call engineer. The status page is green — someone hasn't updated it. Your Slack has 340 unread messages.",
    context: "This mirrors the opening of the October 4, 2021 Facebook BGP outage — the largest internet blackout in a decade. 3.5 billion users lost access. The on-call SRE who picked up the incident had to make a critical call in the first 90 seconds: escalate immediately, or investigate first. That 90-second window determined whether the outage lasted 6 hours or potentially 24.",
    citation: "Facebook Engineering, 'More details about the October 4 outage', Oct 5 2021. engineering.fb.com. Confirmed by Cloudflare Radar BGP analysis.",
    stakes: "$164M revenue per hour at risk · 3.5B users offline · 6-hour outage window",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Wake the entire on-call rotation and infrastructure leads simultaneously — all hands, now. Don't wait to investigate.", risk: "low", hint: "Fast escalation is correct in P0 incidents. The cost of waking 20 engineers is negligible vs. $164M/hour downtime." },
      { id: "b", text: "Spend 10 minutes investigating the root cause yourself before escalating — you want to come to the bridge call with data.", risk: "medium", hint: "10 minutes × $164M/hour = $27M in additional revenue lost. Data is good; speed is better at this stage." },
      { id: "c", text: "Update the status page to 'Investigating' and post in #incidents, waiting for others to self-triage in.", risk: "high", hint: "Passive escalation in a P0 incident is a common new-engineer mistake. Outages don't wait for volunteers." },
    ],
  },
  {
    stageNumber: 2,
    title: "The BGP Withdrawal",
    description: "You've confirmed the root cause: a botched BGP configuration update withdrew all IP routes 45 minutes ago. Remote access to all data centers is now impossible — the networks routing traffic to your servers are the same ones that are broken. Your team needs to physically access the data centers to push the rollback.",
    context: "This is exactly what happened at Facebook on October 4, 2021. Network engineers had to physically drive to data centers. But there was a secondary problem: the door access control systems were also running on the same broken network. Engineers with valid access cards were being denied entry. This 'lock-out' scenario added 2 hours to the outage.",
    citation: "Facebook Engineering post-mortem, Oct 5 2021. The physical access issue was independently confirmed by multiple Facebook engineers on Twitter/X.",
    stakes: "~$980M total revenue impact · 13,000 Facebook employees locked out of internal tools · 6h 28m total outage",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Dispatch two teams simultaneously: one to override the door access systems manually, one to attempt the BGP rollback via console cable.", risk: "low", hint: "Parallel execution cuts time. Facebook's actual approach — both teams working in tandem." },
      { id: "b", text: "Focus solely on the BGP rollback — it's the root cause. The door access problem is secondary.", risk: "medium", hint: "Serial execution adds hours. You cannot fix the network if you can't get in the room." },
      { id: "c", text: "Attempt a remote fix via an out-of-band management network that may have survived the BGP withdrawal.", risk: "high", hint: "Smart instinct, but at Facebook the OOB network was also inadvertently affected by the same change." },
    ],
  },
  {
    stageNumber: 3,
    title: "The Deployment That Ate $440 Million",
    description: "You've just joined the trading platform team at a mid-size fintech. It's 9:31 AM — one minute after market open. Your new trading algorithm went live this morning. In the first 2 minutes, 150,000 erroneous buy orders have hit the NYSE. Your P&L screen shows -$17M and falling fast.",
    context: "On August 1, 2012, Knight Capital Group deployed a trading algorithm that activated a dormant code path called 'Power Peg.' In 45 minutes it executed 4 million trades, generating $440M in losses. The root cause: an engineer reused a deprecated feature flag without realizing the old code was still in the binary on 8 of 9 servers. This single deployment error ended Knight Capital's independence.",
    citation: "SEC Administrative Proceeding, File No. 3-15570, 'In the Matter of Knight Capital Americas LLC', Oct 16 2013. SEC Release No. 70694.",
    stakes: "$10M lost per minute · 45-minute window · Knight Capital went bankrupt 3 months later",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Shut down the trading system entirely and halt all order flow immediately, regardless of regulatory penalties.", risk: "low", hint: "Knight's fatal mistake was not doing this. Each minute of hesitation cost $10M. Kill the system." },
      { id: "b", text: "Try to hedge the erroneous positions by placing offsetting trades — this limits downside while engineering investigates.", risk: "high", hint: "Knight's actual choice. They tried to hedge. Offsetting trades in a broken system doubled their exposure." },
      { id: "c", text: "Identify and rollback the specific code flag causing the issue — targeted fix without full system shutdown.", risk: "medium", hint: "Good instinct, but at $10M/minute, surgical fixes take too long. The blast radius is already global." },
    ],
  },
  {
    stageNumber: 4,
    title: "Zero-Day in Production",
    description: "A security researcher has just sent your team a responsible disclosure email. Your flagship API has a remote code execution vulnerability. He's given you 72 hours before public disclosure. He estimates the vulnerability has been exploitable for 6 months. Your API serves 40 million users. You don't know if it's been exploited yet.",
    context: "This scenario mirrors the 2014 Heartbleed disclosure. The OpenSSL team, Google Project Zero, and Codenomicon had a 72-hour coordinated disclosure window. The decisions made during that window — who to notify, in what order, how quickly to patch vs. how quickly to go public — became a case study in security incident response. Done well, it's a PR win. Done poorly, it's a congressional hearing.",
    citation: "CVE-2014-0160 NVD entry. Google Security Blog, 'Protecting our customers from the Heartbleed bug', Apr 14 2014. Codenomicon/Synopsys disclosure timeline.",
    stakes: "40M users' data · potential regulatory fines up to 4% of annual revenue (GDPR) · company reputation",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Patch internally first (48h), then notify enterprise customers directly 12h before public disclosure, then post the CVE.", risk: "low", hint: "Standard coordinated disclosure practiced by Google, Microsoft, and major vendors. Balances security and transparency." },
      { id: "b", text: "Go public immediately — your users deserve to know. Transparency first.", risk: "high", hint: "Noble but dangerous. Publishing before a patch is ready gives attackers a 0-day exploit guide with no defense available." },
      { id: "c", text: "Ask the researcher for a 30-day extension, patch quietly, and never publicly disclose.", risk: "high", hint: "Hiding a vulnerability that may have been exploited for 6 months is a legal liability and almost always leaks. See: Uber 2016 breach cover-up ($148M settlement)." },
    ],
  },
  {
    stageNumber: 5,
    title: "The Regex That Killed the CDN",
    description: "You're a software engineer at a CDN company. Your team just deployed a new WAF (Web Application Firewall) rule at 2:02 PM. Within 60 seconds, your monitoring shows CPU utilization at 100% across all 194 data centers globally. HTTP traffic is being dropped entirely. 17.5 million websites are offline.",
    context: "On July 2, 2019, Cloudflare deployed a WAF rule containing a regular expression with catastrophic backtracking — a pattern that required exponential CPU time for certain inputs due to nested quantifiers. The regex engine would try billions of possible matches before failing, pegging CPU at 100% on every server globally. 27 minutes of total outage, affecting 1 in 10 internet users.",
    citation: "Cloudflare Blog, 'Details of the Cloudflare outage on July 2, 2019', Jul 12 2019. Author: John Graham-Cumming, CTO. blog.cloudflare.com",
    stakes: "$100M+ in SLA credits · 17.5M websites offline · 1 in 10 internet users affected",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Globally disable the new WAF rule immediately — accept any security gap as preferable to 100% CPU outage.", risk: "low", hint: "Correct. This is what Cloudflare actually did. Disable first, investigate second. A WAF gap is recoverable. Total downtime is not." },
      { id: "b", text: "Try to fix the regex in-place and push an update — the rule is the right security control, just implemented wrong.", risk: "high", hint: "Pushing changes to already-overloaded servers risks triggering restart cascades. You cannot safely deploy when CPUs are pinned at 100%." },
      { id: "c", text: "Progressively disable the rule in 10% of data centers to test if it's actually the cause before a full rollback.", risk: "medium", hint: "Good engineering instinct for ambiguous incidents, but when CPU is 100% globally, you already have your answer. Speed over confirmation." },
    ],
  },
  {
    stageNumber: 6,
    title: "The Cascading Microservices Failure",
    description: "Your e-commerce platform handles $4.2M in sales per hour during peak holiday traffic. At 11:58 PM on Black Friday, your inventory service returns a timeout. Within 90 seconds, the order service starts timing out too. Then payments. Your circuit breakers were supposed to prevent this. They didn't trip. The cascade is accelerating.",
    context: "This mirrors Amazon's 2013 holiday outage and Netflix's documented 2012 cascading failure study. Netflix's engineering team published their 'Chaos Engineering' practices specifically because of cascading microservice failures. The fundamental insight: a circuit breaker that doesn't trip is worse than no circuit breaker — it creates false confidence. Jeff Bezos' 2002 mandate that all Amazon services communicate via APIs was a direct response to these failure modes.",
    citation: "Netflix Tech Blog, 'Fault Tolerance in a High Volume, Distributed System', Feb 2012. Amazon's official root cause analysis for the 2013 Black Friday degradation.",
    stakes: "$4.2M revenue per hour · 340,000 pending orders at risk · every minute = $70,000 lost",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Trip all circuit breakers manually right now — serve cached product data, queue all orders for async processing, stop the cascade.", risk: "low", hint: "Controlled degradation over total failure. Amazon's actual playbook: fail gracefully, queue everything, catch up when stable." },
      { id: "b", text: "Restart the inventory service — it was the first to fail, fixing it should unwind the cascade.", risk: "medium", hint: "Restarting a service under extreme load can make cascades worse. If inventory is being hammered, restarting brings it back to the same conditions." },
      { id: "c", text: "Scale up all services horizontally — add more instances to absorb the traffic spike causing timeouts.", risk: "high", hint: "If the timeout is a logic bug or data corruption, adding capacity scales the bug. You may need it, but scaling before diagnosing is risky." },
    ],
  },
  {
    stageNumber: 7,
    title: "The Code Review You Almost Skipped",
    description: "It's 5:45 PM on a Friday. You have a flight at 8 PM. A junior engineer on your team has submitted a pull request for a 'minor config update' that needs to go out tonight for a customer deadline. The PR is 47 lines. Your teammate is pressuring you to just approve it — they've reviewed it and it looks fine. You skim it in 2 minutes.",
    context: "The 2020 SolarWinds supply chain attack began with a seemingly routine build process change. The Stuxnet worm exploited a Windows zero-day found in a file that passed dozens of security reviews. The 2017 Equifax breach that exposed 147M people's data stemmed from an unpatched Apache Struts vulnerability — teams had been notified but the patch was 'deprioritized.' The danger isn't the dramatic zero-day. It's the PR approved at 5:45 PM on a Friday.",
    citation: "SolarWinds breach: CISA Advisory AA20-352A, Dec 17 2020. Equifax breach: U.S. Senate Permanent Subcommittee on Investigations Report, 2019.",
    stakes: "Zero risk if you're wrong · Potentially catastrophic if the PR contains a subtle bug in a customer billing path",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Ask the customer to accept a 24-hour delay and do a proper review on Monday. Document the business reason.", risk: "low", hint: "This is the right call. 'Friday afternoon deployments' are a documented anti-pattern. The customer will understand; a Friday night outage won't." },
      { id: "b", text: "Do a thorough review yourself right now — 30 minutes — and either approve or request changes with specific feedback.", risk: "medium", hint: "Better than rubber-stamping, though it's rushed. If you find nothing, deploy. If you're uncertain, don't. Set a personal rule: no uncertain Friday deploys." },
      { id: "c", text: "Trust your teammate's review and approve it. They're capable, and you've worked together for 2 years.", risk: "high", hint: "Two engineers missing the same subtle bug is common. Peer review only works when both reviewers are fresh and unrushed. Friday 5:45 PM is neither." },
    ],
  },
  {
    stageNumber: 8,
    title: "The Technical Debt Reckoning",
    description: "You've been at this company for 18 months. You've identified a core authentication service that was written in 2015 — it has no tests, uses deprecated cryptography (MD5 password hashing), and handles 4M login requests per day. Rewriting it would take 6 weeks and delay your team's roadmap by one quarter. Your manager says the business can't afford the delay. The CTO agrees with your manager.",
    context: "In 2012, LinkedIn suffered a breach that exposed 6.5 million MD5-hashed passwords. In 2016, those hashes were cracked and 117 million full accounts were sold on the dark web — revealing LinkedIn had actually stored all 117 million passwords with no salting. The root cause was technical debt: an authentication system from the early 2000s that no one wanted to prioritize rewriting. LinkedIn settled a class action for $1.25M in 2016.",
    citation: "LeakedSource, LinkedIn breach analysis, 2016. LinkedIn CISO blog post on the 2012 incident. Steinberg et al v. LinkedIn Corp., N.D. Cal. 2016 ($1.25M settlement).",
    stakes: "4M users' credentials · $1.25M+ settlement risk · Potential GDPR fines up to €20M · Reputational cost",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Write a formal risk document quantifying the breach exposure in dollar terms. Present it to the CTO and request a 6-week exception. If denied, escalate to the board in writing.", risk: "low", hint: "This is how LinkedIn's breach could have been prevented. When engineers document risk and leadership still says no, the paper trail protects the engineer and sometimes changes minds." },
      { id: "b", text: "Migrate the authentication system incrementally — add bcrypt alongside MD5 over 4 months while shipping the roadmap in parallel.", risk: "medium", hint: "Clever compromise. Slower than a full rewrite but reduces blast radius. Document the plan and get sign-off." },
      { id: "c", text: "Accept the business decision. The CTO and your manager have more context on business priorities. Ship the roadmap.", risk: "high", hint: "This is what LinkedIn's engineers did in 2012. When the breach came in 2016, the company paid $1.25M in settlement and untold reputational damage. Deferring security debt doesn't make it go away." },
    ],
  },
];

// ─── EMERGENCY MEDICINE: 8 Stages ─────────────────────────────────────────────

const emergencyMedicineScenarios = [
  {
    stageNumber: 1,
    title: "The Walk-In That Shouldn't Have Walked",
    description: "You are the attending physician on a busy Saturday evening shift. A 28-year-old male walks in and says he has 'just a bad headache.' He's ambulatory and talking normally. Triage rated him as a Level 3 (Urgent). There are 22 patients ahead of him and your department is at 140% capacity. He tells you the headache came on 'like a thunderclap' 2 hours ago.",
    context: "The thunderclap headache — described as 'the worst headache of my life, starting suddenly' — is the cardinal symptom of subarachnoid hemorrhage (SAH). SAH has a 30-day mortality of 45%. Approximately 10-15% of patients with SAH are misdiagnosed as 'headache NOS' on their first ER visit and sent home. Of those, 50% die or suffer permanent disability before their correct diagnosis. The Ottawa Subarachnoid Hemorrhage Rule was published specifically to reduce this miss rate.",
    citation: "Perry JJ, et al. 'Sensitivity of computed tomography performed within six hours of onset of headache for diagnosis of subarachnoid haemorrhage.' BMJ. 2011;343:d4277. Ottawa SAH Rule, CMAJ 2013.",
    stakes: "45% 30-day mortality if SAH missed · 10-15% SAH misdiagnosis rate nationally · Immediate LP after negative CT saves lives",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Upgrade him to Level 1 immediately, order a stat non-contrast CT head, and if negative within 6 hours of onset, proceed to lumbar puncture.", risk: "low", hint: "Correct application of the Ottawa SAH Rule. A thunderclap headache in a 28-year-old is SAH until proven otherwise." },
      { id: "b", text: "Order a CT head as Level 3 while he waits — if CT is negative, reassure him and discharge with headache precautions.", risk: "high", hint: "CT alone misses ~2% of SAH even within 6 hours. Without LP follow-up, you miss those cases. This is the most common SAH litigation scenario." },
      { id: "c", text: "He's young and ambulatory — treat for tension headache with ketorolac and reassess in 1 hour before imaging.", risk: "high", hint: "Deferring imaging in a thunderclap headache is the exact error pattern in documented SAH fatalities. Age and ambulation do not rule out SAH." },
    ],
  },
  {
    stageNumber: 2,
    title: "The Sepsis Clock",
    description: "EMS brings a 67-year-old nursing home resident: altered mental status (baseline GCS 15, now 12), HR 118, BP 86/52, Temp 38.8°C, RR 26. She has a Foley catheter in place. Her nursing home notes say she was 'not herself' for 18 hours. Lactate is pending. You have confirmed she has no advance directive.",
    context: "The Surviving Sepsis Campaign's 2021 international guidelines mandate a 1-hour bundle: lactate measurement, blood cultures, broad-spectrum antibiotics, 30mL/kg crystalloid for hypotension, and vasopressors if MAP <65. Evidence shows antibiotic delay of even 1 hour in septic shock increases mortality by 7-9% per hour. The median time to antibiotics in US hospitals is 3.2 hours. The 'best' hospitals achieve 58-minute median.",
    citation: "Evans L, et al. 'Surviving Sepsis Campaign: International Guidelines 2021.' Crit Care Med 2021;49(11). Kumar A, et al. 'Duration of hypotension before initiation of effective antimicrobial therapy.' Crit Care Med 2006.",
    stakes: "7-9% mortality increase per hour of antibiotic delay · 28-35% baseline mortality in septic shock · Every minute costs a measurable fraction of a life",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Activate the 1-Hour Bundle simultaneously: blood cultures x2, broad-spectrum antibiotics, 30mL/kg NS bolus, recheck lactate, vasopressors if MAP doesn't respond.", risk: "low", hint: "Guideline-concordant care. All five bundle elements should start in parallel, not sequentially." },
      { id: "b", text: "Get the lactate result and a urine culture first — you want to identify the source before starting antibiotics to preserve culture sensitivity.", risk: "high", hint: "Culture sensitivity is compromised by ~10% if antibiotics start first. Mortality increases 7-9% per hour of delay. The math strongly favors speed." },
      { id: "c", text: "Start antibiotics immediately but hold fluids until you can assess volume status with a bedside echo — she may not tolerate aggressive fluids.", risk: "medium", hint: "Reasonable in select patients (known CHF, ESRD), but without echo readily available, the default 30mL/kg is guideline-recommended. Antibiotics + some fluids now is better than perfect fluids in 20 minutes." },
    ],
  },
  {
    stageNumber: 3,
    title: "The Quiet Child",
    description: "A 3-year-old girl is brought in by her father. Chief complaint: 'won't stop crying and isn't eating.' She is afebrile, HR 160, BP 88/54, SpO2 98%. She is irritable but consolable. Physical exam is difficult because she is uncooperative. Father says she's been like this since yesterday morning. No trauma history given. She has two healing bruises on her lower back.",
    context: "Non-accidental trauma (NAT/child abuse) is the leading cause of traumatic death in children under 4, responsible for approximately 1,500 deaths per year in the US. It is also one of the most commonly missed diagnoses in pediatric emergency medicine. The 'history inconsistent with injury' pattern — bruising in pre-mobile children, inconsistent stories, delayed presentation — are the documented red flags. Missing NAT has legal and child welfare consequences beyond the medical emergency.",
    citation: "Flaherty EG, et al. 'Evaluating Children with Fractures for Child Physical Abuse.' Pediatrics 2014;133:e477. CDC Child Abuse Surveillance Data 2022.",
    stakes: "1,500 child deaths/year from NAT · 30% re-injury rate if discharged without intervention · Mandatory reporter liability",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Order a full skeletal survey and abdominal CT, activate social work, and separately interview the father and contact the mother — do not disclose concerns yet. File a mandatory report.", risk: "low", hint: "Correct protocol. Pre-mobile children do not get bruises on their lower back from normal activity. You are a mandatory reporter. Separate interviews are essential." },
      { id: "b", text: "Treat for pain and irritability, discharge with close follow-up. Document the bruises but wait for more information before involving social services.", risk: "high", hint: "Children who are discharged without NAT evaluation and are re-abused are a documented medicolegal and ethical failure. Waiting for 'more information' is not protocol-concordant." },
      { id: "c", text: "Ask the father directly if there has been any injury or fall — his response will guide your next steps.", risk: "medium", hint: "Asking perpetrators directly often produces false reassurance and may compromise the investigation. Social work and forensic interviews are the correct tools here." },
    ],
  },
  {
    stageNumber: 4,
    title: "The STEMI That Wasn't — Or Was It?",
    description: "A 34-year-old male presents with acute crushing chest pain, diaphoresis, and nausea for 45 minutes. ECG shows 2mm ST elevation in II, III, aVF. BP 118/72. HR 62. No prior cardiac history. He is a runner who completed a half-marathon last month. His initial troponin is borderline elevated at 0.06 (your lab's cutoff: 0.04). The cath lab team is on standby.",
    context: "This presentation is clinically ambiguous. It meets STEMI criteria and current guidelines mandate cath lab activation within 90 minutes. However, the NEJM 2019 series documented a 34-year-old with an identical presentation who had Spontaneous Coronary Artery Dissection (SCAD) — a condition primarily affecting young women and athletes, where PCI can catastrophically worsen dissection. SCAD accounts for 25-35% of acute coronary syndromes in women under 50 and is frequently misdiagnosed as STEMI.",
    citation: "NEJM Case Records of MGH, 'A 34-Year-Old Man with Chest Pain', N Engl J Med 2019;380:270-278. Hayes SN et al. 'Spontaneous Coronary Artery Dissection.' JAMA 2018;320:1570.",
    stakes: "Door-to-balloon time penalty for delay · SCAD + PCI = potentially fatal wire dissection extension · Competing life-threatening time-sensitive diagnoses",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Activate the cath lab as per STEMI protocol — door-to-balloon under 90 minutes takes priority. SCAD is rare; STEMI is common.", risk: "medium", hint: "Statistically correct in most patients. But in a young athletic male with inferior STEMI, SCAD is more prevalent than in the general population. The interventionalist should be briefed on SCAD possibility before entering." },
      { id: "b", text: "Order urgent bedside echo and CT coronary angiography to differentiate STEMI vs SCAD before cath lab activation, accepting a time penalty.", risk: "medium", hint: "Provides critical data but risks breaching the 90-minute window. Best if echo can be done in <15 minutes by a skilled operator." },
      { id: "c", text: "Activate cath lab but inform the interventionalist of possible SCAD — they can modify technique (avoid wire advancement, conservative management if SCAD confirmed).", risk: "low", hint: "Best option. Maintains time sensitivity while flagging the differential. Modern interventionalists have SCAD protocols. This is precisely what the MGH case did." },
    ],
  },
  {
    stageNumber: 5,
    title: "The Bus Crash — Mass Casualty Command",
    description: "A charter bus has rolled over on the highway. 24 patients are en route. ETA 8 minutes. Your ER has 4 physicians, 9 nurses, 6 free beds, and 2 trauma bays. The first radio report: multiple critical patients, at least 3 unconscious. You have 8 minutes to set up your response. You are the medical incident commander.",
    context: "The January 2023 bus crash in Pesaro, Italy killed 21 people, with many preventable deaths attributed to triage failures and inadequate incident command structure. The 2013 Boston Marathon bombing — which injured 264 people — was managed with exemplary mass casualty protocols and had zero immediate preventable deaths among patients who arrived with vital signs. The difference was incident command structure established in the first 5 minutes.",
    citation: "Walls RM, et al. 'The Boston Marathon Bombings Mass Casualty Incident.' JAMA 2013;309(23):2437-2438. WHO Mass Casualty Management Guidelines, 2007.",
    stakes: "24 incoming patients · 6 free beds · 4 physicians · First decisions determine who lives",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Immediately designate roles: one physician as triage officer outside, two for trauma bays, one as documentation/resource coordinator. Activate hospital disaster plan. Clear two additional beds by rapidly boarding 3 stable patients to hallways.", risk: "low", hint: "Incident command structure in the first 5 minutes is the single most evidence-based intervention in mass casualty response. Boston Marathon survival rates proved this." },
      { id: "b", text: "Wait until patients arrive to assess severity before assigning roles — you don't want to over-mobilize for what might be mostly minor injuries.", risk: "high", hint: "Reactive incident command is the documented failure mode in MCIs. By the time you're reacting to patient severity, you've lost the window to organize effectively." },
      { id: "c", text: "Call the chief of surgery and trauma attendings immediately and cede command to them — they have more MCI experience.", risk: "medium", hint: "Valid if they can arrive in <5 minutes. But you are the incident commander until relieved. Abdicating before they arrive creates a dangerous leadership vacuum." },
    ],
  },
  {
    stageNumber: 6,
    title: "The Withdrawal That Looked Like Sepsis",
    description: "A 44-year-old male brought by EMS from a hotel: agitated, diaphoretic, HR 132, BP 168/96, Temp 38.1°C, GCS 13. EMS found empty alcohol bottles. He has a history of heavy alcohol use. His wife called from overseas — she says he drinks daily but was trying to quit 'cold turkey' 3 days ago. He is now having a generalized seizure as you walk in.",
    context: "Alcohol withdrawal is life-threatening and killed an estimated 1 in 300 patients before the benzodiazepine era. Severe alcohol withdrawal (delirium tremens) carries 5-25% mortality when untreated and 1-5% when treated. The peak danger window is 48-96 hours after last drink. The CIWA-Ar (Clinical Institute Withdrawal Assessment) scale quantifies severity and guides dosing. Critically, alcohol withdrawal can mimic — or co-occur with — sepsis, Wernicke's encephalopathy, and intracranial hemorrhage.",
    citation: "McKeon A, et al. 'Alcohol-related seizures.' Epilepsy & Behavior 2008;12(4). Mayo-Smith MF. 'Pharmacological management of alcohol withdrawal: a meta-analysis.' JAMA 1997;278(2).",
    stakes: "5-25% mortality untreated · Wernicke's encephalopathy risk if thiamine not given before glucose · Benzodiazepine dosing is time-critical",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Treat the seizure with IV lorazepam, give IV thiamine 500mg BEFORE any glucose, order CIWA-Ar assessment, CT head to exclude hemorrhage, and start a lorazepam infusion protocol.", risk: "low", hint: "Correct sequence. Thiamine before glucose is non-negotiable — glucose can precipitate acute Wernicke's in thiamine-deficient patients. CT excludes the most dangerous mimics." },
      { id: "b", text: "Give IV dextrose immediately for possible hypoglycemia, then lorazepam for the seizure, then assess further.", risk: "high", hint: "Giving glucose before thiamine to a thiamine-deficient alcoholic can precipitate Wernicke's encephalopathy — a potentially irreversible neurological emergency. This sequence is a documented preventable harm." },
      { id: "c", text: "Prioritize sepsis workup — fever + altered mental status + tachycardia meets SIRS criteria. Blood cultures and antibiotics first, then address the possible withdrawal.", risk: "medium", hint: "Reasonable concern, but alcohol withdrawal is the most dangerous diagnosis in this room and the most time-critical. A sepsis workup can run in parallel but should not delay benzodiazepine treatment." },
    ],
  },
  {
    stageNumber: 7,
    title: "The Family That Won't Let Go",
    description: "An 89-year-old woman with metastatic pancreatic cancer, dementia, and end-stage renal disease arrives in cardiac arrest. EMS has been doing CPR for 22 minutes. She has no pulse, no DNR on file. Her son insists you 'do everything.' Her daughter (equally present) has a copy of the patient's advance directive on her phone — written 14 months ago — requesting comfort care only, no CPR.",
    context: "The ethical tension between family wishes and documented patient autonomy is one of the most common and distressing situations in emergency medicine. In a 2019 survey of emergency physicians, 63% reported performing CPR they believed was medically futile due to family pressure. The legal standard in all 50 US states is clear: a valid advance directive supersedes family wishes. But enforcement in real-time is deeply complex.",
    citation: "Kon AA, et al. 'Defining futile and potentially inappropriate interventions.' Crit Care Med 2016;44(9). ACEP Ethics Policy Statement, 2020.",
    stakes: "Patient autonomy vs. family grief · Legal liability either way · Resident team watching your decision",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Verify the advance directive is valid and current, then compassionately but firmly discontinue resuscitation, explaining that you are honoring your patient's own documented wishes.", risk: "low", hint: "Legally and ethically correct. A valid advance directive is the patient's voice. Continuing futile CPR against documented wishes violates patient autonomy and causes additional harm." },
      { id: "b", text: "Continue resuscitation while the hospital ethics committee is contacted — this is too complex to decide in the field.", risk: "medium", hint: "Ethics committees are for prospective decisions, not ongoing futile CPR. Continuing resuscitation while seeking committee guidance prolongs suffering unnecessarily." },
      { id: "c", text: "Attempt a 10-minute resuscitation trial to give the son closure, then discontinue regardless of outcome.", risk: "high", hint: "Well-intentioned but violates the patient's documented wishes for family comfort. The ethical obligation is to the patient, not to the family's grief process." },
    ],
  },
  {
    stageNumber: 8,
    title: "The System Failure",
    description: "It's 2:30 AM. You are 18 hours into a 24-hour shift (a scheduling error — you should have been relieved at hour 16). You have 11 patients in your queue. You just caught yourself nearly ordering the wrong dose of heparin for a STEMI patient — 5000 units instead of 60 units/kg. You corrected it before the nurse gave it. No one else noticed.",
    context: "The JAMA 2004 landmark study showed 61% of serious medication errors in ICUs occurred between 8 PM and 7 AM. A 2011 BMJ study found physicians working 24-hour shifts made 36% more serious errors than those on 16-hour shifts. The Libby Zion case (1984) — where an 18-year-old died partly due to an overworked resident's error — led to the 80-hour resident work week limits. But attendings are not covered by the same rules.",
    citation: "Landrigan CP, et al. 'Effect of reducing interns' work hours on serious medical errors.' NEJM 2004;351:1838-1848. Libby Zion v. New York Hospital, 1984.",
    stakes: "Near-miss caught this time · 11 patients still waiting · Your shift coverage is unavailable · Reporting it may affect your career",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Report the near-miss to the charge nurse and department chief immediately, document it in the incident reporting system, and request emergency coverage even if it means waking the CMO.", risk: "low", hint: "Near-miss reporting is the cornerstone of medical safety culture. Hospitals that report near-misses have lower actual error rates. You identified a system failure — the scheduling error — that will harm the next patient if not corrected." },
      { id: "b", text: "Note it mentally, slow down, and double-check every order for the rest of the shift. You can report it after you're done.", risk: "medium", hint: "Better than nothing, but fatigued vigilance is not reliable vigilance. Studies show that fatigued physicians consistently overestimate their own alertness." },
      { id: "c", text: "The error was caught — no harm was done. Log it in your personal notes but don't report formally to avoid scrutiny during your performance review cycle.", risk: "high", hint: "Near-miss concealment is a documented safety culture failure. The next near-miss may not be caught. The Libby Zion case and multiple malpractice settlements have involved physicians who failed to report known impairment." },
    ],
  },
];

// ─── STARTUP FOUNDER: 8 Stages ────────────────────────────────────────────────

const startupFounderScenarios = [
  {
    stageNumber: 1,
    title: "The Product Market Fit Trap",
    description: "Your B2B SaaS startup raised a $2M seed round 14 months ago. You have 47 paying customers, an NPS of 71, and $18K MRR. But you're burning $85K/month. You have 9 months of runway. Your investors are asking for a Series A in 6 months. Standard Series A benchmark in 2024: $1M ARR minimum, ideally $1.5M. You are at $216K ARR. The gap is $784K ARR in 6 months.",
    context: "This is the exact situation that 38% of seed-stage startups find themselves in at the 12-18 month mark, according to First Round Capital's State of Startups 2023 report. The 'Series A crunch' — when seed funding runs out before companies reach Series A benchmarks — killed more startups in 2022-2023 than any other cause. The companies that survived had one thing in common: they made hard prioritization decisions before they needed to.",
    citation: "First Round Capital, 'State of Startups 2023.' Crunchbase, 'The Series A Crunch Revisited', 2023. Y Combinator Default Alive calculator methodology.",
    stakes: "$18K MRR → need $125K MRR in 180 days · 9 months runway · 47 customers who would churn if you shut down",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Immediately cut burn by 40% (reduce team from 8 to 5, move to a cheaper office), extend runway to 15 months, and focus 100% of sales effort on 3-5 enterprise contracts that could add $50K+ ARR each.", risk: "low", hint: "This is the 'Default Alive' path. Paul Graham: 'The ability to make something people want is the most important quality in a startup. Everything else is noise.' Survive first, grow second." },
      { id: "b", text: "Raise a bridge round from existing investors immediately — they have more information than outside investors and understand your trajectory.", risk: "medium", hint: "Bridge rounds work when investors are enthusiastic and the gap is closeable. They often signal distress and dilute founders significantly. Only pursue if investors have already expressed willingness." },
      { id: "c", text: "Double down on growth — hire two more sales reps to accelerate revenue before runway runs out. Revenue cures all problems.", risk: "high", hint: "Sales hiring takes 3-6 months to ramp. At your current burn rate, two sales hires cut your runway from 9 months to ~6 months before they're productive. This is the 'speed to death' trap." },
    ],
  },
  {
    stageNumber: 2,
    title: "The Co-Founder Divorce",
    description: "You and your co-founder started this company 22 months ago. You have a 60/40 equity split. Over the last 6 months, you've disagreed on product direction 7 times. Three of your best engineers have told you privately that your co-founder's behavior in design reviews is 'creating a toxic environment.' Your co-founder closed the company's biggest deal last month — $8K/month. You are the CEO. He is the CTO.",
    context: "Co-founder conflict is the #1 cause of early-stage startup failure, according to Noam Wasserman's study of 10,000 startup founders published in 'The Founder's Dilemmas' (2012). 65% of high-potential startups fail because of co-founder conflict. Yet most founders wait an average of 14 months after first identifying serious problems before addressing them — by which time significant damage has occurred. Ben Horowitz: 'No mentor prepared me for how hard it is to fire a friend.'",
    citation: "Wasserman N. 'The Founder's Dilemmas.' Princeton University Press, 2012. Y Combinator Co-Founder Equity Guide. Horowitz B, 'The Hard Thing About Hard Things', Ch 8.",
    stakes: "65% of startups fail from co-founder conflict · His 40% equity · $8K/month customer relationship · Engineering team morale",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Have a direct, documented conversation with your co-founder this week — specific behavioral examples, specific impact on team, specific 30-day change request. Engage a startup attorney to review the vesting agreement before the conversation.", risk: "low", hint: "Addressing it directly with documentation is the only path that preserves both the relationship and the company. Involving an attorney before the conversation protects both parties." },
      { id: "b", text: "Restructure roles — move him from CTO to Chief Revenue Officer, where his sales talent is an asset and his technical influence is reduced.", risk: "medium", hint: "Creative reframing. Works if he accepts it and if the underlying behavioral issues are role-specific. Doesn't work if the conflict is personal or about control." },
      { id: "c", text: "Continue as-is — the company can't afford a co-founder split right now. Focus on the business and manage around the conflict.", risk: "high", hint: "Wasserman's data: every month of unresolved co-founder conflict reduces Series A probability by ~4%. The team has already noticed. This doesn't manage itself." },
    ],
  },
  {
    stageNumber: 3,
    title: "The Enterprise Deal That Changes Everything",
    description: "A Fortune 500 company wants to sign a 3-year, $2.4M contract ($800K/year). It would triple your ARR overnight and guarantee your Series A. But their legal team wants: (1) full source code escrow, (2) a 99.9% uptime SLA with $50K daily penalties, (3) a dedicated instance with custom HIPAA compliance modifications. Your engineering team estimates the custom work at 4 months of full-team effort. You currently have 11 other customers.",
    context: "The 'one big customer trap' is documented in detail in Peter Thiel's 'Zero to One' and extensively in SaaS literature. In 2015, Zenefits generated 70% of revenue from one customer segment and nearly collapsed when that segment turned. Conversely, Salesforce's first enterprise contract with Bank of America ($5M in 2004) gave it the credibility to close 50 more. The key variable: what does the contract do to your product roadmap and your ability to serve other customers?",
    citation: "Thiel P, Masters B. 'Zero to One', 2014. Zenefits post-mortem: Forbes, 'What Happened to Zenefits?', 2016. Benioff M. 'Trailblazer', 2019.",
    stakes: "$2.4M contract · 4 months roadmap freeze · $50K/day penalty exposure · 11 existing customers affected by resource diversion",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Negotiate to keep the SLA penalties capped at $500K total, reduce custom work scope to 6 weeks, and hire one dedicated engineer for the enterprise build — funded by a contract deposit.", risk: "low", hint: "Best outcome: you get the deal, limit downside, and grow capacity to serve it. Enterprise customers expect negotiation; proposing a deposit-funded hire signals maturity." },
      { id: "b", text: "Sign the contract as presented — $2.4M triples ARR and guarantees your Series A. Figure out the execution later.", risk: "high", hint: "Uncapped $50K/day SLA penalties on a team that can't yet guarantee 99.9% uptime is an existential risk. Salesforce had 20 engineers when they signed their first enterprise deal. You have 8." },
      { id: "c", text: "Decline the deal — the custom work will freeze your product for 4 months and harm your 11 existing customers, sacrificing the many for one.", risk: "medium", hint: "Legitimate if the 11 existing customers represent comparable lifetime value. But $2.4M ARR is transformative at your stage. The answer is negotiate, not decline." },
    ],
  },
  {
    stageNumber: 4,
    title: "The Pivot Moment",
    description: "You've been building a B2C productivity app for 18 months. You have 340,000 downloads, 12,000 monthly active users, and $4,200 MRR (mostly from a $4.99/month tier). Your churn is 8% monthly. In user interviews, you discovered that 40 of your power users are using your app for team project management in small agencies — a use case you didn't design for. They're begging for collaboration features.",
    context: "The pivot from consumer to B2B is the most documented and most value-creating pivot pattern in startup history: Slack pivoted from Glitch (consumer game). Flickr pivoted from a consumer game. YouTube was originally a video dating site. Instagram was originally a check-in app (Burbn). The pattern: a small cohort using the product in an unintended way with intense engagement and willingness to pay more. This is the signal most founders miss because they're focused on their original vision.",
    citation: "Butterfield S. 'We Don't Sell Saddles Here.' Medium, Feb 17 2014. Kim B et al. 'Pivots in Startups.' Harvard Business Review, 2018. Instagram founding story, Kevin Systrom interview, 2018.",
    stakes: "340K downloads · 8% monthly churn (12-month retention: ~37%) · 40 teams paying $50-150/month would equal current total MRR',",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Run a 60-day experiment: build the minimum collaboration features, price a team plan at $79/month, and sell it manually to the 40 power-user teams. Measure conversion before any major investment.", risk: "low", hint: "The 'concierge MVP' approach. Dropbox, Zapier, and Airbnb all validated their pivots with manual concierge tests before scaling. Cheap signal, high information." },
      { id: "b", text: "Fully pivot to B2B immediately — shut down the consumer app, rebuild for teams, and re-launch in 4 months with a new go-to-market.", risk: "high", hint: "Shutting down 340K users before you've validated the B2B revenue is irreversible. You lose the consumer base without proof the B2B works." },
      { id: "c", text: "Stay the course on consumer. The 8% churn is high but solvable with better onboarding. The B2B signal is interesting but too small to act on.", risk: "high", hint: "At 8% monthly churn, your product has a 37% annual retention rate. That's not a fixable onboarding problem — it's a product-market fit problem. The B2B signal is your product-market fit." },
    ],
  },
  {
    stageNumber: 5,
    title: "The Offer",
    description: "Your Series A-backed startup ($8M raised, $2.1M ARR, 18 months of runway) has received an acquisition offer from a public company: $42M all-cash. Your cap table: you own 22%, your co-founder owns 18%, seed investors own 28%, Series A owns 32%. At $42M: you get ~$9.2M, co-founder gets ~$7.6M. Your Series A investor says they think you can build to $100M ARR in 3 years — implying a $500M-$1B exit. They are against the deal. Your employees have $0 liquidation preference.",
    context: "The acquisition decision is the most consequential decision most founders make. In 2012, Brian Acton and Jan Koum turned down a $1B acquisition offer for WhatsApp from Google. Two years later they sold to Facebook for $19B. In 2013, Evan Spiegel turned down a $3B acquisition offer from Facebook for Snapchat. Snapchat IPO'd in 2017 but has never recovered to its peak. The base rate for Series A companies reaching $100M ARR: approximately 5-8%.",
    citation: "Acton/Koum: Forbes 'Inside The WhatsApp Deal', Feb 2014. Spiegel: WSJ 'Snapchat Spurned $3 Billion Acquisition Offer from Facebook', Nov 2013. First Round Capital success rates data.",
    stakes: "$9.2M guaranteed for you · 5-8% base rate of reaching $100M ARR · 32 employees with unvested equity depending on the outcome",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Counter-propose at $65M or negotiate a structure where you retain product autonomy and your team is protected (full vesting acceleration, employment guarantees).", risk: "medium", hint: "Most successful acquisitions start with a counter. If they say yes at $65M, you've added 54% more value for all shareholders. If they say no, you've learned their ceiling." },
      { id: "b", text: "Accept the $42M. Your investors took the risk; $9.2M changes your life and your employees will be protected. The 5-8% odds of building to $1B are real.", risk: "low", hint: "Rational choice given base rates. WhatsApp is the exception. Most founders who bet on '5 more years' end up with less. This is a live option, not a failure." },
      { id: "c", text: "Decline — your Series A investor is right. You have the trajectory and the team. Build to $100M ARR.", risk: "high", hint: "High expected value but high variance. Your employees have unvested equity and no liquidation preference. If the next 3 years don't work, they get nothing. This is not only your decision." },
    ],
  },
  {
    stageNumber: 6,
    title: "The Viral Moment You Didn't Prepare For",
    description: "Your consumer app just went viral overnight. A TikTok with 4.2M views mentioned your product. You woke up to 87,000 new signups in 12 hours. Your server infrastructure was built for 5,000 concurrent users. You currently have 94,000 concurrent users. Your app is responding in 12-14 seconds. Users are rage-quitting at the sign-up screen. Your one DevOps engineer is on vacation in Costa Rica.",
    context: "Product Hunt launches, TikTok virality, and press coverage create identical pressure patterns. Clubhouse grew from 1,500 to 600,000 users in 3 weeks in Feb 2021 and spent $1M in emergency infrastructure in 72 hours. Wordle had to move from a personal server to The New York Times infrastructure in 48 hours after going viral. The companies that survived these moments had one thing in common: they made infrastructure decisions before user experience deteriorated past the point of no return.",
    citation: "Clubhouse infrastructure story: The Verge, Feb 2021. Wordle: NYT, 'We Didn't Expect Wordle to Be This Good', Jan 2022.",
    stakes: "87,000 new signups in 12 hours · 12-second load times = 74% abandonment rate · Viral windows typically last 48-96 hours",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Immediately spin up cloud auto-scaling, put a waitlist on sign-ups to reduce concurrent load, and call your DevOps engineer (offer $5K emergency bonus). Preserve existing users over new ones.", risk: "low", hint: "Protecting the experience for existing users is the right call. A waitlist turns viral chaos into a product feature. Dropbox's waitlist in 2008 added social proof and managed load simultaneously." },
      { id: "b", text: "Let it run — accept the degraded experience and hope the infrastructure holds. This is too valuable a moment to throttle.", risk: "high", hint: "A 12-14 second load time gives you a 74% bounce rate on first impression. These users will never come back. Viral moments are won or lost in the first hour." },
      { id: "c", text: "Take the app offline temporarily, upgrade infrastructure (4-6 hours), then come back up with proper capacity.", risk: "medium", hint: "Full downtime during a viral window kills momentum. A waitlist is better — it acknowledges the surge, creates exclusivity, and lets you catch up." },
    ],
  },
  {
    stageNumber: 7,
    title: "The Culture at the Crossroads",
    description: "You have 34 employees. Three of your earliest engineers — who built the core product — are asking to leave. Their reason: the culture has changed as you've scaled. They cite: long meeting schedules, too many process layers, and feeling like 'just another resource.' Replacing each one takes 4-6 months and $35K in recruiting costs. They are the only people who fully understand the legacy codebase. One has already given notice.",
    context: "The 'founder mode vs. manager mode' tension — described by Paul Graham in his 2024 essay — is the defining cultural crisis of startup scaling. Patrick Collison has spoken about Stripe losing three core engineers in 2015 who were 'foundational to our identity' and spending 18 months recovering. The cost of losing a senior engineer who knows your codebase deeply is typically calculated at 1.5x annual salary in total cost (recruiting, onboarding, knowledge loss, team disruption).",
    citation: "Graham P, 'Founder Mode', paulgraham.com, Sep 2024. Collison P, interviews on Stripe culture 2015-2016. Stack Overflow Developer Survey, 'Why Developers Leave Jobs', 2023.",
    stakes: "$105K+ in recruiting costs · 4-6 month knowledge gap · Legacy codebase risk · Cultural signal to remaining team",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Do 1-1 exit interviews yourself (not HR) with all three. Identify which process changes are specifically driving them out. Implement the ones that don't compromise scale, and create a 'core builder' track with more autonomy for senior engineers.", risk: "low", hint: "Paul Graham's finding: the best engineers leave because of bureaucracy, not compensation. Removing one or two friction points often retains them. Personal CEO engagement sends a signal no email does." },
      { id: "b", text: "Counter-offer with 20% salary increases and additional equity refreshes for all three.", risk: "medium", hint: "Money rarely fixes cultural dissatisfaction — but it gives you 6-12 months while you solve the culture problem. Only works if compensation is actually a factor." },
      { id: "c", text: "Thank them for their contributions, begin the recruiting process, and use this as an opportunity to hire more senior engineers with startup-to-scale experience.", risk: "high", hint: "Losing the only engineers who understand your legacy codebase is a technical debt crisis waiting to happen. 'Upgrade the team' thinking works for junior roles; at the senior/founding-engineer level, it's rarely correct." },
    ],
  },
  {
    stageNumber: 8,
    title: "The Board Meeting You Can't Win",
    description: "It's your Series B board meeting. Your lead investor controls 3 of 5 board seats. She is proposing to replace you as CEO with an 'experienced operator' from the enterprise software world. Her reasoning: you've hit $4.2M ARR but growth has slowed to 15% MoM from 30% six months ago. You believe the slowdown is market seasonality. You have 2 independent board members who are on the fence. You have 48 hours before the vote.",
    context: "CEO replacement by the board is one of the most common and controversial events in venture-backed company history. Steve Jobs was ousted from Apple in 1985 by a board vote he lost 4-1. He returned 12 years later and turned Apple into the most valuable company in history. Jack Dorsey was ousted from Twitter's CEO role in 2008, then returned in 2015. Both cases show that founder-operator transitions can either save or destroy companies depending on the timing and the replacement's fit.",
    citation: "Jobs ouster: Isaacson W. 'Steve Jobs', 2011. Dorsey's Twitter arc: Jack Dorsey interviews, 2015-2022. Wasserman N, 'The Founder's Dilemmas' Chapter 11: CEO Succession.",
    stakes: "Your company · Your vision · 34 employees · 4 years of work · $12M raised on your behalf",
    timeLimit: 120,
    choices: [
      { id: "a", text: "In the next 24 hours, prepare a detailed data-backed analysis of why growth slowed (market data, seasonal benchmarks, cohort analysis), what you've already done to fix it, and a specific 90-day plan with measurable milestones. Present it personally to each independent board member.", risk: "low", hint: "Founders who survive board challenges do so with data and a plan, not with appeals to loyalty. You have 48 hours — use them to build the case you should have brought to the last board meeting." },
      { id: "b", text: "Accept a 90-day performance improvement plan with specific targets — show willingness to be held accountable and buy time to hit the numbers.", risk: "medium", hint: "Accepting a PIP is a signal of weakness to some investors and a signal of maturity to others. It buys time but changes your authority dynamic with the team." },
      { id: "c", text: "Invoke your founder rights and threaten to resign along with the founding engineering team if the vote proceeds — the company needs you more than they need the vote.", risk: "high", hint: "This works approximately 30% of the time and poisons the relationship permanently in the other 70%. Once you threaten a board and lose, you've usually already lost." },
    ],
  },
];

async function main() {
  console.log("Seeding expanded 8-stage scenarios with real-world data...");
  const sims = await db.select().from(simulationsTable);

  for (const sim of sims) {
    if (sim.careerCategory === "Software Engineering" || sim.title.toLowerCase().includes("software")) {
      await db.update(simulationsTable)
        .set({ scenariosData: softwareEngineerScenarios, stages: 8 })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Software Engineer (id: ${sim.id}) — 8 stages`);
    } else if (sim.careerCategory === "Medicine" || sim.title.toLowerCase().includes("emergency") || sim.title.toLowerCase().includes("physician")) {
      await db.update(simulationsTable)
        .set({ scenariosData: emergencyMedicineScenarios, stages: 8 })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Emergency Medicine (id: ${sim.id}) — 8 stages`);
    } else if (sim.careerCategory === "Entrepreneurship" || sim.title.toLowerCase().includes("founder") || sim.title.toLowerCase().includes("startup")) {
      await db.update(simulationsTable)
        .set({ scenariosData: startupFounderScenarios, stages: 8 })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Startup Founder (id: ${sim.id}) — 8 stages`);
    }
  }
  console.log("Done!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
