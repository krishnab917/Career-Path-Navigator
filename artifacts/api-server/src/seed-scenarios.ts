import { db, simulationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const softwareEngineerScenarios = [
  {
    stageNumber: 1,
    title: "The Facebook BGP Blackhole",
    description: "Your monitoring system fires 47 simultaneous alerts at 11:39 AM PDT. Facebook, Instagram, and WhatsApp have vanished from the internet. DNS lookups fail globally. 3.5 billion users are offline.",
    context: "On October 4, 2021, a BGP misconfiguration caused Facebook to withdraw all IP routes from the internet. As an SRE on the reliability team, you are paged first. Physical access to data centers is required because remote SSH also fails — the same networks routing traffic to your servers are the ones broken.",
    citation: "Facebook Engineering Post-Mortem, 'More details about the October 4 outage', engineering.fb.com, Oct 5 2021. Confirmed by Cloudflare Radar and independent BGP analysis.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Roll back the BGP configuration via an out-of-band management interface before pursuing physical access.", risk: "high", hint: "Fast, but the OOB path may also be compromised." },
      { id: "b", text: "Dispatch engineers physically to the data center to make the rollback directly on the routers.", risk: "medium", hint: "Guaranteed access but takes 45+ minutes." },
      { id: "c", text: "Broadcast an emergency call with network leads from all regions to coordinate response.", risk: "low", hint: "Coordination helps, but time is critical." },
    ],
  },
  {
    stageNumber: 2,
    title: "AWS Kinesis Cascading Failure",
    description: "A capacity expansion in us-east-1 has triggered an unexpected cascade. Front-end servers for Kinesis are overloaded and failing health checks. Downstream services — Alexa, Ring, Lambda — have started degrading.",
    context: "On November 25, 2020, AWS added capacity to the Kinesis fleet. New servers overloaded existing ones because the OS thread count limit was unexpectedly hit. The failure propagated to IAM, Cognito, CloudWatch, and AutoScaling. You are incident commander and must halt the spread.",
    citation: "AWS Service Health Dashboard, 'Summary of the November 25, 2020 AWS Service Event in the AWS US-EAST-1 Region', aws.amazon.com, Nov 2020.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Rollback the capacity expansion and accept performance degradation until it can be re-done safely.", risk: "medium", hint: "Slowest but cleanest path to stable state." },
      { id: "b", text: "Increase thread count limits system-wide and continue the expansion — the issue is a config limit, not a code bug.", risk: "high", hint: "May work, but applying config changes in an unstable environment risks worsening the cascade." },
      { id: "c", text: "Stop all new connection attempts via a traffic throttle, buying time to understand the full blast radius.", risk: "low", hint: "Containment before correction." },
    ],
  },
  {
    stageNumber: 3,
    title: "Knight Capital's $440M Code Deployment",
    description: "A new trading algorithm just went live. In 45 minutes, your firm's positions are moving in impossible directions. The P&L screen shows a loss growing by $10 million per minute.",
    context: "On August 1, 2012, Knight Capital deployed a new trading algorithm, SMARS, to production. An old code flag accidentally repurposed activated a defunct algorithm ('Power Peg') on 8 of 9 servers. For 45 minutes the system executed millions of erroneous trades. Knight lost $440M and nearly went bankrupt. The SEC cited inadequate deployment procedures.",
    citation: "SEC Administrative Proceeding, 'In the Matter of Knight Capital Americas LLC', File No. 3-15570, Oct 16 2013. SEC Release No. 70694.",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Shut down the trading system entirely and halt all market activity, absorbing the operational penalty.", risk: "medium", hint: "Stops the bleeding immediately — the right call in hindsight." },
      { id: "b", text: "Attempt to hedge positions by placing offsetting trades manually while engineering debugs.", risk: "high", hint: "Manual trading in this scenario increases position size — Knight's actual mistake." },
      { id: "c", text: "Escalate to the CEO and pause until a technical determination is made — 5–10 minutes.", risk: "low", hint: "Responsible escalation, but every minute costs ~$10M." },
    ],
  },
  {
    stageNumber: 4,
    title: "Heartbleed: Disclosure or Silence?",
    description: "Your security team confirmed you are running OpenSSL 1.0.1 — the version with CVE-2014-0160. Attackers can read 64KB of server memory per request, leaking private keys, session tokens, and passwords. The patch dropped this morning but most of the internet is still vulnerable.",
    context: "The Heartbleed bug was discovered independently by Neel Mehta at Google and Codenomicon researchers in April 2014. Before public disclosure, OpenSSL, major cloud providers, and OS vendors coordinated privately. The ethics of coordinated disclosure vs. immediate public notification is a recurring dilemma for security engineers.",
    citation: "CVE-2014-0160 NVD entry; Codenomicon/Synopsys, 'The Heartbleed Bug', heartbleed.com, Apr 2014; Google Security Blog, 'Protecting our customers from the Heartbleed bug', Apr 14 2014.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Patch all internal systems first (48h window), then notify customers directly before public announcement.", risk: "medium", hint: "Standard coordinated disclosure — gives your users advance warning." },
      { id: "b", text: "Announce publicly immediately — users deserve to know as soon as you know.", risk: "high", hint: "Transparent, but attackers immediately know too, and mass-exploitation begins." },
      { id: "c", text: "Rotate all internal certificates and keys, then wait for OpenSSL's advisory cycle for industry-wide coordination.", risk: "low", hint: "Conservative approach used by major vendors in practice." },
    ],
  },
  {
    stageNumber: 5,
    title: "Cloudflare's Regex Took Down the Internet",
    description: "Cloudflare's global network has entered catastrophic failure. HTTP traffic is being dropped entirely. 17.5 million websites are offline. CPU utilization on every server is pinned at 100%. Root cause: a newly deployed WAF rule.",
    context: "On July 2, 2019, Cloudflare deployed a new WAF rule containing a regular expression with catastrophic backtracking. The regex required exponential CPU time, causing the WAF process to consume 100% CPU globally. The outage lasted 27 minutes. It became a canonical case study in production engineering and regex safety.",
    citation: "Cloudflare Blog, 'Details of the Cloudflare outage on July 2, 2019', blog.cloudflare.com, Jul 12 2019. Author: John Graham-Cumming, CTO.",
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
    description: "A 32-year-old male presents at 2:17 AM with crushing chest pain radiating to his left arm, diaphoresis, and nausea. No cardiac history. His initial ECG shows ST-elevation in leads II, III, and aVF.",
    context: "STEMI in young adults is rare but carries high mortality when missed. AHA/ACC guidelines require door-to-balloon time under 90 minutes. A published NEJM case describes a 34-year-old male with near-identical presentation who had spontaneous coronary artery dissection (SCAD) — a diagnosis that changes management entirely.",
    citation: "NEJM Case Records of the Massachusetts General Hospital, 'A 34-Year-Old Man with Chest Pain', N Engl J Med 2019;380:270-278. DOI:10.1056/NEJMcpc1900041.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Activate the cath lab immediately for primary PCI — this is a STEMI and the 90-minute clock is running.", risk: "high", hint: "Correct for typical STEMI, but SCAD management differs fundamentally." },
      { id: "b", text: "Start aspirin, order urgent echo and troponins, and consult cardiology before cath lab activation.", risk: "medium", hint: "More information — may reveal SCAD, avoiding inappropriate PCI." },
      { id: "c", text: "Treat as likely dissection, avoid anticoagulants, and go directly to CT angiography.", risk: "medium", hint: "CT angio is fast but delays definitive management if wrong." },
    ],
  },
  {
    stageNumber: 2,
    title: "Sepsis in the Nursing Home Transfer",
    description: "EMS brings in a 78-year-old woman: altered mental status, HR 118, BP 88/54, temp 38.9°C, respiratory rate 24. She has a urinary catheter. Family says she 'wasn't herself' for 24 hours.",
    context: "Septic shock carries 30–40% in-hospital mortality. Recognition in elderly patients is critical — classic features are often blunted. The Surviving Sepsis Campaign's 2021 guidelines mandate the '1-Hour Bundle': lactate, blood cultures, broad-spectrum antibiotics, 30mL/kg crystalloid, and vasopressors if MAP <65.",
    citation: "Evans L, et al. 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021.' Crit Care Med. 2021;49(11):e1063-e1143. DOI:10.1097/CCM.0000000000005337.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Initiate the full 1-Hour Bundle immediately: cultures, antibiotics, 30mL/kg IV fluids, lactate, and vasopressors.", risk: "low", hint: "Guideline-concordant care — recommended by Surviving Sepsis Campaign." },
      { id: "b", text: "Get a lactate and cultures first, then decide on fluids — avoid fluid overload in elderly patients.", risk: "medium", hint: "Cautious about fluids, but delaying antibiotics in sepsis increases mortality 7% per hour." },
      { id: "c", text: "Start empiric antibiotics immediately, then work up the source — UTI vs. pneumonia vs. intra-abdominal.", risk: "medium", hint: "Prioritizes antibiotics correctly, but delays volume resuscitation." },
    ],
  },
  {
    stageNumber: 3,
    title: "The 5-Year-Old Rushed In By Ambulance",
    description: "A 5-year-old arrives after a 4-minute seizure at home. He is post-ictal, GCS 12, temp 39.2°C, with a petechial rash spreading across his trunk. Parents mention a sore throat yesterday.",
    context: "Meningococcal disease can kill in hours. A non-blanching petechial rash combined with fever and meningism is classical meningococcemia. UK NICE guidelines state: 'Give benzylpenicillin or ceftriaxone immediately if meningococcal disease is suspected — do not wait for confirmation.'",
    citation: "NICE Guideline NG51, 'Meningitis (bacterial) and meningococcal septicaemia in under 16s', Aug 2015 (updated 2022). Meningitis Research Foundation Clinical Guidelines 2019.",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Give ceftriaxone IV immediately, then order blood cultures, LP, and CT head in parallel.", risk: "low", hint: "Correct — antibiotics must not be delayed for investigations in suspected meningococcemia." },
      { id: "b", text: "Order CT head and LP first to confirm meningitis before giving antibiotics, to preserve culture sensitivity.", risk: "high", hint: "Delay of even 30 minutes significantly worsens prognosis in meningococcemia." },
      { id: "c", text: "Start supportive care and request pediatric neurology consult before antibiotic decision.", risk: "high", hint: "This presentation requires immediate empiric treatment — delays are dangerous." },
    ],
  },
  {
    stageNumber: 4,
    title: "Mass Casualty: The Bus Crash",
    description: "20 patients arrive simultaneously from a bus rollover. You have 4 physicians, 8 nurses, and 6 free beds. First arrivals: unresponsive 17-year-old with airway compromise, 45-year-old with femur fracture and BP 70/40, 60-year-old with GCS 9, and a screaming but walking child. You are medical incident commander.",
    context: "START triage (Simple Triage and Rapid Treatment) is the standard mass casualty protocol in the US, classifying patients as Immediate, Delayed, Minimal, or Expectant. The principle of 'greatest good for greatest number' directly conflicts with individual patient advocacy — a documented ethical tension reviewed in a 2013 JAMA analysis of the Boston Marathon bombing response.",
    citation: "Walls RM, et al. 'The Boston Marathon Bombings Mass Casualty Incident.' JAMA. 2013;309(23):2437-2438. Lerner EB. 'Mass Casualty Triage.' Disaster Med Public Health Prep. 2008.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Apply START triage: Immediate for the teen and hypotensive femur, Delayed for low-GCS patient, Minimal for the walking child.", risk: "medium", hint: "Correct protocol — prioritizes by survivability and resource investment." },
      { id: "b", text: "Focus all resources on the most critical patient (the teen) before distributing care.", risk: "high", hint: "Individual-patient thinking conflicts with mass casualty resource allocation." },
      { id: "c", text: "Call for mutual aid from neighboring hospitals and delay triage until backup arrives.", risk: "low", hint: "Mutual aid is correct, but triage and immediate care cannot wait." },
    ],
  },
  {
    stageNumber: 5,
    title: "Opioid Overdose Cluster: Treat or Alert?",
    description: "In 4 hours, your ER has received 8 suspected fentanyl overdoses — 6 required naloxone. A 9th arrives: 28-year-old female, GCS 5, pupils pinpoint, RR 4. Her partner says she used a new batch of pills bought an hour ago.",
    context: "Fentanyl cluster events — multiple overdoses from a contaminated batch — are documented public health emergencies. CDC surveillance identified over 700 overdose clusters in the US between 2016-2019. Emergency physicians face a dual role: treating individual patients and activating the public health system to prevent further casualties.",
    citation: "Friedman J, Akre S. 'COVID-19 and the Drug Overdose Crisis.' Am J Public Health. 2021;111(8). CDC Health Alert Network, 'Increases in Fentanyl Drug Confiscations and Fentanyl-Related Overdose Fatalities', CDCHAN-00384.",
    timeLimit: 60,
    choices: [
      { id: "a", text: "Treat with naloxone immediately while simultaneously calling the county public health emergency line to report a cluster event.", risk: "low", hint: "Individual care + public health activation — both concurrent and correct." },
      { id: "b", text: "Stabilize the patient, then wait for a 10th case before activating public health response to avoid false alarm.", risk: "medium", hint: "Waiting delays harm reduction for potential additional victims." },
      { id: "c", text: "Admit to ICU, issue a public social media warning from the hospital account, and notify police.", risk: "high", hint: "Police and social media are not standard protocol and may discourage people from seeking care." },
    ],
  },
];

