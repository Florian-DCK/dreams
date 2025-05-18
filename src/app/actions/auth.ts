"use server"
import { SignupFormSchema, FormState } from "../lib/definitions";
import Database from "../utils/database";
import { getUser, createUser } from "../utils/userCrud";
import { hashPassword, comparePassword } from "../utils/auth";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function signUp(state: FormState, formData: FormData) {
    const validatedData = SignupFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedData.success) {
        return {
            error: validatedData.error.flatten().fieldErrors,
        }
    }

    const db = new Database();
    const connection = await db.getDB();
    const { username, email, password } = validatedData.data;
    if (await getUser(email).catch(() => false)) {
        return {
            error: {
                email: ["Cet utilisateur existe déjà."],
            },
        };
    }

    const hashedPassword = await hashPassword(password);
    const result = await createUser(username, email, hashedPassword).catch((err) => {
        console.error(err);
        return {
            error: {
                message: "Une erreur est survenue lors de la création de l'utilisateur.",
            },
        };
    });

}

export async function signIn(state: FormState, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await getUser(email).catch(() => false);
    if (!user) {
        return {
            error: {
                email: ["Cet utilisateur n'existe pas."],
            },
        };
    }
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
        return {
            error: {
                password: ["Mot de passe incorrect."],
            },
        };
    }
    await createSession(user.user_id, user.username)
    revalidatePath("/", "page")
    redirect("/")
}

export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete({ name: 'session', path: '/' })
    revalidatePath("/")
    redirect("/")
}