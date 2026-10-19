import { describe, expect, it } from 'vitest';
import { contact, whatsappTrialUrl, whatsappUrl } from '@/config/site';
import { classLabel, schedule, scheduleSlots, slotOf, weekdays } from '@/data/schedule';
import { defaultDay, filterBlocks } from '@/lib/schedule';

/** Transcrição do PDF "Grade Horária, 10_08_2026.pdf" (a partir de 10/08/2026). */
const expected = {
  seg: [
    '09:30-10:30 GBK',
    '12:00-13:00 GB1 + GB2',
    '17:30-18:30 GB1 + GB2 Competição',
    '19:00-19:50 GBK 7 a 13 anos',
    '20:00-21:00 GB1 + GB2 Defesa pessoal',
  ],
  ter: ['06:15-07:15 GB1 + GB2', '17:00-18:00 GB1 + GB2', '18:00-18:50 GBK Até 6 anos', '19:00-20:00 GBF', '20:00-21:00 GB1 + GB2'],
  qua: [
    '06:15-07:15 No-Gi',
    '09:30-10:30 GBK',
    '12:00-13:00 GB1 + GB2',
    '17:00-18:00 GB1 + GB2 Competição',
    '18:00-18:50 GBK Até 6 anos',
    '19:00-19:50 GBK 7 a 13 anos',
    '20:00-21:00 No-Gi',
  ],
  qui: ['06:15-07:15 GB1 + GB2', '17:00-18:00 No-Gi', '18:00-18:50 GBK Até 6 anos', '19:00-20:00 GBF', '20:00-21:00 GB1 + GB2'],
  sex: ['09:30-10:30 GBK', '12:00-13:00 No-Gi', '17:00-18:00 GB1 + GB2 Competição', '19:00-19:50 GBK 7 a 13 anos', '20:00-21:00 GB1 + GB2'],
};

describe('grade oficial', () => {
  it('confere bloco a bloco com o PDF', () => {
    for (const w of weekdays) {
      const actual = schedule[w.id].map((b) => [`${b.start}-${b.end}`, classLabel(b.classes), b.ageGroup, b.note].filter(Boolean).join(' '));
      expect(actual, w.label).toEqual(expected[w.id]);
    }
  });

  it('tem 27 blocos (5 + 5 + 7 + 5 + 5) e nada no fim de semana', () => {
    expect(weekdays.map((w) => schedule[w.id].length)).toEqual([5, 5, 7, 5, 5]);
    expect(Object.keys(schedule)).toEqual(['seg', 'ter', 'qua', 'qui', 'sex']);
  });
});

describe('faixas de horário (linhas da grade)', () => {
  it('cada bloco cai numa faixa, sem dois blocos na mesma faixa do mesmo dia', () => {
    for (const w of weekdays) {
      const slots = schedule[w.id].map((b) => slotOf(b.start));
      expect(new Set(slots).size, w.label).toBe(slots.length);
      expect(slots.every((s) => scheduleSlots.includes(s)), w.label).toBe(true);
    }
  });

  it('segunda 17:30 fica na linha das 17:00, como na arte oficial', () => {
    expect(slotOf('17:30')).toBe('17:00');
    expect(slotOf('06:15')).toBe('06:15');
    expect(slotOf('19:00')).toBe('19:00');
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
    expect(filterBlocks(schedule.qua, ['NOGI', 'GBK'])).toHaveLength(5);
    expect(filterBlocks(schedule.ter, ['GBK'])).toHaveLength(1);
    expect(filterBlocks(schedule.ter, ['NOGI'])).toHaveLength(0);
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
    // Um único número para ligação e WhatsApp.
    expect(contact.displayPhone).toBe('(41) 3205-8109');
    expect(contact.phoneE164).toBe('+554132058109');
    expect(whatsappTrialUrl).toBe(`https://wa.me/554132058109?text=${encodeURIComponent(contact.trialMessage)}`);
    expect(whatsappUrl()).toBe('https://wa.me/554132058109');
  });
});
