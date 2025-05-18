'use client';
import { signIn } from "@/app/actions/auth"
import { useActionState } from "react";

export default function Login() {
    const [state, action, pending] = useActionState(signIn, undefined);
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <form action={action} className="flex flex-col w-full max-w-sm p-4 bg-white rounded shadow-md">
                <label htmlFor="email">Addresse mail</label>
                {state?.error?.email && <p className="text-red-400 ">{state.error.email}</p>}
                <input type="email" id="email" name="email" className="border" required />
                <label htmlFor="password">Mot de passe</label>
                {state?.error?.password && <p className="text-red-400 ">{state.error.password}</p>}
                <input type="password" id="password" name="password" className="border" required />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Se connecter</button>
            </form>
            <a href="/register">Vous n'avez pas encore de compte ?</a>
        </main>
    )
}