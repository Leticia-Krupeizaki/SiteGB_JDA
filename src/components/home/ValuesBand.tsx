const values = ['Integridade', 'Desenvolvimento', 'Irmandade'];

/** Faixa com os valores da rede Gracie Barra, em rolagem lenta (parada com reduced-motion). */
export function ValuesBand() {
  const row = [...values, ...values, ...values, ...values];

  return (
    <section aria-label="Valores Gracie Barra" className="overflow-hidden bg-gb-red py-5 text-gb-white">
      <div className="flex w-max animate-[gb-marquee_40s_linear_infinite] gap-10 motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-10">
            {row.map((value, i) => (
              <li key={`${value}-${i}`} className="flex items-center gap-10 font-display text-4xl font-bold uppercase whitespace-nowrap sm:text-5xl">
                {value}
                <span aria-hidden className="inline-block h-3 w-3 rotate-45 bg-gb-white" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
