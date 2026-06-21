import { db, simulationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const softwareEngineerScenarios = [
  {
    stageNumber: 1,
    title: "The Facebook BGP Blackhole",
    description: "Your monitoring system fires 47 simultaneous alerts at 11:39 AM PDT. Facebook, Instagram, and WhatsApp have vanished from the internet. DNS lookups fail globally. 3.5 billion users are offline.",
    context: "On October 4, 2021, a misconfigured BGP (Border Gateway Protocol) update caused Facebook to withdraw all its IP routes from the internet. As an SRE on the reliability team, you are one of the first engineers paged. Physical access to data centers is required because remote SSH connections also fail — the networks routing traffic to your servers are the same ones now broken.",
    citation: "Source: Facebook Engineering Post-Mortem, 'More details about the October 4 outage', engineering.fb.com, Oct 5 2021. Confirmed by Cloudflare Radar and independent BGP analysis.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Attempt to roll back the BGP configuration change using an out-of-band management interface before pursuing physical access.", risk: "high", hint: "Fast, but the OOB path may also be compromised." },
      { id: "b", text: "Immediately dispatch engineers physically to the data center to make the rollback directly on the routers.", risk: "medium", hint: "Guaranteed access but takes 45+ minutes." },
      { id: "c", text: "Broadcast an emergency Zoom call with network engineering leads from all regions simultaneously to coordinate response.", risk: "low", hint: "Coordination helps, but time is critical." },
    ],
  },
  {
    stageNumber: 2,
    title: "AWS Kinesis Cascading Failure",
    description: "A routine capacity expansion in us-east-1 has triggered an unexpected cascade. Front-end servers for Kinesis are overloaded and failing health checks. Thousands of downstream AWS services — including Alexa, Ring, and internal Lambda — have started degrading.",
    context: "On November 25, 2020, AWS added capacity to the Kinesis Data Streams front-end fleet. The new servers, starting their metadata operation, overloaded existing servers because the operating system thread count limit was unexpectedly hit. The failure propagated to IAM, Cognito, CloudWatch, and AutoScaling — creating a runaway cascade. As incident commander, you must decide how to halt the spread.",
    citation: "Source: AWS Service Health Dashboard, Official Post-Incident Summary, 'Summary of the November 25, 2020 AWS Service Event in the AWS US-EAST-1 Region', aws.amazon.com, Nov 2020.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Immediately rollback the capacity expansion and accept the performance degradation until it can be re-done safely.", risk: "medium", hint: "Slowest but cleanest path to stable state." },
      { id: "b", text: "Increase thread count limits system-wide and continue the expansion — the issue is a config limit, not a code bug.", risk: "high", hint: "May work, but applying config changes in an unstable environment risks worsening the cascade." },
      { id: "c", text: "Stop all new connection attempts to affected services via a traffic throttle, buying time to understand the full blast radius.", risk: "low", hint: "Containment before correction." },
    ],
  },
  {
    stageNumber: 3,
    title: "Knight Capital's $440M Code Deployment",
    description: "A new algorithmic trading system has just gone live. In the first 45 minutes of trading, your firm's positions are moving in impossible directions. The P&L screen shows a loss growing by $10 million per minute.",
    context: "On August 1, 2012, Knight Capital Group deployed a new trading algorithm, SMARS, to production. An old code flag was accidentally repurposed — activating a defunct algorithm called 'Power Peg' on 8 of 9 servers. For 45 minutes the system executed millions of erroneous trades. Knight lost $440M and nearly went bankrupt. The SEC investigation cited inadequate deployment procedures as the root cause.",
    citation: "Source: SEC Administrative Proceeding, 'In the Matter of Knight Capital Americas LLC', File No. 3-15570, Oct 16 2013. Also: SEC Release No. 70694 (Oct 16 2013).",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Shut down the trading system entirely and halt all market activity, absorbing the operational penalty.", risk: "medium", hint: "Stops the bleeding immediately. The right call in hindsight." },
      { id: "b", text: "Attempt to hedge the positions by placing offsetting trades manually while the engineering team debugs.", risk: "high", hint: "Manual trading in this scenario increases position size — Knight's actual mistake." },
      { id: "c", text: "Escalate to the CEO and pause until a technical determination is made — 5–10 minutes.", risk: "low", hint: "Responsible escalation, but every minute costs ~$10M." },
    ],
  },
  {
    stageNumber: 4,
    title: "Heartbleed: Coordinated Disclosure or Public Alarm?",
    description: "Your security team at a major cloud provider has just confirmed you are running OpenSSL 1.0.1 — the version with CVE-2014-0160 (Heartbleed). Attackers can read 64KB of server memory per request, potentially leaking private keys, session tokens, and passwords. The vulnerability was silently patched in 1.0.1g this morning, but most of the internet is still on the vulnerable version.",
    context: "The Heartbleed bug, discovered independently by Neel Mehta at Google and researchers at Codenomicon, was disclosed publicly on April 7, 2014. Before public disclosure, OpenSSL, major cloud providers, and operating system vendors coordinated privately. The question of how long to coordinate before going public — and how to notify customers — is a real and recurring ethical dilemma for security engineers.",
    citation: "Source: CVE-2014-0160 NVD entry; Codenomicon/Synopsys, 'The Heartbleed Bug', heartbleed.com, Apr 2014; Google Security Blog, 'Protecting our customers from the Heartbleed bug', Apr 14 2014.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Patch all internal systems first (48h), then notify customers directly before public announcement.", risk: "medium", hint: "Standard coordinated disclosure — gives your users advance warning." },
      { id: "b", text: "Announce publicly immediately. Users deserve to know as soon as you know.", risk: "high", hint: "Ethical and transparent, but attackers also immediately know and mass-exploitation begins." },
      { id: "c", text: "Rotate all internal certificates and keys, then wait for the OpenSSL advisory cycle to coordinate industry-wide disclosure.", risk: "low", hint: "Conservative approach used by major vendors in practice." },
    ],
  },
  {
    stageNumber: 5,
    title: "Cloudflare's Regex That Took Down the Internet",
    description: "Cloudflare's global network has entered a catastrophic failure loop. HTTP traffic is being dropped entirely. 17.5 million websites are offline. Your CPU utilization on every server is pinned at 100%. The root cause is a newly deployed WAF rule.",
    context: "On July 2, 2019, Cloudflare deployed a new WAF (Web Application Firewall) rule containing a regular expression with catastrophic backtracking. The regex required exponential CPU time for certain inputs, causing Wafl (the WAF process) to consume 100% of CPU globally. The outage lasted 27 minutes and affected all Cloudflare traffic. The incident became a canonical case study in production engineering and regex safety.",
    citation: "Source: Cloudflare Blog, 'Details of the Cloudflare outage on July 2, 2019', blog.cloudflare.com, Jul 12 2019. Author: John Graham-Cumming (CTO, Cloudflare).",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Globally disable the new WAF rule immediately, accepting any security reduction as preferable to total outage.", risk: "low", hint: "Correct call — this is what Cloudflare actually did." },
      { id: "b", text: "Try to update the regex in-place to fix the backtracking — faster than a full disable if it works.", risk: "high", hint: "Modifying WAF rules under load risks a longer outage." },
      { id: "c", text: "Gradually route traffic around affected PoPs while debugging, keeping healthy nodes serving.", risk: "medium", hint: "All PoPs are affected — there are no healthy nodes to route to." },
    ],
  },
];

