import { z } from 'zod';

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
        .trim(),
    email: z.string().email({ message: 'Veuillez saisir un email valide.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Doit contenir au moins 8 caractères' })
        .regex(/[a-zA-Z]/, { message: 'Doit contenir au moins une lettre.' })
        .regex(/[0-9]/, { message: 'Doit contenir au moins un chiffre.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Doit contenir au moins un caractère spécial.',
        })
        .trim(),
});

export type FormState =
    | {
            errors?: {
                name?: string[];
                email?: string[];
                password?: string[];
            };
            message?: string;
      }
    | undefined;
