Port the ps dark-mode pattern to ae3: `system | light | dark` mode defaulting to the OS preference, persisted, flash-free, with a cycling icon button — plus a full conversion of all hardcoded light colors to theme variables.

## 1. Mode plumbing (ps pattern)

- **`src/store/index.ts`**: `export type ThemeMode = 'system' | 'light' | 'dark'` and `themeModeAtom = atomWithStorage<ThemeMode>('ae-theme-mode', 'system', undefined, { getOnInit: true })` (follows the existing `ae-` key convention; `getOnInit` reads storage synchronously).
- **`src/theme.js`**: export `lightTheme` (the current theme, untouched) and `darkTheme` — `createTheme` with `palette.mode: 'dark'`, primary orange, secondary green, error red, MUI dark defaults for background/paper.
- **`src/App.jsx`**: `themeMode` read with `useAtomValue(themeModeAtom, { store })` (like ps — App renders the JotaiProvider inside itself, so the custom store must be passed explicitly); `systemPrefersDark` lazy `useState` from `matchMedia('(prefers-color-scheme: dark)')` + `change` listener; `isDark = mode === 'dark' || (mode === 'system' && systemPrefersDark)`; `useEffect` mirrors it to `document.documentElement.dataset.theme`, `style.colorScheme`, and the `<meta name="theme-color">` content (#943400 ↔ dark background); `ThemeProvider theme={isDark ? darkTheme : lightTheme}`.
- **`index.html`**: pre-paint inline script at the end of `<head>` (ps pattern): `JSON.parse(localStorage['ae-theme-mode'])` (jotai JSON-encodes), resolve against `prefers-color-scheme`, set `html[data-theme]` + `color-scheme` — no light→dark flash.

## 2. Global CSS dark variants + theme variables (`src/index.css`)

- `html { color-scheme: light }` / `html[data-theme='dark'] { color-scheme: dark; scrollbar-color: … }`; dark `body` background override; dark variants for webkit/simplebar scrollbars and react-reflex splitters.
- Define CSS custom properties on `html` (light values) and `html[data-theme='dark']` (dark values) for the recurring palette: `--ae-bg-page`, `--ae-bg-surface` (#fff3e0), `--ae-bg-highlight` (#ffcc80), `--ae-bg-highlight-strong` (#ffe0b2), `--ae-text-primary/secondary/faint`, `--ae-border`, `--ae-brand-accent` (#D84315→lighter in dark), `--ae-green`, `--ae-text-shadow-color`, `--ae-tab-selected`.

## 3. Full sweep of hardcoded colors

- **~68 `*.module.css` files**: replace hardcoded cream/white/black/grey literals with the variables (mechanical mapping, done with sed per color + manual review). Deliberately unchanged: AppBar `#c24600` brand bar with white text (stays orange in dark, like ps's colored headers), the already-dark TreeContextMenu, MoreMenu hover.
- **Inline JSX colors**: Tree Row `#D84315` → `var(--ae-brand-accent)`; stacked Tabs in DataStacked/Docs/ExportStacked → text/selected/indicator vars; DataTable `white` → surface var, `#ffcc80` cells → highlight var.
- **Tree Filter react-select** (`getCustomStyles`): derive its hardcoded blacks/oranges from `useTheme()` palette instead of literals.
- PWA manifest stays brand `#943400`; only the runtime meta theme-color switches.

## 4. Toggle UI (ps pattern)

- **`src/components/Layout/AppBar/ThemeChooser.jsx`**: icon-only cycling button system → light → dark → system, icons `MdBrightnessAuto`/`MdLightMode`/`MdDarkMode` (verify availability in ae3's react-icons version), `title`/`aria-label` "Darstellung: wie System / hell / dunkel", placed in the AppBar buttons row before the share button/more menu, `color="inherit"`. (Verify icon existence; fall back to closest equivalents if missing.)

## 5. Verification

- `npm test`, `npm run build`, eslint on touched files.
- New e2e test in smoke.spec.js: clicking the chooser cycles `html[data-theme]` (light→dark on a light-preferring runner) and the choice survives reload (localStorage).
- Visual check: Playwright screenshots of Home, tree + object page, and Export in dark mode — I'll read the images and tune the dark variable values where surfaces look wrong.
- Remove the dark-mode entry from tasks.md.

Notes: the light theme keeps its existing quirks (misplaced `background` key is harmless and out of scope). The existing `useSetAtom(activeNodeArrayAtom)` in App.jsx uses the default store — I will not touch it; the new atom reads pass `{ store }` explicitly like ps does.