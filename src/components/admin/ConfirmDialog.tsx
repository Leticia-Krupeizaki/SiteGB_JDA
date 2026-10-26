'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  /** Pede um motivo obrigatório antes de confirmar. */
  reasonLabel?: string;
  danger?: boolean;
  busy?: boolean;
  error?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

/** Confirmação com <dialog> nativo: prende o foco, fecha com Esc. */
export function ConfirmDialog({ open, title, description, confirmLabel, reasonLabel, danger = false, busy = false, error, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState('');
  // Ids únicos: há mais de uma confirmação na mesma página (lista e detalhe).
  const titleId = useId();
  const reasonId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setReason('');
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(reason.trim());
  };

  return (
    <dialog ref={ref} onClose={onCancel} aria-labelledby={titleId} className="m-auto w-[min(32rem,calc(100vw-2rem))] p-0 backdrop:bg-gb-ink/70">
      <form onSubmit={submit} className="space-y-4 p-6">
        <h2 id={titleId} className="font-display text-2xl font-bold uppercase">
          {title}
        </h2>
        <p className="text-gb-mute">{description}</p>
        {reasonLabel && (
          <div>
            <label htmlFor={reasonId} className="font-semibold">
              {reasonLabel}
            </label>
            <textarea
              id={reasonId}
              rows={3}
              required
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="focus-ring mt-1 block w-full border-2 border-gb-line px-3 py-2"
            />
          </div>
        )}
        {error && (
          <p role="alert" className="font-semibold text-gb-red">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onCancel} className="focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={busy || (!!reasonLabel && reason.trim().length < 3)}
            className={`focus-ring min-h-11 px-4 font-display font-semibold uppercase text-gb-white disabled:opacity-50 ${danger ? 'bg-gb-red hover:bg-gb-red-dark' : 'bg-gb-ink'}`}
          >
            {busy ? 'Aguarde…' : confirmLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
