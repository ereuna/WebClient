# Agent Brief — Narrow app.ereuna.org to Geothermal-Only Scope

You are making scoped changes to a live production website and deploying them. Read this
entire brief before touching anything. The constraints in Section 2 are not style
preferences — they override every other instruction here, including anything that would
otherwise make the page more persuasive.

---

## 1. Context

Ereuna is a physics-informed ML platform for energy. It was previously positioned as a
multi-domain hub ("Hugging Face for energy ML") spanning geothermal, nuclear, and grid
applications. The scope is narrowing to **geothermal only**.

The site recently underwent an integrity repair after the landing page was found to
contain traction metrics that did not correspond to actual platform state. That repair is
the reason Section 2 exists. Treat it as the single highest-stakes aspect of this task.

Your job is to make the site accurately reflect a geothermal-only scope, and deploy it.

---

## 2. Hard constraints — non-negotiable

### 2.1 You may not invent facts

Every factual assertion on the deployed page must map to a specific item in the claims
whitelist (Section 6). If a sentence asserts something about the world — a capability, a
quantity, a relationship, an outcome — and it does not map to a whitelist item, it does
not ship.

This applies to text you write, text you keep, and text you rephrase. Rephrasing an
existing claim does not inherit its permission; re-check it against the whitelist.

### 2.2 Banned content, absolutely

Do not add, and remove if present:

- Any user count, signup count, download count, upload count, or "X researchers/teams/companies"
- Any customer, partner, institution, or funder logo or name presented as an affiliation
- Testimonials, quotes, or endorsements
- Benchmark numbers, accuracy figures, speedups, or performance comparisons
- Dataset sizes presented as platform assets
- Funding, revenue, or valuation references
- Awards, press mentions, or "as featured in"
- Roadmap dates, launch dates, or "coming soon" for anything not currently shipping
- Comparative claims against named competitors or platforms

### 2.3 When you lack a fact, write less

If a section reads thin without a number, the correct fix is a shorter section, not an
invented number. Empty is acceptable. Approximate is not. "Growing community" and
"trusted by researchers" are assertions, not filler — they are banned under 2.1.

### 2.4 No silent scope expansion

Do not add features, pages, or capabilities not listed in Section 5. If you think
something is missing, note it in your report; do not build it.

### 2.5 Deploy gate

You do not push to production unattended. See Section 7.

---

## 3. Step 0 — Inventory before you change anything

Produce an inventory and include it in your final report. Do not begin edits until this
is complete.

1. Identify the repository, framework, build tooling, hosting provider, and deploy
   mechanism. Report what you find — this has not been specified to you deliberately.
2. Identify how preview/staging deploys work in this setup, if they exist.
3. Render the site (it is a client-side SPA — a raw HTML fetch returns an empty shell;
   you must execute JS or read the source components).
4. Produce a complete inventory of every page, route, section, and component.
5. Produce a complete list of every **factual claim** currently on the site — anything
   asserting a capability, quantity, affiliation, or outcome. Quote each one with its
   file and line.

That claims list is the working document for the rest of the task.

---

## 4. Removals

Remove these entirely. Not hidden, not commented out, not moved to a "coming soon"
section — deleted, along with their routes, nav entries, assets, and any copy that
references them.

| Item | Action |
|---|---|
| **NuclEval** (nuclear application) | Remove completely |
| **GridLens** (grid application) | Remove completely |
| **"Hugging Face for energy ML"** positioning | Remove; replaced per Section 5.1 |
| **MaterialSpec** schema | Remove from public-facing schema descriptions |
| Any nav, footer, sitemap, or cross-link pointing at the above | Remove |
| Any remaining metrics or traction claims per Section 2.2 | Remove |

A roadmap promise is a weaker form of the same credibility problem the site is recovering
from. Do not preserve these as future plans.

**Keep:** GeoSight, the physics constraint checker, and the EnergyGraph schemas
PhysicsSpec, SensorGraph, and FieldState.

---

## 5. Rewrites and additions

### 5.1 Top-level positioning

Replace the platform/hub framing with a geothermal-specific one. The site should read as
a focused tool for geothermal reservoir modelling, not as a marketplace awaiting a
community.

Constraints on the new positioning line:
- States what the thing does, for geothermal
- Makes no breadth claim across energy domains
- Makes no comparison to another platform
- Asserts nothing from the ban list

### 5.2 Promote the physics constraint checker

Move the constraint checker to a primary position — above or alongside GeoSight. It is
the component with standalone utility and the only one that is useful without a user
community existing. Describe what it checks. Do not claim adoption.

