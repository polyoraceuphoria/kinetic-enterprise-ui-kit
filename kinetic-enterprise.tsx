/* ============================================================
   KINETIC ENTERPRISE · React library · v2.3.0-chatgpt
   One file. React 18+, no other dependencies, no Tailwind needed.
   Render <KineticStyles /> once at the root, then use the parts.
   Every component maps 1:1 to a class in kinetic-enterprise.css.
   ============================================================ */
import * as React from "react";

type Intent = "ok" | "warn" | "bad";
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/* ---------- styles ---------- */
// Raw injection is deliberate: KINETIC_CSS is a build-time constant, never user input.
// A plain text child would be HTML-escaped on server render and break quotes and ">" selectors.
export const KineticStyles = () => <style dangerouslySetInnerHTML={{ __html: KINETIC_CSS }} />;

/* ---------- shell ---------- */
export type NavItem = { id: string; label: string; badge?: string | number; disabled?: boolean };
export type NavSection = { title?: string; items: NavItem[] };

export const Shell = ({
  brand, brandSub, nav, active, onNavigate, foot, children,
}: {
  brand: React.ReactNode; brandSub?: string; nav: NavSection[]; active?: string;
  onNavigate?: (id: string) => void; foot?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="shell">
    <a className="skip" href="#k-main">Skip to content</a>
    <aside>
      <div className="brand">{brand}</div>
      {brandSub && <div className="brand-sub">{brandSub}</div>}
      <nav aria-label="Primary">
        {nav.map((sec, i) => (
          <React.Fragment key={sec.title ?? i}>
            {sec.title && <div className="nsec">{sec.title}</div>}
            {sec.items.map((it) => (
              <button
                key={it.id}
                className={cx(it.id === active && "on")}
                aria-current={it.id === active ? "page" : undefined}
                disabled={it.disabled}
                onClick={() => onNavigate?.(it.id)}
              >
                {it.label}
                {it.badge !== undefined && <span className="nbadge">{it.badge}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>
      {foot && <div className="side-foot">{foot}</div>}
    </aside>
    <main id="k-main">{children}</main>
  </div>
);

/* ---------- page header ---------- */
export const Crumbs = ({ trail }: { trail: Array<{ label: string; href?: string }> }) => (
  // A div with role, not <nav>: the kit's ".shell nav" rules would restyle it as sidebar items.
  <div className="crumbs" role="navigation" aria-label="Breadcrumb">
    {trail.map((t, i) => (
      <React.Fragment key={t.label}>
        {i > 0 && <span aria-hidden>/</span>}
        {i === trail.length - 1 ? <b aria-current="page">{t.label}</b> : <a href={t.href ?? "#"}>{t.label}</a>}
      </React.Fragment>
    ))}
  </div>
);

export const PageHeader = ({ kicker, title, lead }: { kicker?: string; title: React.ReactNode; lead?: React.ReactNode }) => (
  <header>
    {kicker && <div className="kicker">{kicker}</div>}
    <h1 className="ent">{title}</h1>
    {lead && <p className="lead">{lead}</p>}
  </header>
);

/* ---------- layout ---------- */
export const Panel = ({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) => (
  <section className={cx("panel", className)}>
    {title && <h4>{title}</h4>}
    {children}
  </section>
);

export const Grid2 = ({ children }: { children: React.ReactNode }) => <div className="grid2">{children}</div>;

/* ---------- stat band ---------- */
export type Stat = { label: string; value: React.ReactNode; muted?: boolean };
export const StatBand = ({ stats }: { stats: Stat[] }) => (
  <div className="band">
    {stats.map((s) => (
      <div key={s.label}>
        <div className={cx("v", s.muted && "mute")}>{s.value}</div>
        <div className="k">{s.label}</div>
      </div>
    ))}
  </div>
);

/* ---------- buttons ---------- */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger" | "danger-solid";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};
export const Button = ({ variant = "default", size = "md", loading, className, children, ...rest }: ButtonProps) => (
  <button
    {...rest}
    aria-busy={loading || undefined}
    className={cx(
      "btn",
      variant === "primary" && "primary",
      variant === "ghost" && "ghost",
      variant.startsWith("danger") && "danger",
      variant === "danger-solid" && "solid",
      size !== "md" && size,
      loading && "loading",
      className,
    )}
  >
    {children}
  </button>
);

export const ButtonGroup = ({ options, value, onChange, label }: {
  options: Array<{ value: string; label: string }>; value: string; onChange: (v: string) => void; label: string;
}) => (
  <div className="btngroup" role="group" aria-label={label}>
    {options.map((o) => (
      <button key={o.value} className={cx("btn sm", o.value === value && "on")} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
        {o.label}
      </button>
    ))}
  </div>
);

/* ---------- status ---------- */
export const Pill = ({ intent, processing, children }: { intent?: Intent | "neutral"; processing?: boolean; children: React.ReactNode }) => (
  <span className={cx("pill", processing ? "proc" : intent)}>
    <span className="dot" aria-hidden />
    {children}
  </span>
);

export const Note = ({ intent, title, children, onDismiss }: {
  intent?: "info" | "warn" | "bad"; title?: string; children: React.ReactNode; onDismiss?: () => void;
}) => (
  <div className={cx("note", intent)} role={intent === "bad" ? "alert" : "status"}>
    {onDismiss && <button className="dismiss" aria-label="Dismiss" onClick={onDismiss}>×</button>}
    {title && <b>{title} </b>}
    {children}
  </div>
);

export const Progress = ({ value, caption, warn }: { value?: number; caption?: string; warn?: boolean }) => (
  <div>
    <div
      className={cx("bar", warn && "warn", value === undefined && "indet")}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={caption}
    >
      <i style={value === undefined ? undefined : { width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
    {caption && <div className="bar-cap">{caption}</div>}
  </div>
);

export const Steps = ({ steps, current }: { steps: string[]; current: number }) => (
  <div className="steps" aria-label="Progress">
    {steps.map((s, i) => (
      <div key={s} className={cx(i < current && "done", i === current && "on")} aria-current={i === current ? "step" : undefined}>
        <span className="n">{String(i + 1).padStart(2, "0")}</span>{s}
      </div>
    ))}
  </div>
);

/* ---------- forms ---------- */
type FieldShell = { label: string; help?: string; error?: string; success?: string; required?: boolean; id?: string };
const useFieldId = (id?: string) => {
  const auto = React.useId();
  return id ?? `k${auto.replace(/:/g, "")}`;
};
const FieldWrap = ({ f, fid, children }: { f: FieldShell; fid: string; children: React.ReactNode }) => {
  const msg = f.error ?? f.success ?? f.help;
  return (
    <div className={cx("field", f.error && "err", !f.error && f.success && "ok")}>
      <label htmlFor={fid}>{f.label}{f.required && <span className="req" aria-hidden>*</span>}</label>
      {children}
      {msg && <div className="help" id={`${fid}-help`}>{msg}</div>}
    </div>
  );
};
const aria = (f: FieldShell, fid: string) => ({
  id: fid,
  required: f.required,
  "aria-invalid": f.error ? true : undefined,
  "aria-describedby": f.error || f.success || f.help ? `${fid}-help` : undefined,
});

export const TextField = ({ label, help, error, success, required, id, ...input }: FieldShell & React.InputHTMLAttributes<HTMLInputElement>) => {
  const f = { label, help, error, success, required }; const fid = useFieldId(id);
  return <FieldWrap f={f} fid={fid}><input {...input} {...aria(f, fid)} /></FieldWrap>;
};

export const TextArea = ({ label, help, error, success, required, id, ...ta }: FieldShell & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const f = { label, help, error, success, required }; const fid = useFieldId(id);
  return <FieldWrap f={f} fid={fid}><textarea {...ta} {...aria(f, fid)} /></FieldWrap>;
};

export const Select = ({ label, help, error, success, required, id, options, ...sel }: FieldShell & React.SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) => {
  const f = { label, help, error, success, required }; const fid = useFieldId(id);
  return (
    <FieldWrap f={f} fid={fid}>
      <select {...sel} {...aria(f, fid)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldWrap>
  );
};

export const Checkbox = ({ label, radio, ...input }: { label: React.ReactNode; radio?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className={cx("check", radio && "radio")}>
    <input type={radio ? "radio" : "checkbox"} {...input} />
    <span>{label}</span>
  </label>
);

export const Toggle = ({ label, ...input }: { label: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="toggle">
    <input type="checkbox" role="switch" {...input} />
    <span>{label}</span>
  </label>
);

export const Fieldset = ({ legend, children }: { legend: string; children: React.ReactNode }) => (
  <fieldset className="fset"><legend>{legend}</legend>{children}</fieldset>
);

export const FormFoot = ({ note, children }: { note?: string; children: React.ReactNode }) => (
  <div className="formfoot">
    {note && <span className="savenote">{note}</span>}
    <span className="spacer" />
    {children}
  </div>
);

/* ---------- navigation ---------- */
export const Tabs = ({ tabs, value, onChange }: {
  tabs: Array<{ value: string; label: string; disabled?: boolean }>; value: string; onChange: (v: string) => void;
}) => (
  <div className="enttabs" role="tablist">
    {tabs.map((t) => (
      <button key={t.value} role="tab" aria-selected={t.value === value} className={cx(t.value === value && "on")} disabled={t.disabled} onClick={() => onChange(t.value)}>
        {t.label}
      </button>
    ))}
  </div>
);

/* ---------- data ---------- */
export type Column<R> = { key: keyof R & string; label: string; num?: boolean; hash?: boolean; render?: (row: R) => React.ReactNode };
export const DataTable = <R extends Record<string, unknown>>({
  columns, rows, rowKey, label, dense, empty = "Nothing here yet.", selected, onToggleRow,
}: {
  columns: Column<R>[]; rows: R[]; rowKey: (r: R) => string; label: string; dense?: boolean;
  empty?: string; selected?: Set<string>; onToggleRow?: (key: string) => void;
}) => (
  <div className="tblwrap" tabIndex={0} role="region" aria-label={label}>
    <table className={cx("ent", dense && "dense")}>
      <thead>
        <tr>
          {onToggleRow && <th className="rowck"><span className="sr-only">Select</span></th>}
          {columns.map((c) => <th key={c.key} className={cx(c.num && "num")} scope="col">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr className="ent-empty"><td colSpan={columns.length + (onToggleRow ? 1 : 0)}>{empty}</td></tr>
        )}
        {rows.map((r) => {
          const k = rowKey(r); const on = selected?.has(k);
          return (
            <tr key={k} className={cx(on && "sel")}>
              {onToggleRow && (
                <td className="rowck">
                  <label className="check"><input type="checkbox" checked={!!on} onChange={() => onToggleRow(k)} aria-label={`Select ${k}`} /></label>
                </td>
              )}
              {columns.map((c) => (
                <td key={c.key} className={cx(c.num && "num", c.hash && "hash")}>
                  {c.render ? c.render(r) : String(r[c.key] ?? "")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const BulkBar = ({ count, children }: { count: number; children: React.ReactNode }) =>
  count > 0 ? (
    <div className="bulkbar" role="status"><span className="n">{count}</span> selected<span className="spacer" />{children}</div>
  ) : null;

export const DescriptionList = ({ items }: { items: Array<{ term: string; detail: React.ReactNode }> }) => (
  <dl className="dl">
    {items.map((it) => (
      <React.Fragment key={it.term}><dt>{it.term}</dt><dd>{it.detail}</dd></React.Fragment>
    ))}
  </dl>
);

export const EmptyState = ({ glyph = "∅", title, children, action, error }: {
  glyph?: string; title: string; children?: React.ReactNode; action?: React.ReactNode; error?: boolean;
}) => (
  <div className={cx("ent-state", error && "err")}>
    <div className="glyph" aria-hidden>{glyph}</div>
    <h4>{title}</h4>
    {children && <p>{children}</p>}
    {action}
  </div>
);

export const Skeleton = ({ widths = [120, 260, 80] }: { widths?: number[] }) => (
  <div className="skelrow" aria-hidden>
    {widths.map((w, i) => <span key={i} className="skel" style={{ width: w }} />)}
  </div>
);

/* ---------- overlays ---------- */
export const Dialog = ({ open, title, onClose, footer, destructive, children }: {
  open: boolean; title: string; onClose: () => void; footer?: React.ReactNode; destructive?: boolean; children: React.ReactNode;
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="ent-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("dialog", destructive && "destructive")} role="dialog" aria-modal="true" aria-label={title}>
        <header><h3>{title}</h3><button className="x" aria-label="Close" onClick={onClose}>×</button></header>
        <div className="body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
};

export type ToastItem = { id: string; title: string; body?: string; intent?: "warn" | "bad" };
export const Toasts = ({ items }: { items: ToastItem[] }) => (
  <div className="toasts" aria-live="polite">
    {items.map((t) => (
      <div key={t.id} className={cx("toast", t.intent)}><b>{t.title}</b>{t.body}</div>
    ))}
  </div>
);

export const Kbd = ({ children }: { children: React.ReactNode }) => <kbd>{children}</kbd>;
export const Footer = ({ children }: { children: React.ReactNode }) => <footer className="foot">{children}</footer>;

/* ---------- stylesheet (generated from kinetic-enterprise.css, do not edit here) ---------- */
const KINETIC_CSS = "/* ============================================================\n   KINETIC ENTERPRISE · single-file library for ChatGPT builds\n   Flattened from Kinetic UI Kit v2.3.0: kernel.css + enterprise.css\n   (writing register, core control set). Values are unchanged.\n   One file, no build step. Load fonts, then this file.\n   ============================================================ */\n@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=Geist+Mono:wght@400;600&display=swap');\n\n\n:root{\n  /* ink scale */\n  --fg:#E9E7E2;\n  --muted:#9BA1A8;\n  --dim:#5E666D;\n  --faint:#3A424A;\n\n  /* signal (one green, house-wide) */\n  --green:#3CB44B;\n  --green-b:#5BD86B;\n  --green-dim:rgba(60,180,75,.10);\n\n  /* alerts */\n  --amber:#C9A44D;\n  --red:#B96B5E;\n\n  /* voices */\n  --serif:'Cormorant Garamond',serif;\n  --sans:'Inter',sans-serif;\n  --mono:'Geist Mono',monospace;\n\n  /* spacing scale (4px base, use these, never arbitrary values) */\n  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px; --s6:32px; --s7:48px; --s8:64px;\n\n  /* motion (Active Theory: style states are CSS-only, GPU-safe) */\n  --t-fast:120ms; --t-base:180ms; --t-slow:300ms;\n  --ease:cubic-bezier(.25,.1,.25,1);\n\n  /* z-scale (never invent a z-index) */\n  --z-nav:50; --z-gate:60; --z-modal:70; --z-toast:80;\n\n  /* legacy aliases (fleet compatibility, do not use in new work) */\n  --ink:var(--fg); --ink-2:var(--muted); --ink-3:var(--dim);\n  --accent:var(--green); --accent-b:var(--green-b);\n  --sig:var(--green); --sig-2:var(--green-b); --sig-dim:var(--green-dim);\n}\n\n*{margin:0;padding:0;box-sizing:border-box}\nbody{color:var(--fg);font-family:var(--sans);-webkit-font-smoothing:antialiased}\n::selection{background:rgba(60,180,75,.25)}\n\n/* keyboard focus is law (Apple: a control without visible focus does not exist) */\n:focus-visible{outline:1px solid var(--green);outline-offset:3px;border-radius:1px}\n:focus:not(:focus-visible){outline:none}\n\n/* three voices: serif states, mono proves, sans explains */\n.mono{font-family:var(--mono)}\n.kicker,.lbl{font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim)}\n\n/* screen-reader only */\n.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n\n/* keyboard hint */\nkbd{font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;color:var(--dim);border:1px solid var(--faint);border-radius:3px;padding:2px 6px}\n\n/* skeleton loading (shared shimmer, both screen registers) */\n.skel{display:inline-block;background:var(--faint);opacity:.35;border-radius:2px;animation:k-skel 1.4s var(--ease) infinite;color:transparent!important;pointer-events:none;user-select:none}\n@keyframes k-skel{0%,100%{opacity:.22}50%{opacity:.42}}\n\n/* live pulse (data feels alive, signal only) */\n.pulse{animation:k-pulse 2.2s var(--ease) infinite}\n@keyframes k-pulse{0%,100%{opacity:1}50%{opacity:.45}}\n\n/* reduced motion: everything still works with motion off */\n@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n\n/* scrollbars, quiet */\n::-webkit-scrollbar{width:10px;height:10px}\n::-webkit-scrollbar-thumb{background:var(--faint);border-radius:5px}\n::-webkit-scrollbar-track{background:transparent}\n\n/* ============================================================\n   KINETIC UI KIT · kernel-additions.css · v2.2.0 · TOKENS LANE\n   Typography scale, weight, line-height, letter-spacing tokens.\n   ADDITIVE ONLY: appended after kernel.css, zero visual change.\n   Every value traced from the existing kit registers (kernel,\n   enterprise, hyperminimal). No rendering delta.\n   ============================================================ */\n\n:root {\n\n  /* ── Font Size Scale ──────────────────────────────────────────\n     24-step ramp covering every px literal across all three\n     registers. Anchored at --fs-base (13px, enterprise table body).\n     Steps 4xs → xl span readable text; 2xl → 3xl are transitional;\n     heading/display tiers above. Half-pixel register values carry\n     a \"-5\" suffix (read: \"plus half\").\n     \n     Survey source: kernel.css (9.5, 10), enterprise.css (9 → 34),\n     hyperminimal.css (8.5 → 38). All values pixel-identical. */\n\n  --fs-4xs:    8.5px;   /* HM: book specimen caption                    */\n  --fs-3xs:    9px;     /* ENT: brand-sub, band kicker (.k)             */\n  --fs-2xs:    9.5px;   /* K: kbd; ENT: field labels, th, .foot         */\n  --fs-xs:     10px;    /* K: kicker/lbl; ENT: nav .nsec, pill, legend  */\n  --fs-xs-5:   10.5px;  /* ENT: .tblfoot button; HM: .tblfoot button   */\n  --fs-sm:     11px;    /* ENT: .side-foot, .btn, .help, .affix span    */\n  --fs-sm-5:   11.5px;  /* ENT: table.ent td:first-child mono           */\n  --fs-md:     12px;    /* ENT: .crumbs, .note, .tblfoot, .btn.lg       */\n  --fs-md-5:   12.5px;  /* ENT: .drop, .bulkbar, .toast, dense, state-p */\n  --fs-base:   13px;    /* ENT: table.ent body, .enttabs, .dl, empty    */\n  --fs-base-5: 13.5px;  /* ENT: nav a, .panel p, .field input, .check   */\n  --fs-lg:     14px;    /* ENT: .note .dismiss icon                     */\n  --fs-lg-5:   14.5px;  /* ENT: .lead paragraph                         */\n  --fs-xl:     15px;    /* ENT: body default                             */\n  --fs-2xl:    16px;    /* ENT: .dialog .x close icon                   */\n  --fs-3xl:    17px;    /* HM: mid heading tier                         */\n  --fs-sub:    19px;    /* HM: subheading                               */\n  --fs-title:  20px;    /* ENT: .dialog h3, .ent-state h4               */\n  --fs-brand:  21px;    /* ENT: .shell .brand; HM: brand                */\n  --fs-h2:     24px;    /* ENT: .ent-state .glyph                       */\n  --fs-h1:     26px;    /* ENT: .band .v stat value                     */\n  --fs-d3:     30px;    /* HM: display heading                          */\n  --fs-d2:     34px;    /* ENT: h1.ent; HM: display                     */\n  --fs-d1:     38px;    /* HM: largest display heading                  */\n\n  /* ── Font Weight Tokens ───────────────────────────────────────\n     Three weights used across all registers. Named for role. */\n\n  --fw-regular: 400;    /* body copy, form inputs, panel text            */\n  --fw-medium:  500;    /* emphasis bold (b tags), serif headings        */\n  --fw-semi:    600;    /* mono labels, buttons, table headers           */\n\n  /* ── Line Height Scale ────────────────────────────────────────\n     Five values covering every line-height literal in the kit.  */\n\n  --lh-none:    1;      /* icons, dismiss buttons, single-line compact   */\n  --lh-tight:   1.2;    /* headings, .brand                              */\n  --lh-snug:    1.5;    /* .help text                                    */\n  --lh-base:    1.55;   /* body default                                  */\n  --lh-loose:   1.6;    /* textarea                                      */\n  --lh-relaxed: 1.9;    /* .side-foot (mono at small sizes)              */\n\n  /* ── Letter Spacing Scale ─────────────────────────────────────\n     Named pair: mono label tracking and serif/brand tracking.\n     Individual steps for the graduated mono scale used in labels. */\n\n  --ls-tight:   .01em;  /* serif heading: .ent-state h4                  */\n  --ls-brand:   .02em;  /* .shell .brand serif                           */\n  --ls-kbd:     .08em;  /* kbd element                                   */\n  --ls-btn:     .1em;   /* .btn, .bar-cap                                */\n  --ls-pill:    .12em;  /* .pill                                         */\n  --ls-steps:   .14em;  /* .steps wizard                                 */\n  --ls-label:   .16em;  /* field labels, .dl dt, th                      */\n  --ls-foot:    .18em;  /* .foot, .band .k, .side-foot                   */\n  --ls-wide:    .2em;   /* nav .nsec, .panel h4, .fset legend            */\n  --ls-sub:     .22em;  /* .brand-sub                                    */\n  --ls-mono:    .24em;  /* K: kicker/lbl (widest tracking)               */\n}\n\n:root{\n  /* canvas (enterprise) */\n  --bg:#101418;\n  --surface:#171D23;\n  --surface-2:#1C242B;\n  --line:#2A323B;\n  --line-s:#364049;\n  --radius:6px;\n  --maxw:1180px;\n  /* muted status inks (v2: --bad raised to AA on surface, 5.5:1) */\n  --ok:#8FAE84; --warn:#C79A4E; --bad:#C97F72;\n  /* v2 panel audit: metadata ink AA at 9.5px on this canvas (4.5:1 on all three surfaces) */\n  --dim:#828B95;\n  /* interactive boundary: 3:1 non-text contrast against control bg (WCAG 1.4.11) */\n  --line-i:#606B77;\n}\n\nbody{background:var(--bg);font-size:var(--fs-xl);line-height:var(--lh-base)}\n\n/* ---- surfaced sidebar, 248px ---- */\n.shell{display:grid;grid-template-columns:248px 1fr;min-height:100vh}\n.shell aside{background:var(--surface);border-right:1px solid var(--line);padding:28px 20px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:4px}\n.shell .brand{font-family:var(--serif);font-size:var(--fs-brand);letter-spacing:var(--ls-brand);margin-bottom:4px}\n.shell .brand b{color:var(--green);font-weight:var(--fw-semi)}\n.brand-sub{font-family:var(--mono);font-size:var(--fs-3xs);letter-spacing:var(--ls-sub);color:var(--dim);margin-bottom:28px}\n.shell nav{display:flex;flex-direction:column;gap:2px}\n.shell nav .nsec{font-size:var(--fs-xs);letter-spacing:var(--ls-wide);text-transform:uppercase;color:var(--dim);margin:22px 0 8px 12px;font-family:var(--mono)}\n.shell nav button,.shell nav a{background:none;border:1px solid transparent;text-align:left;color:var(--muted);font-size:var(--fs-base-5);padding:11px 14px;transition:all var(--t-fast) var(--ease);border-radius:var(--radius);cursor:pointer;font-family:var(--sans);display:block;text-decoration:none;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.shell nav button:hover,.shell nav a:hover{background:var(--surface-2);border-color:var(--line);color:var(--fg)}\n.shell nav button.on,.shell nav a.on{background:var(--green-dim);border-color:rgba(60,180,75,.35);color:var(--green-b)}\n.side-foot{margin-top:auto;font-size:var(--fs-sm);color:var(--dim);border-top:1px solid var(--line);padding-top:16px;line-height:var(--lh-relaxed);font-family:var(--mono)}\n.shell main{padding:40px 48px 96px;max-width:var(--maxw);width:100%}\n\n/* ---- headings ---- */\nh1.ent{font-family:var(--serif);font-weight:var(--fw-medium);font-size:var(--fs-d2);margin:10px 0 6px}\nh1.ent b{color:var(--green-b);font-weight:var(--fw-medium)}\n.lead{color:var(--muted);max-width:720px;font-size:var(--fs-lg-5);margin-bottom:32px}\n.lead b{color:var(--fg);font-weight:var(--fw-medium)}\n\n/* ---- panels carry forms ---- */\n.panel{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:20px 22px;margin-bottom:14px}\n.panel h4{font-family:var(--mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--dim);font-weight:var(--fw-regular);margin-bottom:10px;text-transform:uppercase}\n.panel p{font-size:var(--fs-base-5);color:var(--muted);max-width:700px}\n.panel p b{color:var(--fg);font-weight:var(--fw-medium)}\n.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}\n\n/* ---- stat band ---- */\n.band{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;margin-bottom:14px}\n.band>div{background:var(--surface);padding:18px 20px}\n.band .v{font-family:var(--mono);font-size:var(--fs-h1);color:var(--green-b)}\n.band .v.mute{color:var(--fg)}\n.band .k{font-family:var(--mono);font-size:var(--fs-3xs);letter-spacing:var(--ls-foot);color:var(--dim);margin-top:6px;text-transform:uppercase}\n\n/* ---- table ---- */\ntable.ent{width:100%;border-collapse:collapse;font-size:var(--fs-base);font-variant-numeric:tabular-nums}\ntable.ent th{font-family:var(--mono);font-size:var(--fs-2xs);letter-spacing:var(--ls-label);text-transform:uppercase;color:var(--dim);font-weight:var(--fw-semi);text-align:left;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--surface)}\ntable.ent td{padding:12px 14px;border-bottom:1px solid var(--line);color:var(--muted)}\ntable.ent td:first-child{color:var(--fg);font-family:var(--mono);font-size:var(--fs-sm-5)}\ntable.ent tr:hover td{background:rgba(60,180,75,.05)}\n\n/* ---- pills (muted status, dot carries state) ---- */\n.pill{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line-s);border-radius:99px;background:var(--surface-2);padding:5px 12px;font-family:var(--mono);font-size:var(--fs-xs);font-weight:var(--fw-semi);letter-spacing:var(--ls-pill)}\n.pill .dot{width:6px;height:6px;border-radius:50%;background:var(--dim)}\n.pill.ok{color:var(--green-b);border-color:rgba(60,180,75,.3)}.pill.ok .dot{background:var(--green)}\n.pill.warn{color:var(--warn);border-color:rgba(199,154,78,.35)}.pill.warn .dot{background:var(--warn)}\n.pill.bad{color:var(--bad);border-color:rgba(185,107,94,.35)}.pill.bad .dot{background:var(--bad)}\n\n/* ---- buttons ---- */\n.btn{display:inline-block;border:1px solid var(--line-s);border-radius:var(--radius);background:var(--surface-2);color:var(--fg);font-family:var(--mono);font-size:var(--fs-sm);font-weight:var(--fw-semi);letter-spacing:var(--ls-btn);padding:10px 18px;cursor:pointer;text-decoration:none}\n.btn:hover{border-color:var(--dim);background:var(--surface)}\n.btn.primary{background:var(--green);color:#0A0A0A;border-color:var(--green);font-weight:var(--fw-semi)}\n.btn.primary:hover{background:var(--green-b)}\n\n/* ---- fields (real controls, signal focus) ---- */\n.field{margin-bottom:12px;max-width:420px}\n.field label{display:block;font-family:var(--mono);font-size:var(--fs-2xs);font-weight:var(--fw-semi);letter-spacing:var(--ls-label);color:var(--muted);text-transform:uppercase;margin-bottom:6px}\n.field input,.field select,.field textarea{width:100%;background:#12171C;border:1px solid var(--line-i);caret-color:var(--green-b);border-radius:var(--radius);color:var(--fg);font-family:var(--sans);font-size:var(--fs-base-5);padding:11px 13px;outline:none}\n.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--green);outline:2px solid rgba(60,180,75,.25)}\n\n/* ---- notes ---- */\n.note{font-size:var(--fs-md);color:var(--dim);background:var(--green-dim);border:1px solid rgba(60,180,75,.25);border-radius:var(--radius);padding:12px 14px;max-width:760px;margin-top:18px}\n.note b{color:var(--green-b);font-weight:var(--fw-medium)}\n\n/* ---- footer ---- */\n.foot{font-family:var(--mono);font-size:var(--fs-2xs);letter-spacing:var(--ls-foot);color:var(--dim);border-top:1px solid var(--line);margin-top:60px;padding-top:20px}\n\n/* ---- degradable: sidebar collapses to top row ---- */\n@media(max-width:900px){\n  .shell{display:block}\n  .shell aside{position:static;height:auto;flex-direction:row;align-items:center;gap:16px;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line);padding:18px 20px}\n  .shell nav{flex-direction:row;flex-wrap:wrap}\n  .shell nav .nsec{margin:0 4px}\n  .side-foot{display:none}\n  .shell main{padding:26px 20px 80px}\n  .band{grid-template-columns:1fr 1fr}\n  .grid2{grid-template-columns:1fr}\n  .dl{grid-template-columns:1fr}\n  .dl dt{border-bottom:0;padding-bottom:2px}\n  .dl dd{padding-top:0}\n}\n\n/* reflow at extreme narrow widths (WCAG 1.4.10) */\n@media(max-width:480px){\n  .steps{flex-wrap:wrap}\n  .steps>div{flex:none;width:50%}\n}\n\n/* ============================================================\n   v1 BOOK EXPANSION · complete writing-register control set.\n   Every control defines: rest, hover, focus, active, disabled,\n   loading, error, success, readonly. No exceptions.\n   ============================================================ */\n\n/* ---- sidebar extensions ---- */\n.shell nav .nbadge{float:right;font-family:var(--mono);font-size:var(--fs-2xs);color:var(--dim);padding-top:2px}\n.shell nav button.on .nbadge{color:var(--green-b)}\n.shell nav button:disabled{color:var(--faint);cursor:default}\n\n/* ---- breadcrumbs ---- */\n.crumbs{font-size:var(--fs-md);color:var(--dim);margin-bottom:6px}\n.crumbs a{color:var(--muted);text-decoration:none;display:inline-block;padding:3px 2px}\n.crumbs a:hover{color:var(--fg)}\n.crumbs span{padding:0 8px;color:var(--faint)}\n.crumbs b{color:var(--fg);font-weight:var(--fw-medium)}\n\n/* ---- tabs ---- */\n.enttabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:20px}\n.enttabs button{background:none;border:0;border-bottom:2px solid transparent;color:var(--muted);font-family:var(--sans);font-size:var(--fs-base);padding:10px 14px;cursor:pointer;transition:color var(--t-fast)}\n.enttabs button:hover{color:var(--fg)}\n.enttabs button.on{color:var(--green-b);border-bottom-color:var(--green)}\n.enttabs button:disabled{color:var(--faint);cursor:default}\n\n/* ---- buttons: variants x sizes x full state set ---- */\n.btn{transition:border-color var(--t-fast),background var(--t-fast),color var(--t-fast);user-select:none}\n.btn:active{transform:translateY(1px)}\n.btn:disabled{opacity:.45;cursor:not-allowed;transform:none}\n.btn:disabled:hover{border-color:var(--line-s)}\n.btn.primary:disabled:hover{background:var(--green)}\n.btn.ghost{background:none;border-color:transparent;color:var(--muted)}\n.btn.ghost:hover{color:var(--fg);background:var(--surface-2)}\n.btn.danger{color:var(--bad);border-color:rgba(185,107,94,.4)}\n.btn.danger:hover{border-color:var(--bad);background:rgba(185,107,94,.08)}\n.btn.danger.solid{background:var(--bad);color:#0A0A0A;font-weight:var(--fw-semi)}\n.btn.sm{padding:6px 12px;font-size:var(--fs-xs)}\n.btn.lg{padding:13px 22px;font-size:var(--fs-md)}\n.btn.loading{pointer-events:none;position:relative;color:transparent}\n.btn.loading:after{content:\"\";position:absolute;inset:0;margin:auto;width:12px;height:12px;border:1.5px solid var(--dim);border-top-color:var(--green-b);border-radius:50%;animation:ent-spin .7s linear infinite}\n.btn.primary.loading:after{border-color:rgba(10,10,10,.35);border-top-color:#0A0A0A}\n@keyframes ent-spin{to{transform:rotate(360deg)}}\n.btngroup{display:inline-flex}\n.btngroup .btn{border-radius:0}\n.btngroup .btn:first-child{border-radius:var(--radius) 0 0 var(--radius)}\n.btngroup .btn:last-child{border-radius:0 var(--radius) var(--radius) 0}\n.btngroup .btn+.btn{margin-left:-1px}\n.btngroup .btn.on{border-color:var(--green);color:var(--green-b);position:relative;z-index:1}\n\n/* ---- fields: full state set ---- */\n.field .help{font-size:var(--fs-sm);color:var(--dim);margin-top:6px;line-height:var(--lh-snug)}\n.field .req{color:var(--bad);padding-left:3px}\n.field input:hover:not(:focus):not(:disabled),.field select:hover:not(:focus):not(:disabled),.field textarea:hover:not(:focus):not(:disabled){border-color:var(--line-s);filter:brightness(1.15)}\n.field.err input,.field.err select,.field.err textarea{border-color:var(--bad)}\n.field.err input:focus,.field.err select:focus,.field.err textarea:focus{border-color:var(--bad);outline-color:rgba(201,127,114,.3)}\n.field.ok input:focus{border-color:var(--green);outline:2px solid rgba(60,180,75,.25)}\n.field.err .help{color:var(--bad)}\n.field.ok input{border-color:var(--green)}\n.field.ok .help{color:var(--ok)}\n.field input:disabled,.field select:disabled,.field textarea:disabled{background:var(--surface);color:var(--faint);cursor:not-allowed;border-style:dashed}\n.field input:read-only:not(:disabled){background:var(--surface);color:var(--muted)}\n.field textarea{resize:vertical;min-height:88px;line-height:var(--lh-loose)}\n.field select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--dim) 50%),linear-gradient(135deg,var(--dim) 50%,transparent 50%);background-position:calc(100% - 16px) 50%,calc(100% - 12px) 50%;background-size:4px 4px;background-repeat:no-repeat;cursor:pointer}\n.field .affix{display:flex;align-items:stretch}\n.field .affix span{display:flex;align-items:center;padding:0 12px;background:var(--surface-2);border:1px solid var(--line-s);color:var(--dim);font-family:var(--mono);font-size:var(--fs-sm)}\n.field .affix span:first-child{border-right:0;border-radius:var(--radius) 0 0 var(--radius)}\n.field .affix span:last-child{border-left:0;border-radius:0 var(--radius) var(--radius) 0}\n.field .affix input{border-radius:0}\n.field .affix input:first-child{border-radius:var(--radius) 0 0 var(--radius)}\n.field .affix input:last-child{border-radius:0 var(--radius) var(--radius) 0}\n.field .cnt{float:right;font-family:var(--mono);font-size:var(--fs-xs);color:var(--faint)}\n.field .cnt.over{color:var(--bad)}\n\n/* ---- choice controls ---- */\n.check{display:flex;gap:10px;align-items:flex-start;font-size:var(--fs-base-5);color:var(--muted);padding:6px 0;cursor:pointer;max-width:560px}\n.check input{appearance:none;width:16px;height:16px;min-width:16px;border:1px solid var(--line-i);border-radius:3px;background:var(--bg);cursor:pointer;margin-top:1px;transition:all var(--t-fast);position:relative}\n.check input:hover{border-color:var(--dim)}\n.check input:checked{background:var(--green);border-color:var(--green)}\n.check input:checked:after{content:\"\";position:absolute;left:5px;top:2px;width:4px;height:8px;border:solid #0A0A0A;border-width:0 2px 2px 0;transform:rotate(45deg)}\n.check input:indeterminate{background:var(--green);border-color:var(--green)}\n.check input:indeterminate:after{content:\"\";position:absolute;left:3px;top:6px;width:8px;height:2px;background:#0A0A0A}\n.check input:disabled{opacity:.4;cursor:not-allowed}\n.check input:disabled~span{color:var(--faint)}\n.check.radio input{border-radius:50%}\n.check.radio input:checked{background:var(--bg);border-color:var(--green)}\n.check.radio input:checked:after{border:0;left:4px;top:4px;width:6px;height:6px;border-radius:50%;background:var(--green);transform:none}\n.check b{color:var(--fg);font-weight:var(--fw-medium)}\n\n/* ---- toggle switch ---- */\n.toggle{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:var(--fs-base-5);color:var(--muted)}\n.toggle input{appearance:none;width:34px;height:19px;border-radius:99px;background:var(--surface-2);border:1px solid var(--line-i);position:relative;cursor:pointer;transition:background var(--t-base)}\n.toggle input:after{content:\"\";position:absolute;left:2px;top:2px;width:13px;height:13px;border-radius:50%;background:var(--dim);transition:all var(--t-base) var(--ease)}\n.toggle input:checked{background:var(--green);border-color:var(--green)}\n.toggle input:checked:after{left:17px;background:#0A0A0A}\n.toggle input:disabled{opacity:.4;cursor:not-allowed}\n\n/* ---- file drop ---- */\n.drop{border:1px dashed var(--line-i);border-radius:var(--radius);padding:28px;text-align:center;color:var(--dim);font-size:var(--fs-md-5);cursor:pointer;transition:border-color var(--t-fast);max-width:560px}\n.drop:hover,.drop.over{border-color:var(--green);color:var(--muted)}\n.drop b{color:var(--green-b);font-weight:var(--fw-medium)}\n.drop .mono{font-size:var(--fs-xs);color:var(--faint);display:block;margin-top:6px}\n\n/* ---- form structure: fieldset + wizard steps + sticky footer ---- */\n.fset{border:0;border-top:1px solid var(--line);padding-top:18px;margin:22px 0 0}\n.fset legend{font-family:var(--mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);text-transform:uppercase;color:var(--dim);padding-right:14px}\n.steps{display:flex;gap:0;margin-bottom:26px;font-family:var(--mono);font-size:var(--fs-xs);letter-spacing:var(--ls-steps);text-transform:uppercase}\n.steps>div{flex:1;padding:12px 0 10px;border-top:2px solid var(--line);color:var(--faint)}\n.steps>div.done{border-top-color:var(--green);color:var(--dim)}\n.steps>div.on{border-top-color:var(--green);color:var(--green-b)}\n.steps .n{color:inherit;padding-right:8px}\n.formfoot{display:flex;gap:10px;align-items:center;border-top:1px solid var(--line);margin-top:26px;padding-top:18px}\n.formfoot .spacer{flex:1}\n.formfoot .savenote{font-family:var(--mono);font-size:var(--fs-xs);color:var(--dim)}\n\n/* ---- table extensions: select, bulk, sort, pager, empty, states ---- */\ntable.ent th.sort{cursor:pointer;user-select:none}\ntable.ent th.sort:hover{color:var(--fg)}\ntable.ent th.sort.asc:after{content:\" \\2191\";color:var(--green-b)}\ntable.ent th.sort.desc:after{content:\" \\2193\";color:var(--green-b)}\ntable.ent td.num,table.ent th.num{text-align:right;font-variant-numeric:tabular-nums}\ntable.ent .rowck{width:34px}\ntable.ent tr.sel td{background:var(--green-dim)}\ntable.ent tr.sel:hover td{background:rgba(60,180,75,.14)}\ntable.ent.dense td,table.ent.dense th{padding:7px 14px;font-size:var(--fs-md-5)}\ntr.ent-empty td{text-align:center;color:var(--dim);padding:44px 0;font-size:var(--fs-base)}\n.bulkbar{display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid var(--green);border-radius:var(--radius);padding:8px 14px;margin-bottom:10px;font-size:var(--fs-md-5);color:var(--fg)}\n.bulkbar .n{font-family:var(--mono);color:var(--green-b)}\n.bulkbar .spacer{flex:1}\n.tblfoot{display:flex;align-items:center;gap:8px;padding:12px 2px;font-size:var(--fs-md);color:var(--dim)}\n.tblfoot .spacer{flex:1}\n.tblfoot button{background:none;border:1px solid var(--line-s);border-radius:var(--radius);color:var(--muted);font-family:var(--mono);font-size:var(--fs-xs-5);padding:5px 10px;cursor:pointer}\n.tblfoot button:hover{border-color:var(--dim);color:var(--fg)}\n.tblfoot button.on{border-color:var(--green);color:var(--green-b)}\n.tblfoot button:disabled{opacity:.4;cursor:default}\n\n/* ---- alerts: four intents ---- */\n.note.info{background:var(--surface-2);border-color:var(--line-s)}\n.note.info b{color:var(--fg)}\n.note.warn{background:rgba(199,154,78,.07);border-color:rgba(199,154,78,.3)}\n.note.warn b{color:var(--warn)}\n.note.bad{background:rgba(185,107,94,.07);border-color:rgba(185,107,94,.3)}\n.note.bad b{color:var(--bad)}\n.note .dismiss{float:right;background:none;border:0;color:var(--dim);cursor:pointer;font-size:var(--fs-lg);line-height:var(--lh-none);padding:0;margin-left:12px;min-width:24px;min-height:24px;display:inline-flex;align-items:center;justify-content:center}\n.note .dismiss:hover{color:var(--fg)}\n\n/* ---- pills: neutral + processing ---- */\n.pill.neutral{color:var(--muted)}\n.pill.proc .dot{background:var(--green);animation:k-pulse 1.4s var(--ease) infinite}\n.pill.proc{color:var(--green-b);border-color:rgba(60,180,75,.3)}\n\n/* ---- modal / dialog ---- */\n.ent-scrim{position:fixed;inset:0;background:rgba(17,21,24,.72);z-index:var(--z-modal);display:flex;align-items:center;justify-content:center;padding:20px}\n.dialog{width:min(520px,94vw);max-height:88vh;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line-s);border-radius:var(--radius);animation:ent-pop var(--t-base) var(--ease)}\n@keyframes ent-pop{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:none}}\n.dialog header{display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line)}\n.dialog header h3{font-family:var(--serif);font-weight:var(--fw-medium);font-size:var(--fs-title);flex:1}\n.dialog header .x{background:none;border:0;color:var(--dim);font-size:var(--fs-2xl);cursor:pointer;padding:4px;min-width:28px;min-height:28px;display:inline-flex;align-items:center;justify-content:center}\n.dialog header .x:hover{color:var(--fg)}\n.dialog .body{padding:20px;font-size:var(--fs-base-5);color:var(--muted);overflow:auto;overscroll-behavior:contain}\n.dialog footer{display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:1px solid var(--line)}\n.dialog.destructive header h3{color:var(--bad)}\n\n/* ---- toasts (stacked, top right) ---- */\n.toasts{position:fixed;top:18px;right:18px;display:flex;flex-direction:column;gap:8px;z-index:var(--z-toast);width:min(340px,92vw)}\n.toast{background:var(--surface);border:1px solid var(--line-s);border-left:2px solid var(--green);border-radius:var(--radius);padding:12px 14px;font-size:var(--fs-md-5);color:var(--muted);animation:ent-pop var(--t-base) var(--ease)}\n.toast b{color:var(--fg);font-weight:var(--fw-medium);display:block;margin-bottom:2px}\n.toast b:before{content:\"\\2713\\00a0\\00a0\";color:var(--green-b);font-weight:var(--fw-semi)}\n.toast.warn{border-left-color:var(--warn)}\n.toast.warn b:before{content:\"\\26A0\\00a0\\00a0\";color:var(--warn)}\n.toast.bad{border-left-color:var(--bad)}\n.toast.bad b:before{content:\"\\2715\\00a0\\00a0\";color:var(--bad)}\n\n/* ---- description list ---- */\n.dl{display:grid;grid-template-columns:180px 1fr;font-size:var(--fs-base);max-width:720px}\n.dl dt{font-family:var(--mono);font-size:var(--fs-xs);letter-spacing:var(--ls-label);text-transform:uppercase;color:var(--dim);padding:11px 0;border-bottom:1px solid var(--line)}\n.dl dd{color:var(--muted);padding:11px 0;border-bottom:1px solid var(--line)}\n.dl dd b{color:var(--fg);font-weight:var(--fw-medium)}\n\n/* ---- progress bar ---- */\n.bar{height:6px;background:var(--surface-2);border:1px solid var(--line);border-radius:99px;overflow:hidden;max-width:420px}\n.bar i{display:block;height:100%;background:var(--green);transition:width var(--t-slow) var(--ease)}\n.bar.warn i{background:var(--warn)}\n.bar-cap{font-family:var(--mono);font-size:var(--fs-xs);color:var(--dim);margin-top:6px;letter-spacing:var(--ls-btn)}\n\n/* ---- view states: empty / error / forbidden ---- */\n.ent-state{padding:64px 20px;text-align:center;border:1px dashed var(--line);border-radius:var(--radius);max-width:760px}\n.ent-state .glyph{font-family:var(--serif);font-size:var(--fs-h2);color:var(--dim);display:inline-flex;width:44px;height:44px;border:1px solid var(--line-s);border-radius:50%;align-items:center;justify-content:center;margin-bottom:14px}\n.ent-state h4{font-family:var(--serif);font-weight:var(--fw-medium);font-size:var(--fs-title);color:var(--fg);margin-bottom:6px;letter-spacing:var(--ls-tight);text-transform:none}\n.ent-state p{font-size:var(--fs-md-5);color:var(--dim);margin:0 auto 16px;max-width:380px}\n.ent-state.err .glyph{color:var(--bad);border-color:rgba(185,107,94,.4)}\n\n/* ---- skeleton panel ---- */\n.skelrow{display:flex;gap:12px;align-items:center;padding:10px 0}\n.skelrow .skel{height:12px}\n\n/* ---- print ---- */\n@media print{.shell aside,.toasts,.formfoot,.bulkbar{display:none}.shell{display:block}body{background:#FFF;color:#16191C}}\n\n/* ============================================================\n   v2 PANEL AUDIT ADDENDUM · edge cases\n   ============================================================ */\n\n/* wide tables degrade by scrolling, never by breaking layout */\n/* tblwrap: consumers MUST add tabindex=\"0\" role=\"region\" aria-label=\"[name]\" for keyboard scroll (WCAG 2.1.1) */\n.tblwrap{overflow-x:auto;overscroll-behavior-x:contain}\n.tblwrap:focus-visible{outline:1px solid var(--green);outline-offset:2px;border-radius:var(--radius)}\n.tblwrap table.ent{min-width:640px}\n\n/* long unbroken strings (hashes, addresses) never blow a panel */\n.panel p,.dl dd,.toast,table.ent td{overflow-wrap:break-word}\ntable.ent td.hash{font-family:var(--mono);font-size:var(--fs-sm);word-break:break-all}\n\n/* progress: indeterminate (working, no known total) */\n.bar.indet i{width:38%;animation:ent-indet 1.2s var(--ease) infinite}\n@keyframes ent-indet{0%{margin-left:-38%}100%{margin-left:100%}}\n\n/* browser autofill keeps the register (no yellow flash) */\n.field input:-webkit-autofill{-webkit-box-shadow:0 0 0 60px #12171C inset;-webkit-text-fill-color:var(--fg)}\n\n/* forced colors: state must survive high-contrast mode */\n@media(forced-colors:active){\n  .shell nav button.on,.shell nav a.on{border:1px solid Highlight}\n  .pill .dot{forced-color-adjust:none}\n  .bar i{background:Highlight}\n}\n\n/* ============================================================\n   v2.2.0 · SKIP NAVIGATION (docs lane, SKIP.md)\n   ============================================================ */\n.skip{position:absolute;top:-100%;left:var(--s4);z-index:calc(var(--z-toast) + 1);background:var(--surface);color:var(--green-b);font-family:var(--mono);font-size:var(--fs-sm);letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:var(--s3) var(--s4);border:1px solid var(--green);border-radius:var(--radius)}\n.skip:focus-visible{top:var(--s4);outline:1px solid var(--green);outline-offset:3px}\n";
