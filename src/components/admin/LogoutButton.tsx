'use client';

import { useState } from 'react';
import { adminFetch } from './api';

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await adminFetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
        window.location.assign('/admin/login');
      }}
      className="focus-ring min-h-11 border-2 border-gb-white px-3 font-display font-semibold uppercase text-gb-white hover:bg-gb-white hover:text-gb-ink"
    >
      Sair
    </button>
  );
}
