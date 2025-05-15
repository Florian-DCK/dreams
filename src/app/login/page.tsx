import Database from "@/app/utils/database";
export default function Login() {

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <form action="" className="flex flex-col w-full max-w-sm p-4 bg-white rounded shadow-md">
                <label htmlFor="email">Addresse mail</label>
                <input type="email" id="email" name="email" className="border" required />
                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="password" className="border" required />
            </form>
            <a href="/register">Vous n'avez pas encore de compte ?</a>
        </main>
    )
}