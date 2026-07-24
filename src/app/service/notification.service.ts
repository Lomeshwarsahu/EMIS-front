import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  route?: string;
}

const STORAGE_KEY = 'emis-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>(this.readStored());
  readonly notifications$ = this.notificationsSubject.asObservable();

  get notifications(): AppNotification[] {
    return this.notificationsSubject.value;
  }

  get unreadCount(): number {
    return this.notifications.filter((item) => !item.read).length;
  }

  add(title: string, message: string, route?: string): void {
    const next: AppNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      message,
      createdAt: Date.now(),
      read: false,
      route,
    };
    this.persist([next, ...this.notifications].slice(0, 30));
  }

  markRead(id: string): void {
    this.persist(
      this.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  markAllRead(): void {
    this.persist(this.notifications.map((item) => ({ ...item, read: true })));
  }

  clear(): void {
    this.persist([]);
  }

  private persist(list: AppNotification[]): void {
    this.notificationsSubject.next(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore storage failures */
    }
  }

  private readStored(): AppNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
