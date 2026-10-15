import { describe, expect, it } from 'vitest';
import { generatePassword, hashPassword, verifyPassword } from '@/lib/auth/password';
import { approveSchema, loginSchema, rejectSchema, resolveRemovalSchema } from '@/lib/validation/admin';

describe('senha do painel', () => {
  it('confere a senha certa e recusa a errada', async () => {
    const hash = await hashPassword('senha-forte-123');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(hash).not.toContain('senha-forte-123');
    expect(await verifyPassword('senha-forte-123', hash)).toBe(true);
    expect(await verifyPassword('senha-forte-124', hash)).toBe(false);
  });

  it('gera sal diferente a cada hash', async () => {
    expect(await hashPassword('igual')).not.toBe(await hashPassword('igual'));
  });

  it('recusa hash em formato desconhecido', async () => {
    expect(await verifyPassword('x', 'md5$abc')).toBe(false);
    expect(await verifyPassword('x', '')).toBe(false);
  });

  it('gera senhas iniciais longas e diferentes', () => {
    const a = generatePassword();
    expect(a.length).toBeGreaterThanOrEqual(20);
    expect(generatePassword()).not.toBe(a);
  });
});

describe('validação do painel', () => {
  it('normaliza o e-mail do login', () => {
    expect(loginSchema.parse({ email: '  Equipe@Exemplo.com ', password: 'x' }).email).toBe('equipe@exemplo.com');
  });

  it('exige motivo na rejeição e no tratamento de retirada', () => {
    expect(rejectSchema.safeParse({ reason: ' ' }).success).toBe(false);
    expect(resolveRemovalSchema.safeParse({ status: 'RESOLVED', resolutionNote: '' }).success).toBe(false);
    expect(resolveRemovalSchema.safeParse({ status: 'OPEN', resolutionNote: 'feito' }).success).toBe(false);
  });

  it('aprovação só aceita status de autorização conhecidos', () => {
    expect(approveSchema.safeParse({ guardianAuthorizationStatus: 'TALVEZ', thirdPartyRightsReviewed: true }).success).toBe(false);
  });
});
