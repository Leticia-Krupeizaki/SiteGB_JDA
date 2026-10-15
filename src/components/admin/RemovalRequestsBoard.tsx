'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryLabel } from '@/data/mural';
import { AdminApiError, adminFetch } from './api';
import { formatDateTime, removalStatusLabel, statusLabel } from './labels';
import { useToast } from './Toast';
import type { AdminRemovalRequest, RemovalRequestStatus } from './types';

const tabs: RemovalRequestStatus[] = ['OPEN', 'RESOLVED', 'DISMISSED'];

function RequestCard({ request, onDone }: { request: AdminRemovalRequest; onDone: () => void }) {
  const toast = useToast();
  const [note, setNote] = useState('');
  const [removePost, setRemovePost] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canRemove = request.post && request.post.status !== 'REMOVED';

  const resolve = async (status: 'RESOLVED' | 'DISMISSED') => {
    setBusy(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/removal-requests/${request.id}`, { method: 'PATCH', body: { status, resolutionNote: note, removePost: status === 'RESOLVED' && removePost } });
      toast('success', status === 'RESOLVED' ? 'Pedido resolvido.' : 'Pedido descartado.');
      onDone();
    } catch (err) {
      setError(err instanceof AdminApiError ? (err.fieldErrors.resolutionNote ?? err.message) : 'Algo deu errado.');
      setBusy(false);
    }
  };

  return (
    <li className="space-y-3 bg-gb-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold">{request.requesterContact}</p>
        <p className="text-sm text-gb-mute">{formatDateTime(request.createdAt)}</p>
      </div>
      <p className="whitespace-pre-line">{request.reason}</p>
      {request.post ? (
        <p className="text-sm">
          Foto vinculada: {categoryLabel[request.post.category]} · {statusLabel[request.post.status]} ·{' '}
          <a href={`/admin/mural?foto=${request.postId}`} className="focus-ring font-semibold text-gb-navy underline">
            abrir foto
          </a>
        </p>
      ) : (
        <p className="text-sm text-gb-mute">Sem foto vinculada: localize a foto pela descrição em &quot;Fotos do mural&quot; e remova por lá.</p>
      )}

      {request.status === 'OPEN' ? (
        <div className="space-y-2 border-t border-gb-line pt-3">
          <label htmlFor={`nota-${request.id}`} className="text-sm font-semibold">
            O que foi feito (registro interno)
          </label>
          <textarea
            id={`nota-${request.id}`}
            rows={2}
            maxLength={500}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="focus-ring block w-full border-2 border-gb-line px-3 py-2"
          />
          {canRemove && (
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={removePost} onChange={(event) => setRemovePost(event.target.checked)} className="h-5 w-5 accent-gb-red" />
              Remover a foto vinculada do mural ao resolver
            </label>
          )}
          {error && (
            <p role="alert" className="text-sm font-semibold text-gb-red">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || note.trim().length < 3}
              onClick={() => resolve('RESOLVED')}
              className="focus-ring min-h-11 bg-gb-ink px-4 font-display font-semibold uppercase text-gb-white disabled:opacity-50"
            >
              Marcar como resolvido
            </button>
            <button
              type="button"
              disabled={busy || note.trim().length < 3}
              onClick={() => resolve('DISMISSED')}
              className="focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase disabled:opacity-50"
            >
              Descartar
            </button>
          </div>
        </div>
      ) : (
        <p className="border-t border-gb-line pt-3 text-sm">
          <span className="font-semibold">{request.resolutionNote}</span>
          <span className="block text-gb-mute">
            {request.resolvedAt && formatDateTime(request.resolvedAt)} · {request.resolvedBy?.name ?? request.resolvedBy?.email}
          </span>
        </p>
      )}
    </li>
  );
}

export function RemovalRequestsBoard() {
  const [status, setStatus] = useState<RemovalRequestStatus>('OPEN');
  const [items, setItems] = useState<AdminRemovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (next: RemovalRequestStatus) => {
    setLoading(true);
    setError(null);
    try {
      setItems((await adminFetch<{ items: AdminRemovalRequest[] }>(`/api/admin/removal-requests?status=${next}`)).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(status);
  }, [status, load]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold uppercase">Pedidos de retirada</h1>
      <div role="tablist" aria-label="Situação" className="flex flex-wrap gap-1 border-b-2 border-gb-ink">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === status}
            onClick={() => setStatus(tab)}
            className={`focus-ring min-h-11 px-4 font-display text-lg font-semibold uppercase ${tab === status ? 'bg-gb-ink text-gb-white' : 'bg-gb-white hover:bg-gb-line'}`}
          >
            {removalStatusLabel[tab]}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-busy={loading}>
        {error && (
          <p role="alert" className="font-semibold text-gb-red">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && <p className="border border-dashed border-gb-mute/40 bg-gb-white p-8 text-center text-gb-mute">Nenhum pedido aqui.</p>}
        <ul className="grid gap-4 lg:grid-cols-2">
          {items.map((request) => (
            <RequestCard key={request.id} request={request} onDone={() => void load(status)} />
          ))}
        </ul>
      </div>
    </div>
  );
}
