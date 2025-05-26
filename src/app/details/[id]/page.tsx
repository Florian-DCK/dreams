"use client";
import { useEffect, useState, use } from 'react';
import { checkBookExists, fetchBook, getBook } from '@/app/utils/bookCrud';

export default function Details({ params }: { params: { id: string } }) {
    const { id } = use(params);
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                console.log("ID du livre:", id);
                const bookExists = await checkBookExists(id);
                console.log("Livre existe dans la base de données:", bookExists);
                
                if (!bookExists) {
                    console.log("Livre non trouvé dans la base de données, récupération depuis l'API...");
                    const newBook = await fetchBook(id);
                    const book = await getBook(id);
                    setBook(book);
                } else {
                    console.log("Livre déjà présent dans la base de données.");
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
        <div className="container mx-auto p-4">
            <div>
                
            </div>
            <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
            {book.cover_image && (
                <img 
                    src={book.cover_image} 
                    alt={book.title}
                    className="w-48 h-auto mb-4 shadow-lg rounded"
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {book.authors && (
                        <p><span className="font-semibold">Auteur(s):</span> {book.authors.join(', ')}</p>
                    )}
                    {book.publishedDate && (
                        <p><span className="font-semibold">Date de publication:</span> {book.publishedDate}</p>
                    )}
                    {book.publisher && (
                        <p><span className="font-semibold">Éditeur:</span> {book.publisher}</p>
                    )}
                    {book.pageCount && (
                        <p><span className="font-semibold">Nombre de pages:</span> {book.pageCount}</p>
                    )}
                    {book.categories && (
                        <p><span className="font-semibold">Catégories:</span> {book.categories.join(', ')}</p>
                    )}
                </div>
                <div>
                    {book.description && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Description:</h2>
                            <p className="text-gray-700">{book.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}