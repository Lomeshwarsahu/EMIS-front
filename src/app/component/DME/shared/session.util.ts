export function resolveLoginUserId(): number {
  const login = JSON.parse(localStorage.getItem('loginData') || '{}');
  return Number(login.user_id ?? login.userId ?? login.DistId ?? 0);
}

export function resolveLoginAuthorityId(): string {
  const login = JSON.parse(localStorage.getItem('loginData') || '{}');
  return String(login.ConID ?? login.conID ?? login.conId ?? '').trim();
}

export function apiErrorMessage(
  err: { error?: { message?: string; detail?: string } },
  fallback: string,
): string {
  const detail = err?.error?.detail?.trim();
  const message = err?.error?.message?.trim();
  return detail ? (message ? `${message} (${detail})` : detail) : message || fallback;
}
