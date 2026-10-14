import { z } from 'zod';
import { muralCategories, muralLimits } from '@/data/mural';

const categoryIds = muralCategories.map((c) => c.id) as [string, ...string[]];

const mustAccept = (message: string) => z.literal(true, { errorMap: () => ({ message }) });

/**
 * Campos do formulário público (especificação, seção 9.3). O mesmo schema será
 * usado pela API na Etapa 4; a verificação do navegador nunca é a única barreira.
 */
export const muralSubmissionSchema = z.object({
  senderName: z.string().trim().min(2, 'Informe seu nome.').max(80, 'Use no máximo 80 caracteres.'),
  contactType: z.enum(['WHATSAPP', 'EMAIL'], { errorMap: () => ({ message: 'Escolha WhatsApp ou e-mail.' }) }),
  contactValue: z.string().trim().min(1, 'Informe seu contato.'),
  category: z.enum(categoryIds, { errorMap: () => ({ message: 'Escolha uma categoria.' }) }),
  caption: z
    .string()
    .trim()
    .max(muralLimits.captionMaxLength, `Use no máximo ${muralLimits.captionMaxLength} caracteres.`)
    .optional()
    .or(z.literal('')),
  acceptPrivacy: mustAccept('É preciso aceitar a política de privacidade.'),
  acceptPublication: mustAccept('É preciso autorizar o uso e a publicação da foto.'),
  declareImageRights: mustAccept('É preciso confirmar a declaração sobre direitos de imagem.'),
  /** Honeypot: campo invisível que pessoas não preenchem. */
  website: z.string().max(0).optional(),
}).superRefine((data, ctx) => {
  const value = data.contactValue.trim();
  if (data.contactType === 'EMAIL' && !z.string().email().safeParse(value).success) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contactValue'], message: 'Informe um e-mail válido.' });
  }
  if (data.contactType === 'WHATSAPP') {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contactValue'], message: 'Informe um WhatsApp com DDD.' });
    }
  }
});

export type MuralSubmission = z.infer<typeof muralSubmissionSchema>;

/** Checagem inicial do arquivo no navegador. O servidor fará a verificação real (magic bytes, decodificação). */
export function validatePhotoFile(file: { type: string; size: number } | null | undefined): string | null {
  if (!file) return 'Escolha uma foto.';
  if (!(muralLimits.acceptedTypes as readonly string[]).includes(file.type)) return 'Envie uma foto em JPG, PNG ou WebP.';
  if (file.size > muralLimits.maxFileBytes) return 'A foto deve ter no máximo 10 MB.';
  if (file.size === 0) return 'O arquivo está vazio.';
  return null;
}
