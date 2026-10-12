# WCAG 2.1 AA mapping matrix

| Criterion | Target component | Technical implementation | Verification |
|---|---|---|---|
| **1.3.1 Info and Relationships (A)** | All pages, forms | Landmarks (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`); `<label for>`; `fieldset`/`legend` for filter groups | axe `region`, `label` rules; NVDA landmark list (D key) |
| **1.4.3 Contrast (Minimum)** | Body text, buttons, errors | Ink on white 14.6:1, green 6.5:1, error 6.5:1, documented in `main.css` | Lighthouse and axe `color-contrast`; manual check in WebAIM Contrast Checker |
| **1.4.11 Non-text Contrast** | Input borders, focus ring | 2px ink borders; `#2B6CB0` ring is 5.4:1 against white | Visual inspection, axe |
| **2.1.1 Keyboard** | Filters, cards, form, modal | Native `button`, `input`, `select`; no `div` click handlers | Manual Tab / Shift+Tab / Enter / Space run-through |
| **2.1.2 No Keyboard Trap** | Confirmation modal | Tab cycles inside the modal only while open; Escape always closes it | Manual test; Testing Library keyboard test |
| **2.4.1 Bypass Blocks** | Every page | Skip link as first focusable element | Tab once on page load |
| **2.4.3 Focus Order** | Directory, form, view switching | DOM order equals visual order; on view change focus moves to the new `h1` | Manual tab-sequence log |
| **2.4.7 Focus Visible** | All interactive controls | `:focus-visible { outline: 3px solid #2B6CB0; outline-offset: 2px }` | Visual check; no `outline: none` in CSS |
| **3.3.1 Error Identification** | Booking form | `aria-invalid`, error text linked via `aria-describedby` | Component tests; NVDA reads error with field |
| **3.3.3 Error Suggestion** | Booking form | Errors state the fix ("Enter an email like name@example.com") | Test assertions on message text |
| **3.3.2 Labels or Instructions** | Booking form | Visible labels plus helper text via `aria-describedby` | axe, screen reader log |
| **4.1.2 Name, Role, Value** | Filter accordion, toggle buttons | `aria-expanded`, `aria-controls`, `aria-pressed` update with state | Component tests; axe `aria-*` rules |
| **4.1.3 Status Messages (2.1 AA)** | Results count, validation summary | `role="status"` (polite) and `role="alert"` (assertive) | NVDA announcement log |
