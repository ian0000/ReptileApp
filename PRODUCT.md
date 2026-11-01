# ReptileApp — Product context

## Product truth

Personal reptile-care record application in Spanish. The product stores reptiles (name, optional birth date, description and gender), feeding records, weights and notes. Account flows are registration, email confirmation, login and password recovery. Existing authenticated API contracts, ownership checks and MongoDB persistence remain the source of business behavior. No administrative role, invented species/photo field, health scoring or new notification service was added.

## Audience and purpose

People who care for reptiles and want to keep each animal's information and records together. The public welcome page explains the product and leads to the existing create-account/login routes. It is not a medical service or a care recommendation engine.

## Approved scope — 2026-11-01

The user first approved foundation and landing at `/bienvenida`, preserving `/` as the authenticated dashboard. They subsequently authorized completing the frontend modules in the same execution, concurrent agents under a manager, updating repository documentation and portfolio presentation, and commit/push/publication at the end. That later authorization supersedes the initial per-module approval pause. Publication is authorized, not asserted complete by this document.

The implemented scope includes public welcome, all six account routes, authenticated application shell, reptile collection and create/detail/edit views, note/food/weight histories and their create/edit/delete dialogs, loading/empty/error states and the fallback route. It includes frontend API-error presentation and session-cache isolation, preserving existing endpoints and server authorization.

## Visual and interaction principles

“Cada reptil, su historia”: petroleum identity, lime actions, mineral reading surfaces and restrained category cues. The gecko illustration is decorative brand material, never a user's animal photograph. Welcome demonstrations use clearly labeled fictional local data and do not query accounts. Form controls have associated labels, hints and validation messages. Pending operations expose feedback and prevent repeated submission. Shared dialogs support keyboard focus, Escape and bounded scrolling. Reduced-motion preferences retain immediate state feedback.

## Constraints and boundaries

Use the existing React/Vite/TypeScript stack, React Query, React Hook Form and existing Headless UI dialog capability. No new appearance library, framework migration, backend business logic, API routes, database schema or infrastructure configuration was introduced. Preserve validation constraints and payload semantics. Weight records with different units must not be silently combined into a misleading single-unit chart. All production mutations require a user's authenticated action; QA must use synthetic local data rather than real production records.

## Evidence and QA coverage

Discovery used README.md, docs/deployment.md, FrontEnd/src/router.tsx, the current source and browser observations. The original frontend bundle was measured at 1041.25 kB (292.19 kB gzip); this is baseline evidence, not the final bundle size. Final routes use lazy loading and shared components; current build output is the source for final performance figures.

Local fixture QA covered login; reptile creation/editing with no birth date; food creation; note creation/editing; weight creation/editing/reopening; mixed-unit feedback; dialog Escape and focus restoration; cancelling deletion; and logout. Desktop 1440px and narrow 320/390px views were inspected. No destructive CRUD was performed against production. These checks are smoke/regression evidence, not full WCAG, physical-device, screen-reader or field Core Web Vitals certification.

The frontend declares `npm run test:contracts` using the Node test runner and isolated API-contract fixtures. Backend still has no test script. Existing CI workflow integration is documented separately; availability of the new manual command does not imply it is a required remote CI check.

## Delivery and publication

Record local validation, remote checks and production deployment as separate results. A local build or preview does not prove that a new version is deployed. User-authorized Git/publication work is coordinated by the root agent; no deployment, credentials or infrastructure change should be inferred from this context file.
