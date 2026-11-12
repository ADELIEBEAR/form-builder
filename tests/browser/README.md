# Browser Regression Suite

`npm test` covers pure logic, server validation, pagination, image handling, and minified HTML generation.

`npm run test:browser` runs the real editor, public form, dashboard, response list, and duplicate list in headless Chromium. Playwright must be available as `playwright` or through `PLAYWRIGHT_MODULE`. It defaults to the installed Edge channel; override with `QA_BROWSER` if needed.

Example in PowerShell:

```powershell
$env:TEMP = 'E:\Codex\Temp'
$env:TMP = $env:TEMP
$env:QA_OUTPUT = 'E:\Codex\form-builder-qa-results'
npm run test:browser
```

Use a dedicated output directory. `results.json` contains pass/fail details, and screenshots are captured for failures and selected mobile combinations. Optional `QA_FILTER` (substring) and `QA_MATCH` (regular expression) narrow the cases.

The suite uses a QA-only Vite plugin to inject a fixture user and fake Supabase URL. Every external request is intercepted or blocked. Form reads, writes, and response submission use synthetic in-memory fixtures; submission fixtures execute the real server validator. No production forms or responses are modified. The Vite server and browser are closed when testing finishes.

Coverage includes:

- Duplicate question IDs, independent edits, clone/save/reload, option deletion, branch remapping, and drag/drop.
- Delayed reads, edits during saves, failed saves, and stable published URLs.
- Eight question types, required/optional values, both layouts, branches, quizzes, retries, and duplicate submit events.
- Korean IME, keyboard settings, input cursor keys, international phone formats, and other-choice inputs.
- Dashboard navigation, response filters/table mode, phone search, and duplicate grouping.
- Five current themes, 29 legacy themes, six color pairs, three viewport widths, and ten animation modes.
- No production Google OAuth, Google Sheets, or real database writes are exercised.
