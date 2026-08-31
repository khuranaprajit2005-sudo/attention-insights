# Attention Insights

# PROJECT: AI SOCIAL ATTENTION ANALYZER — PROTOTYPE 1

## ROLE

Act as a senior product engineer, software architect, UX designer, conversion-focused product designer, QA engineer, and AI application developer with 20+ years of experience building consumer web applications.

You are building **Prototype 1** of a consumer-facing AI social-attention analysis web application.

This is NOT the production version.

The purpose of Prototype 1 is to validate:

1. The product concept
2. The user journey
3. The visual experience
4. The analysis/result experience
5. The conversion funnel
6. Whether the application architecture is sensible
7. Whether the application can later be connected to legitimate data sources, AI APIs, analytics, and payment processing

Do not over-engineer the prototype.

Prioritize:
**clarity → speed → mobile UX → realistic interaction → maintainability.**

---

# 1. CORE PRODUCT CONCEPT

The product is an AI-powered **Social Attention Analyzer**.

The user enters a social-media username and receives an entertaining personalized analysis showing an **Attention Score** and simulated attention/engagement signals.

The long-term product may use legitimate available social signals and authorized data sources.

For this prototype, DO NOT connect to Instagram APIs or scrape Instagram.

Use clearly separated **demo/mock data** so that the complete user experience can be tested safely.

Do NOT request Instagram passwords.

Do NOT create a fake Instagram login page.

Do NOT claim that Instagram provided private profile-visitor information.

Do NOT represent simulated data as verified Instagram profile visits.

---

# 2. TARGET AUDIENCE

Initial target:

Indian young adults who are highly active on Instagram and comfortable with Hindi/Hinglish.

The product should feel:

* fun
* slightly mysterious
* curiosity-driven
* social
* youthful
* mobile-first
* fast
* premium enough to justify a ₹99 purchase

Primary emotional themes:

* ex
* crush
* attention
* curiosity
* social popularity
* relationship interest

The initial marketing concept is inspired by the hook:

"Kya tumhari EX tumhe aaj bhi stalk karti hai? 👀"

However, the product itself should be positioned as an **AI Social Attention Analysis**, not as an official Instagram feature.

---

# 3. BRAND / VISUAL DIRECTION

Create a temporary brand identity.

Use the temporary product name:

**AttentionAI**

Do not treat this as the final brand name.

Design direction:

* modern
* premium
* youthful
* slightly mysterious
* highly mobile optimized
* strong visual hierarchy
* social-media-native aesthetic
* subtle dark/premium feel
* strong CTA buttons
* rounded cards
* smooth progress indicators
* tasteful gradients
* clean typography
* avoid excessive clutter

Do not copy the UI of Instagram.

Do not use Instagram's logo.

Do not imply affiliation with Meta or Instagram.

---

# 4. CORE USER JOURNEY

Build this complete clickable flow:

LANDING PAGE
↓
USERNAME INPUT
↓
ANALYSIS START
↓
ANALYSIS PROGRESS
↓
FREE RESULT
↓
PAYWALL
↓
CHECKOUT DEMO
↓
PAYMENT SUCCESS
↓
FULL REPORT
↓
SHARE RESULT

Every stage must work.

No dead buttons.

No placeholder buttons that appear functional but do nothing.

---

# 5. PAGE 1 — LANDING PAGE

Create a high-conversion landing page.

Hero section:

Large headline:

"KYA TUMHARI EX TUMHE AAJ BHI STALK KARTI HAI? 👀"

Supporting text:

"AI-powered social attention analysis se dekho kaun tumhari social presence par sabse zyada attention de raha hai."

Primary CTA:

"CHECK KARO 👀"

Below CTA, include a username input.

Placeholder:

"@username"

Add small supporting text:

"Username only — password ki zarurat nahi."

Include a secondary explanation:

"Get your personalized attention analysis in under a minute."

Do NOT claim that the system can access private profile-view history.

Add a small trust/safety note:

"Analysis is based on available signals and AI-generated interpretation."

---

# 6. LANDING PAGE SOCIAL PROOF

Create simulated prototype-only social proof.

Clearly code this as demo content, not factual customer claims.

Example:

"12,400+ analyses completed"

But mark this internally as demo data so it can easily be removed before production.

Add 3 small testimonial cards using fictional placeholder names.

