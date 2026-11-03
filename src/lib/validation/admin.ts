import { z } from 'zod';
import { muralCategories } from '@/data/mural';

const categoryIds = muralCategories.map((c) => c.id) as [string, ...string[]];

export const muralStatuses = ['PENDING', 'AWAITING_GUARDIAN_AUTHORIZATION', 'APPROVED', 'REJECTED', 'REMOVED'] as const;
export const guardianStatuses = ['NOT_EVALUATED', 'NOT_REQUIRED', 'REQUIRED_PENDING', 'RECEIVED'] as const;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(200),
  password: z.string().min(1, 'Informe a senha.').max(200),
});

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.');

/** Filtros da lista do painel. */
export const adminListQuerySchema = z.object({
  status: z.enum(muralStatuses).optional(),
  category: z.enum(categoryIds).optional(),
  from: day.optional(),
  to: day.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const approveSchema = z.object({
  guardianAuthorizationStatus: z.enum(guardianStatuses),
  thirdPartyRightsReviewed: z.boolean(),
});

const reason = (message: string) => z.string().trim().min(3, message).max(500, 'Use no máximo 500 caracteres.');

export const rejectSchema = z.object({ reason: reason('Informe o motivo da rejeição.') });
export const removeSchema = z.object({ reason: reason('Informe o motivo da remoção.') });
export const awaitingGuardianSchema = z.object({ reason: z.string().trim().max(500).optional() });
export const noteSchema = z.object({ note: reason('Escreva a observação.') });

export const removalStatuses = ['OPEN', 'RESOLVED', 'DISMISSED'] as const;

export const removalListQuerySchema = z.object({ status: z.enum(removalStatuses).default('OPEN') });

export const resolveRemovalSchema = z.object({
  status: z.enum(['RESOLVED', 'DISMISSED']),
  resolutionNote: z.string().trim().min(3, 'Registre o que foi feito.').max(500),
  /** Atalho: resolver e já remover a foto vinculada. */
  removePost: z.boolean().default(false),
});

/** Texto alternativo das fotos do site (leitores de tela e buscadores). */
export const siteImageFormSchema = z.object({
  alt: z.string().trim().min(3, 'Descreva a foto em poucas palavras.').max(300, 'Use no máximo 300 caracteres.'),
});

export const curriculumFormSchema = z.object({
  /** Opcional: sem versão, vale a atual do currículo. */
  version: z.string().trim().max(20, 'Use no máximo 20 caracteres.').transform((value) => value || null),
  referenceMonth: z
    .string()
    .trim()
    .regex(/^(\d{4}-(0[1-9]|1[0-2]))?$/, 'Use o formato AAAA-MM.')
    .transform((value) => value || null),
});
