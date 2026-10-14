/** Aviso fixo da Fase A: o mural ainda não tem backend. */
export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="border-2 border-dashed border-gb-ink bg-gb-white p-4 sm:p-5">
      <p className="font-display text-xl font-bold uppercase">Demonstração</p>
      <p className="mt-1 text-gb-mute">{children}</p>
    </div>
  );
}
