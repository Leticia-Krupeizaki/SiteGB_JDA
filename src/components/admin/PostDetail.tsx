'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import { categoryLabel } from '@/data/mural';
import { AdminApiError, adminFetch } from './api';
import { ConfirmDialog } from './ConfirmDialog';
import { actionLabel, formatDateTime, guardianLabel, statusLabel } from './labels';
import { StatusBadge } from './StatusBadge';
import { useToast } from './Toast';
import type { AdminPost, AuditEvent, GuardianStatus } from './types';

type Props = { postId: string | null; onClose: () => void; onChanged: (post: AdminPost) => void };

type Pending = 'reject' | 'remove' | null;

const buttonBase = 'focus-ring min-h-11 px-4 font-display text-lg font-semibold uppercase disabled:opacity-50';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-gb-mute">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  );
}

/** Detalhe privado de uma foto, com as ações permitidas para o status atual e o histórico. */
export function PostDetail({ postId, onClose, onChanged }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const [post, setPost] = useState<AdminPost | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [guardian, setGuardian] = useState<GuardianStatus | ''>('');
  const [rightsReviewed, setRightsReviewed] = useState(false);
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState<Pending>(null);
  const [confirmError, setConfirmError] = useState<string>();

  const load = useCallback(async (id: string) => {
    setLoadError(null);
    try {
      const [detail, trail] = await Promise.all([
        adminFetch<AdminPost>(`/api/admin/mural/${id}`),
        adminFetch<{ items: AuditEvent[] }>(`/api/admin/mural/${id}/audit`),
      ]);
      setPost(detail);
      setAudit(trail.items);
      setGuardian(detail.status === 'AWAITING_GUARDIAN_AUTHORIZATION' ? 'RECEIVED' : '');
      setRightsReviewed(false);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Não foi possível carregar a foto.');
    }
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (postId) {
      setPost(null);
      setAudit([]);
      setNote('');
      if (!dialog.open) dialog.showModal();
      void load(postId);
    } else if (dialog.open) dialog.close();
  }, [postId, load]);

  /** Executa uma ação, atualiza o detalhe e avisa a lista. */
  const run = async (request: () => Promise<AdminPost>, success: string) => {
    setBusy(true);
    setConfirmError(undefined);
    try {
      const updated = await request();
      setPost(updated);
      onChanged(updated);
      setConfirm(null);
      toast('success', success);
      const trail = await adminFetch<{ items: AuditEvent[] }>(`/api/admin/mural/${updated.id}/audit`);
      setAudit(trail.items);
    } catch (err) {
      const message = err instanceof AdminApiError ? err.message : 'Algo deu errado.';
      if (confirm) setConfirmError(message);
      else toast('error', message);
      // Conflito: outra pessoa moderou antes. Recarrega o estado real.
      if (err instanceof AdminApiError && err.status === 409 && post) void load(post.id);
    } finally {
      setBusy(false);
    }
  };

  const approve = () =>
    post &&
    run(
      () => adminFetch(`/api/admin/mural/${post.id}/approve`, { method: 'PATCH', body: { guardianAuthorizationStatus: guardian, thirdPartyRightsReviewed: rightsReviewed } }),
      'Foto aprovada e publicada no mural.',
    );

  const awaitGuardian = () =>
    post && run(() => adminFetch(`/api/admin/mural/${post.id}/awaiting-guardian`, { method: 'PATCH', body: {} }), 'Foto aguardando autorização dos responsáveis.');

  const addNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!post || note.trim().length < 3) return;
    setBusy(true);
    try {
      const trail = await adminFetch<{ items: AuditEvent[] }>(`/api/admin/mural/${post.id}/audit`, { method: 'POST', body: { note } });
      setAudit(trail.items);
      setNote('');
      toast('success', 'Observação registrada.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  };

  const reviewable = post?.status === 'PENDING' || post?.status === 'AWAITING_GUARDIAN_AUTHORIZATION';
  const canApprove = rightsReviewed && (guardian === 'NOT_REQUIRED' || guardian === 'RECEIVED');

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Detalhe da foto"
      className="m-auto h-[calc(100dvh-2rem)] w-[min(72rem,calc(100vw-2rem))] max-w-none bg-gb-white p-0 backdrop:bg-gb-ink/70"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-2 border-gb-ink bg-gb-white px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold uppercase">{post ? categoryLabel[post.category] : 'Carregando…'}</h2>
          {post && <StatusBadge status={post.status} />}
        </div>
        <button type="button" onClick={onClose} className="focus-ring inline-flex min-h-11 items-center gap-1 bg-gb-ink px-4 font-display font-semibold uppercase text-gb-white">
          <CloseIcon className="h-4 w-4" /> Fechar
        </button>
      </div>

      {loadError && (
        <p role="alert" className="m-5 font-semibold text-gb-red">
          {loadError}
        </p>
      )}

      {post && (
        <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <div className="flex justify-center bg-gb-ink">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada temporária do bucket privado */}
              <img src={post.imageUrl} alt={`Foto enviada por ${post.studentName}`} width={post.width} height={post.height} className="max-h-[60vh] w-auto object-contain" />
            </div>
            <p className="text-sm text-gb-mute">
              {post.width} × {post.height} px · link da imagem válido por 5 minutos (reabra a foto se expirar).
            </p>
          </div>

          <div className="space-y-6">
            <dl className="divide-y divide-gb-line">
              <Field label="Enviada em">{formatDateTime(post.createdAt)}</Field>
              <Field label="Nome">
                {post.studentName} <span className="text-sm text-gb-mute">({post.showNamePublicly ? 'pode aparecer no mural' : 'não aparece no mural'})</span>
              </Field>
              <Field label="Contato">
                {post.contactType === 'EMAIL' ? 'E-mail' : 'WhatsApp'}: {post.contactValue}
              </Field>
              <Field label="Legenda">{post.caption ?? <span className="text-gb-mute">Sem legenda</span>}</Field>
              <Field label="Autorizações">
                Privacidade (versão {post.privacyPolicyVersion})
                <span className="block">Publicação (versão {post.publicationConsentVersion})</span>
                <span className="block text-sm text-gb-mute">aceitas em {formatDateTime(post.publicationConsentAt)}</span>
              </Field>
              <Field label="Menores na foto">{guardianLabel[post.guardianAuthorizationStatus]}</Field>
              {post.approvedAt && <Field label="Aprovada em">{formatDateTime(post.approvedAt)}</Field>}
              {post.rejectionReason && <Field label="Motivo da rejeição">{post.rejectionReason}</Field>}
              {post.removedAt && <Field label="Removida em">{formatDateTime(post.removedAt)}</Field>}
              {post.moderatedBy && <Field label="Moderada por">{post.moderatedBy}</Field>}
              {post.openRemovalRequests > 0 && (
                <Field label="Pedidos de retirada">
                  <a href="/admin/retiradas" className="focus-ring font-semibold text-gb-red underline">
                    {post.openRemovalRequests} em aberto
                  </a>
                </Field>
              )}
            </dl>

            {reviewable && (
              <section aria-labelledby="moderar" className="space-y-4 border-2 border-gb-ink p-4">
                <h3 id="moderar" className="font-display text-xl font-bold uppercase">
                  Moderar
                </h3>
                <div>
                  <label htmlFor="guardian" className="font-semibold">
                    Há menores de idade na foto?
                  </label>
                  <select
                    id="guardian"
                    value={guardian}
                    onChange={(event) => setGuardian(event.target.value as GuardianStatus)}
                    className="focus-ring mt-1 block min-h-11 w-full border-2 border-gb-line bg-gb-white px-3"
                  >
                    <option value="" disabled>
                      Escolha
                    </option>
                    <option value="NOT_REQUIRED">{guardianLabel.NOT_REQUIRED}</option>
                    <option value="RECEIVED">{guardianLabel.RECEIVED}</option>
                    <option value="REQUIRED_PENDING">{guardianLabel.REQUIRED_PENDING}</option>
                  </select>
                </div>
                <label className="flex gap-3">
                  <input type="checkbox" checked={rightsReviewed} onChange={(event) => setRightsReviewed(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-gb-navy" />
                  <span>Revisei a foto: não expõe ninguém de forma indevida e as pessoas que aparecem podem ser publicadas.</span>
                </label>
                {guardian === 'REQUIRED_PENDING' && (
                  <p className="text-sm text-gb-navy">Para fotos com menores sem autorização, use &quot;Aguardar autorização&quot;. A foto não pode ser aprovada assim.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy || !canApprove} onClick={approve} className={`${buttonBase} bg-gb-navy text-gb-white hover:bg-gb-navy-dark`}>
                    Aprovar e publicar
                  </button>
                  {post.status === 'PENDING' && (
                    <button type="button" disabled={busy} onClick={awaitGuardian} className={`${buttonBase} border-2 border-gb-navy text-gb-navy`}>
                      Aguardar autorização
                    </button>
                  )}
                  <button type="button" disabled={busy} onClick={() => setConfirm('reject')} className={`${buttonBase} border-2 border-gb-red text-gb-red`}>
                    Rejeitar
                  </button>
                </div>
              </section>
            )}

            {post.status === 'APPROVED' && (
              <section className="border-2 border-gb-red p-4">
                <p className="font-semibold">Esta foto está publicada no mural.</p>
                <button type="button" disabled={busy} onClick={() => setConfirm('remove')} className={`${buttonBase} mt-3 bg-gb-red text-gb-white hover:bg-gb-red-dark`}>
                  Remover do mural
                </button>
              </section>
            )}

            <section aria-labelledby="historico" className="space-y-3">
              <h3 id="historico" className="font-display text-xl font-bold uppercase">
                Histórico
              </h3>
              <ol className="space-y-2 border-l-2 border-gb-line pl-4">
                {audit.map((event) => (
                  <li key={event.id}>
                    <p className="font-semibold">
                      {actionLabel[event.action]}
                      {event.nextStatus && event.action !== 'SUBMITTED' && event.action !== 'NOTE' && (
                        <span className="font-normal text-gb-mute"> · {statusLabel[event.nextStatus]}</span>
                      )}
                    </p>
                    <p className="text-sm text-gb-mute">
                      {formatDateTime(event.createdAt)} · {event.admin ?? 'sistema'}
                    </p>
                    {event.reason && <p className="mt-1 text-sm">{event.reason}</p>}
                  </li>
                ))}
              </ol>
              <form onSubmit={addNote} className="space-y-2">
                <label htmlFor="note" className="text-sm font-semibold">
                  Observação interna (só a equipe vê)
                </label>
                <textarea
                  id="note"
                  rows={2}
                  maxLength={500}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="focus-ring block w-full border-2 border-gb-line px-3 py-2"
                />
                <button type="submit" disabled={busy || note.trim().length < 3} className={`${buttonBase} border-2 border-gb-ink text-base`}>
                  Registrar observação
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm === 'reject'}
        title="Rejeitar foto"
        description="A foto não será publicada. O motivo fica registrado no histórico."
        reasonLabel="Motivo da rejeição"
        confirmLabel="Rejeitar"
        danger
        busy={busy}
        error={confirmError}
        onCancel={() => setConfirm(null)}
        onConfirm={(reason) => post && run(() => adminFetch(`/api/admin/mural/${post.id}/reject`, { method: 'PATCH', body: { reason } }), 'Foto rejeitada.')}
      />
      <ConfirmDialog
        open={confirm === 'remove'}
        title="Remover do mural"
        description="A foto sai do mural na hora e a cópia pública é apagada. Esta ação não pode ser desfeita."
        reasonLabel="Motivo da remoção"
        confirmLabel="Remover"
        danger
        busy={busy}
        error={confirmError}
        onCancel={() => setConfirm(null)}
        onConfirm={(reason) => post && run(() => adminFetch(`/api/admin/mural/${post.id}`, { method: 'DELETE', body: { reason } }), 'Foto removida do mural.')}
      />
    </dialog>
  );
}