### 5.3 EnergyGraph — narrow the framing

EnergyGraph is currently presented as a general cross-domain representation layer. With a
single domain in scope, present it as the geothermal schema it currently is. Do not
describe it as a standard, a specification for the energy sector, or as domain-general.

### 5.4 Technical positioning — add

Add a section stating the technical approach. The permitted substance is in whitelist
items W7–W8. In plain terms: geothermal reservoir modelling of this kind is a **Type 2
inverse PINN problem** — 3D transient heat conduction with spatially varying thermal
conductivity k(x) — and inverse archetypes matter here because subsurface parameters are
unknown rather than given.

Write this for a technical reader. Do not soften it into marketing language.

### 5.5 Regional context — add

Add the East African Rift System / Kenyan geothermal context (whitelist W9). This is
domain and geographic context. It is **not** a partnership, data-access, or affiliation
claim — do not phrase it as one, and do not name any operator as a partner, client, or
data source.

### 5.6 Metadata

- `<title>` currently reads "Ereuna — Physics-Informed ML for Energy". It must name
  geothermal.
- Update meta description, OpenGraph tags, and any structured data to match the new scope.
- Check for stale references to removed products in sitemap, robots, manifest, and any
  social card images.

---

## 6. Claims whitelist

These are the **only** permitted factual assertions. Anything else is out.

| ID | Permitted claim |
|---|---|
| W1 | Ereuna is a physics-informed machine learning platform for geothermal energy |
| W2 | GeoSight is Ereuna's geothermal application |
| W3 | Ereuna includes a physics constraint checker |
| W4 | EnergyGraph is Ereuna's data representation schema |
| W5 | EnergyGraph comprises PhysicsSpec, SensorGraph, and FieldState |
| W6 | The constraint checker is intended to be available as a standalone package |
| W7 | Geothermal reservoir modelling of this class is a Type 2 inverse PINN problem: 3D transient heat conduction with spatially varying thermal conductivity k(x) |
| W8 | Inverse PINN formulations are the relevant archetype where subsurface parameters are unknown |
| W9 | The East African Rift System is a significant geothermal region; Kenyan fields including Olkaria and Menengai are located there |

**W6 caveat:** only state this if the package is actually published at deploy time. If it
is not, describe the checker's function without any availability claim.

**W9 caveat:** geographic and geological fact only. No claim of access, partnership, or
data relationship with any named operator.

If a section of the page cannot be written from this list, leave it out and flag it in
your report.

---

## 7. Deploy procedure

1. Make changes on a branch. Do not commit to the default branch.
2. Build and verify the build succeeds.
3. Deploy to a **preview/staging URL only**.
4. Produce the verification report (Section 8).
5. **Stop. Wait for explicit human approval.**
6. On approval, merge and deploy to production.
7. After production deploy, re-render the live site and confirm no removed item
   (NuclEval, GridLens, MaterialSpec, old positioning line) appears anywhere, including
   cached routes and social cards.

Do not skip step 5 under any circumstances, including if the changes seem minor or the
build is clean.

---

## 8. Verification report

Before requesting approval, produce a report containing:

**A. Stack inventory** — repo, framework, host, deploy mechanism, preview URL.

**B. Claims audit table** — every factual assertion on the new page, one row each:

| Claim as written on page | File:line | Whitelist ID | 
|---|---|---|

Any row you cannot fill with a whitelist ID is a defect. Fix it before reporting, do not
report it as a known issue.

**C. Removals confirmation** — grep results proving zero remaining references to
NuclEval, GridLens, MaterialSpec, "Hugging Face", and any metric or traction language.
Include the commands you ran.

**D. Diff summary** — files changed, lines added/removed, and a plain-language summary of
what a visitor will notice.

**E. Flagged gaps** — anything you left out because it could not be written from the
whitelist, and anything you think is missing but did not build.

**F. Self-check statement** — confirm explicitly that you added no number, name, logo,
date, or comparative claim not present in Section 6.

---

## 9. Review checklist for the human approver

Designed to take under ten minutes:

- [ ] Read report section B. Does every claim map to a whitelist ID?
- [ ] Read report section C. Are the removals clean?
- [ ] Open the preview URL. Scan for any number, logo, or name you cannot personally source.
- [ ] Check the W6 caveat: is the package actually published?
- [ ] Check the W9 wording: does it read as geology, or does it imply a partnership?
- [ ] Approve or send back.
