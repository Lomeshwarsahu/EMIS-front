import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

/**
 * Opens API documents in a new tab without exposing the API URL.
 *
 * The file is fetched through HttpClient (Bearer token added by authInterceptor)
 * and shown from a `blob:` URL. A blob URL only lives inside this browser
 * session, so copying the tab address into another browser / device does not
 * open the document, and the raw API link is never shown to the user.
 */
@Injectable({ providedIn: 'root' })
export class SecureFileService {
  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  openInNewTab(url: string, fallbackFileName = 'document'): void {
    // Open the tab synchronously (inside the click) so pop-up blockers allow it.
    const tab = window.open('', '_blank');
    if (tab) {
      tab.document.title = 'Loading document…';
      tab.document.body.innerHTML =
        '<p style="font-family:sans-serif;color:#475569;text-align:center;margin-top:20vh">Loading document…</p>';
    }

    this.http.get(url, { responseType: 'blob', observe: 'response' }).subscribe({
      next: async (res) => {
        const blob = res.body;
        if (!blob || blob.size === 0) {
          tab?.close();
          this.toastr.error('File not found.');
          return;
        }
        if (blob.type.includes('application/json')) {
          tab?.close();
          this.toastr.error(await this.readMessage(blob, 'Could not open file.'));
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        if (tab) {
          tab.opener = null;
          tab.location.href = blobUrl;
        } else {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = this.fileNameFrom(res.headers.get('content-disposition')) || fallbackFileName;
          a.click();
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
      },
      error: async (err: HttpErrorResponse) => {
        tab?.close();
        if (err.status === 401) return; // authInterceptor shows "Session expired"
        const msg =
          err.error instanceof Blob
            ? await this.readMessage(err.error, 'Could not open file.')
            : err.error?.message || 'Could not open file.';
        this.toastr.error(msg);
      },
    });
  }

  private async readMessage(blob: Blob, fallback: string): Promise<string> {
    try {
      return (JSON.parse(await blob.text()) as { message?: string }).message || fallback;
    } catch {
      return fallback;
    }
  }

  private fileNameFrom(disposition: string | null): string {
    const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    return match ? decodeURIComponent(match[1]) : '';
  }
}