Do not fabricate real celebrities or real users.

---

# 7. PAGE 2 — USERNAME SUBMISSION

When the user clicks "CHECK KARO":

Validate input.

Requirements:

* empty input → show error
* username without @ → automatically normalize it
* username with @ → accept it
* extremely long input → reject
* unsupported characters → show friendly error
* trim whitespace
* prevent duplicate submission while processing

Example:

User enters:

"Prajit"

System converts to:

"@prajit"

Button:

"START ANALYSIS"

---

# 8. PAGE 3 — ANALYSIS EXPERIENCE

Create an engaging analysis animation.

Do not make it misleading by claiming access to private Instagram data.

Use language such as:

"Preparing your AI attention analysis..."

Then show sequential steps:

✓ Profile input received

✓ Engagement signals prepared

✓ Attention patterns analyzed

✓ Social-interest model calculated

✓ AI report generated

Progress indicator:

0% → 100%

Use realistic timing.

Target total demo duration:

approximately 5–8 seconds.

The user should feel that something meaningful is happening.

Include a subtle animation.

After completion:

"YOUR REPORT IS READY 🔥"

CTA:

"SEE MY SCORE"

---

# 9. DEMO DATA ENGINE

Create a deterministic mock analysis engine for Prototype 1.

Do NOT randomly generate a completely different result every time for the same username.

Instead:

Normalize username.

Generate deterministic demo data based on the username.

For example:

@prajit should consistently return the same demo result.

Create a simple deterministic scoring system.

Overall Attention Score:

0–100.

Use these dimensions:

* Engagement
* Recency
* Interaction Frequency
* Consistency
* Attention Momentum

Weights:

Engagement = 25%

Recency = 20%

Interaction Frequency = 20%

Consistency = 15%

Attention Momentum = 20%

Calculate the final score using deterministic logic.

Clamp score between 0 and 100.

Never return NaN, Infinity, negative values, or values above 100.

---

# 10. FREE RESULT PAGE

Create a visually impressive result.

Headline:

"YOUR ATTENTION SCORE"

Large score:

"82/100"

Use a circular score visualization.

Below:

"🔥 High Attention"

Then show:

Engagement: 84/100

Recency: 78/100

Interaction Frequency: 81/100

Consistency: 76/100

Momentum: +23%

Then:

"WE FOUND 7 STRONG ATTENTION SIGNALS"

Do not say:

"We found 7 people who stalked you."

Instead use:

"We identified 7 strong attention signals in your demo analysis."

---

# 11. TOP ACCOUNTS SECTION

Display three fictional/demo accounts.

Example:

@ananya

Attention Score: 89

HIGH ATTENTION 🔥

@rahul

Attention Score: 81

HIGH ATTENTION 👀

@simran

Attention Score: 74

MEDIUM ATTENTION ❤️

These are demo identities only.

Make it visually obvious that this is prototype/demo data where necessary.

Do not claim these people actually visited the user's profile.

---

# 12. PAYWALL

After showing the free result, create a strong premium CTA.

Headline:

"THE INTERESTING PART IS STILL LOCKED 👀"

Subheadline:

"Unlock your complete AI Social Attention Report."

Show locked features:

🔒 Top attention signals

🔒 Detailed attention breakdown

🔒 Relationship-interest analysis

🔒 Attention momentum

🔒 Personalized AI explanation

🔒 Social attention type

Price:

₹99

CTA:

"UNLOCK FULL REPORT — ₹99"

Secondary small text:

"One-time purchase"

Do NOT create automatic recurring billing in Prototype 1.

---

# 13. DEMO PAYMENT FLOW

Do not connect a real payment gateway in Prototype 1.

Create a realistic payment simulation.

When the user clicks:

"UNLOCK FULL REPORT — ₹99"

open a checkout screen.

Show:

Product:
"Full AI Social Attention Report"

Price:
₹99

Payment options:

UPI

Card

Net Banking

Use simulated payment controls.

Primary button:

"PAY ₹99"

On click:

show:

"Processing payment..."

Then:

"Payment successful ✓"

Then unlock the full report.

Structure the code so a real Razorpay integration can later replace this demo payment layer without rebuilding the entire frontend.

---

# 14. FULL REPORT PAGE

Create a premium report.

Top:

