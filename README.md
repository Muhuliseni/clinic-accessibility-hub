# Eastbrook Community Clinic: Accessible Booking Portal
Ticket MD-2026-0143 · Candidate MD-48206 (even → Community Healthcare Clinic)

```
npm install && npm run dev      # develop
npm test                        # component + axe tests
npm run build                   # deploys via netlify.toml (publish: dist)
```
**Live demo:** _paste your Netlify URL here_

Part A lives in `/wireframes` (3 static pages, `main.css`, `persona.md`, `wcag-matrix.md`).

## Architecture and accessibility decisions

### 1. Trade-offs
**Native controls over custom widgets.** The service picker is a native `<select>` and the date field a native `<input type="date">`. They look plainer than a custom dropdown, but they ship correct roles, keyboard handling and mobile pickers for free, and screen readers already understand them. A custom listbox would need roving tabindex and typeahead, and each is a place to introduce bugs.

**A contained modal instead of an inline confirmation.** The booking confirmation uses `role="dialog"` with `aria-modal`. Focus moves into it, Tab cycles only between its two buttons, and Escape closes it and returns focus to the button that opened it. The cost is a deliberate focus trap, which WCAG 2.1.2 allows because Escape always exits. The benefit is that the confirmation cannot be missed by someone who cannot see the screen change.

**Quiet versus loud live regions.** The results count uses `role="status"` (polite) so it never interrupts typing, and it is one short sentence. Validation failures use `role="alert"` (assertive) because a blocked submit is urgent. Per-field errors are not announced live. They are attached to their fields via `aria-describedby`, so they are read when the user lands there, avoiding a wall of speech.

### 2. State to accessibility-tree synchronisation
Every ARIA attribute is derived from React state in the render, never set imperatively, so the tree cannot drift from the UI. `open` drives `aria-expanded` and `hidden` on the filter panel; the `active` array drives each button's `aria-pressed`; `errors` drives `aria-invalid` and the `aria-describedby` id list; `results.length` and `active` build the status sentence. An availability refresh sets `loading`, which drives `aria-busy` on the results list while a polite region announces the start and outcome; the button uses `aria-disabled` rather than `disabled` so focus is never lost mid-update. Focus is the only imperative piece, handled with `useRef` plus `.focus()`: the `h1` on view change (`tabIndex={-1}`), the first invalid field after a failed submit, the first modal button on open, and the previously focused element on modal close. `useEffect` cleanup in `Modal` guarantees focus restoration.

### 3. Verification and testing audit
**Automated.** `npm test` runs 13 Vitest and Testing Library tests with axe-core. On 12 Oct 2026: **13 of 13 pass, axe-core reports 0 violations** on the directory and on the booking form in its error state, and coverage is **100% of lines and 92% of branches**. The tests assert ARIA state transitions, error linkage, `aria-busy`, focus placement and modal containment, including negative paths such as invalid emails and weekend dates. Lighthouse 13.4.1 (mobile, slow 4G) on the directory view scored **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. `npm audit --omit=dev` reports 0 vulnerabilities.

**Manual.** Keyboard tab-sequence and VoiceOver logs, with screenshots, are in [docs/testing-log.md](docs/testing-log.md).
