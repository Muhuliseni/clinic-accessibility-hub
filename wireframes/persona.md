# Primary persona: Amara Nkosi

**Age / role:** 41, part-time bookkeeper and single parent. Blind since her twenties.

**Technical configuration**
- Windows 11, Firefox, **NVDA 2025** with a 450 wpm speech rate; Android phone with TalkBack.
- Inputs: keyboard only on desktop. Navigates by headings (H), landmarks (D), forms (F), and the elements list (NVDA+F7).
- Tools: braille display (40 cells) for confirming reference numbers and dates.

**Pain points with conventional web design**
- Unlabeled inputs read as "edit, blank". Placeholder-only fields vanish once typed in.
- Errors shown only in red text below a field are never announced.
- Custom dropdowns and modals that trap focus or drop her at the top of the page.
- Search results that refresh silently, so she cannot tell whether her filter worked.
- Time-limited sessions and CAPTCHA.

**Primary goals**
1. Find a clinic service for her son's immunisation without phoning during work hours.
2. Know immediately which filters are on and how many results remain.
3. Book an appointment and receive a confirmation she can verify by braille display.
4. Correct form mistakes quickly, with errors told to her in plain language.

**Design implications:** landmark structure, labelled fields with helper text, `aria-live` results count, focus moved to errors and confirmations, no keyboard traps.
