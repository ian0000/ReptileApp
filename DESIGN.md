# ReptileApp — frontend visual system

Scope: public welcome, account screens, authenticated shell, reptile collection/fiches and care histories. The full frontend scope follows the user's expanded authorization on 2026-11-01; it supersedes the earlier landing-only stage. Commit, push and publication are authorized for the completed result, with their actual status reported separately.

## Built identity

“Cada reptil, su historia.” Petroleum `#153d32` and lime `#d7f15b` carry identity; mineral `#f2f5ed` carries reading. White, muted `#52665c`, coral/cobalt/violet and semantic error states support clear hierarchy. Values are CSS variables under `.reptile-design`, including spacing, type, controls, panels, shadows and feedback durations. Jost variable is self-hosted with OFL; no remote font service is needed. The original gecko.svg remains the compact mark. The generated alpha WebP is a decorative public illustration, not user content. Asset provenance: docs/LANDING_ASSETS.md.

## Public welcome

The hero combines expressive two-line type, a factual benefit, existing account destinations and a single gecko illustration. The example switches among meal, weight and note records in local React state, labeled as fictional. The next section explains account confirmation, adding a reptile and recording care. Footer navigation leads to existing routes. No invented testimonials, usage metrics, medical claims or unavailable product features.

## Account experience

AuthLayout uses petroleum storytelling on desktop and a compact mineral form surface on mobile. Brand copy is not a second h1. Each view owns its heading and page title. Registration, code re-request and recovery have persistent inline success states with the next action. Confirmation and recovery-code validation preserve six-digit auto-submission plus an explicit submit fallback and an in-flight guard. Password minimum length and confirmation-match constraints remain intact. Labels, autocomplete, hints and error IDs are connected. Errors retain entered values; pending buttons expose progress. Passwords and verification codes are not added to browser URLs or extra storage.

## Authenticated shell and reptiles

AppLayout supplies persistent brand/navigation, collection access, add-reptile action, logout, skip-to-main and feedback. Session loading, invalid authentication and network errors have distinct outcomes; network problems offer retry. Login and logout clear private query caches to avoid displaying another session's cached records.

The collection presents reptiles and their existing care destinations. Reptile details become the contextual entry to food, weight and note histories. Create/edit forms use shared fields, preserve optional birth dates and return to an appropriate existing context. Destructive deletion has explicit confirmation; pending and error states remain visible.

## Care histories and shared primitives

Histories identify the reptile, expose local navigation among the three record types and keep create/edit/delete actions discoverable. Cards use explicit keyboard-operable actions rather than clickable divs and hover-only delete controls. Empty, loading, query-error/retry and mutation-error states use product-specific language.

Reusable components include ActionLink, BrandMark, SectionHeading, FormField, SubmitButton, FormNotice and Dialog. FormField connects labels, hint and error IDs; consuming controls declare aria-invalid/aria-describedby. Shared Dialog uses the installed Headless UI implementation for dialog semantics, focus containment/restoration and Escape. The title and Close action remain visible while the body scrolls within the viewport; pending operations prevent premature close. Error presentation distinguishes failed API/network requests from not-found content. Success feedback normalizes string/object API responses into readable text.

Weight visualizations preserve recorded values and units. Mixed units are called out rather than silently presenting unrelated measurements as grams. The refactor does not define a new conversion policy or alter server-side data.

## Motion and responsive behavior

Feedback uses short color/border transitions under fine-hover and no reduced-motion preference. Focus, content and task completion remain immediate. There are no entrance reveals, parallax or content hidden until animation. Controls retain visible two-tone focus. Public grids adapt at 48rem; auth splits at 64rem; shared application layouts and dialogs handle narrow viewports without depending on hover.

## Architecture and verification

Public welcome, auth views, dashboard, reptile views, histories and fallback page use React lazy imports with Suspense loading feedback. `/bienvenida` remains public; `/` and existing reptile routes remain authenticated. Existing account and API paths are preserved; a wildcard now gives unknown URLs a real fallback. Styles are scoped under the design system rather than changing the framework. index.html declares Spanish.

Local QA with an isolated fixture exercised login; reptile create/edit without a birth date; food create; note create/edit; weight create/edit/reopen; mixed-unit messaging; Escape/focus restoration; cancel-delete; and logout. Captures include 1440px and 320/390px layouts. Contract tests run manually with `npm run test:contracts`. Local lint/build and detector results belong to the delivery record, and remote CI/publication must be checked independently.

No real production CRUD was performed during QA. These checks do not establish complete screen-reader, physical-device, cross-browser, reduced-motion emulation or field performance conformance. Backend business code and infrastructure remain outside this frontend refactor. No text in this file asserts that the new version has already deployed.
