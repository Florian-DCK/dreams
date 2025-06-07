import { z } from 'zod';

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Le pseudo doit contenir au moins 2 caractères.' })
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

export const CustomBookSchema = z.object({
    custom_title: z.string().trim().optional(),
    review: z.string().trim().optional(),
    note: z.number().min(0, { message: 'La note doit être comprise entre 0 et 5.' }).max(5, { message: 'La note doit être comprise entre 0 et 5.' }).optional(),
})

export type FormState =
    | {
            errors?: {
                username?: string[];
                email?: string[];
                password?: string[];
            };
            message?: string;
    }
    | undefined;

export type SessionPayload = {
    id: string;
    username: string;
    iat?: number;
    exp?: number;
}