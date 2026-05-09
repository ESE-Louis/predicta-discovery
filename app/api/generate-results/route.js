// app/api/generate-results/route.js

import Anthropic from "@anthropic-ai/sdk";

// ─────────────────────────────────────────────────────────────
// INDUSTRY BENCHMARK LIBRARY
// Curated data on AI adoption, revenue patterns, gaps, and
// market context by industry. Used to ground analysis in real
// sector-specific intelligence rather than generic advice.
// ─────────────────────────────────────────────────────────────

const INDUSTRY_BENCHMARKS = {

  "financial_services": {
    keywords: ["financial services", "finance", "wealth", "wealth management", "fintech", "financial planning", "investment", "superannuation", "super", "netwealth", "insurance", "banking", "mortgage", "lending", "credit", "fund management", "asset management", "stockbroking", "financial advice", "cfp", "afsl"],
    data: `
INDUSTRY BENCHMARKS — Financial Services & Wealth Management

AI Revenue Adoption (2024-2025):
- Leading Australian wealth platforms (Netwealth, HUB24, Praemium) are investing heavily in AI-powered client engagement and adviser productivity tools
- Early-adopter advice firms using AI for client meeting prep and portfolio commentary report 25-40% more client interactions per adviser per week
- AI-generated SOAs and review documents: firms trialling this are cutting document turnaround from 4-5 days to same-day, enabling more reviews per adviser
- Firms using AI for proactive client outreach (birthday, market event, threshold triggers) report 15-25% improvement in client retention and 20-30% uplift in referral rates

Revenue Gaps in the Industry Right Now:
- Average Australian advice firm leaves 30-40% of their client book under-serviced (B and C clients who don't get proactive contact)
- Referral programs exist at most firms but fewer than 20% have systematic follow-up — AI can automate this entire workflow
- Data monetisation: most firms collect rich client behavioural and portfolio data but sell nothing from it — peer benchmarks, market insights, and financial health scores are emerging revenue products
- Mid-market client segment ($500K–$2M investable assets) is underserved by most boutique advice firms — AI enables serving this segment profitably at scale
- Insurance attachment rates remain below 30% at most advice businesses — AI can identify protection gaps and prompt conversation at the right moment

Industry-Specific Metrics to Reference:
- FUA (Funds Under Advice/Administration): revenue driver, typically 0.5-1.1% per annum
- BDM capacity: most firms have 1-2 BDMs servicing 80-150 advisers — AI can multiply touchpoints without adding headcount
- Client-to-adviser ratio: industry average 80-120:1; top performers using AI tools are managing 150-200:1 profitably
- Revenue per client: industry average $3,000-$8,000 per annum depending on segment
- Referral conversion: average advice firm converts 40-60% of warm referrals; AI follow-up lifts this to 65-80%

Regulatory Context (Australia):
- ASIC's focus on "good client outcomes" and the Quality of Advice Review create commercial incentive to demonstrate proactive client engagement — AI provides the audit trail
- AFSL obligations around review frequency create systematic demand for AI-assisted scheduling and documentation
- Open Banking/CDR data is now available — firms that build AI tools on top of this data have a genuine first-mover revenue advantage

Competitive Pressure:
- Digital advice platforms (Six Park, Stockspot, Vanguard Personal Investor) are capturing the self-directed segment — traditional firms must move up-market AND serve mid-market at scale
- Accounting firms (Deloitte Private, mid-tier firms) are expanding into advice and using AI to make it profitable at lower AUM thresholds
- The firms that will win the next decade are those that use AI to make advice scalable, not just more efficient
`
  },

  "professional_services": {
    keywords: ["professional services", "consulting", "management consulting", "strategy consulting", "accounting", "accountant", "audit", "tax", "legal", "law", "law firm", "recruitment", "executive search", "staffing", "hr consulting", "advisory", "business advisory", "engineering consulting", "it consulting", "technology consulting"],
    data: `
INDUSTRY BENCHMARKS — Professional Services

AI Revenue Adoption (2024-2025):
- Top-tier consulting firms (McKinsey, Deloitte, KPMG) have deployed AI tools that allow consultants to produce first-draft deliverables 3-5x faster — they are now competing for engagements previously out of scope on price
- Mid-market Australian consulting firms using AI for proposal generation report win rates improving 15-25% due to faster, higher-quality responses
- Legal firms using AI for contract review and matter summaries are taking on 30-40% more matters per lawyer — turning away work is becoming less common
- Accounting firms that have productised AI-assisted advisory (cash flow forecasting, scenario modelling, tax optimisation alerts) are generating $800–$2,000 per client per year in additional advisory revenue

Revenue Gaps Right Now:
- Most consulting and advisory firms have significant IP locked in past deliverables — reports, frameworks, models — that could be packaged as subscription products or licensed
- Client onboarding is typically manual and slow — AI can compress this, enabling more engagements per year without adding senior headcount
- Most firms lose 20-35% of warm prospects due to slow proposal turnaround (3-7 days) — AI can cut this to hours
- Recurring revenue is rare in project-based professional services — AI-powered "always-on advisory" retainers are emerging as a category
- Data and benchmarks produced through client engagements are routinely discarded — anonymised and aggregated, these are highly valuable to other clients and the broader market

Industry-Specific Metrics:
- Utilisation rate: billable hours as % of available hours; industry average 65-75%, top performers 80-85%
- Realisation rate: fees collected vs fees billed; typically 85-92%
- Revenue per fee earner: varies widely, $250K–$600K in mid-market Australian firms
- Average project size and pipeline conversion: typically 25-35% of qualified proposals convert
- Retainer/recurring revenue %: most mid-market firms below 20%; firms above 40% trade at significantly higher multiples

Competitive Pressure (Australia):
- Big-4 and second-tier firms are using AI to compete on speed and scope at price points previously owned by boutiques
- Boutique firms that don't productise their IP will be squeezed — AI is the mechanism to turn expertise into scalable revenue
- Clients are increasingly expecting real-time insight, not quarterly reports — firms delivering this via AI tools are winning renewals and referrals
`
  },

  "saas": {
    keywords: ["saas", "software", "software as a service", "technology", "tech", "platform", "app", "application", "product", "b2b software", "cloud", "api", "developer tools", "marketplace", "proptech", "edtech", "healthtech", "hr tech", "martech", "legaltech"],
    data: `
INDUSTRY BENCHMARKS — SaaS & Software

AI Revenue Adoption (2024-2025):
- SaaS companies embedding AI features are seeing 20-40% improvement in activation rates and 15-25% reduction in churn — directly impacting ARR growth
- AI-powered in-product recommendations and usage nudges are driving expansion revenue without additional sales headcount — NRR improvements of 10-20 percentage points reported
- Conversational AI for onboarding and support is enabling SaaS companies to serve 3-5x more users without scaling customer success teams
- Companies using AI for usage-based upsell triggers (identifying accounts approaching limits or showing expansion signals) report 25-40% more expansion revenue per CSM

Revenue Gaps Right Now:
- Most SaaS companies have rich product usage data they don't monetise — benchmarking dashboards, industry comparisons, and usage insights are emerging as premium tier features
- Free-to-paid conversion is typically 2-5% for PLG companies; AI-driven personalised conversion sequences are lifting this to 6-12%
- Win-back of churned customers: most SaaS companies have no systematic approach; AI can identify re-engagement windows and automate personalised outreach
- Partner and integration channel is under-leveraged at most mid-market SaaS companies — AI can qualify and activate partners at scale
- Geographic expansion: most Australian SaaS companies have a larger addressable market than they're pursuing; AI removes the cost barrier to entering new regions

Industry-Specific Metrics:
- ARR and MRR: primary revenue metric
- NRR (Net Revenue Retention): best-in-class >120%; average 100-110%
- CAC and LTV:CAC ratio — should be 3:1 or higher for sustainable growth
- Churn rate: B2B SaaS average 5-7% annually; top performers <3%
- Expansion revenue %: best-in-class companies derive 30-50% of new ARR from existing customers
- Time to value: days from signup to first meaningful outcome; directly correlated with retention

Competitive Pressure:
- AI-native competitors are entering every SaaS category — incumbents that don't embed AI into their product and GTM will lose market share rapidly
- Buyers now expect AI features as table stakes, not premium add-ons
- The window to build a defensible AI data moat (trained on your customers' usage patterns) is open now but closing fast
`
  },

  "real_estate": {
    keywords: ["real estate", "property", "real estate agency", "real estate agent", "property management", "commercial property", "residential", "development", "developer", "proptech", "buyers agent", "mortgage broker", "conveyancing", "strata"],
    data: `
INDUSTRY BENCHMARKS — Real Estate & Property

AI Revenue Adoption (2024-2025):
- Leading Australian real estate agencies using AI for automated property appraisals and market reports are generating 30-50% more vendor leads with the same BDM headcount
- AI-powered nurture sequences for off-market buyer lists: agencies report converting 15-25% of dormant buyer contacts that previously went cold
- Property management firms using AI for tenant communication and maintenance coordination are managing 20-30% more properties per property manager
- Mortgage brokers using AI for lead qualification and pre-approval preparation report handling 40% more applications per month

Revenue Gaps Right Now:
- Most agencies have large CRM databases of past buyers, vendors, and enquiries that receive zero proactive outreach — AI can re-engage these at scale
- Market reports and suburb intelligence are produced internally but rarely monetised — packaged as a subscription for investors and developers, these have real commercial value
- Off-market deal flow: most agencies match buyers and sellers manually and slowly — AI can systematically match buyer criteria to vendor situations in real time
- Commercial property: tenant retention is critical but proactive relationship management is rare — AI can systematise touch points before lease expiry
- Property developers are sitting on large data sets about buyer preferences, settlement timing, and upgrade patterns that could drive referral and resale revenue

Industry-Specific Metrics:
- GCI (Gross Commission Income): primary revenue metric for agencies
- List-to-sale conversion rate and days on market
- Property management: income per property manager; industry average 120-150 properties per PM
- Buyer enquiry to sale conversion: typically 8-15% for residential
- Vendor referral rate: top performing agents generate 40-60% of listings from past clients and referrals

Competitive Pressure (Australia):
- REA Group and Domain are using AI to shift value toward their platforms and away from traditional agencies
- Agencies that own the client relationship with AI-powered ongoing engagement will be more defensible than those that rely on transactional volume
- PropTech platforms are unbundling agency services — AI is how traditional agencies bundle them back together more profitably
`
  },

  "healthcare": {
    keywords: ["healthcare", "health", "allied health", "medical", "clinic", "hospital", "pharmacy", "dental", "physio", "physiotherapy", "psychology", "mental health", "aged care", "disability", "ndis", "gp", "specialist", "pathology", "radiology", "telehealth", "health tech", "healthtech", "wellness"],
    data: `
INDUSTRY BENCHMARKS — Healthcare & Allied Health

AI Revenue Adoption (2024-2025):
- Allied health practices using AI for appointment optimisation and gap-fill are recovering 15-25% of previously lost revenue from cancellations and no-shows
- Psychology and mental health practices using AI-assisted intake and outcome measurement are able to take on 20-30% more patients with the same clinical hours
- Telehealth providers using AI for triage and pre-consultation preparation are increasing consultation throughput by 25-35%
- NDIS providers using AI to streamline plan management and service delivery reporting are reducing admin time by 40% — freeing capacity to serve more participants

Revenue Gaps Right Now:
- Most healthcare businesses have high patient/client attrition between episodes of care — AI-powered re-engagement and preventative check-in programs recover this revenue
- Group programs and digital health products are underutilised in most practices — AI can identify which patients are appropriate and automate enrolment
- NDIS plan utilisation: the average NDIS participant uses only 65-70% of their plan funding — providers that help participants utilise more of their funding retain them and grow revenue
- Healthcare data is extraordinarily rich but rarely monetised — anonymised population health insights, benchmarks, and outcome data are valuable to insurers, employers, and government
- Referral networks are relationship-driven and largely manual — AI can systematise referral tracking and reciprocal referral opportunities

Industry-Specific Metrics:
- Revenue per clinical hour (utilisation): maximising billable hours is the primary lever
- New patient acquisition cost and lifetime value
- NDIS: average plan value, plan utilisation rate, participant retention
- Cancellation and no-show rate: industry average 15-20%; AI-driven reminders and engagement typically reduce this to 5-8%
- Referral source tracking: most practices can't accurately attribute referrals — AI fixes this and enables systematic referral cultivation

Regulatory Context (Australia):
- My Health Record and interoperability mandates are creating new data assets that forward-thinking providers can use for AI-powered care coordination
- Medicare compliance requirements create demand for AI-assisted clinical documentation
- NDIS Quality and Safeguards Commission requirements are driving demand for better outcome tracking — AI provides this while generating billable evidence
`
  },

  "retail": {
    keywords: ["retail", "ecommerce", "e-commerce", "online store", "consumer goods", "fmcg", "fashion", "apparel", "beauty", "cosmetics", "food and beverage", "f&b", "hospitality", "restaurant", "cafe", "wholesale", "distribution", "consumer products", "d2c", "direct to consumer"],
    data: `
INDUSTRY BENCHMARKS — Retail & eCommerce

AI Revenue Adoption (2024-2025):
- Australian eCommerce brands using AI for personalised product recommendations report 20-35% uplift in average order value and 15-25% improvement in repeat purchase rate
- AI-powered dynamic pricing in retail: early adopters are generating 8-15% revenue uplift with minimal margin impact
- Retailers using AI for demand forecasting are reducing stockouts by 30-40% — directly recovering revenue that was previously lost to out-of-stock situations
- Loyalty program personalisation via AI: brands using behavioural triggers rather than blanket promotions report 40-60% better program engagement and 25% higher redemption-to-purchase conversion

Revenue Gaps Right Now:
- Most retailers have large pools of lapsed customers who haven't purchased in 6-18 months — AI win-back sequences with personalised offers typically recover 10-15% of this segment
- Subscription and auto-replenishment models are underutilised in categories where they naturally fit (consumables, supplements, pet food, beauty) — AI identifies ideal candidates and triggers enrolment
- Wholesale and B2B channel: most retailers with B2B capability don't proactively develop it — AI can identify and target business buyers from existing transaction data
- Marketplace expansion (Amazon AU, Catch, international): AI can identify which SKUs have the best cross-platform potential and optimise listings automatically
- Post-purchase experience is largely untouched — AI-powered follow-up driving reviews, referrals, and upsells is a significant unrealised revenue stream

Industry-Specific Metrics:
- AOV (Average Order Value) and units per transaction
- Repeat purchase rate and purchase frequency
- Customer LTV and payback period
- Conversion rate: eCommerce average 1.5-3%; AI personalisation typically lifts this to 3-5%
- Cart abandonment rate: industry average 70%; AI recovery sequences capture 5-15% of these
- Return rate and its impact on net revenue
`
  },

  "recruitment": {
    keywords: ["recruitment", "recruiting", "talent acquisition", "executive search", "staffing", "labour hire", "hr", "human resources", "people and culture", "workforce", "headhunting", "talent management"],
    data: `
INDUSTRY BENCHMARKS — Recruitment & Talent

AI Revenue Adoption (2024-2025):
- Recruitment agencies using AI for candidate sourcing and matching are filling roles 40-60% faster — enabling more placements per consultant per quarter
- AI-powered talent pipelining: firms maintaining AI-curated talent communities are winning more retained search mandates because they can demonstrate pre-existing candidate access
- Executive search firms using AI for market mapping and competitor intelligence are winning pitch processes against larger firms by demonstrating deeper insight faster
- Recruitment firms using AI for client relationship management (tracking hiring patterns, predicting when clients will next hire) report 20-30% improvement in account revenue

Revenue Gaps Right Now:
- Most agencies have large candidate databases that are actively decaying — AI re-engagement of dormant candidates regularly surfaces placed candidates who are now open to moving (and their employers become new clients)
- Contractor and temp desks are under-leveraged at most agencies — AI can identify permanent placement clients who would benefit from flex workforce solutions
- Salary benchmarking and workforce insights are produced internally but rarely sold — packaged as a subscription for HR teams, this data has significant commercial value
- Most agencies lose 30-40% of placed candidates within 12 months of placement — AI-powered aftercare programs that retain placements directly protect fee income and reduce clawback risk
- Outplacement and career transition services are adjacent revenue streams most traditional recruiters don't offer — AI makes delivering these at scale viable

Industry-Specific Metrics:
- Revenue per consultant (target typically $400K–$800K in permanent recruitment)
- Fill rate and time-to-fill: directly correlates with revenue per consultant
- Perm fee as % of salary: typically 15-25%; retained search commands 25-33%
- Contractor book size and gross profit per contractor
- Client concentration risk: over-reliance on top 3-5 clients is common and dangerous
`
  },

  "media_marketing": {
    keywords: ["marketing", "advertising", "media", "digital marketing", "agency", "creative agency", "pr", "public relations", "social media", "content", "seo", "sem", "performance marketing", "brand", "communications", "events", "sponsorship"],
    data: `
INDUSTRY BENCHMARKS — Marketing, Media & Advertising

AI Revenue Adoption (2024-2025):
- Marketing agencies using AI for content production are delivering 3-5x more content output per creative — enabling them to pitch and win larger retainers or serve more clients
- Performance marketing agencies using AI for campaign optimisation are demonstrating 20-40% better ROAS for clients — becoming stickier and commanding premium fees
- PR firms using AI for media monitoring and journalist relationship management are pitching more stories with higher placement rates — a direct driver of client retention and referrals
- Digital agencies that have productised AI tools (white-labelled reporting dashboards, AI content calendars, automated competitor analysis) are generating $500–$2,000/month per client in SaaS-like recurring revenue

Revenue Gaps Right Now:
- Most agencies are still selling time, not outcomes — AI enables the shift to performance-based and outcome-based pricing, which dramatically improves revenue ceiling
- First-party data collected through campaigns is usually returned to clients or discarded — aggregated and anonymised, this is a valuable media and benchmarking asset
- Smaller clients (under $5K/month) are uneconomical to service manually — AI makes a mid-market client segment suddenly profitable
- Agencies with strong creative IP (brand frameworks, campaign playbooks, methodology) are not licensing or productising it — these could generate revenue independently of client services
- Most agencies have poor revenue visibility beyond the current month — AI-powered pipeline and renewal forecasting enables more confident hiring and investment decisions

Industry-Specific Metrics:
- Revenue per head: typically $120K–$200K in Australian mid-market agencies
- Retainer vs project revenue mix: retainer-heavy agencies are more valuable and stable
- Client churn and average client tenure: industry average tenure 18-24 months; top agencies retain clients 3-5+ years
- Pitch win rate: typically 20-35%; AI-assisted proposals are lifting this at the best agencies
- Gross margin: typically 40-55% for service businesses of this type
`
  },

  "education": {
    keywords: ["education", "edtech", "training", "learning", "university", "school", "tafe", "vocational", "rto", "registered training", "corporate training", "e-learning", "online learning", "coaching", "tutoring", "professional development", "certification"],
    data: `
INDUSTRY BENCHMARKS — Education & Training

AI Revenue Adoption (2024-2025):
- RTOs and training providers using AI for personalised learning pathways report 25-35% improvement in course completion rates — directly impacting government funding outcomes and student satisfaction scores that drive referrals
- Corporate training firms using AI to customise content delivery for each client are winning larger enterprise contracts and longer-term partnerships
- Online education platforms using AI for adaptive learning and at-risk student identification are reducing dropout rates by 20-30%, protecting recurring revenue
- EdTech companies embedding AI tutors and practice tools are seeing 40-60% improvement in learner engagement metrics — reducing churn and increasing upsell to advanced content

Revenue Gaps Right Now:
- Most training organisations have extensive content libraries that are significantly undermonetised — AI can package and distribute this content at marginal cost to new segments and geographies
- Alumni networks are almost universally neglected — AI-powered alumni engagement drives referrals, creates communities, and enables premium continuing education revenue
- Corporate/B2B channel: most education businesses are consumer-focused but have significant untapped enterprise opportunity — AI makes corporate training customisation viable at scale
- Micro-credentialing and stackable qualifications are growing demand — AI enables providers to rapidly build and personalise these at lower cost than traditional curriculum development
- International student pipeline (especially Southeast Asia) is a major revenue opportunity for Australian education providers — AI enables personalised outreach and support at scale

Industry-Specific Metrics:
- Revenue per enrolled student and LTV
- Completion rate: directly impacts funding, NPS, and referrals
- B2B vs B2C revenue mix
- Cost per enrolment and conversion rate from enquiry
- Government funding as % of revenue (and risk concentration)
`
  },

  "manufacturing": {
    keywords: ["manufacturing", "supply chain", "logistics", "distribution", "industrial", "engineering", "construction", "building", "infrastructure", "mining", "resources", "agriculture", "agtech", "food manufacturing", "packaging"],
    data: `
INDUSTRY BENCHMARKS — Manufacturing, Supply Chain & Industrial

AI Revenue Adoption (2024-2025):
- Australian manufacturers using AI for demand forecasting and inventory optimisation are recovering 8-15% of revenue previously lost to stockouts or overstock write-downs
- Industrial businesses using AI for predictive maintenance are offering this as a premium service contract to customers — converting one-off equipment sales into recurring service revenue
- Supply chain businesses using AI for route and load optimisation are taking on 15-25% more volume with existing fleet — a direct revenue multiplier
- Engineering firms embedding AI into design and specification processes are winning more bids by responding faster and demonstrating more rigorous analysis

Revenue Gaps Right Now:
- Most manufacturers sell products but not outcomes — AI enables shift to outcome-based contracts (pay per unit of output, pay per uptime) which dramatically increases customer LTV
- Service and maintenance businesses typically have poor visibility into when customers will need their next intervention — AI predictions enable proactive outreach that competitors miss
- Sustainability and carbon reporting is becoming a purchasing criterion for large corporate and government buyers — AI-powered emissions tracking and reporting is an emerging service revenue stream
- Export market development: most Australian manufacturers significantly under-index on export despite strong product quality — AI enables targeted international BD at fraction of traditional cost
- Data from connected equipment (IoT) is routinely collected but almost never monetised — industry benchmarks, performance comparisons, and predictive insights from this data are valuable

Industry-Specific Metrics:
- Revenue per employee and revenue per shift
- Capacity utilisation: most manufacturers operate at 70-80%; AI helps push this to 85-90%+
- Service contract attachment rate: typically 40-60% of equipment sales; AI can lift this significantly
- Gross margin by product line: AI identifies where pricing power exists
- Customer concentration: losing one large customer is existential for many manufacturers
`
  }
};

