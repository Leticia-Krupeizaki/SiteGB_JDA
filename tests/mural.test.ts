import { describe, expect, it } from 'vitest';
import { demoMuralPosts, muralLimits } from '@/data/mural';
import { muralSubmissionSchema, validatePhotoFile } from '@/lib/validation/mural';

const valid = {
  senderName: 'Ana',
  contactType: 'WHATSAPP',
  contactValue: '(41) 99999-0000',
  category: 'TREINOS',
  caption: '',
  acceptPrivacy: true,
  acceptPublication: true,
  declareImageRights: true,
  website: '',
};

describe('formulário do mural', () => {
  it('aceita um envio completo', () => {
    expect(muralSubmissionSchema.safeParse(valid).success).toBe(true);
  });

  it('exige as três autorizações', () => {
    for (const key of ['acceptPrivacy', 'acceptPublication', 'declareImageRights']) {
      const result = muralSubmissionSchema.safeParse({ ...valid, [key]: false });
      expect(result.success, key).toBe(false);
    }
  });

  it('valida contato conforme o tipo', () => {
    expect(muralSubmissionSchema.safeParse({ ...valid, contactValue: '1234' }).success).toBe(false);
    expect(muralSubmissionSchema.safeParse({ ...valid, contactType: 'EMAIL', contactValue: 'ana@' }).success).toBe(false);
    expect(muralSubmissionSchema.safeParse({ ...valid, contactType: 'EMAIL', contactValue: 'ana@exemplo.com' }).success).toBe(true);
  });

  it('rejeita categoria fora da lista, legenda longa e honeypot preenchido', () => {
    expect(muralSubmissionSchema.safeParse({ ...valid, category: 'OUTRA' }).success).toBe(false);
    expect(muralSubmissionSchema.safeParse({ ...valid, caption: 'x'.repeat(muralLimits.captionMaxLength + 1) }).success).toBe(false);
    expect(muralSubmissionSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(false);
  });
});

describe('arquivo da foto', () => {
  it('aceita JPG, PNG e WebP até 10 MB', () => {
    expect(validatePhotoFile({ type: 'image/jpeg', size: 1000 })).toBeNull();
    expect(validatePhotoFile({ type: 'image/webp', size: muralLimits.maxFileBytes })).toBeNull();
  });

  it('rejeita ausência, tipo errado, arquivo vazio ou grande demais', () => {
    expect(validatePhotoFile(null)).not.toBeNull();
    expect(validatePhotoFile({ type: 'image/gif', size: 1000 })).not.toBeNull();
    expect(validatePhotoFile({ type: 'image/png', size: 0 })).not.toBeNull();
    expect(validatePhotoFile({ type: 'image/png', size: muralLimits.maxFileBytes + 1 })).not.toBeNull();
  });
});

describe('dados de demonstração', () => {
  it('não trazem nome, legenda, imagem ou contato', () => {
    for (const post of demoMuralPosts) {
      expect(post.studentName).toBeUndefined();
      expect(post.caption).toBeUndefined();
      expect(post.imageUrl).toBeUndefined();
      expect(Object.keys(post)).not.toContain('contactValue');
    }
  });
});