"YOUR COMPLETE SOCIAL ATTENTION REPORT"

Overall:

82/100

Sections:

## 1. Attention Overview

Explain the score in human-readable language.

## 2. Attention Breakdown

Show:

Engagement
Recency
Frequency
Consistency
Momentum

Use clean visual bars.

## 3. Highest Attention Signals

Show top 3 demo accounts.

## 4. Relationship Interest

Create a demo score:

"74/100"

Explain that this is an AI interpretation of available/demo signals, not a verified psychological or relationship fact.

## 5. Attention Momentum

Example:

"+23%"

Explain:

"Your recent attention signals are trending upward in this demo analysis."

## 6. AI Personality/Attention Type

Example:

"THE MAGNET 🔥"

Description:

"You appear to generate stronger-than-average attention signals across your social circle."

Make this entertaining but clearly framed as an AI interpretation.

---

# 15. AI REPORT ARCHITECTURE

For Prototype 1, do not require a live external AI API.

Create a clean abstraction such as:

analyzeSignals()

→ calculateScore()

→ generateReport()

The report generator should be designed so that a real LLM API can replace the demo text generator later.

Do not hard-code the architecture in a way that makes future OpenAI integration difficult.

---

# 16. SHARE RESULT

At the end of the full report:

Headline:

"WANT TO SEE YOUR FRIEND'S SCORE? 👀"

Button:

"SHARE MY RESULT"

For Prototype 1, use a simulated share action.

Example result card:

"MY AI ATTENTION SCORE 🔥

82/100

Apparently people are paying attention 👀

Check yours."

Create buttons:

"Copy Result"

"Share"

For prototype purposes, Copy Result can copy the generated text if browser clipboard is available; otherwise provide a visible fallback.

---

# 17. MOBILE FIRST

This is extremely important.

At least 80% of expected traffic may come from mobile.

Design first for:

320px–430px widths.

Then adapt for desktop.

Test:

* 320px
* 375px
* 390px
* 430px
* desktop

No horizontal scrolling.

Buttons should be easy to tap.

Inputs should be at least comfortable mobile size.

---

# 18. ERROR STATES

Every important operation needs an error state.

Create friendly messages for:

* empty username
* invalid username
* analysis failure
* payment failure
* report loading failure
* unknown error
* network-style failure simulation

Never show raw:

"undefined"

"null"

"500"

or technical stack traces to users.

---

# 19. LOADING STATES

Every asynchronous-looking operation needs a loading state.

Examples:

"Analyzing..."

"Generating your report..."

"Processing payment..."

Do not allow multiple simultaneous submissions.

Disable relevant buttons while processing.

---

# 20. FRONTEND ARCHITECTURE

Use reusable components.

At minimum separate:

* Header
* Hero
* UsernameForm
* AnalysisProgress
* ScoreCard
* SignalCard
* AccountCard
* Paywall
* Checkout
* ReportSection
* ShareCard
* ErrorMessage

Do not put the entire application into one massive component.

Use clean component structure.

---

# 21. BACKEND ARCHITECTURE

For Prototype 1 create a clean conceptual backend/service layer.

Separate:

* input validation
* scoring logic
* demo data generation
* report generation
* payment simulation
* user state

The architecture should later allow:

Demo Data Source

to be replaced with:

Legitimate Data Source / Authorized API

without rewriting the entire application.

---

# 22. DATABASE ARCHITECTURE

For Prototype 1, database integration is optional if unnecessary.

If using Supabase, create a simple structure that can later support:

users

analyses

reports

payments

events

Suggested fields:

users:
id
username
created_at

analyses:
id
user_id
score
status
created_at

reports:
id
analysis_id
report_data
created_at

payments:
id
analysis_id
amount
status
provider
created_at

Do not store unnecessary sensitive information.

---

# 23. PAYMENT ARCHITECTURE

Even though Prototype 1 uses a simulated payment, create the conceptual flow correctly:

User clicks purchase

→ checkout created

→ payment initiated

→ payment result

→ backend verifies payment status

→ payment record stored

→ report entitlement unlocked

Do NOT make "frontend payment success" alone responsible for unlocking production access.

Structure the code so real payment verification can later happen server-side.

---

# 24. ANALYTICS ARCHITECTURE

Create event hooks for:

landing_view

username_submitted

analysis_started

analysis_completed

