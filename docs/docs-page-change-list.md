# /docs change list (WebClient)

Date: 2026-10-11. Scope: `WebClient/src/pages/DocsPage.jsx` (served at https://app.ereuna.org/docs).

**Proposed file:** `WebClient/src/pages/DocsPage.next.jsx`. It sits beside the current page and is not imported anywhere, so nothing changes on the site until you swap it in. To apply it, replace `DocsPage.jsx` with it. It builds with `vite build` and passes `eslint`, checked against your local WebClient source (including the uncommitted Research/Domains/Fields/Workbench pages).

Every statement in the new page was checked against the local code in AuthService, RepositoryService, PlatformService, DatasetsService, InferenceService, EreunaCLI, nginx.conf, and the live site as of 11 Oct 2026.

## 1. Remove or correct claims that are false today (P0)

| Current text | Problem | Change |
|---|---|---|
| Quickstart: `pip install ereuna-geothermal` (also under SDK → Installation) | None of the repos contain this package. The only installable tool is `ereuna-cli`, installed from source | Remove. Quickstart is replaced by Accounts → Install CLI → Push. The SDK is listed under Roadmap |
| `import ereuna`, `ereuna.load()`, `EnergyGraph.from_csv()`, `model.predict()` | No Python SDK exists | Remove; listed as planned |
| `from ereuna.checks import PhysicsSpec ... report.pass_status` | The physics constraint checker is not implemented. Workbench → Validate shows "Coming soon" | Remove; listed as planned |
| "Create an API key at **ereuna.energy**/settings/keys", `EREUNA_API_KEY=ak_live_...` | Wrong domain. The CLI does not read `EREUNA_API_KEY`. RepositoryService accepts only JWT bearer tokens, not API keys | Document `ereuna login` and bearer tokens; state that API keys are not accepted yet |
| Intro: "GeoSight is a demo geothermal application" | `/apps/geosight` returns "App not found". The SPACE list is empty | Marked "Not available" in the status table |
| Intro: "physics constraint checker to verify governing equations ... before model outputs are accepted" | Not implemented. Nothing gates uploads | Moved to Roadmap as planned |
| Creating a model repository: `ereuna init --type MODEL` **then** `ereuna repo create geothermal-pinn ...` | `init` already creates the remote repo, so `repo create` with the same slug fails (409) | Use one or the other. The recommended path is web create, then `ereuna clone` |
| "All REST API endpoints require a bearer token" | Listing, lookup, search, file lists and presign are anonymous. Only writes need a token | Per-endpoint Auth column |
| Dataset page hint "POST /v1/datasets/{slug}/query" (DatasetDetailPage, not DocsPage) | Wrong path and wrong id type. DatasetsService ids are not repo slugs, and the service rejects AuthService tokens | Docs say the query endpoint is not usable yet. **Separate code fix needed** in `DatasetDetailPage.jsx:569` |

## 2. Fill or remove empty sections (P0)

Nine sidebar items had no body: Node types, Edge types, Serialisation, Physics constraint checker, Versioning & tags, Running inference, Loading datasets, Inference endpoint, Search & filter.

- **Removed:** Node types, Edge types, Serialisation, Running inference, Loading datasets. They describe things that don't exist yet. The EnergyGraph page says when they will be documented.
- **Replaced by real content:** Search (now under Repositories), Inference endpoint (now "Datasets & inference", which states the 503), Versioning (now "How commits work").

## 3. Add what a user needs to actually use the platform (P0)

New sidebar, organised by user journey:

1. **Getting started:** Introduction (North Star, fields, domains, data policy), **What works today** (status table), **Accounts & sign-in**, **Finding your way around** (including /models and /datasets, which are missing from the nav).
2. **Publish your work:** repository concepts and types; create on the web (the only way to set catalog metadata); install the CLI; push and pull with the CLI (full command table, private-by-default, missing metadata); model files (`config.json` highlighted keys, `params.json` shape); dataset files (`schema.json` / `profile.json` / `validation.json` examples, taken from the ereuna-dataset-card skill); **How commits work**.
3. **REST API:** base URLs and the `/api/auth/auth/...` double prefix; login, refresh and logout payloads; repository endpoints with a create-with-metadata example; multipart commit upload and presigned download; Platform read-only endpoints; Datasets and inference status.
4. **Concepts & roadmap:** EnergyGraph, clearly labelled draft; planned features; **Known limitations**.

## 4. Behaviour change in DocsPage

- Sections are deep-linkable: `/docs#api-auth` opens that section, and clicking the sidebar updates the hash. This lets the footer's Python SDK / REST API / EnergyGraph links point somewhere specific.
- Hero description now reads: "Publish geothermal models and datasets, use the Ereuna CLI and REST API, and see what works today."
- Ordered steps use bold-numbered bullets, because `renderMarkdown` has no ordered-list support and would merge `1.` lines into one paragraph.

## 5. Follow-up edits outside DocsPage (not applied)

| File | Change |
|---|---|
| `components/Footer.jsx` | Point DEVELOP links at `/docs#api-overview`, `/docs#cli-install`, `/docs#eg-spec`. GitHub → `https://github.com/ereuna`. Remove the generic Discord link or add a real invite. Contact → a real address |
| `components/CTA.jsx` (landing) | "git clone the repo → cd EreunaCLI" doesn't say which repo. `ereuna/AetherCLI` is private, so outside users can't follow this step. Publish the CLI repo or a package |
| `components/FlagshipApps.jsx` | Remove the "Live" badges on GeoSight and the Physics Constraint Checker |
| `pages/ModelsPage.jsx` | "all passing the physics constraint checker" is false; both listed models are non-geothermal (tokamak, distillation) |
| `pages/DatasetDetailPage.jsx:569` | Remove or fix the query endpoint string |
| `components/Nav.jsx` | Add Models and Datasets, or link them from Research |
| `pages/SettingsPage.jsx` | The 2FA toggle is a no-op (`onChange={() => {}}`) |
| `pages/LoginPage.jsx` | Add a forgot-password link. Handle `mfa_required` (currently errors out) |

## 6. Platform bugs the docs now disclose (log in Jira/GitHub)

1. **Commits are deltas but are read as snapshots.** `create_commit_handler` stores only the uploaded files under the new SHA. The WebClient, `ereuna clone` and `ereuna pull` read only the latest commit. A partial push hides earlier files. Fix in RepositoryService by carrying the parent tree forward.
2. **Private visibility is not enforced.** `GET /repositories`, `/search`, `/files/{sha}` and `/presign` need no auth and apply no visibility filter.
3. **DatasetsService auth mismatch.** It verifies HS256 with a local `SECRET_KEY` and never accepts AuthService RS256 tokens.
4. **API keys are not accepted** by RepositoryService (`decode_access_token` handles JWTs only).
5. **MFA lockout risk.** Enrolling MFA through the API makes web and CLI login impossible.
6. Unknown `/api/*` paths return the SPA HTML with status 200. Add `location /api/ { return 404; }` in nginx.conf after the service blocks.