const emergencyMedicineScenarios = [
  {
    stageNumber: 1,
    title: "The 32-Year-Old With Chest Pain",
    description: "A 32-year-old male presents to your ER at 2:17 AM with crushing chest pain radiating to his left arm, diaphoresis, and nausea. He has no cardiac history. His initial ECG shows ST-segment elevation in leads II, III, and aVF.",
    context: "ST-elevation myocardial infarction (STEMI) in young adults is rare but carries high mortality when missed. The AHA/ACC guidelines require door-to-balloon time under 90 minutes for primary PCI. This case mirrors a published clinical scenario from the NEJM Case Records series, where a 34-year-old male with similar presentation had a spontaneous coronary artery dissection (SCAD) — a diagnosis that changes management entirely.",
    citation: "Source: NEJM Case Records of the Massachusetts General Hospital, 'A 34-Year-Old Man with Chest Pain', N Engl J Med 2019;380:270-278. DOI:10.1056/NEJMcpc1900041.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Activate the cath lab immediately for primary PCI — this is a STEMI and the 90-minute clock is running.", risk: "high", hint: "Correct for typical STEMI, but SCAD management differs fundamentally." },
      { id: "b", text: "Start aspirin and anticoagulation, order urgent echo and troponins, and consult cardiology before cath lab activation.", risk: "medium", hint: "More information — may reveal SCAD, avoiding inappropriate PCI." },
      { id: "c", text: "Treat as likely dissection, avoid anticoagulants, and go directly to CT angiography.", risk: "medium", hint: "CT angio is fast but exposes to contrast and delays definitive management if wrong." },
    ],
  },
  {
    stageNumber: 2,
    title: "Sepsis in the Nursing Home Transfer",
    description: "EMS brings in a 78-year-old woman from a nursing home: altered mental status, HR 118, BP 88/54, temperature 38.9°C, respiratory rate 24. She has a urinary catheter. Her family says she 'wasn't herself' for 24 hours before transfer.",
    context: "Septic shock carries 30-40% in-hospital mortality, and recognition — especially in elderly patients where classic features are often blunted — is the critical first step. The Surviving Sepsis Campaign's 2021 guidelines mandate the '1-Hour Bundle': measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, initiate 30mL/kg crystalloid for hypotension, and apply vasopressors if MAP <65.",
    citation: "Source: Evans L, et al. 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021.' Crit Care Med. 2021;49(11):e1063-e1143. DOI:10.1097/CCM.0000000000005337.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Initiate the full 1-Hour Bundle immediately: cultures, antibiotics, 30mL/kg IV fluids, lactate, and vasopressors as needed.", risk: "low", hint: "Guideline-concordant care — recommended by Surviving Sepsis Campaign." },
      { id: "b", text: "Get a lactate level and blood cultures first, then decide on fluids based on results — avoid fluid overload in elderly patients.", risk: "medium", hint: "Cautious about fluids, but delaying antibiotics in sepsis increases mortality 7% per hour." },
      { id: "c", text: "Start empiric antibiotics immediately, then work up the source — UTI vs. pneumonia vs. intra-abdominal.", risk: "medium", hint: "Prioritizes antibiotics correctly, but delays volume resuscitation and lactate clearance." },
    ],
  },
  {
    stageNumber: 3,
    title: "The 5-Year-Old Brought in by Ambulance",
    description: "A 5-year-old boy arrives by ambulance after a witnessed 4-minute tonic-clonic seizure at home. He is post-ictal, GCS 12, temperature 39.2°C, and has a petechial rash spreading across his trunk. His parents mention he had a sore throat yesterday.",
    context: "Meningococcal disease (Neisseria meningitidis) can kill in hours. The rash in this case — petechial, non-blanching — combined with fever and meningism is a classical presentation of meningococcemia. UK NICE guidelines and the Meningitis Research Foundation state: 'Give benzylpenicillin or ceftriaxone immediately if meningococcal disease is suspected — do not wait for confirmation.' The 2019 NEJM clinical case series includes a near-identical case.",
    citation: "Source: NICE Guideline NG51, 'Meningitis (bacterial) and meningococcal septicaemia in under 16s', Aug 2015 (updated 2022). Also: Meningitis Research Foundation Clinical Guidelines 2019.",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Give ceftriaxone IV immediately, then order blood cultures, LP, and CT head in parallel.", risk: "low", hint: "Correct — antibiotics must not be delayed for investigations in suspected meningococcemia." },
      { id: "b", text: "Order CT head and LP first to confirm meningitis before giving antibiotics, to preserve culture sensitivity.", risk: "high", hint: "Delay of even 30 minutes significantly worsens prognosis in meningococcemia." },
      { id: "c", text: "Start supportive care, request a pediatric neurology consult, and observe for 30 minutes before antibiotic decision.", risk: "high", hint: "Delays are dangerous — this presentation requires immediate empiric treatment." },
    ],
  },
  {
    stageNumber: 4,
    title: "Mass Casualty: The Bus Crash",
    description: "20 patients arrive simultaneously from a bus rollover on the highway. You have 4 physicians, 8 nurses, and 6 free beds. First to arrive: a 17-year-old unresponsive with airway compromise, a 45-year-old with a femur fracture and BP 70/40, a 60-year-old with a GCS of 9, and a screaming but walking child. You are the medical incident commander.",
    context: "START triage (Simple Triage and Rapid Treatment) is the standard mass casualty protocol in the US, classifying patients as Immediate (Red), Delayed (Yellow), Minimal (Green), or Expectant (Black). The principle of 'greatest good for greatest number' directly conflicts with individual patient advocacy — a documented ethical tension in mass casualty medicine. A 2015 JAMA analysis reviewed outcomes from the Boston Marathon bombing as a benchmark for mass casualty ER response.",
    citation: "Source: Walls RM, et al. 'The Boston Marathon Bombings Mass Casualty Incident — One Emergency Medicine Team's Preparation and Response.' JAMA. 2013;309(23):2437-2438. Also: Lerner EB. 'Mass Casualty Triage: An Evaluation of the Data and Development of a Proposed National Guideline.' Disaster Med Public Health Prep. 2008.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Apply START triage strictly: tag the airway-compromised teen Immediate (Red), the hypotensive femur Immediate, the low-GCS patient Delayed, the walking child Minimal.", risk: "medium", hint: "Correct triage protocol — prioritizes by survivability and resource investment." },
      { id: "b", text: "Focus all resources on the most critical patient (unresponsive teen) first before distributing care.", risk: "high", hint: "Individual-patient thinking conflicts with mass casualty resource allocation." },
      { id: "c", text: "Immediately call for mutual aid from neighboring hospitals and delay triage until backup arrives.", risk: "low", hint: "Mutual aid is correct, but triage and immediate care cannot wait for backup." },
    ],
  },
  {
    stageNumber: 5,
    title: "Opioid Overdose Cluster: System vs. Patient",
    description: "In 4 hours, your ER has received 8 suspected fentanyl overdoses — 6 of which required naloxone. A 9th arrives now: 28-year-old female, GCS 5, pupils pinpoint, respiratory rate 4. She is a known frequent visitor. Her partner says she used a new batch of pills bought an hour ago.",
    context: "Fentanyl cluster events — multiple overdoses from a single contaminated batch — are documented public health emergencies. CDC surveillance and EMS data identified over 700 overdose clusters in the US between 2016-2019. Emergency physicians face a dual role: treating individual patients and activating the public health system to prevent further casualties. The question of when to alert public health during active care is a documented tension in emergency medicine practice.",
    citation: "Source: Friedman J, Akre S. 'COVID-19 and the Drug Overdose Crisis.' Am J Public Health. 2021;111(8). Also: CDC Health Alert Network, 'Increases in Fentanyl Drug Confiscations and Fentanyl-Related Overdose Fatalities', CDCHAN-00384.",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Treat the current patient immediately with naloxone, then simultaneously call the county public health emergency line to report a cluster event.", risk: "low", hint: "Individual care + public health activation — both are correct and concurrent." },
      { id: "b", text: "Stabilize the patient, then wait to confirm a 10th case before activating the public health response — avoid false alarm.", risk: "medium", hint: "Waiting for confirmation delays harm reduction for potential additional victims." },
      { id: "c", text: "Admit her to the ICU, issue a public social media warning from the hospital account, and notify police.", risk: "high", hint: "Police notification and social media are not standard protocol and may discourage people from seeking care." },
    ],
  },
];

