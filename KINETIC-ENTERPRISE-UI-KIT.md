# Kinetic Enterprise UI Kit

**Version** 2.3.0-chatgpt · **Register** Enterprise (the writing register) · **Source** Kinetic UI Kit v2.3.0, `kernel.css` + `enterprise.css`

**Product** Name your product and current workspace in the instructions block in §9.

A Kinetic product holds workspaces. The interface reads as `Kinetic <Product> · <Workspace>`.

The Enterprise register is Kinetic's surface for work that gets filled in: matters, intake, review queues, settings, tables of evidence. It is dark, quiet and exact. One green carries every signal. Nothing decorates.

This document is the spec. The library is two files that implement it:

| File | Use it when |
|---|---|
| `kinetic-enterprise.tsx` | You are building in React (a ChatGPT or Wisp canvas, an app widget, a Next.js page). One file, no dependencies beyond React 18. The stylesheet is inlined. |
| `kinetic-enterprise.css` | You are writing plain HTML, or any framework that takes class names. |

Both carry the same values. The CSS file is the source; `node build.mjs` regenerates the TSX from it.

---

## 1. Using it in ChatGPT

1. Attach `KINETIC-ENTERPRISE-UI-KIT.md` and `kinetic-enterprise.tsx` to the GPT, project or chat as knowledge files.
2. Paste the block in §9 into the GPT's instructions (or at the top of the chat).
3. Ask for screens by what they do ("an intake queue with a bulk-assign bar"), not by how they look. The rules below decide the look.

If ChatGPT cannot read an attachment, paste `kinetic-enterprise.tsx` into the chat directly. It is self-contained.

---

## 2. Principles

1. **Tokens are law.** Every colour, size, space, radius, duration and z-index comes from a token. A literal value in product code is a bug.
2. **Three voices.** Serif *states* (page titles, dialog titles, empty-state headings). Mono *proves* (labels, IDs, numbers, hashes, timestamps, buttons). Sans *explains* (body, inputs, help text).
3. **One green.** `--green` is the only accent. It means: selected, active, primary, healthy, focused. Never use it for decoration.
4. **Muted status.** Warning and error inks are desaturated (`--warn`, `--bad`). Status is carried by a dot or a left rule, not by a coloured block.
5. **Every control has every state.** Rest, hover, focus, active, disabled, loading, error, success, read-only. If a state is missing, the control is not finished.
6. **Focus is visible.** A 1px green outline, offset 3px. Never remove it.
7. **Surfaces, not shadows.** Depth is three flat layers (`--bg` → `--surface` → `--surface-2`) separated by 1px lines. Only menus and popovers cast a shadow.
8. **Degrade, never break.** Below 900px the sidebar becomes a top row and grids stack. Wide tables scroll inside their wrapper. Long hashes wrap.

---

## 3. Tokens

### Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#101418` | Page canvas |
| `--surface` | `#171D23` | Panels, sidebar, table header, dialogs |
| `--surface-2` | `#1C242B` | Hover fill, pills, secondary buttons |
| `--line` | `#2A323B` | Dividers, panel borders |
| `--line-s` | `#364049` | Stronger borders (buttons, dialogs, menus) |
| `--line-i` | `#606B77` | Input and checkbox borders (3:1 non-text contrast) |
| `--fg` | `#E9E7E2` | Primary text |
| `--muted` | `#9BA1A8` | Secondary text, body copy in panels |
| `--dim` | `#828B95` | Labels, metadata (AA at 9.5px) |
| `--faint` | `#3A424A` | Disabled text, separators |
| `--green` | `#3CB44B` | The signal: primary, selected, focus |
| `--green-b` | `#5BD86B` | Signal text on dark (active nav, stat values) |
| `--green-dim` | `rgba(60,180,75,.10)` | Selected row, active nav fill, note fill |
| `--ok` | `#8FAE84` | Success help text |
| `--warn` | `#C79A4E` | Warning |
| `--bad` | `#C97F72` | Error, destructive |

### Type

| Token | Value |
|---|---|
| `--serif` | Cormorant Garamond |
| `--sans` | Inter |
| `--mono` | Geist Mono |

