"use client";
import { useEffect, useState, use } from 'react';
import { checkBookExists, fetchBook, getBook } from '@/app/utils/bookCrud';
import Card from '@/components/Card';
import Notes from '@/components/notes';

export default function Details({ params }: { params: { id: string } }) {
    const { id } = use(params);
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        /*
            * Fonction pour récupérer les détails d'un livre par son ID.
            * Elle vérifie d'abord si le livre existe dans la base de données.
            * Si le livre n'existe pas, elle le récupère depuis l'API externe et l'ajoute à la base de données.
            * Ensuite, elle met à jour l'état du composant avec les détails du livre.
        **/
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const bookExists = await checkBookExists(id);
                
                if (!bookExists) {
                    await fetchBook(id);
                    const book = await getBook(id);
                    setBook(book);
                } else {
                    const bookData = await getBook(id);
                    setBook(bookData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du livre:", error);
                setError("Impossible de charger les détails du livre.");
            } finally {
                setLoading(false);
            }
        }  
        fetchBookDetails();
    }, [id]); 

    if (loading) return <div className="container mx-auto p-4">Chargement...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    if (!book) return <div className="container mx-auto p-4">Livre non trouvé</div>;

    return (
        <div className="min-h-full flex items-center justify-center">
            <div className="w-[90%] mx-auto px-8 py-10 rounded flex flex-col md:flex-row gap-8 ">
                {/* Colonne gauche : titre, description, image */}
                <Card className="flex-1 flex flex-col gap-4">
                    <h1 className="text-3xl font-extrabold mb-2 text-black">{book.title}</h1>
                    <div className='flex'>
                        {book.description && (
                            <p className="text-black text-base leading-relaxed whitespace-pre-line">
                                {book.cover_image && (
                                    <img
                                        src={book.cover_image}
                                        alt={book.title}
                                        className="h-80 w-auto shadow-lg rounded float-right ml-6 mb-4"
                                    />
                                )}
                                <span dangerouslySetInnerHTML={{ __html: book.description }} />
                            </p>
                        )}
                    </div>
                </Card>
                {/* Séparateur vertical */}
                {/* <div className="hidden md:block w-px bg-[#3f3f3f] mx-6"></div> */}
                {/* Colonne droite : infos */}
                <Card className="flex-1 self-start">
                    <h2 className="text-2xl font-bold mb-4 text-black">Informations du livre :</h2>
                    <div className="text-black text-base space-y-2">
                        {book.published_date && (
                            <p>
                                <span className="font-semibold">Date de publication :</span>{" "}
                                {new Date(book.published_date).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                        )}
                        {book.genres && (
                            <p>
                                <span className="font-semibold">Genres :</span>{" "}
                                {Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}
                            </p>
                        )}
                        {book.author && (
                            <p>
                                <span className="font-semibold">Auteur :</span>{" "}
                                {Array.isArray(book.author)
                                    ? book.author.map((a: string, i: number) => (
                                        <span key={a}>
                                            <a href="#" className="underline hover:text-blue-700">{a}</a>
                                            {i < book.author.length - 1 && ", "}
                                        </span>
                                    ))
                                    : <a href="#" className="underline hover:text-blue-700">{book.author}</a>
                                }
                            </p>
                        )}
                        {book.publisher && (
                            <p>
                                <span className="font-semibold">Éditeur :</span> {book.publisher}
                            </p>
                        )}
                        {book.language && (
                            <p>
                                <span className="font-semibold">Langue :</span> {book.language}
                            </p>
                        )}
                        {book.page_count && (
                            <p>
                                <span className="font-semibold">Nombre de pages :</span> {book.page_count}
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}