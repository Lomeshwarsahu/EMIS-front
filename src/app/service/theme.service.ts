import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type EmisTheme = 'light' | 'dark';

const STORAGE_KEY = 'emis-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<EmisTheme>(this.readStoredTheme());
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get theme(): EmisTheme {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.theme === 'dark';
  }

  setTheme(theme: EmisTheme): void {
    if (theme === this.themeSubject.value) {
      return;
    }
    this.themeSubject.next(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  private readStoredTheme(): EmisTheme {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: EmisTheme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
