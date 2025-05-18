'use client';
import { signUp } from "@/app/actions/auth";
import { useActionState } from "react";

export default function Register(){
    const [state, action, pending] = useActionState(signUp, undefined);
    return (

        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <form action={action} className="flex flex-col w-full max-w-sm p-4 bg-white rounded shadow-md">
                <label htmlFor="username">pseudo</label>
                <input type="text" id="username" name="username" className="border" />
                {state?.error?.username && <p className="text-red-400 ">{state.error.name}</p>} 
                
                <label htmlFor="email">Addresse mail</label>
                <input type="email" id="email" name="email" className="border" />
                {state?.error?.email && <p className="text-red-400 ">{state.error.email}</p>} 

                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="password" className="border"  />
                {state?.error?.password && (
                    <div>
                        <p className="text-red-400">Le mot de passe doit</p>
                        <ul>
                            {state.error.password.map((error, index) => (
                                <li key={index} className="text-red-400 ">{error}</li>
                            ))}
                        </ul>
                    </div>

                )
                
                } 

                <button type="submit" disabled={pending}>Envoyer</button>

            </form>
            <a href="/login">j'ai un compte.</a>
        </main>
    )
}