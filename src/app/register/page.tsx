'use client';
import { signUp } from "@/app/actions/auth";
import { useActionState } from "react";

export default function Register(){
    const [state, action, pending] = useActionState(signUp, undefined);
    return (

        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            
            <form action={signUp} className="flex flex-col w-full max-w-sm p-4 bg-white rounded shadow-md">
                <label htmlFor="name">Prénom</label>
                <input type="text" id="name" name="name" className="border" />

                <label htmlFor="surname">Nom</label>
                <input type="text" id="surname" name="surname" className="border" />
                
                <label htmlFor="email">Addresse mail</label>
                <input type="email" id="email" name="email" className="border" />

                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="password" className="border"  />

                <button type="submit">Envoyer</button>

            </form>
            <a href="/login">j'ai un compte.</a>
        </main>
    )
}