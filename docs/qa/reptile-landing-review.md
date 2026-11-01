# RA-003 — Independent code review of public landing

Date: 2026-11-01. Branch: `feat/complete-ui-ux-refactor`.

## Verdict

No blocking code regression found in the integrated design foundation and additive `/bienvenida` route. Suitable for the user's landing-stage review after root completes the rendered/browser checks. This is a code review, not a WCAG conformance claim or an authenticated end-to-end certification.

Only this QA document was written by the reviewer. No product code, backend, infrastructure, production data, credentials, package manifests or dependency locks were modified by this review.

## Scope and baseline comparison

Reviewed `FrontEnd/src/router.tsx`, `FrontEnd/index.html`, `FrontEnd/src/design-system/{components.tsx,tokens.css}`, `FrontEnd/src/views/public/{WelcomeView.tsx,WelcomeView.css}`, local public assets and the design contract in `docs/FRONTEND_REFACTOR.md`.

The tracked product diff is limited to the additive route and `lang="es"`. `git diff --name-only -- Backend FrontEnd/src/api FrontEnd/src/hooks FrontEnd/src/layout FrontEnd/package.json FrontEnd/package-lock.json .github` returned no paths. All prior route declarations remain under their original layouts. `/` remains the authenticated dashboard; `/bienvenida` is outside `AppLayout` and does not call `useAuth`.

## Checks

| Area | Result and evidence |
| --- | --- |
| Routing and authentication | Preserved. `router.tsx` adds lazy `WelcomeView` with a `Suspense` status fallback; no existing route, redirect, auth guard or payload was replaced. |
| Backend and permissions | Unchanged. The previously recorded ownership gaps remain a separate backend/security concern and are not claimed fixed. |
| Loading boundaries | Landing JS/CSS are imported through the dynamic route. Existing large initial app bundle remains primarily baseline debt. Root measured landing JS 7.64 KB / 2.65 KB gzip and CSS 10.01 KB / 2.49 KB gzip; main 1042.77 KB versus 1041.25 KB baseline. These numbers were reported by root, not independently rerun here. |
| Design scoping | Tokens/components are scoped to `.reptile-design`; landing rules use `.welcome-*`. `@font-face` registers Jost but does not apply it to previous screens. No global reset or change to `index.css` was introduced. |
| Demo safety | `WelcomeView.tsx:61` uses local state only. Buttons select among fixed fictional examples; no API imports, network mutation, localStorage token access, account creation request or backend calls are made by the demo. |
| Content integrity | Meals, weight and notes correspond to existing capabilities. Fictional example data is labeled both near the controls and inside the preview. No customer, health, husbandry, clinical or performance claims are invented. |
| Destinations | Native links point to existing `/auth/login` and `/auth/register`. In-page links target existing IDs. No nested interactive controls found. |
| Semantics | One h1, named sections, navigation landmark, main, footer and a definition list for record fields. Toggle group has an accessible name; buttons expose `aria-pressed` and reference the preview via `aria-controls`. |
| Keyboard and targets | Controls are native buttons/links. Minimum heights are 44px in the landing and 48px for ActionLink. Focus styles are provided, with lime override on dark hero/header and cobalt on light content. Skip link targets a main with `tabIndex={-1}`. Actual keyboard behavior must be confirmed in root's browser pass. |
| Motion | No hidden entrance content, spatial effects or continuous animation. Color feedback is limited to fine hover and `prefers-reduced-motion: no-preference`; focus remains immediate. |
| Images and fonts | Image has explicit width/height and fluid CSS; decorative gecko uses empty alt and is hidden from AT. Jost is local with OFL license. No external image/font service is referenced by the landing. Asset provenance should remain in the final delivery. |
| Deployment | No `.github`, backend or external configuration edits. No public `_headers` or redirects were added. A local preview does not independently prove production response headers or successful font loading under any external CSP; verify when publication is separately authorized. |

## Calculated contrast checks

Computed directly from source hex values using sRGB relative luminance and `(Lmax+.05)/(Lmin+.05)`. These are source color checks; they do not substitute for rendered/overlaid pixel analysis.

| Pair | Ratio |
| --- | --- |
| `#52665c` on meal `#e5ebcf` | 5.01:1 |
| `#52665c` on weight `#e6eaf6` | 5.12:1 |
| `#52665c` on note `#f1e7e0` | 5.05:1 |
| Cobalt `#3658bd` on mineral `#f2f5ed` | 5.80:1 |
| Lime `#d7f15b` on petroleum `#153d32` | 9.52:1 |
| Muted-dark `#c9d6cb` on petroleum `#153d32` | 8.00:1 |

## Follow-up finding — resolved

**Resolved P2 — Demo change announcement.** `WelcomeView.tsx:97–107` updates the explanatory text and preview after activating a category, while focus stays on the button. `aria-pressed` exposes which toggle is selected, but there is no live announcement of the updated content. Consider a concise polite status such as the selected example category, rather than announcing the whole card. This would improve discoverability for screen-reader users without changing the demo or business behavior. No keyboard trap or inaccessible mouse-only control was found; this is not a release blocker for the isolated demonstration.

