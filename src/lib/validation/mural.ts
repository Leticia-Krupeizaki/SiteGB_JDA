import { z, type ZodError } from 'zod';
import { muralCategories, muralLimits } from '@/data/mural';

const categoryIds = muralCategories.map((c) => c.id) as [string, ...string[]];

const mustAccept = (message: string) => z.literal(true, { errorMap: () => ({ message }) });

/**
 * Campos do formulário público (especificação, seção 9.3). O mesmo schema roda
 * no navegador e na API; a verificação do navegador nunca é a única barreira.
 */
export const muralSubmissionSchema = z.object({
  senderName: z.string().trim().min(2, 'Informe seu nome.').max(80, 'Use no máximo 80 caracteres.'),
  contactType: z.enum(['WHATSAPP', 'EMAIL'], { errorMap: () => ({ message: 'Escolha WhatsApp ou e-mail.' }) }),
  contactValue: z.string().trim().min(1, 'Informe seu contato.').max(120, 'Use no máximo 120 caracteres.'),
  category: z.enum(categoryIds, { errorMap: () => ({ message: 'Escolha uma categoria.' }) }),
  caption: z
    .string()
    .trim()
    .max(muralLimits.captionMaxLength, `Use no máximo ${muralLimits.captionMaxLength} caracteres.`)
    .optional()
    .or(z.literal('')),
  /** Opcional: o nome só aparece no mural com esta autorização. */
  showNamePublicly: z.boolean(),
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

const text = (data: FormData, name: string) => {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
};

/** Lê o FormData do formulário do mural no formato do schema. Usado pelo navegador e pela API. */
export function muralFormValues(data: FormData) {
  return {
    senderName: text(data, 'senderName'),
    contactType: text(data, 'contactType') || undefined,
    contactValue: text(data, 'contactValue'),
    category: text(data, 'category') || undefined,
    caption: text(data, 'caption'),
    showNamePublicly: data.get('showNamePublicly') === 'on',
    acceptPrivacy: data.get('acceptPrivacy') === 'on',
    acceptPublication: data.get('acceptPublication') === 'on',
    declareImageRights: data.get('declareImageRights') === 'on',
    website: text(data, 'website'),
  };
}

/** Primeira mensagem de erro de cada campo. */
export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0])] ??= issue.message;
  return errors;
}

/** Checagem inicial do arquivo no navegador. O servidor faz a verificação real (magic bytes, decodificação). */
export function validatePhotoFile(file: { type: string; size: number } | null | undefined): string | null {
  if (!file) return 'Escolha uma foto.';
  if (!(muralLimits.acceptedTypes as readonly string[]).includes(file.type)) return 'Envie uma foto em JPG, PNG ou WebP.';
  if (file.size > muralLimits.maxFileBytes) return 'A foto deve ter no máximo 10 MB.';
  if (file.size === 0) return 'O arquivo está vazio.';
  return null;
}

/** Consulta pública da galeria: `?category=&cursor=&limit=`. */
export const publicListQuerySchema = z.object({
  category: z.enum(categoryIds).optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(muralLimits.maxPageSize).default(muralLimits.pageSize),
});

/** Pedido de retirada de foto (spec §9). */
export const removalRequestSchema = z.object({
  requesterContact: z.string().trim().min(5, 'Informe um WhatsApp ou e-mail para retorno.').max(120, 'Use no máximo 120 caracteres.'),
  reason: z
    .string()
    .trim()
    .min(10, 'Descreva a foto e o motivo (mínimo de 10 caracteres).')
    .max(1000, 'Use no máximo 1000 caracteres.'),
  postId: z.string().uuid().optional().or(z.literal('')),
  website: z.string().max(0).optional(),
});