free_result_viewed

checkout_started

payment_started

payment_success

report_viewed

share_clicked

For Prototype 1 these can be logged locally or through a simple analytics abstraction.

Structure them so PostHog can later be connected easily.

---

# 25. SECURITY REQUIREMENTS

Even for the prototype:

* Never expose secret API keys in frontend code.
* Never place future OpenAI API keys in client-side code.
* Never put payment secrets in frontend code.
* Validate all user input.
* Sanitize displayed usernames.
* Do not trust client-side payment status.
* Do not expose one user's report to another user.
* Do not collect Instagram passwords.
* Do not create credential collection functionality.

---

# 26. PERFORMANCE

The landing page should feel fast.

Avoid:

* unnecessary libraries
* huge images
* unnecessary animations
* excessive dependencies

Keep the initial bundle lightweight.

Optimize for mobile networks.

---

# 27. CODE QUALITY

Use:

* TypeScript
* clean naming
* reusable functions
* modular components
* comments only where useful
* no duplicated logic
* no unnecessary complexity

Do not generate fake backend endpoints that aren't used.

Do not leave dead code.

Do not leave unused imports.

Do not leave console errors.

---

# 28. QA REQUIREMENT

Before considering Prototype 1 complete, perform a self-test.

Test the entire flow:

1. Open landing page
2. Enter valid username
3. Start analysis
4. Wait for completion
5. View score
6. View teaser results
7. Click unlock
8. Complete demo payment
9. Verify full report unlocks
10. Refresh
11. Verify correct state
12. Return/back navigation
13. Test invalid username
14. Test empty username
15. Test mobile layout
16. Test desktop layout
17. Test duplicate clicks
18. Test payment failure
19. Test analysis failure
20. Test share functionality

Fix all obvious issues before reporting completion.

---

# 29. CRITICAL PRODUCT PRINCIPLE

The application should feel **highly engaging**, but it must not rely on pretending that we have access to secret Instagram profile-view data.

The long-term product value should come from:

**available/authorized signals**

*

**deterministic scoring**

*

**AI interpretation**

*

**excellent UX**

The provocative marketing angle can be tested separately from the underlying product claims.

---

# 30. DO NOT BUILD YET

Do NOT implement:

* Instagram scraping
* Instagram password collection
* fake Instagram login
* private profile access
* fake verified profile-visitor data
* real payment gateway
* subscription billing
* complex authentication
* native iOS app
* native Android app
* referral backend
* production advertising integration

These belong to later phases.

---

# 31. SUCCESS CRITERIA FOR PROTOTYPE 1

Prototype 1 is successful if:

### UX

A first-time user understands the product within 5 seconds.

### Functionality

The complete flow works from landing → analysis → result → demo payment → full report.

### Design

It looks credible, polished, modern and mobile-first.

### Architecture

Frontend, business logic, scoring, payment simulation and analytics are reasonably separated.

### Maintainability

Another developer can understand the structure without rewriting the entire project.

### Conversion

The user has a clear reason to continue from free result to ₹99 report.

---

# 32. IMPORTANT: AFTER BUILDING

Do NOT simply say:

"App complete."

Instead produce a **Prototype 1 Demo Report** with:

## PRODUCT

What was built

## USER FLOW

What works

## FRONTEND

Passed / Failed

## BACKEND

Passed / Failed

## API/SERVICE LAYER

Passed / Failed

## DATABASE

Passed / Failed

## PAYMENT

Passed / Failed

## ANALYTICS

Passed / Failed

## SECURITY

Passed / Failed

## MOBILE

Passed / Failed

## BUGS

List every known issue.

## TECHNICAL DEBT

List shortcuts taken for the prototype.

## NEXT STEPS

List only the highest-priority next actions.

Give each area:

🟢 PASS
🟡 NEEDS WORK
🔴 FAIL

Do not hide problems.

---

# FINAL INSTRUCTION

Build Prototype 1 now.

Prioritize a polished, realistic, fully clickable experience over adding unnecessary features.

If a requested feature cannot be implemented safely or cleanly in the prototype, create the cleanest mock implementation and explicitly document the limitation in the Demo Report.

Do not ask unnecessary clarification questions.

Start by creating the application structure and implement the complete user journey.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ba28097d-0415-4d76-8982-44c90afc954d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