The implementation now includes a visually hidden `role="status" aria-live="polite" aria-atomic="true"` directly after the controls (`WelcomeView.tsx:102–104`). Its text names the selected category and example name/value. The change was verified in source; no assistive-technology playback test is claimed. This resolves the code finding without changing business behavior.

## Additional visual evidence review

The independent reviewer inspected the saved current-run desktop, mobile and tablet screenshots `10-landing-desktop.png`, `11-landing-mobile.png` and `12-landing-tablet.png` from the chat output folder. All sections are present, the gecko is visible, the demo panel keeps its readable label/value structure, and the mobile layout stacks controls/content without visible clipping or horizontal overflow. Tablet uses two columns without the compressed principle-card issue identified in the old product. No additional visual blocker found. These screenshots do not prove keyboard behavior, reader announcements, resource loading or physical-device performance.

## Remaining verification owned by root

- Render and inspect desktop/tablet/mobile screenshots, including long labels and the three record states.
- Exercise Tab, Shift+Tab, Enter/Space, skip-to-main, auth destinations and direct refresh at `/bienvenida`.
- Check focus visibility in both dark and light fields, console/resource loading and reduced-motion behavior where available.
- Keep authenticated CRUD and production-data testing outside this landing stage unless a test account/data environment is explicitly authorized.
- Report physical-device, screen-reader, cross-browser and field-performance limits rather than claiming full coverage.

Root reported successful lint and build before this review; the reviewer did not rerun or alter tests. Neither package declares automated tests. No commit, push or deployment was performed.


## RA-009 — Care histories implementation record

The user later approved the full frontend scope. This reviewer then became the implementer for the three care-history modules; the following is an implementation self-review, not an independent audit of those modules.

- Lists preserve existing query keys, API wrappers and entity IDs, add the actual reptile name via useReptil, contextual navigation among meals/weights/notes, explicit registration actions, meaningful loading/empty states and inline errors with retry. Fetch failures no longer redirect silently to a 404 page.
- Cards preserve available values and dates, use semantic articles, expose Edit/Delete as native buttons at all pointer sizes and retain descriptions/metadata without hover-only controls. Note numeric values of zero are displayed instead of disappearing under truthiness checks.
- Shared HeadlessUI Dialog provides focus, Escape and focus return. Record forms have labels/IDs/error associations, a disabled fieldset and pending submit feedback. Mutation failures keep the form and its input; deletion closes only on success and otherwise retains the confirmation and error. No nested forms or new endpoints were added.
- Empty optional select values become undefined, consistent with their declared optional form types. Backend validation differences remain visible through the existing error path rather than changing schemas/rules. The appetite 'not specified' value becomes undefined instead of invalid numeric zero; actual 1–5 choices remain unchanged.
- Weight graph receives the source unit. It renders only when every value has the same explicit unit; mixed or absent units produce an explanation and the original-unit list remains available. There are no implicit conversions or gram-only labels. Chart interpolation is linear, animations are disabled, and the list carries every value/date independently of the visual chart.
- No backend, API module, hook, type/schema, dependency or infrastructure file was changed by this owner. Lint passed. Full build at this point was blocked by an unrelated in-progress integration error at ReptileDetailsView.tsx:99 (possibly undefined user); root owns that fix and the final build result.

The useLogPesaje cache key was aligned to [logPesaje, reptilId, id] on root request so detail reads and update writes refer to the same cache. getLogComidas has a narrow TypeScript return projection, while its passthrough schema can retain optional server fields; cards render optional values only when available, and edit fetches the full record. Backend required/optional discrepancies and owner authorization findings are not fixed or hidden by this UI work.

Source strings were checked with the TypeScript scanner after correcting a PowerShell pipe encoding issue; no corrupted question-mark text remained in the owned modules. Browser/CRUD verification with authorized test data is still required by root before any claim of successful end-to-end mutation.

## Isolated functional QA fixture

At root request, `work/qa-api.mjs` provides a temporary Node HTTP server bound only to `127.0.0.1:4000`. It contains fictitious in-memory user/reptile/note/meal/weight records; no MongoDB, credentials, email delivery or external services. CORS accepts only localhost/127.0.0.1 on frontend ports 5173/5174. The scratch directory is locally excluded through `.git/info/exclude` and must not be committed or deployed.

The fixture emulates existing auth and reptile/history CRUD paths and their response shapes. Health, login, user, reptile list and weight list were checked. These checks validate the test harness only, not real API integration or real backend authorization. Root's browser tests must be labeled as fixture-backed. A deliberately rejected `error@example.test` login supports the error path, and `123456` is a fictional confirmation/reset code; no email is sent.

A functional review of other owners' changes found the cache-clearing logout and inline network-error recovery preserve session contracts more clearly than the previous redirect-only handling. Existing route declarations and backend files remain unchanged. Optional empty birth-date serialization and success-toast handling of object responses were reported to root for validation; the fixture intentionally returns the backend's actual object envelopes rather than masking that behavior with strings.

### Encoding follow-up during browser QA

Root found six corrupted JSX option labels not covered by the first lexical scanner. They were corrected (Sin método and the five appetite labels), then all six owned history folders were checked with a TypeScript AST traversal of JsxText, StringLiteral and template nodes: zero remaining question-mark text nodes. Singular 1 día was also corrected in both upcoming and overdue meal messages. Lint passed after the correction.
