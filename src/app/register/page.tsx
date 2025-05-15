
export default function Register(){
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <form action="" className="flex flex-col w-full max-w-sm p-4 bg-white rounded shadow-md">
                <label htmlFor="name">Prénom</label>
                <input type="text" id="name" name="name" className="border" required />

                <label htmlFor="surname">Nom</label>
                <input type="text" id="surname" name="surname" className="border" required />
                
                <label htmlFor="email">Addresse mail</label>
                <input type="email" id="email" name="email" className="border" required />

                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="password" className="border" required />

            </form>
            <a href="/login">j'ai un compte.</a>
        </main>
    )
}