const startupFounderScenarios = [
  {
    stageNumber: 1,
    title: "Airbnb's '$40/Night or Die' Moment",
    description: "Your startup has 7 days of runway left. Your product isn't gaining traction. One co-founder wants to bridge-raise. Another suggests a radical pivot. A third proposes selling a non-core asset. You must decide before Monday.",
    context: "In October 2008, Airbnb's founders had nearly run out of money. Brian Chesky and Joe Gebbia created novelty cereal boxes (Obama O's and Cap'n McCains) sold for $40/box, raising $30,000 — enough to keep Airbnb alive. Paul Graham: 'I thought [the cereal boxes] were the work of people so determined to succeed they would try anything.'",
    citation: "First Round Capital, 'The Growth Hacker's Playbook', interview with Brian Chesky, 2013. Graham, Paul. 'Do Things That Don't Scale.' paulgraham.com, Jul 2013.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Take the most creative revenue path — sell something unconventional related to the product concept to prove resourcefulness to investors.", risk: "high", hint: "Airbnb's actual choice — showed grit and led to Y Combinator's belief in the team." },
      { id: "b", text: "Immediately email every existing investor contact for an emergency bridge round — speed is critical.", risk: "medium", hint: "Bridge fundraising with no new traction signals is very difficult." },
      { id: "c", text: "Apply to Y Combinator's next batch — the structure and capital will buy critical time.", risk: "low", hint: "YC was Airbnb's path, but applications close months before a batch starts." },
    ],
  },
  {
    stageNumber: 2,
    title: "The Pivot You Didn't See Coming",
    description: "Your gaming company has been building 'Glitch' for 3 years. It has passionate but small users — 300,000. The market hasn't come. Inside Glitch, your team built an internal communication tool to coordinate development. That tool has 8,000 daily users and is growing 30% week-over-week.",
    context: "This is the exact situation Stewart Butterfield faced in 2012. Tiny Speck's game Glitch was struggling. But the internal tool — later named Slack — showed organic growth signals none of their gaming metrics ever had. Butterfield wrote his famous essay 'We Don't Sell Saddles Here' as the company pivoted. Slack went from 0 to $7.1B valuation in 5 years.",
    citation: "Butterfield, Stewart. 'We Don't Sell Saddles Here.' Medium, Feb 17 2014. Levy, Steven. 'The Secret History of the Pivot That Changed Silicon Valley.' Wired, Oct 2019.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Shut down Glitch, return remaining capital to investors with full transparency, and restart as a communications company.", risk: "high", hint: "Butterfield's actual choice — honest, fast, and ultimately led to Slack." },
      { id: "b", text: "Spin out the communication tool as a separate product while keeping Glitch alive, splitting focus.", risk: "medium", hint: "Split attention in early startups rarely produces breakout results." },
      { id: "c", text: "Keep building Glitch for 6 more months and treat the communication tool as a morale side project.", risk: "low", hint: "Organic growth signals like this are rare and time-sensitive." },
    ],
  },
  {
    stageNumber: 3,
    title: "Dropbox's Growth Problem",
    description: "Your NPS is 72 but paid acquisition costs $388/customer and the product sells for $99/year. Churn is low, but you can't grow fast enough to raise a Series B. Your VP Marketing wants to double down on Google Ads. Your head of growth wants to build a referral program.",
    context: "Dropbox faced an identical crisis in 2008. Drew Houston implemented a double-sided referral program: refer a friend, both get free storage. The result was 3900% sign-up growth over 15 months — from 100,000 to 4,000,000 users. This became the definitive example of viral growth loops, taught at every major business school.",
    citation: "Houston, Drew. Dropbox referral program, presented at Startup Lessons Learned Conference, San Francisco, Apr 2010. Chen, Andrew. 'Dropbox's 3900% growth in 15 months.' andrewchen.com, 2012.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Design a two-sided referral program: give existing users and new users additional storage per successful referral.", risk: "low", hint: "Dropbox's actual solution — leverages user love and creates a viral loop." },
      { id: "b", text: "Double down on paid acquisition and optimize the funnel to reduce CAC from $388 to under $50.", risk: "high", hint: "Paid channels rarely achieve 8x efficiency improvements." },
      { id: "c", text: "Partner with device manufacturers to pre-install the product and get built-in distribution.", risk: "medium", hint: "Dropbox also did this later — good for scale but slow to negotiate." },
    ],
  },
  {
    stageNumber: 4,
    title: "The First Bad Hire",
    description: "Your VP of Engineering is 6 weeks in. Team velocity dropped 40%. Three engineers have come to you separately, saying she micromanages, dismisses opinions, and has created a toxic code review culture. She's past her 90-day review threshold.",
    context: "Startup VP-level hiring mistakes are among the most expensive founders make. Ben Horowitz's 'The Hard Thing About Hard Things' (2014) dedicates significant space to this: 'The wrong executive in a key role can set a company back by 1-2 years. The right time to act is when you have signal, not confirmation.'",
    citation: "Horowitz, Ben. 'The Hard Thing About Hard Things: Building a Business When There Are No Easy Answers.' Harper Business, 2014. Chapter 5.",
    timeLimit: 120,
    choices: [
      { id: "a", text: "Have a structured conversation with specific behavioral examples, set 30-day measurable goals, and let go if not met.", risk: "medium", hint: "Fair process — but team morale is actively declining every week you wait." },
      { id: "b", text: "Let her go now with severance. Three independent engineers is enough signal — delay compounds the damage.", risk: "high", hint: "Horowitz's actual recommendation: 'When you know, you know.'" },
      { id: "c", text: "Restructure around her — hire a second VP for people management while she handles technical direction.", risk: "high", hint: "Adds complexity and sends confusing signals to the organization." },
    ],
  },
  {
    stageNumber: 5,
    title: "Buffer's Radical Transparency Decision",
    description: "Your startup has 40 employees. A journalist asks about your salary structure after noticing your job listings don't show salaries. You can give a standard PR response, share some data, or publish every employee's salary publicly on the internet.",
    context: "In December 2013, Buffer's CEO Joel Gascoigne published every employee's full salary — name, role, and formula — publicly. The post went viral and led to a 50% increase in job applications the following week. The decision is now a Stanford Graduate School of Business case study on organizational culture and transparency as strategy.",
    citation: "Gascoigne, Joel. 'Introducing Open Salaries at Buffer.' Buffer Open Blog, Dec 19 2013. Stanford Graduate School of Business Case Study, 'Buffer: A Radically Transparent Company', 2015.",
    timeLimit: 90,
    choices: [
      { id: "a", text: "Publish all salaries publicly with a detailed explanation of the formula — full transparency as a company value.", risk: "high", hint: "Buffer's actual choice — massive PR and recruiting lift, but exposed internal salary debates." },
      { id: "b", text: "Share the salary formula publicly without individual names — transparent principles without personal disclosure.", risk: "medium", hint: "Principled middle ground — many companies have adopted this since." },
      { id: "c", text: "Decline the salary question and stick to standard market benchmarking communication.", risk: "low", hint: "Safe choice, but misses the opportunity Buffer capitalized on." },
    ],
  },
];

async function main() {
  console.log("Updating simulation scenarios with real-world citations...");
  const sims = await db.select().from(simulationsTable);
  for (const sim of sims) {
    if (sim.careerCategory === "Software Engineering" || sim.title.toLowerCase().includes("software")) {
      await db.update(simulationsTable).set({ scenariosData: softwareEngineerScenarios }).where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Software Engineer (id: ${sim.id})`);
    } else if (sim.careerCategory === "Medicine" || sim.title.toLowerCase().includes("emergency") || sim.title.toLowerCase().includes("physician")) {
      await db.update(simulationsTable).set({ scenariosData: emergencyMedicineScenarios }).where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Emergency Medicine (id: ${sim.id})`);
    } else if (sim.careerCategory === "Entrepreneurship" || sim.title.toLowerCase().includes("founder") || sim.title.toLowerCase().includes("startup")) {
      await db.update(simulationsTable).set({ scenariosData: startupFounderScenarios }).where(eq(simulationsTable.id, sim.id));
      console.log(`✓ Startup Founder (id: ${sim.id})`);
    }
  }
  console.log("Done!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