// ─────────────────────────────────────────────────────────────
// Match user's industry input to the closest benchmark category
// ─────────────────────────────────────────────────────────────
const BENCHMARK_LABELS = {
  financial_services: "Financial Services & Wealth Management",
  professional_services: "Professional Services",
  saas: "SaaS & Software",
  real_estate: "Real Estate & Property",
  healthcare: "Healthcare & Allied Health",
  retail: "Retail & eCommerce",
  recruitment: "Recruitment & Talent",
  media_marketing: "Marketing, Media & Advertising",
  education: "Education & Training",
  manufacturing: "Manufacturing & Supply Chain",
};

function getIndustryBenchmark(industryInput) {
  if (!industryInput) return { data: null, label: null };
  const lower = industryInput.toLowerCase();

  for (const [key, benchmark] of Object.entries(INDUSTRY_BENCHMARKS)) {
    if (benchmark.keywords.some(kw => lower.includes(kw) || kw.includes(lower))) {
      return { data: benchmark.data, label: BENCHMARK_LABELS[key] };
    }
  }
  return { data: null, label: null };
}

const BASE_SYSTEM_PROMPT = `You are an expert AI revenue strategist with deep knowledge of how AI is being applied across industries globally to generate new revenue. Analyse this self-serve discovery to identify where AI can generate NEW revenue — not reduce costs or headcount. The person completed this themselves.

Use the industry benchmark data provided (where available) to make your analysis sharper and more credible:
- Compare their situation against what leading and lagging businesses in their industry are actually doing with AI
- Identify where they sit relative to industry benchmarks — are they ahead, behind, or missing a category entirely?
- Surface revenue gaps that are proven in their industry but absent from their current approach
- Use industry-specific language, metrics, and revenue models in your output
- Factor in their geography — maturity of AI adoption, regulatory context, and local competitive dynamics

Return ONLY valid JSON. No preamble, no markdown fences.

{
  "executiveSummary": "2-3 sentences synthesising the most important revenue insight. Reference specific things they said AND benchmark them against their industry. Address them directly as 'you'. Be concrete and specific.",
  "opportunities": [
    {
      "title": "Short punchy opportunity name (4-7 words)",
      "type": "New Revenue | Revenue Recovery | Market Expansion | Retention & Expansion",
      "score": <integer 60-95>,
      "headline": "One sentence capturing the opportunity in their language, addressing them as 'you'",
      "description": "2-3 sentences explaining what the AI solution looks like, why it fits their situation, and how it compares to what other businesses in their industry are doing. Use 'you/your'.",
      "immediacy": "One sentence on why now is the right moment — reference industry timing, what competitors are doing, or market conditions in their geography",
      "effort": "Low | Medium | High",
      "timeToRevenue": "e.g. 60-90 days"
    }
  ],
  "biggestRisk": "The single most important thing that could prevent them capturing these opportunities. Reference industry-specific barriers where relevant. Use 'you'.",
  "recommendedFirstMove": "One concrete action they should take in the next 30 days. Specific and actionable, grounded in what works in their industry. Use 'you'.",
  "closingThought": "1-2 sentences that land the insight — make it feel like a revelation specific to their industry position and geography, not a generic summary."
}

Return 2-4 opportunities ranked by score. Revenue generation only. Never mention cost reduction or headcount reduction.`;

