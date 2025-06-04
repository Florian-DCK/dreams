// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { checkBookExists, fetchBook, getBook } from '@/app/utils/bookCrud';
import Card from '@/components/card';
import Notes from '@/components/details/notes';
import DetailsControls from '@/components/details/detailsControls';
import DetailsReviews from '@/components/details/detailsReviews';

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Details({ params }: PageProps) {
    const { id } = params;
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

    if (loading)
        return <div className="container mx-auto p-4">Chargement...</div>;
    if (error)
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    if (!book)
        return <div className="container mx-auto p-4">Livre non trouvé</div>;

    return (
        <div className="items-center justify-center mt-5">
            <div className="w-[90%] mx-auto px-8 rounded flex flex-col md:flex-row gap-8 ">
                <section className='flex-1 flex-col gap-4 space-y-5'>
                    <Card className="flex-1 flex flex-col gap-4">
                        <h1 className="text-3xl font-extrabold mb-2">
                            {book.title}
                        </h1>
                        <div className="flex">
                            {book.description && (
                                <p className="text-base leading-relaxed whitespace-pre-line">
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
                    <DetailsControls className="flex-1 self-start" book={book.id} />
                </section>
				{/* Séparateur vertical */}

				{/* Colonne droite : infos */}
				<section className='flex-1 flex flex-col flex-start space-y-5'>
					<Card className="self-start w-full">
						<h2 className="text-2xl font-bold mb-4 ">
							Informations du livre :
						</h2>
						<div className="text-base space-y-2">
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
									<span className="font-semibold">Auteur :</span>{' '}
									{Array.isArray(book.author) ? (
										book.author.map((a: string, i: number) => (
											<span key={a}>
												<a href="#" className="underline hover:text-blue-700">
													{a}
												</a>
												{i < book.author.length - 1 && ', '}
											</span>
										))
									) : (
										<a href="#" className="underline hover:text-blue-700">
											{book.author}
										</a>
									)}
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
					<Notes className="flex-1 " />
				</section>
			</div>
			{/* Section des notes et avis des utilisateurs en dessous de tout le reste */}
			<section className="w-[90%] mx-auto mt-8 mb-10">
				<DetailsReviews className="flex-1" />
			</section>
		</div>
	);
}
