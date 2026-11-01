# ReptileApp — frontend refactor

## Product brief and approval boundary

ReptileApp records reptiles and their meals, weights and notes. The current audience is a visitor or an authenticated user; this project does not introduce administrative roles, business rules, photo fields or new API contracts.

The user first approved the foundation and public `/bienvenida` landing, then explicitly authorized completion of every frontend module in this execution with parallel agents. Intermediate approval gates between frontend groups no longer apply. The authenticated `/` dashboard and `/auth/*` routes remain. Final commit/push and publication through main were explicitly authorized after validation. Production verification is still pending and must be recorded against the deployed commit. Backend rules, database and infrastructure changes remain outside scope.

## Direction: Cada reptil, su historia

The product should feel memorable and inviting, with reptiles as the subject and useful records as the proof. The visual identity combines deep petroleum, a vivid lime action color and a light mineral canvas. Coral, cobalt and violet distinguish meals, weights and notes when those categories are present; labels and icons must carry the same meaning without color.

A reptile illustration is a brand character, not an image of a user's animal. It may accompany the landing and later approved empty states. Product previews use explicitly marked demonstration records and do not show production data. No scores, streaks, health judgments, telemetry, reminders or other capabilities are implied.

The landing uses expressive typography and product-specific composition. Internal tools, when approved, prioritize readable dates, units, visible actions and contextual navigation for the selected animal. The shared language must stay recognizable without copying marketing-scale typography into data entry screens.

## Manager board

| Ticket | Owner | Scope | Status | Acceptance gate |
| --- | --- | --- | --- | --- |
| RA-001 — Design foundation | `reptile_manager` | Scoped tokens, ActionLink, BrandMark, SectionHeading, decisions and board | Completed; locally validated | No style changes outside `.reptile-design`; no dependencies; keyboard focus and reduced motion retained |
| RA-002 — Public landing | `reptile_screens` | `/bienvenida` content, brand illustration, responsive product preview and real auth destinations | Completed; locally validated | Factual features, demo data clearly marked, public route, readable at mobile/tablet/desktop |
| RA-003 — Landing integration and QA | Root + independent review | Landing route, assets, lint/build and browser verification | Verified locally | Auth routes preserved; no production mutations; limitations recorded |
| RA-004 — Shared forms and dialogs | `reptile_manager` | FormField, SubmitButton, FormNotice, controls and accessible Dialog | Completed locally; final QA pending | IDs/errors, pending, focus/Escape/restore, viewport scroll |
| RA-005 — Account access | `reptile_screens` | AuthLayout, login and registration | Completed locally; final QA pending | Existing auth behavior, readable forms, feedback |
| RA-006 — Verification and recovery | `reptile_screens` | Confirmation, resend, recovery and new password | Completed locally; final QA pending | Preserve token rules, accessible feedback and continuity |
| RA-007 — Application shell | `reptile_manager` | Responsive navigation, session states, cache-safe logout | Completed locally; final QA pending | Missing/invalid session to login; network retry; cache cleared |
| RA-008 — Reptile workflows | Root | Dashboard, create/detail/edit and navigation | Completed locally; final QA pending | Preserve fields, payloads, routes and ownership |
| RA-009 — Care histories | `reptile_architecture` | Meals, weights, notes, dialogs and record actions | Completed locally; final QA pending | Existing capabilities/units preserved; no model changes |
| RA-010 — Final QA and GitHub delivery | Root + independent review | Integrated gates, tests, browser checks, commit and push | Local QA in progress; publication authorized | Evidence and limitations; production verification pending |

The manager coordinates the interface contract between tickets. Each owner edits only its assigned files. Root owns integration and final decisions; parallel work does not bypass approval boundaries.

## Foundation contract

Files: `FrontEnd/src/design-system/tokens.css` and `components.tsx`. Importing `components.tsx` registers the stylesheet. Consumers place their surface inside `.reptile-design`; no selectors change existing screens outside that wrapper. The `@font-face` registration alone does not apply a font globally.

- `ActionLink`: React Router `LinkProps` plus `variant?: "primary" | "secondary"`; accepts `className`; defaults to primary. Primary uses petroleum text on lime. Secondary inherits the surrounding text color. Both retain native link semantics and keyboard behavior.
- `BrandMark`: `{ compact?: boolean; className?: string }`; a span containing the existing `FrontEnd/gecko.svg` and visible ReptileApp text. It is not a link; the caller owns its destination. Compact mode gives the image an accessible name.
- `SectionHeading`: `{ id?: string; children: ReactNode; className?: string }`; semantic `h2`, not a configurable heading-level abstraction.

Tokens use `--ra-*`: petroleum `#153d32`, lime `#d7f15b`, coral `#ee8b6c`, cobalt `#3658bd`, violet `#7750ad`, mineral `#f2f5ed`, white surface, readable ink/muted colors and a neutral border. Color roles are not claims of measured WCAG conformance; rendered combinations still require contrast checks.

Spacing steps are 4/8/12/16/24/32/48/64/96px. Control radius is 12px; panel radius 24px. Shadow is reserved for raised surfaces. Breakpoint values remain the adopted Tailwind 4 defaults; CSS custom properties are not used as media-query conditions. Component layouts stay mobile-first.

