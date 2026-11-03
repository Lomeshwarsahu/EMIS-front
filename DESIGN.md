# EMIS-front UI Design Guide

Design reference for the Angular EMS frontend. Supplier PO / dispatch / receipt migration pages set the current standard — new EMS screens should match these patterns before introducing new styles.

Start with **[Project UI flow](#project-ui-flow)** for how a user moves through the app (login → home dashboard → department pages), then the pattern sections below.

---

## Design principles

1. **Legacy parity** — Migrated pages mirror ASP.NET WebForms layout (labels, table grids, tab flows). Do not redesign flows unless product asks.
2. **Readable government forms** — High contrast tables, explicit labels, no icon-only actions for primary work.
3. **Tables fit their content; scroll only when needed** — Columns size to their data and text wraps. A small table stays compact, a wide one scrolls sideways **inside** `.table-wrap` / `.datagrid` only when the wrapped content still does not fit. The page itself never scrolls sideways. See [Responsive tables](#responsive-tables-global).
4. **Shared first** — Reuse `supplier-po-pages.shared.css` and existing class names before adding page-specific CSS.
5. **Standalone supplier components** — New supplier EMS pages use standalone Angular components with `styleUrls` including the shared sheet.
6. **Look like EMIS, not a template** — Reuse the app's panels, orange (light) / blue (dark) header bars and theme tokens. Avoid generic dashboard decoration: coloured side stripes on every card, "View →" on every tile, rainbow charts, shimmer everywhere.
7. **Keep this doc in sync** — Any UI change (colors, classes, layout, components, navigation behaviour) must update `DESIGN.md` in the **same change** — same session, same PR. Do not merge UI-only diffs without touching this file when patterns shift.

---

## Project UI flow

### 1. Entry

| Step | Route | Notes |
|------|-------|-------|
| Department login | `/login` | Role = `user_type` (`TPO`, `AUPO`, `AUGMF`, `DME`, `SEC1`, …) stored as `roleName`; session in `sessionStorage` |
| Supplier login | `/supplier-login` | Role `SUP` |
| Home | `/home` | Department dashboard on top, menu tiles below (see [Home dashboard](#home-dashboard)) |

The shell (sidebar + header) wraps every page except [chromeless routes](#chromeless-routes-no-header--sidebar). The header shows the page title from `service/page-title.util.ts` (route → title; some titles depend on role, e.g. Cover A Evaluation).

### 2. Home dashboard → work pages

Each dashboard figure opens the page that lists those records (with a filter where the page supports one, e.g. Plan a Tender `?status=2`). The menu tiles and sidebar give the full menu for the role.

### 3. Department flows

| Department (roles) | Main flow |
|--------------------|-----------|
| **Tender Cell** (`TPO`, `TPOT`, `BME`) | Plan a Tender `/tender/plan` → row actions: Update Status, Add Tender Item, Upload Excel, Add Bidder (Cover A), Add Bid Items, Add Leavy, HOD conversation, Tender Status → Cover A Evaluation `/TenderCoverA` (Show → Action per supplier → Freeze) → Claim-Object `/TenderCoverAObClaim` → Finalization of Cover A / B `/TenderCoverAObClaimAfter`, `/TenderCoverAObClaimAfterB` → Price Bid Entry `/TenderDetailsPriceEntryGEM` → Price Accept / Reject `/TenderItemsPriceAR` |
| **PO Cell** (`AUPO`) | Indents (consolidated) → PO generation / EMS PO dashboard `/EMSPODashboard` → extensions, pending supply / installation reports |
| **Finance** (`AUGMF`, `FIN`) | Pending sanctions `/finance/pending-sanctions` → sanction / payments → EMD refund `/emd-refund/tenderwise` → SD release `/emd-refund/sd-release-finance` |
| **Supplier** (`SUP`) | PO Supply `/orders/po-supply` → Dispatch entry → Receipt / Installation → reports, EMD refund request `/emd-refund/emd-deposit` |
| **Facility / DME** (`DME`, `FU`, `PRINCIPAL`, `FDA`, `Store`, `Facility`, …) | Annual indent `/indents/annual-indent` → PO dashboard `/orders/purchase-order-dashboard` → PO receipts `/orders/purchase-order-receipts` |
| **IT** (`SEC1`) | Menus / sub menus / role screens under `/IT/...` |

Full route ↔ role list: `documentation/feature-department-matrix.md`. Legacy parity rule: a migrated page follows the legacy `EMSRole` page's flow (same steps, buttons, checks and messages); only the look changes.

---

## Typography

| Context | Font | Size | Weight |
|---------|------|------|--------|
| Supplier PO pages | `Times New Roman`, Times, serif | 12–15px body | 400 |
| Page title bar | same | 15px | 700 |
| Table headers | same | inherit | 700 |
| Global shell / Material areas | `Roboto`, `Helvetica Neue`, sans-serif | per Bootstrap/Material | — |

Supplier transaction pages intentionally use **Times New Roman** to match legacy EMS. Do not switch them to Roboto.

---

## Color palette

### Primary (supplier PO pages)

| Token | Hex | Usage |
|-------|-----|--------|
| Primary blue | `#003399` | Body text, links, table cell text |
| Title / button blue | `#4d67a0` | Page title background, primary buttons |
| Button hover | `#3d5588` | `.show-btn:hover` |
| Table header bg | Light `#f97316`, Dark `#6E00B3` | Supplier grid headers (`.po-grid th`, `.batch-grid th`, `.gst-grid th`) |
| Table header text | `#ffffff` | Supplier grid headers (`.po-grid th`, `.batch-grid th`, `.gst-grid th`) |
| Border (tables) | `#000` horizontal row lines only | `.po-grid`, `.table-wrap` outer frame |
| Border (forms) | `#94a3b8` | Inputs, cards, header grids |

### App theme tokens (`src/emis-unified-theme.css`)

Use these in new UI (dashboard, panels, charts) instead of hard-coded hex; they switch with light / dark mode.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--emis-accent` | `#f97316` | `#2563eb` | Primary accent, chart bars, attention values |
| `--emis-head-bg` / `--emis-head-text` | `#f97316` / `#fff` | `#2563eb` / `#fff` | Table and panel header bars |
| `--emis-surface` | `#ffffff` | `#0c0e12` | Panels |
| `--emis-border` | `#e2e8f0` | `#262b36` | Panel / row borders |
| `--emis-text` / `--emis-text-strong` | `#334155` / `#0f172a` | `#e2e8f0` / `#f8fafc` | Body / figures |
| `--emis-muted` | `#64748b` | `#94a3b8` | Labels, axis text |
| `--emis-hover` | `#f8fafc` | `#1a2030` | Hover background |

### Semantic

| Token | Hex | Usage |
|-------|-----|--------|
| Success / complete row | `#90ee90` | `.po-grid tr.status-complete` |
| Partial row | `#add8e6` | `.po-grid tr.status-partial` |
| Not supplied row | `#ffb6c1` | `.po-grid tr.status-not-supplied` |
| Deadline / alert red | `#ff0000` | Last receipt date, critical labels |
| Warning banner | `#fffbeb` bg, `#b45309` text | `.pending-banner` |
| Export green | `#006400` | `.export-btn` |
| Complete action | `#198754` | Complete installation buttons |
| Secondary gray | `#64748b` | `.clear-btn`, `.secondary-btn` |
| Back link | `#2563eb` | `.back-link` |

### Legacy row highlights (global `styles.css`)

Use on `<tr>`: `.row-red`, `.row-yellow`, `.row-pink`, `.row-gray`, `.row-magenta`, `.row-green` — only where legacy EMS used the same meaning.

---

## Page layout

### Standard supplier page shell

```html
<div class="supplier-po-page">
  <h2 class="page-title wide">Page Title</h2>
  <!-- filters / content -->
</div>
```

| Class | Purpose |
|-------|---------|
| `.supplier-po-page` | Root wrapper; padding `20px 24px 32px`, primary text color |
| `.page-title` | Centered blue banner |
| `.page-title.narrow` | ~30% width (entry forms) |
| `.page-title.wide` | ~50% width (desks / reports) |

### Entry / drill-down pages

```html
<div class="supplier-po-page dispatch-entry-page">
  <div class="page-toolbar">
    <a class="back-link" (click)="goBack()">Back</a>
  </div>
  <h2 class="page-title narrow">Dispatch Entry of Equipments</h2>
  ...
</div>
```

Alternative back control (receipt entry):

```html
<div class="page-header">
  <h2 class="page-title wide">...</h2>
  <button type="button" class="back-btn" (click)="goBack()">Back to Receipt Desk</button>
</div>
```

### Max content width

| Page type | Max width | Class |
|-----------|-----------|--------|
| Dispatch entry | 1100px | `.dispatch-entry-wrap` |
| Receipt entry | 1180px | `.receipt-entry-page` |
| SD / extension forms | 920–1120px | `.detail-section`, `.detail-section.wide` |

---

## Header info grids

PO context blocks (dispatch entry, receipt entry) use a **6-column** table:

```html
<table class="header-grid">
  <tbody>
    <tr>
      <td>Item Code</td><td>{{ itemCode }}</td>
      <td>Item Name</td><td>{{ itemName }}</td>
      <td>Tax</td><td>{{ taxPercent }}</td>
    </tr>
  </tbody>
</table>
```

| Style | Rule |
|-------|------|
| Label cells | `nth-child(odd)` — bold, `#f8fafc` background |
| Borders | Horizontal row lines only (`border-bottom`); no vertical column lines | header-grid uses `#e2e8f0` |
| Consignee row | `colspan="3"` on value cell |

### Deadline fields (receipt entry)

Match legacy `FacilityPO_Receipt1_SUP.aspx`:

- Label: **Max Allowed Days from PO** (tender `cancellationdays`)
- Label: **Last Date to be Received of PO** — **red** (`#ff0000`), bold value
- Classes: `.deadline-label`, `.deadline-value`, `.emphasis-value`, `.deadline-inline`

---

## Pill Filters & Rounded Table Design System

### Pill Filter Bar (`.pill-filter-bar`)

Modern top filter bar with floating pill controls aligned to the right:

- **Dropdowns / Inputs**: White pill controls with `border-radius: 9999px`, 40px height, subtle border.
  - Light mode: `#ffffff` bg, `#1e293b` text, `#cbd5e1` border.
  - Dark mode: `#1e293b` bg, `#f8fafc` text, `#334155` border.
- **Show Data Button (`.btn-show-data`, `.btn-pill-primary`)**:
  - Solid vibrant orange background (`#f97316`), white text, bold, `border-radius: 9999px`. Hover: `#ea580c`.
- **Export Excel Button (`.btn-export-excel`, `.btn-pill-success`)**:
  - Solid soft green background (`#5bbd86`), white text, bold, `border-radius: 9999px`. Hover: `#44a870`.

### Rounded Orange Table Header (`.pill-table-card`, `table.table-orange-header`)

- **Header Card**: Soft rounded top corners (`border-radius: 18px`).
- **Header Cells (`th`)**: Solid vibrant orange background (`#f97316` Light mode, `#ea580c` Dark mode), white bold uppercase text (`S.NO`, `USER NAME`, `NO OF ITEMS`, etc.).
- **Top Corners**: 1st `th` has `border-top-left-radius: 16px`, last `th` has `border-top-right-radius: 16px`.
- **Row Hover**: Soft warm tint `#fff7ed` in Light mode, subtle orange highlight `rgba(249, 115, 22, 0.15)` in Dark mode.

---

## Filters

### Radio filter row (receipt desk, reports)


```html
<div class="radio-group">
  <label>
    <input type="radio" name="poType" value="All" [(ngModel)]="poType" (change)="onPoTypeChange()" />
    All PO
  </label>
</div>
```

### Filter table panel

```html
<table class="filter-panel">
  <tr>
    <td class="label-col">PO Fin Year</td>
    <td><select>...</select></td>
  </tr>
</table>
```

| Class | Usage |
|-------|--------|
| `.filters` | Flex row of inline filter labels |
| `.filters.po-select select` | Wider PO dropdown (`min-width: 320px`) |
| `.filter-panel` | Table-styled filter block (receipt desk) |

Filters should **auto-load** grid data on change where legacy did postback — avoid a separate “Search” click unless legacy required it.

---

## Tables

### Primary data grid (`.po-grid`)

```html
<div class="datagrid">
  <div class="table-wrap">
    <table class="po-grid">
      <thead>
        <tr>
          <th>PO No</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows; let i = index" [class.alt-row]="i % 2 === 1">
          <td>{{ row.poNo }}</td>
          <td class="text-center">{{ row.status }}</td>
        </tr>
        <tr *ngIf="!rows.length">
          <td colspan="12" class="empty-row">No records found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

| Class | Purpose |
|-------|---------|
| `.datagrid` | Outer table container |
| `.table-wrap` | Table box: hugs the table, scrolls sideways only when needed (see Responsive tables) |
| `.po-grid` | Main grid styling — horizontal row borders only (no vertical column lines) |
| `.alt-row` | Zebra striping (`#f8fafc`) |
| `.text-center` | Centered numeric/date cells |
| `.wrap-cell` | Long text column (names, descriptions) — wraps, 140px minimum |
| `.empty-row` | Centered italic empty state |

### Responsive tables (global)

Rules in `src/styles.css`, applied to every table inside `.datagrid`, `.table-wrap`, `.grid-scroll`, `.table-responsive`, `.table-container`:

| Rule | Behaviour |
|------|-----------|
| Width | Outermost wrapper hugs its table (`fit-content`, max 100%); table `min-width: 100%`, `table-layout: auto`. A wrapper followed by `mat-paginator` stays full width so both line up |
| Height | Wrapper is as tall as its rows, capped at `calc(100vh - 140px)` — no fixed 500px boxes |
| Cells | `white-space: normal` — text wraps; header text wraps between words only; no `…` truncation |
| Sideways scroll | Only inside the wrapper, only when wrapped content still does not fit |
| Header / cell padding | Material headers `9px 10px`, cells `7px 10px` |

Opt-outs and helpers:

| Class | Use |
|-------|-----|
| `.wrap-cell` | Long text column (names, descriptions, remarks): `min-width: 140px`, wraps |
| `.cell-nowrap` | Keep one cell / column on one line |
| `.table-nowrap` | Keep a whole table on single lines (rare; e.g. PO Receipt Desk `por-grid`) |
| `.table-fill` | Force a table to 100% width |

Do **not** add `white-space: nowrap` to all cells, fixed percentage widths on every column, `min-width: max-content`, or sticky first columns (S.No is not sticky).

### Buttons inside data tables

Global rule: buttons in data-table cells (`table:not(.detail-form-table):not(.filter-panel) td button`) have **no background and no border** — blue link text (`#1d4ed8`, dark `#93c5fd`) with a dotted underline; hover / keyboard focus adds a light tint and a solid underline. Use short verb labels ("Add Item", "Upload"). Icon-only is allowed for Edit (`bi-pencil-square`) with `title` + `aria-label`. Buttons inside form tables keep their normal `.show-btn` look.

### Pagination (`mat-paginator`)

Global rule in `src/styles.css` (applies to every page): page-size selector ("Items per page") sits **bottom-left**, range label + first/prev/next/last buttons sit **bottom-right**; the bar wraps on small screens and never widens the page. Place `<mat-paginator>` directly **below** the table. Do not override `.mat-mdc-paginator-container` alignment per component. When the table is inside `*ngIf`, attach `dataSource.paginator` / `sort` **after** the table renders (`cdr.detectChanges()` first), otherwise the paginator shows "0 of 0".

- **`mat-table` + `MatTableDataSource`**: add `<mat-paginator #paginator [pageSize]="10" [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons>` and connect with a `@ViewChild('paginator') set paginator(p) { this.dataSource.paginator = p ?? null; }` setter (survives `*ngIf`).
- **Plain `*ngFor` grids**: use `ListPager` (`src/app/helper/list-pager.ts`): `readonly pager = new ListPager();`, `*ngFor="let row of rows | slice: pager.start : pager.end"`, S.No `{{ pager.start + i + 1 }}`, call `this.pager.reset()` wherever the list is reloaded/filtered, and
  `<mat-paginator *ngIf="rows.length" [length]="rows.length" [pageIndex]="pager.index" [pageSize]="pager.size" [pageSizeOptions]="pager.sizes" (page)="pager.onPage($event)" showFirstLastButtons>` right after `</table>`.
- **Do not page** entry grids with per-row inputs, selection/approval grids (rows ticked for submit), or print views.

### Nested batch grid (receipt desk)

```html
<table class="batch-grid">...</table>
```

Smaller nested table: dark blue header `#000084`, gray rows — used inside PO receipt rows for dispatch batches.

### Status row classes

Apply to `<tr>` when row status is known:

- `status-not-supplied` — pink
- `status-partial` — light blue
- `status-complete` — light green

### Link actions in cells

```html
<button type="button" class="link-btn" (click)="openEntry(row)">Receipt Entry</button>
<button type="button" class="link-btn status-red" *ngIf="isOverdue">Overdue</button>
```

---

## Tabs

Two tab patterns exist — use the one already on sibling pages in the same flow.

### Pattern A — `tab-bar` (dispatch entry)

```html
<div class="tab-bar">
  <button type="button" [class.active]="activeTab === 'invoice'" (click)="setTab('invoice')">
    Invoice Details
  </button>
</div>
<div class="tab-panel" *ngIf="activeTab === 'invoice">...</div>
```

Active tab: `#1f4e79` background (dispatch-entry CSS) or `#003399` family.

### Pattern B — `tabs` (receipt entry)

```html
<div class="tabs">
  <button type="button" [class.active]="activeTab === 'receipt'" (click)="setTab('receipt')">
    Receipt Details
  </button>
</div>
```

Disable tabs until prerequisites exist (e.g. installation tab disabled until receipt saved).

---

## Forms

### Grid form (receipt entry tabs)

```html
<div class="form-grid">
  <label>
    Received Date *
    <input type="date" [(ngModel)]="receivedDate" name="receivedDate" />
  </label>
  <label class="full-width">
    Remarks *
    <textarea [(ngModel)]="remarks" name="remarks"></textarea>
  </label>
</div>
```

`.form-grid` — 2 columns, `minmax(240px, 1fr)`; `.full-width` spans all columns.

### Table form (dispatch entry)

```html
<table class="entry-form-table">
  <tr>
    <td>Challan No.</td>
    <td><input type="text" [(ngModel)]="challanNo" name="challanNo" /></td>
    <td>Challan Date</td>
    <td><input type="date" [(ngModel)]="challanDate" name="challanDate" /></td>
  </tr>
</table>
```

### Yes/No checklist (installation)

Legacy radio lists — horizontal radio groups per question:

```html
<div class="yes-no-grid">
  <div class="yes-no-item">
    <span>CGMSC/Govt Logo Printed</span>
    <div class="radio-group">
      <label><input type="radio" name="cgmscLogo" value="Y" [(ngModel)]="cgmscLogoPrinted" /> Yes</label>
      <label><input type="radio" name="cgmscLogo" value="N" [(ngModel)]="cgmscLogoPrinted" /> No</label>
    </div>
  </div>
</div>
```

Values are always `"Y"` / `"N"` strings to match the API and SQL.

### Detail form cards (SD, extension)

Use `.detail-header-card`, `.detail-form-card`, `.detail-form-table` with `.label-col` / `.value-col` from the shared sheet.

---

## Buttons

| Class | Appearance | When to use |
|-------|------------|-------------|
| `.show-btn` | Blue `#4d67a0`, white text | Primary save, show, submit |
| `.show-btn.clear-btn` | Gray | Clear filters |
| `.show-btn.secondary-btn` | Gray | Cancel / secondary |
| `.export-btn` | Green `#006400` | Excel / export |
| `.show-btn.complete-btn` | Green `#198754` | Final completion actions |
| `.link-btn` | Underlined text | In-table navigation, download |
| `.back-btn` | Outlined `#1f4e79` | Page header back |
| `.icon-btn` | Transparent | Print / edit icon buttons (with `title`) |
| Table-cell buttons | Link style (see [Buttons inside data tables](#buttons-inside-data-tables)) | Row actions |
| `.new-tender-btn` | Black `#0f172a` (dark: black + slate border) | Plan a Tender "Generate New Tender" |
| `.freeze-btn` | Green `#15803d` | Irreversible "Freeze" steps (Cover A evaluation) |

Always disable buttons during `saving` / `uploading` / `loading` and change label text (`Saving...`, `Completing...`).

---

## Loading states

Use the shared skeleton — **not** a bare “Loading…” string on supplier pages. (Exception: the home dashboard shows a short "Loading summary…" line.)

```html
<app-supplier-page-skeleton *ngIf="loading" type="table" [rows]="8" [cols]="12" />
<app-supplier-page-skeleton *ngIf="loading" type="form" [formFields]="10" />
<app-supplier-page-skeleton *ngIf="loading" type="filter-panel" [filterRows]="3" />
```

| `type` | Use for |
|--------|---------|
| `table` | Grids |
| `form` | Entry pages |
| `filter-panel` | Filter tables |
| `lines` | Line-item editors |

Import: `SupplierPageSkeletonComponent` (standalone).

User feedback for actions: `ngx-toastr` — `toastr.success`, `toastr.warning`, `toastr.error` with API `message` when available.

---

## Navigation

| Action | Behaviour |
|--------|-----------|
| Desk → entry / edit | Same tab (`router.navigate`) |
| Installation completed → report | Same tab |
| Print report / certificate | **New tab** (`window.open`, `noopener,noreferrer`) |
| PDF file download | New tab via API URL |
| Back to list | `navigateToPoSupplyReceipt()` / `goBack()` preserving filter query params |

Filter state travels via query params: `financialYearId`, `poType`, `poId` — use `supplier-transaction-state.util.ts`.

---

## Chromeless routes (no header / sidebar)

`app.component.ts` hides the shell when URL contains:

- `po-supply-dispatch-report`
- `po-supply-installation-print`

New print-only routes must be added to that list. Print views should be self-contained (own title, print CSS, no dependency on sidebar).

---

## File upload UI

```html
<div class="upload-row">
  <span class="upload-label">Upload installation photos (PDF)</span>
  <input type="file" accept=".pdf" #fileInput />
  <button type="button" class="show-btn upload-btn" (click)="uploadFile(fileInput, 'insphoto', itemDetailId)">
    Upload
  </button>
  <button type="button" class="link-btn" *ngIf="hasFile" (click)="downloadFile('insphoto', itemDetailId)">
    Download
  </button>
</div>
```

- PDF only, max ~3 MB (match API validation message)
- After upload, reload page data so flags (`hasInstallationReport`, etc.) update
- Bulk mode: hide per-row upload columns; show bulk upload panel instead

---

## Responsive behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| `≤ 991.98px` | Drawer collapses; table font ~0.8rem |
| `≤ 900px` | Form grids collapse to 1 column |
| `≤ 576px` | Smaller table font; buttons may wrap |

Wide tables scroll inside `.table-wrap` only when wrapped content does not fit (see [Responsive tables](#responsive-tables-global)) — never force `width: 100%` with `table-layout: fixed` and percentage columns. Tested widths: 768, 1024, 1280, 1366, 1920px with the 272px sidebar.

---

## Home dashboard

`/home` (`component/home/`) shows a department summary above the menu tiles. Data: `GET api/Dashboard/home?role=&userId=` (`DashboardController`) → `{ Department, FinancialYear, Cards[], Charts[] }`; sections per role are listed in `documentation/dme-ems-migration/changelog.md` (2026-11-03).

| Part | Pattern |
|------|---------|
| Meta line | "Department · Financial Year" in muted 12px text |
| Figures | One `.dash-panel.dash-stats` strip; each `.stat` = uppercase muted label + 22px value, thin dividers, whole cell clickable (opens `Route` + `Query`). Pending / missing work with a value > 0 uses `--emis-accent` (`.stat--attention`). A failed query shows `—` |
| Charts | `.dash-panel` with `.panel-head` bar (same as table headers). Status breakdowns → horizontal bar chart sorted largest first; year / month series → column chart. One colour (`--emis-accent`), values on bars, tooltip on hover, no legend for single series (ng-apexcharts) |
| Loading | "Loading summary…" text (no shimmer) |

Do not add per-card colour stripes, "View →" links, donut/rainbow palettes or decorative icons.

**Access:** the home page only offers pages in the logged-in role's menu (the same DB sidebar tree as the sidebar, `IT/sidebar-tree/{roleId}`, or the static fallback). `MenuAccessService` (`service/menu-access.service.ts`) holds that menu; `app.component` publishes it whenever `menuItems` is set. Menu tiles come from it, and a dashboard figure is shown only when `canOpen(card.Route)` — matched by the page a URL opens (component / lazy import, redirects followed), so route aliases count. Use `canOpen()` for any new home / shortcut link.

---

## Tender Cell pages (Plan a Tender and sub-pages)

Shared CSS: `component/BME/tender-subpage.shared.css` (with `supplier-po-pages.shared.css`). Header block: `app-tender-page-header` (Back to Tender + Tender No / Date / Status / Description).

| Pattern | Class / rule |
|---------|--------------|
| Page body | `.detail-section.wide` (1120px; `.full-width` for wide editing grids like Cover A evaluation) |
| 4-column form | `table.detail-form-table.cols-4` — fixed layout, inputs fill cells, one column below 900px |
| Collapsible add form | `.form-toggle-bar` (section title + "+ Add …" button); form closes itself after a successful save and the list reloads |
| Action row under a grid | `.popup-actions` (right-aligned) |
| Popups | `.desc-popup` (full text of a truncated cell), Esc / backdrop closes |

**Plan a Tender toolbar** (`/tender/plan`): left — search box (searches 400 ms after typing, no Show Data needed), Search By (Code / Name / Tender, default Tender), financial year (reloads on change); right — Generate New Tender (black), **Filters** (status radios, row-colour legend, Show Data), Export Excel. Grid keeps the legacy 16 columns and headings; Description shows two lines and opens the full text on click; tender number in normal text colour; S.No not sticky.

**Cover A Evaluation** (`/TenderCoverA`): legacy flow — select tender → **Show** → tender block + bidder grid (legacy column order, without Add Items) → per-row Eligibility + Remarks → **Action** (only at Cover A) → **Freeze Cov A-Evaluation**. Legacy alert messages are kept.

---

## File structure for new supplier pages

```
src/app/component/Suppliers/
  my-new-page/
    my-new-page.component.ts      # standalone: true
    my-new-page.component.html
    my-new-page.component.css     # only page-specific overrides
  supplier-po-pages.shared.css    # import in styleUrls
  supplier-page-skeleton/         # loading UI
  supplier-transaction-state.util.ts
  supplier-user.util.ts
```

Component `styleUrls` pattern:

```typescript
styleUrls: ['../supplier-po-pages.shared.css', './my-new-page.component.css'],
```

---

## Checklist for new screens

- [ ] Root `.supplier-po-page` wrapper
- [ ] `.page-title` with `narrow` or `wide`
- [ ] Shared CSS imported
- [ ] Skeleton while loading
- [ ] Grid inside `.datagrid` > `.table-wrap` > `.po-grid`
- [ ] Primary action uses `.show-btn`
- [ ] In-grid links use `.link-btn`
- [ ] Dates: display `dd/MM/yyyy` from API; bind `<input type="date">` via ISO conversion helpers
- [ ] Required fields marked with `*` in label
- [ ] Empty grid row with `.empty-row`
- [ ] Toastr on save/error
- [ ] Back navigation preserves filters where applicable
- [ ] Print/download opens new tab when user needs PDF
- [ ] Table fits its content: no blanket `nowrap`, no fixed % column widths; long text columns use `.wrap-cell`
- [ ] Checked at 1366px and 1024px (no page-level sideways scroll) and in dark mode
- [ ] Migrated page follows the legacy page's flow (steps, buttons, checks, messages)
- [ ] **`DESIGN.md` updated** if new classes, colours, layout, or navigation rules were introduced

---

## Maintaining this document

`DESIGN.md` is the source of truth for EMIS-front UI patterns. **If the UI changes, this file changes too** — in the same PR, before merge.

| UI change | Update in `DESIGN.md` |
|-----------|------------------------|
| New shared CSS class (e.g. in `supplier-po-pages.shared.css`) | Add to relevant section + checklist |
| New colour / semantic token | Color palette table |
| New page layout or wrapper pattern | Page layout section |
| New component pattern (skeleton type, tab style, form layout) | Matching section + example snippet |
| Navigation rule change (same tab vs new tab, chromeless route) | Navigation / chromeless sections |
| New breakpoint or responsive rule | Responsive behaviour |
| Renamed or removed class | Remove or update old reference — do not leave stale docs |

**When to skip:** Bug fixes that restore documented behaviour (no doc change). Pure data/API changes with no visual impact.

**Also update** (when supplier EMS UI is touched):

- `documentation/supplier-ems-migration/feature-documentation.md` — page behaviour
- `documentation/supplier-ems-migration/changelog.md` — user-visible UI changes

---

## Agent prompt (copy-paste)

Use this when asking Cursor / an agent to build or change supplier EMS UI. Replace bracketed placeholders.

```text
Read @EMIS-front/DESIGN.md and @EMIS-front/src/app/component/Suppliers/supplier-po-pages.shared.css
to learn tokens and existing patterns.

Reference one sibling page for layout conventions, e.g.:
@EMIS-front/src/app/component/Suppliers/po-supply-dispatch-entry/po-supply-dispatch-entry.component.html
@EMIS-front/src/app/component/Suppliers/po-supply-dispatch-entry/po-supply-dispatch-entry.component.ts

Build [describe feature — e.g. billing settings panel] using ONLY documented classes,
components, and colours from DESIGN.md and the shared CSS.

Rules:
- Reuse app-supplier-page-skeleton for loading states
- Use .supplier-po-page, .page-title, .po-grid, .show-btn, etc. — no new colour hex unless proposed
- If a component or pattern does not exist, propose it first — do not improvise a new style
- Match navigation rules (same tab vs new tab) from DESIGN.md
- Update DESIGN.md in the same change if UI patterns change
- Update documentation/supplier-ems-migration/ when supplier EMS behaviour changes

Output the diff.
```

### Reference pages by flow

| Flow | Layout reference |
|------|------------------|
| Desk / grid + filters | `po-supply-receipt/po-supply-receipt.component.*` |
| Multi-tab entry form | `po-supply-dispatch-entry/po-supply-dispatch-entry.component.*` |
| Receipt + installation tabs | `po-supply-receipt-entry/po-supply-receipt-entry.component.*` |
| Report + downloads | `po-supply-installation-report/po-supply-installation-report.component.*` |
| SD / extension detail form | `supplier-po-sd-detail/`, `supplier-po-apply-extension/` |
| Big grid + toolbar + Filters panel | `BME/plana-tender-d/` (Plan a Tender) |
| Legacy-flow evaluation grid (Show → Action → Freeze) | `BME/tender-cover-a/` |
| Sub-page with header block + collapsible add form | `cov-aadd-remuvie/` (Add Participants) |
| Department dashboard | `home/` |

### Source files for tokens

| What | File |
|------|------|
| Design rules + checklist | `EMIS-front/DESIGN.md` |
| Shared supplier classes | `EMIS-front/src/app/component/Suppliers/supplier-po-pages.shared.css` |
| Global table / scroll rules, table buttons, legacy row colours | `EMIS-front/src/styles.css` |
| Theme tokens (light / dark) | `EMIS-front/src/emis-unified-theme.css` |
| Tender Cell sub-page classes | `EMIS-front/src/app/component/BME/tender-subpage.shared.css` |
| Home dashboard | `EMIS-front/src/app/component/home/` |
| Page titles | `EMIS-front/src/app/service/page-title.util.ts` |
| Loading skeleton | `EMIS-front/src/app/component/Suppliers/supplier-page-skeleton/` |

---

## App shell sidebar

Global navigation uses `app-app-sidebar` inside `mat-drawer` (`app.component.html`).

| Item | Detail |
|------|--------|
| Component | `src/app/component/layout/app-sidebar/` |
| Theme service | `src/app/service/theme.service.ts` — `light` / `dark`, persisted as `emis-theme` in `localStorage` |
| HTML attribute | `document.documentElement[data-theme="light|dark"]` |

### Sidebar features

- **Full viewport height** — sidebar starts at top of screen; header sits in main content column only
- **Light / dark mode** — footer toggle with icon + **Dark mode** / **Light mode** label when expanded; switch only when collapsed (hover tooltip shows label)
- **Collapsed mode** — icon-only rail (`76px` expanded light / `84px` drawer in dark pill mode); collapse toggle on right edge; hover shows label tooltip (leaf items) or child flyout (parent menus). **Dark collapsed** — floating pill rail with rounded ends, dark gradient background, centered icons (active purple `#6E00B3`, footer icons cream), no icon boxes
- **Brand logo** — `assets/icons/icon.png` (Chhattisgarh Government emblem)
- **Logout only** in sidebar footer (user profile in header)
- **Menu search** — in shell header; filters sidebar items and shows dropdown suggestions below the search box
- **Header** — search, notifications (borderless icon), user avatar; matches sidebar colours
- **Parent menu icons** — `Masters`=`dataset`, `Orders`=`shopping_cart`, `Transaction`=`sync_alt`, `Contracts`=`handshake`

### Shell theme tokens (`styles.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--shell-content-bg` | `#f4f7fa` | `#070707` |
| `--shell-content-text` | `#0f172a` | `#e5e7eb` |

Sidebar colours are scoped in `app-sidebar.component.css` (light mode accent `#f97316` orange, dark mode accent `#6E00B3` purple, dark shell/sidebar surfaces `#070707`). Active menu items use a left accent bar + icon/text colour change only — no icon background or border box. Supplier PO pages keep their own legacy palette — shell theme does not override `.supplier-po-page`.

---

| Doc | Location |
|-----|----------|
| Supplier feature specs | `documentation/supplier-ems-migration/feature-documentation.md` |
| API contracts | `documentation/supplier-ems-migration/api-documentation.md` |
| Global layout scroll rules | `src/styles.css` |

---

## Intentional legacy deviations

Document any deliberate UI change in `documentation/supplier-ems-migration/changelog.md`:

- Material / Bootstrap used in **older** non-supplier modules — do not mix into new supplier EMS pages without approval
- `sweetalert2` / `ngx-spinner` exist globally but supplier migration standard is **toastr + skeleton**
