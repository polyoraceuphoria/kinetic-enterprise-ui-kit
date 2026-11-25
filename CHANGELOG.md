# Changelog

Versions follow semantic versioning: a renamed token or removed prop is a major version, a new component or prop is minor, a value fix is a patch.

## 2.4.0-chatgpt · 2026-11-25

### Added
- `Menu`: action menu with full keyboard support; the only surface that casts a shadow.
- `CopyValue`: identifier or hash with a Copy button, so nothing is truncated without a copy affordance.
- `Pagination`: the `.tblfoot` pager as a component, with ellipses and `aria-current`.
- `FileDrop`: the `.drop` zone as a real, keyboard-reachable file input.
- `TabPanel`, linked to its tab by `idBase`.
- `TextField` `prefix` and `suffix` (`.affix`); `TextArea` `maxLength` with a live counter (`.cnt`).
- `DataTable` sortable columns (`sort`, `onSort`, `aria-sort`), select-all with an indeterminate state (`onToggleAll`), and a caption.
- `Checkbox` `indeterminate`; `Toasts` `onDismiss`; `Skeleton` `label`.
- High-contrast theme `[data-theme="dark-hc"]`: text 7:1 and borders 3:1 on every surface.
- Tokens `--shadow-menu`, `--field-bg`, `--on-green`, `--radius-panel`, `--radius-pill`, `--radius-kbd`.
- `build.mjs`, which re-embeds the CSS in the TSX.

### Changed
- `--line-i` from `#606B77` to `#6A7581`: control borders now hold 3:1 on `--surface-2` (were 2.9:1).
- Error and destructive tints (danger buttons, bad pills and notes, error empty states) now use `--bad`'s colour; they still used the pre-v2 red.
- `kbd` border from `--faint` to `--line-s`.
- `Dialog` moves focus inside on open, traps Tab, locks page scroll, restores focus on close, and is an `alertdialog` when destructive.
- `Tabs` use roving focus: arrow keys, Home and End.
- `Button` defaults to `type="button"`, disables while loading, and forwards its ref.
- Every literal size, radius and colour left in the stylesheet now reads a token.

### Deprecated
- Legacy aliases `--ink`, `--ink-2`, `--ink-3`, `--accent`, `--accent-b`, `--sig`, `--sig-2`, `--sig-dim`, `--amber`, `--red` (marked "do not use in new work" since v2). They still resolve, now pointing at the current tokens (`--amber` to `--warn`, `--red` to `--bad`), and will be removed in 3.0. Replace them with `--fg`, `--muted`, `--dim`, `--green`, `--green-b`, `--green-dim`, `--warn` and `--bad`.

## 2.3.0-chatgpt
- Spec, one-file React library and CSS.