Jost variable is self-hosted at `/fonts/jost-variable.ttf`, with `font-display: swap`; root provides the font and its OFL license. Font registration and use do not contact an external font service. No UI or animation library is added.

Motion tokens are 120/180/240ms. Current ActionLink feedback only transitions background/border color for fine pointers with `prefers-reduced-motion: no-preference`. Keyboard focus is immediate and two-tone for light or dark surfaces. No entrance animation hides content, and no global transition suppressor is applied to existing screens.

## Authorized frontend groups

1. Account access: consistent labels, input/error associations, pending feedback and continuity through login, registration, verification and recovery. Preserve token and account rules.
2. App shell and reptiles: responsive navigation, dashboard, create/detail/edit, visible actions and preservation of ownership behavior.
3. Care histories: accessible shared form dialogs, explicit edit/delete controls, successful mutation feedback and list refresh for meals, weights and notes.
4. Data presentation and polish: chart semantics, consistent units, edge states, motion and bundle evaluation. Resolve unit/contract decisions explicitly before changing representations.

Each group requires a before/after review and appropriate regression checks. The user's expanded authorization permits these frontend groups to proceed in parallel within ownership boundaries. It does not authorize new business capabilities, backend rules or infrastructure changes. The later explicit publish authorization covers integrating the validated frontend into main and observing the existing delivery pipeline.

Shared forms: FormField renders label/hint/error nodes with IDs based on the supplied id; consumers put matching id, aria-invalid and aria-describedby on controls. SubmitButton prevents repeat submission while pending. FormNotice announces errors as alerts and success as status.

Dialog reuses installed Headless UI for focus containment, Escape and restoration. Its portal is scoped with .reptile-design, its header remains visible and its content scrolls within the viewport. No package is added. Shell logout removes the token, cancels outstanding queries, clears React Query cache and returns to login; temporary account failures allow retry.

## Known risks and validation limits

- Frontend and backend require Node 22 (`>=22.13.0 <23`). The portfolio's Node 24 toolchain is not the runtime contract for this repository.
- API responses, enums, query keys, payloads, token flows and ownership are existing contracts. Mismatches between frontend/router/model validation are separate findings, not permission to alter backend rules.
- `/` remains authenticated. `/bienvenida` is an additive public route, avoiding a silent migration of dashboard links or login redirects.
- Authenticated browser coverage needs an authorized test account and local or test data. Production records must not be mutated for visual QA.
- Baseline discovery found modal focus/semantics issues, clickable div cards, hover-only deletion controls, incomplete field associations and errors routed to 404. RA-004 through RA-009 address these frontend surfaces; resolution remains subject to integrated verification.
- The weight chart currently discards source units and labels values as grams. Do not add implicit conversions or health interpretation.
- The backend ownership coverage finding needs a separate security decision; this frontend refactor does not change permissions or claim to resolve it.
- Baseline gates are frontend `npm run build` and `npm run lint`, backend `npm run build`. Neither package declared a test script at discovery. The refactor adds frontend `npm run test:contracts`: 107 local Node test-runner assertions pass with an Axios adapter stub. They cover auth and reptile wrappers, history mutation failures, Zod field/range messages, safe success feedback, date omission, gender values and HTTP request contracts without contacting a server. Backend tests are not introduced; no accessibility certification is claimed.

## Delivery record

RA-001 and RA-002 are implemented and locally validated. Frontend `npm run lint` and `npm run build` pass. Root executed Impeccable context and source detection; the detector returned an empty finding list. An independent source review found no blocking issues. These results do not constitute full WCAG conformance or a complete application regression audit.

Root reviewed the integrated public landing at requested desktop 1440px, tablet 768px and mobile 390px widths. The Pesajes preview was activated by pointer and Notas by Enter; the skip link focuses `welcome-main`. The illustration and local font loaded. An accessible status announcement was added after QA feedback. These observations cover the landing; they do not claim authenticated CRUD, production data, physical device, full screen reader or cross-browser validation.

The landing gate was superseded by the user's explicit authorization to complete all frontend modules. Shared foundation, account screens, shell, reptile workflows and histories are implemented locally. Final QA and the authorized GitHub/main publication are owned by RA-010. Production has not yet been verified for this refactor; report that separately after publication. The manager owns shared forms, dialogs, the application shell and documentation; backend behavior remains outside scope.

## Auth contract test record

The manager added scripts/register-contract-tests.mjs, scripts/typescript-test-loader.mjs and tests/api-contracts.test.mjs. TypeScript is the existing dev dependency used for test-time transpilation; no package was added. Node 22 run: 107 tests, 107 pass, zero fail/skip. Global frontend lint also passes. The tests replace only the Vite API-origin expression and intercept HTTP with Axios adapters; they do not exercise MongoDB, Resend, JWT verification, ownership or production authorization.

### Mutation feedback follow-up

QA found that mutation responses can be objects. The 12 create/update/delete hooks now call successMessage to extract a non-empty string, message or msg and otherwise use an action-specific Spanish fallback. This presentation change does not modify payloads, query keys or cache writes. Hook error toasts were removed to avoid duplicating the existing inline errors. Seven presentation checks and 45 authentication/Zod checks are complemented by 55 reptile/history cases (107 total). Frontend lint passes after the extension; the date tests confirm blank birthDate is omitted from JSON, supplied dates remain intact and genre values 1/2/3 are preserved. No backend schema is changed.