Size scale is anchored at `--fs-base` (13px, table body). Common steps: `--fs-2xs` 9.5 (labels) · `--fs-xs` 10 (pills, section heads) · `--fs-sm` 11 (buttons, help) · `--fs-md` 12 · `--fs-base` 13 · `--fs-base-5` 13.5 (inputs, panel text) · `--fs-lg-5` 14.5 (lead) · `--fs-xl` 15 (body) · `--fs-title` 20 (dialog title) · `--fs-h1` 26 (stat value) · `--fs-d2` 34 (page title).

Weights: `--fw-regular` 400 · `--fw-medium` 500 · `--fw-semi` 600. Mono labels are uppercase with wide tracking (`--ls-label` .16em to `--ls-wide` .2em).

### Space, shape, motion, depth

| Group | Tokens |
|---|---|
| Space (4px base) | `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 64 |
| Radius | `--radius` 6px (controls) · panels 8px · pills 99px |
| Width | `--maxw` 1180px main column · sidebar 248px |
| Motion | `--t-fast` 120ms · `--t-base` 180ms · `--t-slow` 300ms · `--ease` cubic-bezier(.25,.1,.25,1) |
| Z-index | `--z-nav` 50 · `--z-gate` 60 · `--z-modal` 70 · `--z-toast` 80 |

Motion is CSS only and switches off under `prefers-reduced-motion`.

---

## 4. Page anatomy

```
Shell
├── aside (248px, --surface)
│   ├── brand (serif)  ·  brand-sub (mono, tracked)
│   ├── nav sections (mono heads) → nav items (active = green-dim fill)
│   └── side-foot (mono metadata, pinned bottom)
└── main (max 1180px, padding 40 / 48)
    ├── Crumbs
    ├── PageHeader (kicker · serif h1 · lead)
    ├── StatBand (4 figures)
    ├── Tabs
    ├── Panel(s) → table, form, description list
    └── Footer (mono, tracked)
```

One serif title per page. One primary button per view. Stat bands hold four figures, two below 900px.

---

## 5. Components

Each entry gives the React part, the CSS class it renders, and the rule that governs it.

### Layout

| React | Class | Rule |
|---|---|---|
| `<Shell brand nav active onNavigate foot>` | `.shell` | Every app screen. Includes a skip link to `#k-main`. |
| `<PageHeader kicker title lead>` | `.kicker`, `h1.ent`, `.lead` | Title may wrap one word in `<b>` for green emphasis. Use it once, or not at all. |
| `<Crumbs trail>` | `.crumbs` | Last item is the current page and is not a link. |
| `<Panel title>` | `.panel` | The container for every form, table and list. Title is a mono label, not a heading. |
| `<Grid2>` | `.grid2` | Two equal columns; stacks below 900px. |
| `<Footer>` | `.foot` | Build, version, data-as-of. Mono. |

### Actions

| React | Class | Rule |
|---|---|---|
| `<Button variant size loading>` | `.btn` `.primary` `.ghost` `.danger` `.danger.solid` `.sm` `.lg` `.loading` | Labels are verbs, mono, short ("Assign", "Export"). One `primary` per view. `danger-solid` only inside a destructive dialog. |
| `<ButtonGroup options value onChange label>` | `.btngroup` | Segmented choice of 2–4 options. Selected segment takes the green border. |

### Status

| React | Class | Rule |
|---|---|---|
| `<Pill intent processing>` | `.pill` `.ok` `.warn` `.bad` `.neutral` `.proc` | The dot carries the state; the text says it ("Verified", "Pending review"). `processing` pulses. |
| `<Note intent title onDismiss>` | `.note` `.info` `.warn` `.bad` | Inline message within a page. Default intent is the green note. |
| `<Progress value caption warn>` | `.bar` `.bar-cap` | Omit `value` for indeterminate. Caption is mono ("412 / 1,000 documents"). |
| `<Steps steps current>` | `.steps` | Wizards of 3–6 steps. Done steps keep the green rule. |
| `<Toasts items>` | `.toasts` `.toast` | Confirmations after an action. Top right, stacked. Title is past tense ("Exported"). |

