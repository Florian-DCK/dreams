// @ts-nocheck
'use client';
import { useState, useContext, useEffect } from 'react';
import Card from '@/components/card';
import Notes from '@/components/details/notes';
import DetailsReviews from '@/components/details/detailsReviews';
import Button from '@/components/button';
import { PenLine, Minus, Truck} from 'lucide-react';
import { AddToLibraryModalContext } from '@/components/modals/providers';

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Details({ params }: {
  params: {
    libraryId: string;
    bookId: string;
  }
}) {
    const { libraryId, bookId } = params;
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [editableTitle, setEditableTitle] = useState<string>("");
    const { openModal } = useContext(AddToLibraryModalContext);
    
    const handleAddToLibrary = () => {
        openModal(book.id, rating, review, editableTitle);
    };
    
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`/api/library/retrieve/${libraryId}/${bookId}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des détails du livre.');
                }
                const data = await response.json();
                setBook(data);
                setEditableTitle(data.custom_title || data.details.title);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des détails du livre.');
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [bookId]);

    if (loading)
        return <div className="container mx-auto p-4">Chargement...</div>;
    if (error)
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    if (!book)
        return <div className="container mx-auto p-4">Livre non trouvé</div>;

    return (
        <div className="items-center justify-center mt-5">
            <div className="w-[90%] mx-auto rounded flex flex-col md:flex-row gap-8 ">
                <section className='flex-1 flex-col gap-4 space-y-5'>
                    <Card className="flex-1 flex flex-col gap-4">
                        <span className='flex items-center gap-3 w-full'>
                            <PenLine />
                            <input 
                            className="text-3xl font-extrabold mb-2 w-full" 
                            value={editableTitle} 
                            onChange={(e) => setEditableTitle(e.target.value)} 
                        />
                        </span>

                        <div className="flex">
                            {book.details.description && (
                                <p className="leading-relaxed whitespace-pre-line">
                                    {book.details.cover_image && (
                                        <img
                                            src={book.details.cover_image}
                                            alt={book.custom_title || book.title}
                                            className="h-80 w-auto shadow-lg rounded float-right ml-6 mb-4"
                                        />
                                    )}
                                    <span dangerouslySetInnerHTML={{ __html: book.details.description }} />
                                </p>
                            )}
                        </div>
                        <div className='flex self-end space-x-3 items-center mt-4'>
                            <Button className='gap-2'><PenLine /><span>Modifier</span></Button>
                            <Button className='gap-2'><Truck /><span>Déplacer</span></Button>
                            <Button className='!bg-red-400 gap-2'><Minus /><span>Retirer</span></Button>
                        </div>
                    </Card>

                </section>
                {/* Séparateur vertical */}

                {/* Colonne droite : infos */}
                <section className='flex-1 flex flex-col flex-start space-y-5'>
                    <Card className="self-start w-full">
                        <h2 className="text-2xl font-bold mb-4 ">
                            Informations du livre :
                        </h2>
                        <div className=" space-y-2">
                            {book.details.published_date && (
                                <p>
                                    <span className="font-semibold">Date de publication :</span>{' '}
                                    {new Date(book.details.published_date).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            )}
                            {book.details.genres && (
                                <p>
                                    <span className="font-semibold">Genres :</span>{' '}
                                    {Array.isArray(book.details.genres)
                                        ? book.details.genres.join(', ')
                                        : book.details.genres}
                                </p>
                            )}
                            {book.author && (
                                <p>
                                    <span className="font-semibold">Auteur :</span>{' '}
                                    {Array.isArray(book.author) ? (
                                        book.author.map((a: string, i: number) => (
                                            <span key={a}>
                                                <a href="#" className="underline hover:text-blue-700">
                                                    {a}
                                                </a>
                                                {i < book.details.author.length - 1 && ', '}
                                            </span>
                                        ))
                                    ) : (
                                        <a href="#" className="underline hover:text-blue-700">
                                            {book.details.author}
                                        </a>
                                    )}
                                </p>
                            )}
                            {book.details.publisher && (
                                <p>
                                    <span className="font-semibold">Éditeur :</span>{' '}
                                    {book.details.publisher}
                                </p>
                            )}
                            {book.details.language && (
                                <p>
                                    <span className="font-semibold">Langue :</span>{' '}
                                    {book.language}
                                </p>
                            )}
                            {book.details.page_count && (
                                <p>
                                    <span className="font-semibold">Nombre de pages :</span>{' '}
                                    {book.details.page_count}
                                </p>
                            )}
                        </div>
                    </Card>
                    {/* Section des notes */}
                    <Notes 
                        className="flex-1"
                        onReviewChange={setReview}
                        onRatingChange={setRating}
                        note={book.note || 0}
                        userReview={book.review || ""}
                    />
                    {/* Section du canvas */}
                </section>
            </div>
            <div className='h-screen w-[90%] items-center justify-center mx-auto '>
                <Card className='mt-8 p-6 h-full'>
                    <h2 className="text-2xl font-bold mb-4">Canvas</h2>
                    <p >
                        Cette section est réservée à la création artistique.
                    </p>
                </Card>
            </div>
        </div>
    );
}
