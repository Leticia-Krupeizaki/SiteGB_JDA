import { describe, expect, it } from 'vitest';
import { contact, whatsappTrialUrl, whatsappUrl } from '@/config/site';
import { classLabel, schedule, weekdays } from '@/data/schedule';
import { defaultDay, filterBlocks } from '@/lib/schedule';

/** Transcrição do PDF "Grade Horária, a partir de 26_02_26-1.pdf" (especificação, seção 7). */
const expected = {
  seg: ['09:30-10:30 GBK', '12:00-13:00 GB1 + GB2', '17:30-18:30 GB1 + GB2 Competição', '19:00-20:00 GBK', '20:00-21:00 GB1 + GB2 Defesa pessoal'],
  ter: ['06:15-07:15 GB1 + GB2', '18:30-19:30 GBF', '20:00-21:00 GB1 + GB2'],
  qua: ['06:15-07:15 No-Gi', '09:30-10:30 GBK', '12:00-13:00 GB1 + GB2', '17:30-18:30 GB1 + GB2 Competição', '19:00-20:00 GBK', '20:00-21:00 No-Gi'],
  qui: ['06:15-07:15 GB1 + GB2', '18:30-19:30 GBF', '20:00-21:00 GB1 + GB2'],
  sex: ['09:30-10:30 GBK', '12:00-13:00 No-Gi', '17:30-18:30 GB1 + GB2 Competição', '19:00-20:00 GBK', '20:00-21:00 GB1 + GB2'],
};

describe('grade oficial', () => {
  it('confere bloco a bloco com o PDF', () => {
    for (const w of weekdays) {
      const actual = schedule[w.id].map((b) => [`${b.start}-${b.end}`, classLabel(b.classes), b.note].filter(Boolean).join(' '));
      expect(actual, w.label).toEqual(expected[w.id]);
    }
  });

  it('tem 22 blocos (5 + 3 + 6 + 3 + 5) e nada no fim de semana', () => {
    expect(weekdays.map((w) => schedule[w.id].length)).toEqual([5, 3, 6, 3, 5]);
    expect(Object.keys(schedule)).toEqual(['seg', 'ter', 'qua', 'qui', 'sex']);
  });
});

describe('filtros', () => {
  it('sem filtro mostra a grade inteira', () => {
    expect(filterBlocks(schedule.seg, [])).toEqual(schedule.seg);
  });

  it('GB1/GB2 mantém os horários combinados GB1 + GB2', () => {
    const blocks = filterBlocks(schedule.seg, ['GB1GB2']);
    expect(blocks).toHaveLength(3);
    expect(blocks.every((b) => b.classes.join() === 'GB1,GB2')).toBe(true);
  });

  it('combina grupos e não altera a grade original', () => {
    const before = JSON.stringify(schedule);
    expect(filterBlocks(schedule.qua, ['NOGI', 'GBK'])).toHaveLength(4);
    expect(filterBlocks(schedule.ter, ['GBK'])).toHaveLength(0);
    expect(JSON.stringify(schedule)).toBe(before);
  });
});

describe('dia padrão', () => {
  it('abre no dia atual em dias de aula e na segunda no fim de semana', () => {
    expect(defaultDay(new Date(2026, 9, 14))).toEqual({ day: 'qua', isToday: true }); // quarta
    expect(defaultDay(new Date(2026, 9, 17))).toEqual({ day: 'seg', isToday: false }); // sábado
    expect(defaultDay(new Date(2026, 9, 18))).toEqual({ day: 'seg', isToday: false }); // domingo
  });

  it('usa o fuso da academia quando informado', () => {
    // 17/10 02:00 UTC ainda é sexta 23:00 em São Paulo
    const late = new Date(Date.UTC(2026, 9, 17, 2, 0));
    expect(defaultDay(late, 'America/Sao_Paulo')).toEqual({ day: 'sex', isToday: true });
    expect(defaultDay(late, 'UTC')).toEqual({ day: 'seg', isToday: false });
  });
});

describe('contato', () => {
  it('usa o número confirmado e codifica a mensagem', () => {
    expect(contact.displayPhone).toBe('(41) 3205-8109');
    expect(whatsappTrialUrl).toBe(`https://wa.me/554132058109?text=${encodeURIComponent(contact.trialMessage)}`);
    expect(whatsappUrl()).toBe('https://wa.me/554132058109');
  });
});