### Forms

| React | Class | Rule |
|---|---|---|
| `<TextField label help error success required>` | `.field` | Label is mono uppercase above the input. Help sits below. `error` replaces help and turns it `--bad`. |
| `<TextArea …>` | `.field textarea` | Resizes vertically. Minimum 88px. |
| `<Select options …>` | `.field select` | Native select, kit chevron. |
| `<Checkbox label radio>` | `.check` `.check.radio` | Label sits right of the box. |
| `<Toggle label>` | `.toggle` | Immediate settings only. If it needs a Save, use a checkbox. |
| `<Fieldset legend>` | `.fset` | Groups related fields under a ruled mono legend. |
| `<FormFoot note>` | `.formfoot` | Sticky row: save note left, buttons right, primary last. |

Fields are 420px wide at most. Errors are stated plainly and say how to fix them ("Enter a date after the filing date").

### Data

| React | Class | Rule |
|---|---|---|
| `<DataTable columns rows rowKey label dense selected onToggleRow>` | `.tblwrap` `table.ent` | First column is the identifier, in mono. Numbers set `num` (right-aligned, tabular). Hashes set `hash` (wrap anywhere). Always pass `label` for the scroll region. |
| `<BulkBar count>` | `.bulkbar` | Appears only while rows are selected. Count in mono green. |
| `<DescriptionList items>` | `.dl` | Record detail: mono term, sans detail. |
| `<StatBand stats>` | `.band` | Four headline figures. `muted` for figures that are not a signal. |
| `<EmptyState glyph title action error>` | `.ent-state` | Every list has one. Says what will appear and how to make it appear. |
| `<Skeleton widths>` | `.skelrow` `.skel` | Loading rows. Never a spinner over a whole page. |

### Overlays and navigation

| React | Class | Rule |
|---|---|---|
| `<Tabs tabs value onChange>` | `.enttabs` | Sections within one record. Not for top-level navigation. |
| `<Dialog open title onClose footer destructive>` | `.ent-scrim` `.dialog` | Closes on Escape and on scrim click. Destructive dialogs title in `--bad` and name the thing being deleted. |
| `<Kbd>` | `kbd` | Keyboard hints. |

### CSS-only extras

`kinetic-enterprise.css` also carries classes with no React wrapper yet: `.affix` (input prefix/suffix), `.cnt` (character count), `.drop` (file drop zone), `.tblfoot` (pager), `table.ent th.sort` (sortable headers), `.skip`. Use them by class name.

---

## 6. Content rules

- Sentence case everywhere except mono labels, which are uppercase by style (write them in sentence case; CSS uppercases them).
- Buttons are verbs. Pills are states. Panel titles are nouns.
- Dates as `2026-11-15`, times as `14:05 UTC`, both in mono.
- Identifiers, hashes and counts are mono and never truncated without a copy affordance.
- No exclamation marks, no emoji, no marketing language. The product serves sensitive tactical, legal, investigative and crisis work.
- Operation names are proper nouns in sentence case: "Operation Example", never "OPERATION EXAMPLE" in body text (mono labels uppercase it by style).
- Sample data is placeholder only. No real names, places, coordinates, case numbers or identifiers from a live operation, in mockups or in prompts.

---

## 7. Accessibility

- Text meets WCAG AA on all three surfaces; input borders meet 3:1 (1.4.11).
- Every interactive part is reachable by keyboard and shows the green focus ring.
- Table wrappers are focusable regions with a label (2.1.1).
- Fields link help and errors through `aria-describedby`; errors set `aria-invalid`.
- Toggles use `role="switch"`; tabs use `role="tab"` with `aria-selected`; the active nav item has `aria-current="page"`.
- Forced-colours mode keeps active nav and progress visible.
- Reduced motion stops animation without hiding state.

---

## 8. Do and don't

