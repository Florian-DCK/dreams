// @ts-nocheck
'use client';
import { useState, useContext, useEffect , use} from 'react';
import { checkBookExists, fetchBook, getBook } from '@/app/utils/bookCrud';
import Card from '@/components/card';
import Notes from '@/components/details/notes';
import DetailsReviews from '@/components/details/detailsReviews';
import Button from '@/components/button';
import { Plus , PenLine, Palette} from 'lucide-react';
import { AddToLibraryModalContext } from '@/components/modals/providers';
import Stars from '@/components/stars';
import { useRouter } from 'next/navigation';

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Details({ params }: PageProps) {
    const { id } = use(params);
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(false);
    const [editableTitle, setEditableTitle] = useState<string>("");
    const { openModal } = useContext(AddToLibraryModalContext);
	const router = useRouter();

	const [customData, setCustomData] = useState<any>(null);

	const [usersReviews, setUsersReviews] = useState<any[]>([]);
	const [medianeNote, setMedianeNote] = useState<number>(0);
	const [nbNotes, setNbNotes] = useState<number>(0);

    const handleAddToLibrary = () => {
        openModal(book.id, rating, review, editableTitle, isPublic);
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const bookExists = await checkBookExists(id);

                if (!bookExists) {
                    await fetchBook(id);
                    const book = await getBook(id);
                    setBook(book);
                    setEditableTitle(book.title);
                } else {
                    const bookData = await getBook(id);
                    setBook(bookData);
                    setEditableTitle(bookData.title);
                    
                }
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des détails du livre:',
                    error
                );
                setError('Impossible de charger les détails du livre.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Créer un useEffect séparé qui s'exécute quand book est disponible
    useEffect(() => {
        if (book) {
            const fetchCustomData = async () => {
                try {
                    const response = await fetch(`/api/books/fetchCustom?id=${id}`);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des données personnalisées du livre');
                    }
                    const data = await response.json();
                    setCustomData(data);
                    
                    // Précharger avec les données personnalisées si disponibles
                    if (data && data.length > 0) {
                        const customBook = data[0];
                        setEditableTitle(customBook.custom_title || book.title);
                        setRating(customBook.note || 0);
                        setReview(customBook.review || "");
                        setIsPublic(customBook.review_public === 'Y');
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des données personnalisées du livre:', error);
                }
            };

            const fetchUsersReviews = async () => {
                try {
                    const response = await fetch(`/api/books/review?bookId=${id}`);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des avis des utilisateurs');
                    }
                    const data = await response.json();
                    setUsersReviews(data);
                    
                    if (data && data.length > 0) {
                        const sum = data.reduce((acc, review) => acc + review.note, 0);
                        const average = sum / data.length;
                        setMedianeNote(average);
                    }
                    setNbNotes(data.length);
                } catch (error) {
                    console.error('Erreur lors de la récupération des avis des utilisateurs:', error);
                }
            };

            fetchCustomData();
            fetchUsersReviews();
        }
    }, [book, id]);

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
                            disabled={customData && customData.length > 0}
                            onChange={(e) => setEditableTitle(e.target.value)} 
                        />
						</span>

                        <div className="flex">
                            {book.description && (
                                <p className="leading-relaxed whitespace-pre-line">
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
						{ (!customData || customData.length === 0) && (
							<Button onClick={handleAddToLibrary} ><Plus /><span>Ajouter à l'une de mes bibliothèques</span></Button>
						)}
						{customData && customData.length > 0 && (
							<Button onClick={() => router.push(`/library/${customData[0].library_id}/book/${book.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
								<Palette />
								<span>Aller à ma page perso</span>
							</Button>
						)}
                    </Card>

                </section>
				{/* Séparateur vertical */}

				{/* Colonne droite : infos */}
				<section className='flex-1 flex flex-col flex-start space-y-5'>
					<Card className="self-start w-full">
						<span className='flex justify-between'>
							<h2 className="text-2xl font-bold mb-4 ">
								Informations du livre :
							</h2>
								{nbNotes > 0 && (
									<span className='flex items-center gap-2'>
										<span className="text-sm text-right text-gray-500">
											{nbNotes} {nbNotes > 1 ? 'notes' : 'note'}
										</span>
										<Stars note={medianeNote} editable={false}></Stars>
									</span>
								)}
						</span>
						<div className=" space-y-2">
							{book.published_date && (
								<p>
									<span className="font-semibold">Date de publication :</span>{' '}
									{new Date(book.published_date).toLocaleDateString('fr-FR', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</p>
							)}
							{book.genres && (
								<p>
									<span className="font-semibold">Genres :</span>{' '}
									{Array.isArray(book.genres)
										? book.genres.join(', ')
										: book.genres}
								</p>
							)}
							{book.author && (
								<p>
									<span className="font-semibold">Auteur : {book.author}</span>{' '}
								</p>
							)}
							{book.publisher && (
								<p>
									<span className="font-semibold">Éditeur :</span>{' '}
									{book.publisher}
								</p>
							)}
							{book.language && (
								<p>
									<span className="font-semibold">Langue :</span>{' '}
									{book.language}
								</p>
							)}
							{book.page_count && (
								<p>
									<span className="font-semibold">Nombre de pages :</span>{' '}
									{book.page_count}
								</p>
							)}
						</div>
					</Card>
                    {/* Section des notes */}
					<Notes 
                        className="flex-1"
                        onReviewChange={setReview}
                        onRatingChange={setRating}
                        onPublicChange={setIsPublic}
                        IsPublic={isPublic}
                        note={rating}
                        initialReview={review}
						isAlreadyReviewed={customData && customData.length > 0}
                    />
				</section>
			</div>
			{/* Section des notes et avis des utilisateurs en dessous de tout le reste */}
			<section className="w-[90%] mx-auto mt-8 mb-10">
				<DetailsReviews className="flex-1" usersReviews={usersReviews} />
			</section>
		</div>
	);
}
