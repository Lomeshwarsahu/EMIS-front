/**
 * Shares the login session (sessionStorage) between tabs of the SAME browser.
 *
 * sessionStorage is per-tab, so a page opened in a new tab (print view, report,
 * document) starts empty and every API call fails with 401. On startup a tab
 * without a session asks other open tabs over a BroadcastChannel; a logged-in
 * tab replies with its sessionStorage snapshot.
 *
 * A URL copied into another browser / device / private window (or used after
 * every tab is logged out or closed) gets no reply and falls back to login.
 */
const CHANNEL_NAME = 'emis-session-sync';
const WAIT_MS = 400;

type SyncMessage =
  | { type: 'request'; id: string }
  | { type: 'session'; id: string; data: Record<string, string> }
  | { type: 'logout' };

let channel: BroadcastChannel | null = null;

export function hasActiveSession(): boolean {
  return !!sessionStorage.getItem('token') || !!sessionStorage.getItem('authenticatedUser');
}

function snapshot(): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) data[key] = sessionStorage.getItem(key) ?? '';
  }
  return data;
}

function getChannel(): BroadcastChannel | null {
  if (channel || typeof BroadcastChannel === 'undefined') return channel;
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.addEventListener('message', (event: MessageEvent<SyncMessage>) => {
    const msg = event.data;
    if (msg?.type === 'request' && hasActiveSession()) {
      channel?.postMessage({ type: 'session', id: msg.id, data: snapshot() } satisfies SyncMessage);
    } else if (msg?.type === 'logout' && hasActiveSession()) {
      sessionStorage.clear();
      window.location.reload();
    }
  });
  return channel;
}

/** App initializer: restores the session from another open tab when this tab has none. */
export function restoreSessionFromOtherTabs(): Promise<void> {
  const ch = getChannel();
  if (!ch || hasActiveSession()) return Promise.resolve();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return new Promise<void>((resolve) => {
    const done = () => {
      ch.removeEventListener('message', onMessage);
      clearTimeout(timer);
      resolve();
    };
    const onMessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data;
      if (msg?.type !== 'session' || msg.id !== id || hasActiveSession()) return;
      Object.entries(msg.data).forEach(([key, value]) => sessionStorage.setItem(key, value));
      done();
    };
    const timer = setTimeout(done, WAIT_MS);
    ch.addEventListener('message', onMessage);
    ch.postMessage({ type: 'request', id } satisfies SyncMessage);
  });
}

/** Call on explicit logout so other tabs of this browser are logged out too. */
export function broadcastLogout(): void {
  getChannel()?.postMessage({ type: 'logout' } satisfies SyncMessage);
}