export async function POST(request) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { answers, resolvedQuestions, name, company, industry, geography, businessDescription, websiteContent } = await request.json();

    const qaBlock = resolvedQuestions
      .filter((q) => answers[q.id])
      .map((q) => `Q: ${q.resolvedText || q.text}\nA: ${answers[q.id]}`)
      .join("\n\n");

    // Match industry to benchmark data
    const { data: benchmarkData, label: benchmarkLabel } = getIndustryBenchmark(industry);

    const contextBlock = [
      `Name: ${name || "Unknown"}`,
      `Company: ${company || "Unknown"}`,
      `Industry: ${industry || "Unknown"}`,
      `Geography: ${geography || "Unknown"}`,
      `Business: ${businessDescription || "Unknown"}`,
      websiteContent ? `\nWebsite content (homepage extract):\n${websiteContent.slice(0, 3000)}` : null,
      benchmarkData ? `\n--- INDUSTRY BENCHMARK DATA ---\n${benchmarkData}\n--- END BENCHMARK DATA ---` : null,
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: BASE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${contextBlock}\n\n${qaBlock}`,
        },
      ],
    });

    const raw = message.content.map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found in response");

    const results = JSON.parse(clean.slice(start, end + 1));
    // Attach benchmark metadata so the frontend can display it
    if (benchmarkLabel) results._benchmarkLabel = benchmarkLabel;
    return Response.json(results);
  } catch (error) {
    console.error("generate-results error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
