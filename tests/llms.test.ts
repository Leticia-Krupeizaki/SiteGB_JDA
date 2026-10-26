import { describe, expect, it } from 'vitest';
import { contact, site } from '@/config/site';
import { schedule, weekdays } from '@/data/schedule';
import { buildLlmsTxt } from '@/lib/llms';

const text = buildLlmsTxt();

describe('/llms.txt', () => {
  it('segue o formato llmstxt.org: título H1 e resumo em citação', () => {
    const lines = text.split('\n');
    expect(lines[0]).toBe(`# ${site.name}`);
    expect(lines[2].startsWith('> ')).toBe(true);
  });

  it('traz o contato e o agendamento', () => {
    expect(text).toContain(contact.displayPhone);
    expect(text).toContain('gbjardimdasamericas@outlook.com');
    expect(text).toContain(`https://wa.me/${contact.whatsappDigits}`);
  });

  it('lista todas as aulas da grade oficial', () => {
    for (const day of weekdays) {
      expect(text).toContain(`### ${day.label}`);
      for (const block of schedule[day.id]) expect(text).toContain(`${block.start}–${block.end}`);
    }
  });

  it('traz o endereço confirmado e não tem valores vazios', () => {
    expect(text).toContain('Rua Marechal Cardoso Júnior, 194 – Jardim das Américas, Curitiba–PR, 81530-420');
    expect(text).not.toMatch(/undefined|null|\[object/);
  });
});
