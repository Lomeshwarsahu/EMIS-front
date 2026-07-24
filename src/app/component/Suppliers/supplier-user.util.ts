/** Resolves supplier user id — localStorage / session / loginData (works in new tabs). */
export function resolveSupplierUserId(): number {
  const fromStorage = (value: string | null): number => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const fromLocal = fromStorage(localStorage.getItem('userid'));
  if (fromLocal > 0) {
    return fromLocal;
  }

  const fromSession = fromStorage(sessionStorage.getItem('userid'));
  if (fromSession > 0) {
    // Keep localStorage in sync for new tabs / print windows
    localStorage.setItem('userid', String(fromSession));
    return fromSession;
  }

  try {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}') as Record<
      string,
      unknown
    >;
    const n = Number(
      loginData['user_id'] ??
        loginData['User_Id'] ??
        loginData['userId'] ??
        loginData['UserId'] ??
        loginData['DistId'] ??
        0,
    );
    if (Number.isFinite(n) && n > 0) {
      localStorage.setItem('userid', String(n));
      sessionStorage.setItem('userid', String(n));
      return n;
    }
  } catch {
    /* ignore */
  }

  return 0;
}

/** Persist supplier user id after login (session + local for new tabs). */
export function persistSupplierUserId(userId: unknown): number {
  const n = Number(userId);
  if (!Number.isFinite(n) || n <= 0) {
    return 0;
  }
  const value = String(n);
  sessionStorage.setItem('userid', value);
  localStorage.setItem('userid', value);
  return n;
}
