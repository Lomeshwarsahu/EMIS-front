# EMIS-front UI Design Guide

Design reference for the Angular EMS frontend. Supplier PO / dispatch / receipt migration pages set the current standard — new EMS screens should match these patterns before introducing new styles.

---

## Design principles

1. **Legacy parity** — Migrated pages mirror ASP.NET WebForms layout (labels, table grids, tab flows). Do not redesign flows unless product asks.
2. **Readable government forms** — High contrast tables, explicit labels, no icon-only actions for primary work.
3. **Horizontal scroll, not page scroll** — Wide grids live inside `.table-wrap` / `.datagrid`; the app shell stays fixed width.
4. **Shared first** — Reuse `supplier-po-pages.shared.css` and existing class names before adding page-specific CSS.
5. **Standalone supplier components** — New supplier EMS pages use standalone Angular components with `styleUrls` including the shared sheet.
6. **Keep this doc in sync** — Any UI change (colors, classes, layout, components, navigation behaviour) must update `DESIGN.md` in the **same change** — same session, same PR. Do not merge UI-only diffs without touching this file when patterns shift.

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
| Table header bg | `#003399` | `.po-grid th` |
| Table header text | `#ccf` | `.po-grid th` |
| Border (tables) | `#000` | `.po-grid`, `.table-wrap` |
| Border (forms) | `#94a3b8` | Inputs, cards, header grids |

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
| Borders | `1px solid #e2e8f0` (header-grid) or `#94a3b8` outer |
| Consignee row | `colspan="3"` on value cell |

### Deadline fields (receipt entry)

Match legacy `FacilityPO_Receipt1_SUP.aspx`:

- Label: **Max Allowed Days from PO** (tender `cancellationdays`)
- Label: **Last Date to be Received of PO** — **red** (`#ff0000`), bold value
- Classes: `.deadline-label`, `.deadline-value`, `.emphasis-value`, `.deadline-inline`

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
| `.table-wrap` | Horizontal scroll + black border |
| `.po-grid` | Main grid styling |
| `.alt-row` | Zebra striping (`#f8fafc`) |
| `.text-center` | Centered numeric/date cells |
| `.wrap-cell` | Allow line wrap in dense columns |
| `.empty-row` | Centered italic empty state |

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
| `.icon-btn` | Transparent | Print icon buttons |

Always disable buttons during `saving` / `uploading` / `loading` and change label text (`Saving...`, `Completing...`).

---

## Loading states

Use the shared skeleton — **not** a bare “Loading…” string on supplier pages.

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

Wide legacy tables **always** scroll inside `.table-wrap` — never force `width: 100%` with `table-layout: fixed` on `po-grid` unless columns are few.

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

### Source files for tokens

| What | File |
|------|------|
| Design rules + checklist | `EMIS-front/DESIGN.md` |
| Shared supplier classes | `EMIS-front/src/app/component/Suppliers/supplier-po-pages.shared.css` |
| Global scroll / legacy row colours | `EMIS-front/src/styles.css` |
| Loading skeleton | `EMIS-front/src/app/component/Suppliers/supplier-page-skeleton/` |

---

## Related docs

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
