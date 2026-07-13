/** Resolves supplier user id — localStorage first (works in new tabs). */
export function resolveSupplierUserId(): number {
  const fromLocal = Number(localStorage.getItem('userid') || 0);
  if (fromLocal > 0) {
    return fromLocal;
  }

  const fromSession = Number(sessionStorage.getItem('userid') || 0);
  if (fromSession > 0) {
    return fromSession;
  }

  try {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}') as Record<string, unknown>;
    return Number(loginData['user_id'] ?? loginData['userId'] ?? 0);
  } catch {
    return 0;
  }
}