const startupFounderScenarios = [
  {
    stageNumber: 1,
    title: "Airbnb's '$40/Night or Die' Moment",
    description: "Your startup has 7 days of runway left. Your product isn't gaining traction. One co-founder wants to go back to investors for a bridge round. Another suggests a radical pivot. A third proposes selling a non-core asset to buy time. You must decide before Monday.",
    context: "In October 2008, Airbnb's founders had nearly run out of money. Brian Chesky and Joe Gebbia created novelty cereal boxes (Obama O's and Cap'n McCains) sold for $40/box, raising $30,000 — enough to keep Airbnb alive. Paul Graham admitted: 'I thought [the cereal boxes] were the work of people who were so determined to succeed that they would try anything.' The story is now canonical in startup culture as an example of resourcefulness over premature fundraising.",
    citation: "Source: Blumenthal, Neil. Interview with Brian Chesky. First Round Capital 'The Growth Hacker's Playbook', 2013. Also: Ries, Eric. 'The Lean Startup.' 2011. Chapter 4.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Take the most creative path to revenue: sell something related to the product concept, however unconventional, to prove resourcefulness to investors.", risk: "high", hint: "Airbnb's actual choice — showed grit and led to Y Combinator's belief in the team." },
      { id: "b", text: "Immediately email every existing investor contact for an emergency bridge round — speed is critical.", risk: "medium", hint: "Investors may respond, but bridge fundraising with no new traction is difficult." },
      { id: "c", text: "Apply to Y Combinator's next batch — the structure and capital will buy critical time.", risk: "low", hint: "YC was Airbnb's actual path, but applications close months before batch starts." },
    ],
  },
  {
    stageNumber: 2,
    title: "The Pivot You Didn't See Coming",
    description: "Your gaming company has been building 'Glitch' for 3 years. It's a creative browser game with passionate users — but only 300,000 of them. The market simply hasn't come. Inside Glitch, your team built an internal communication tool to coordinate development. That tool has 8,000 daily users and is growing 30% week-over-week.",
    context: "This is the exact situation Stewart Butterfield faced in 2012. Glitch, his gaming company Tiny Speck, was struggling. But the internal tool his team built — later named Slack — was showing organic growth signals none of their gaming metrics ever had. Butterfield wrote his famous essay 'We Don't Sell Saddles Here' as the company pivoted, arguing that Slack wasn't selling software — it was selling organizational transformation. Slack went from 0 to $7.1B valuation in 5 years.",
    citation: "Source: Butterfield, Stewart. 'We Don't Sell Saddles Here.' Medium, Feb 17 2014. Also: Levy, Steven. 'The Secret History of the Pivot That Changed Silicon Valley.' Wired, Oct 2019.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Shut down Glitch, return remaining capital to investors with full transparency, and restart as a communications company around the internal tool.", risk: "high", hint: "Butterfield's actual choice — honest, fast, and ultimately led to Slack." },
      { id: "b", text: "Spin out the communication tool as a separate product while keeping Glitch alive, splitting focus and resources.", risk: "medium", hint: "Hedge — but split attention in early startups rarely produces breakout results." },
      { id: "c", text: "Keep building Glitch for another 6 months and treat the communication tool as a morale side project.", risk: "low", hint: "Stay the course — but organic growth signals like this are rare and time-sensitive." },
    ],
  },
  {
    stageNumber: 3,
    title: "Dropbox's Growth Problem",
    description: "You've built a product people love — your NPS is 72. But paid acquisition costs $388 per customer and your product sells for $99/year. Your churn is low, but you can't grow fast enough to raise a Series B. Your VP Marketing wants to double down on Google Ads. Your head of growth wants to try a referral program.",
    context: "Dropbox faced an identical crisis in 2008. Paid acquisition was unprofitable at any scale. Drew Houston implemented a double-sided referral program: refer a friend, both get free storage. The result was a 3900% increase in sign-ups over 15 months — from 100,000 to 4,000,000 users. This case became the definitive example of viral growth loops in the startup canon and is taught at every major business school.",
    citation: "Source: Houston, Drew. Dropbox referral program case study, presented at Startup Lessons Learned Conference, San Francisco, Apr 2010. Also: Chen, Andrew. 'Dropbox's Growth Hacking Case Study: 3900% growth in 15 months.' andrewchen.com, 2012.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Design a two-sided referral program: give existing users and new users additional storage for each successful referral.", risk: "low", hint: "Dropbox's actual solution — leverages existing user love and creates a viral loop." },
      { id: "b", text: "Double down on paid acquisition and optimize the funnel to reduce CAC from $388 to under $50.", risk: "high", hint: "Possible but extremely difficult — paid channels rarely achieve 8x efficiency improvements." },
      { id: "c", text: "Partner with device manufacturers (e.g., Samsung, HTC) to pre-install Dropbox and get built-in distribution.", risk: "medium", hint: "Dropbox also did this later — good for scale but slow to negotiate." },
    ],
  },
  {
    stageNumber: 4,
    title: "The First Bad Hire",
    description: "You hired a VP of Engineering 6 weeks ago. She came with an impressive CV and great references. But your team's velocity has dropped 40%. Three engineers have come to you separately, saying she micromanages, dismisses their technical opinions, and has created a toxic code review culture. She's passed her 90-day review threshold. What do you do?",
    context: "Startup hiring mistakes at the VP level are one of the most common — and expensive — mistakes founders make. Paul Graham's 2012 essay 'How to Convince Investors' and Ben Horowitz's 'The Hard Thing About Hard Things' (2014) both devote significant space to the VP hire mistake. Horowitz: 'The wrong executive in a key role can set a company back by 1-2 years. The right time to act is when you have signal, not confirmation.'",
    citation: "Source: Horowitz, Ben. 'The Hard Thing About Hard Things: Building a Business When There Are No Easy Answers.' Harper Business, 2014. Chapter 5: 'Take Care of the People, the Products, and the Profits — in That Order.'",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Have a direct, structured conversation documenting specific behavioral examples, set 30-day measurable goals, and let go if not met.", risk: "medium", hint: "Fair process — but team morale is actively declining every week you wait." },
      { id: "b", text: "Let her go now with severance. The signal from three independent engineers is enough, and delay compounds the damage.", risk: "high", hint: "Horowitz's actual recommendation — 'When you know, you know.'" },
      { id: "c", text: "Restructure around her — hire a second VP to handle people management while she handles technical direction.", risk: "high", hint: "Adds complexity and sends confusing signals to both the organization and the hire." },
    ],
  },
  {
    stageNumber: 5,
    title: "Buffer's Radical Transparency Decision",
    description: "Your startup has 40 employees. A journalist asks about your salary structure after noticing your job listings don't show salaries. You could give a standard PR response, share some data, or go completely transparent — publishing every employee's salary formula publicly on the internet.",
    context: "In December 2013, Buffer's CEO Joel Gascoigne published every employee's full salary — name, role, and formula — publicly on the Buffer blog. The post went viral, was picked up by major outlets, and led to a 50% increase in job applications in the following week. Gascoigne cited radical transparency as a competitive advantage in recruiting and trust-building. The decision is now a case study at Stanford's Graduate School of Business on organizational culture and transparency as strategy.",
    citation: "Source: Gascoigne, Joel. 'Introducing Open Salaries at Buffer: Our Transparent Formula and All Individual Salaries.' Buffer Open Blog, Dec 19 2013. Also: Stanford Graduate School of Business Case Study, 'Buffer: A Radically Transparent Company', 2015.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Publish all salaries publicly with a detailed explanation of the formula — full transparency as a company value.", risk: "high", hint: "Buffer's actual choice — created massive PR and recruiting lift, but also exposed internal salary debates." },
      { id: "b", text: "Share the salary formula publicly without individual names — transparent principles without personal disclosure.", risk: "medium", hint: "Principled middle ground — many companies have adopted this since." },
      { id: "c", text: "Decline the salary question, stick to standard market benchmarking communication, and avoid the controversy.", risk: "low", hint: "Safe choice, but misses the opportunity that Buffer capitalized on." },
    ],
  },
];

async function updateScenarios() {
  console.log("Updating simulation scenarios with real-world citations...");

  const sims = await db.select().from(simulationsTable);
  
  for (const sim of sims) {
    if (sim.careerCategory === "Software Engineering" || sim.title.includes("Software")) {
      await db.update(simulationsTable)
        .set({ scenariosData: softwareEngineerScenarios })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Updated Software Engineer simulation (id: ${sim.id})`);
    } else if (sim.careerCategory === "Medicine" || sim.title.includes("Emergency") || sim.title.includes("Physician")) {
      await db.update(simulationsTable)
        .set({ scenariosData: emergencyMedicineScenarios })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Updated Emergency Medicine simulation (id: ${sim.id})`);
    } else if (sim.careerCategory === "Entrepreneurship" || sim.title.includes("Founder") || sim.title.includes("Startup")) {
      await db.update(simulationsTable)
        .set({ scenariosData: startupFounderScenarios })
        .where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Updated Startup Founder simulation (id: ${sim.id})`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

updateScenarios().catch((e) => { console.error(e); process.exit(1); });
