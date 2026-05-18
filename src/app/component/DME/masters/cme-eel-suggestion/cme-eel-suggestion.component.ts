import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage } from '../../shared/session.util';

interface EelSuggestionRow {
  Id: number;
  Name: string;
  MobileNo: string;
  EmailId: string;
  Supplier: string;
  ItemName: string;
  SuggestionCondition: string;
  EntryDt: string;
  UploadLetter?: string;
  UploadRelevantDoc?: string;
  Ext?: string;
}

@Component({
  selector: 'app-cme-eel-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cme-eel-suggestion.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './cme-eel-suggestion.component.css'],
})
export class CmeEelSuggestionComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEMasters/`;

  rows: EelSuggestionRow[] = [];
  loading = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<EelSuggestionRow[]>(`${this.apiRoot}eel-suggestions`).subscribe({
      next: (res) => {
        this.rows = this.mapRows(res);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(apiErrorMessage(e, 'Could not load EEL suggestions.'));
      },
    });
  }

  hasUpload(path?: string): boolean {
    return Boolean(path?.trim());
  }

  onDownloadLetter(row: EelSuggestionRow): void {
    if (!this.hasUpload(row.UploadLetter)) return;
    this.toastr.info('Document download requires legacy file store (MongoDB) — not yet wired in API.');
  }

  onDownloadRelevant(row: EelSuggestionRow): void {
    if (!this.hasUpload(row.UploadRelevantDoc)) return;
    this.toastr.info('Document download requires legacy file store (MongoDB) — not yet wired in API.');
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No records to export.');
      return;
    }
    const header = [
      'S.No',
      'Authorised Person',
      'Mob No',
      'Email',
      'Supplier',
      'Item Name',
      'Suggestion',
      'Entry Date',
    ];
    const lines = this.rows.map((r, i) =>
      [
        i + 1,
        r.Name,
        r.MobileNo,
        r.EmailId,
        r.Supplier,
        r.ItemName,
        r.SuggestionCondition,
        r.EntryDt,
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eel-suggestions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private mapRows(raw: unknown): EelSuggestionRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Id: Number(r['Id'] ?? r['id'] ?? 0),
      Name: String(r['Name'] ?? r['name'] ?? ''),
      MobileNo: String(r['MobileNo'] ?? r['mobileNo'] ?? ''),
      EmailId: String(r['EmailId'] ?? r['emailId'] ?? ''),
      Supplier: String(r['Supplier'] ?? r['supplier'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      SuggestionCondition: String(r['SuggestionCondition'] ?? r['suggestionCondition'] ?? ''),
      EntryDt: String(r['EntryDt'] ?? r['entryDt'] ?? ''),
      UploadLetter: r['UploadLetter'] ?? r['uploadLetter'] ? String(r['UploadLetter'] ?? r['uploadLetter']) : undefined,
      UploadRelevantDoc: r['UploadRelevantDoc'] ?? r['uploadRelevantDoc']
        ? String(r['UploadRelevantDoc'] ?? r['uploadRelevantDoc'])
        : undefined,
      Ext: r['Ext'] ?? r['ext'] ? String(r['Ext'] ?? r['ext']) : undefined,
    }));
  }
}