| Do | Don't |
|---|---|
| Put every table and form inside a `Panel`. | Float controls on the bare canvas. |
| Use `--green` for one meaning at a time. | Add a second accent colour or gradients. |
| Use mono for anything a user might copy or compare. | Set body paragraphs in mono. |
| Show an empty state with a next step. | Leave a blank table. |
| Use tokens (`var(--s4)`, `var(--line)`). | Write `16px` or `#2a323b` in product code. |
| Keep the dark canvas. | Add a light theme ad hoc. Print is the only light surface. |

---

## 9. Instructions block for ChatGPT

Paste this into the GPT's instructions, or at the start of a chat, with the two files attached.

```text
You build interfaces for [PRODUCT NAME] in the Kinetic Enterprise UI Kit. The current workspace is [WORKSPACE NAME]. The spec is KINETIC-ENTERPRISE-UI-KIT.md and the library is kinetic-enterprise.tsx, both attached.

Rules:
- The brand reads "Kinetic [Product]" (the product word in green) and the brand line reads the workspace name. Breadcrumbs start at the product, then the workspace.
- Use placeholder data only (IDs like KX-0001, roles like "Team lead"). Never ask for, invent as real, or repeat real names, places, coordinates or identifiers from a live operation.
- Import every component from "./kinetic-enterprise" and render <KineticStyles /> once at the root. If you must produce one self-contained file, copy kinetic-enterprise.tsx in full above your screen code, unchanged.
- Do not use Tailwind, shadcn, MUI or any other UI library or icon set. Do not write new CSS unless no kit class covers the need; if you do, use only the kit's CSS variables (var(--surface), var(--s4), var(--radius)…), never literal colours or pixel values.
- Every screen sits in <Shell>. One serif page title (PageHeader), one primary Button per view, tables and forms inside <Panel>.
- Mono for identifiers, numbers, dates, hashes and labels. Serif only for page, dialog and empty-state titles. Sans for everything else.
- Green (--green) means selected, primary, healthy or focused, nothing else. Status uses <Pill intent="ok|warn|bad">.
- Every list has an EmptyState; every async view has a Skeleton; every form field has a label and, when invalid, an error that says how to fix it.
- Tone: minimal and serious. No emoji, no exclamation marks, no marketing copy. Use realistic sample data for legal, investigative and crisis work.
- Before finishing, check: tokens only, every control has its states, keyboard focus visible, layout holds at 375px.
```

---

## 10. Minimal screen

```tsx
import * as React from "react";
import { KineticStyles, Shell, PageHeader, StatBand, Panel, DataTable, Pill, Button } from "./kinetic-enterprise";

type Row = { id: string; title: string; source: string; status: string; items: number };
const rows: Row[] = [
  { id: "KX-0418", title: "Placeholder signal A", source: "Field", status: "Pending review", items: 3 },
  { id: "KX-0417", title: "Placeholder signal B", source: "Liaison", status: "Verified", items: 7 },
];

export default function Intake() {
  return (
    <>
      <KineticStyles />
      <Shell
        brand={<>Kinetic <b>Product</b></>}
        brandSub="WORKSPACE"
        active="intake"
        nav={[{ title: "Operation", items: [{ id: "intake", label: "Intake", badge: 12 }, { id: "matters", label: "Matters" }] }]}
        foot="build 2.3.0 · data as of 2026-11-15"
      >
        <PageHeader kicker="Product · Workspace" title="Intake" lead="Signals waiting for triage, newest first." />
        <StatBand stats={[
          { label: "Open", value: 12 }, { label: "Verified today", value: 4 },
          { label: "Awaiting owner", value: 3, muted: true }, { label: "Median age", value: "6h", muted: true },
        ]} />
        <Panel title="Queue">
          <DataTable<Row>
            label="Intake queue"
            rowKey={(r) => r.id}
            rows={rows}
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Signal" },
              { key: "source", label: "Source" },
              { key: "status", label: "Status", render: (r) => <Pill intent={r.status === "Verified" ? "ok" : "warn"}>{r.status}</Pill> },
              { key: "items", label: "Items", num: true },
            ]}
          />
        </Panel>
        <Button variant="primary">Assign selected</Button>
      </Shell>
    </>
  );
}
```
