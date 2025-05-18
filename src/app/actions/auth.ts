"use server"
export async function signUp(formData: FormData) {
    var message = []

    const name = formData.get("name")?.toString();
    const surname = formData.get("surname")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !surname || !email || !password) {
        message.push("Tous les champs sont requis");
        return message;
    }

    // vérification des champs
    name.length < 2 ? message.push("Le prénom doit faire au moins 2 caractères") : null;
    name.length > 20 ? message.push("Le prénom doit faire au maximum 20 caractères") : null;

    surname.length < 2 ? message.push("Le nom doit faire au moins 2 caractères") : null;
    surname.length > 20 ? message.push("Le nom doit faire au maximum 20 caractères") : null;

    if (message.length > 0) {
        return message;
    }

    // return fetch("/api/auth/signup", {
    //     method: "POST",
    //     body: JSON.stringify({ name, surname, email, password }),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });
}

export async function signIn(formData: FormData) {

}