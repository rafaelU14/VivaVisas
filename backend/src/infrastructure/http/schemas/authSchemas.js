import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio.' })
    .trim()
    .toLowerCase()
    .email('El formato de correo electrónico es inválido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña no puede estar vacía.'),
});

export const createUserSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio.' })
    .trim()
    .toLowerCase()
    .email('El formato de correo electrónico es inválido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  role: z.enum(['ADMIN', 'ADVISOR']).optional().default('ADVISOR'),
  status: z.boolean().optional().default(true),
});