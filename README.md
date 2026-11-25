# Kinetic Enterprise UI Kit

A dark, quiet UI kit for work that gets filled in: intake, review queues, records, settings. One green accent, serif titles, mono labels, sans body.

| File | Use |
|---|---|
| `KINETIC-ENTERPRISE-UI-KIT.md` | The spec. §9 is an instructions block to paste into a chat assistant. |
| `kinetic-enterprise.tsx` | The whole React library in one file. React 18 only; the stylesheet is built in. |
| `kinetic-enterprise.css` | The same styles for plain HTML. The source of truth for both. |
| `build.mjs` | `node build.mjs` re-embeds the CSS in the TSX after you edit the CSS. No dependencies. |
| `CHANGELOG.md` | What changed in each version. |

Current version: 2.4.0. It adds Menu, CopyValue, Pagination and FileDrop; a high-contrast theme (`data-theme="dark-hc"`); full keyboard support for Tabs, Menu and Dialog; and control borders that meet 3:1 on every surface.

## Raw links for assistants

- Spec: https://raw.githubusercontent.com/polyoraceuphoria/kinetic-enterprise-ui-kit/main/KINETIC-ENTERPRISE-UI-KIT.md
- React library: https://raw.githubusercontent.com/polyoraceuphoria/kinetic-enterprise-ui-kit/main/kinetic-enterprise.tsx
- CSS: https://raw.githubusercontent.com/polyoraceuphoria/kinetic-enterprise-ui-kit/main/kinetic-enterprise.css

## Use

1. Give the assistant the spec and the React library (the links above).
2. Paste the §9 instructions block and replace `[PRODUCT NAME]` and `[WORKSPACE NAME]`.
3. Import every component from `./kinetic-enterprise` and render `<KineticStyles />` once at the root. No Tailwind or other UI library.
