// @ts-nocheck
'use client';
import { useState, useContext, useEffect, use } from 'react';
import { checkBookExists, fetchBook, getBook } from '@/app/utils/bookCrud';
import Card from '@/components/card';
import Notes from '@/components/details/notes';
import DetailsReviews from '@/components/details/detailsReviews';
import Button from '@/components/button';
import {
	Plus,
	PenLine,
	Palette,
	BookOpen,
	Calendar,
	Users,
	Building2,
	Globe2,
	Hash,
	MessageSquare,
} from 'lucide-react';
import { AddToLibraryModalContext } from '@/components/modals/providers';
import Stars from '@/components/stars';
import { useRouter } from 'next/navigation';

type PageProps = {
	params: {
		id: string;
	};
	searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Details({ params }: PageProps) {
	const { id } = use(params);
	const [book, setBook] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [rating, setRating] = useState<number>(0);
	const [review, setReview] = useState<string>('');
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [editableTitle, setEditableTitle] = useState<string>('');
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
						throw new Error(
							'Erreur lors de la récupération des données personnalisées du livre'
						);
					}
					const data = await response.json();
					setCustomData(data);

					// Précharger avec les données personnalisées si disponibles
					if (data && data.length > 0) {
						const customBook = data[0];
						setEditableTitle(customBook.custom_title || book.title);
						setRating(customBook.note || 0);
						setReview(customBook.review || '');
						setIsPublic(customBook.review_public === 'Y');
					}
				} catch (error) {
					console.error(
						'Erreur lors de la récupération des données personnalisées du livre:',
						error
					);
				}
			};

			const fetchUsersReviews = async () => {
				try {
					const response = await fetch(`/api/books/review?bookId=${id}`);
					if (!response.ok) {
						throw new Error(
							'Erreur lors de la récupération des avis des utilisateurs'
						);
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
					console.error(
						'Erreur lors de la récupération des avis des utilisateurs:',
						error
					);
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
		<div className="container mx-auto p-4 mt-5 space-y-6">
			{/* En-tête */}
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<BookOpen className="text-primary mr-3" size={32} />
					<h1 className="text-3xl font-bold">Détails du livre</h1>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Colonne principale - Informations du livre */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* Carte principale du livre */}
						<Card className="p-6">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Image de couverture */}
								{book.cover_image && (
									<div className="flex-shrink-0 mx-auto md:mx-0">
										<img
											src={book.cover_image}
											alt={book.title}
											className="w-48 h-auto shadow-lg rounded-lg"
										/>
									</div>
								)}

								{/* Contenu principal */}
								<div className="flex-1 space-y-4">
									{/* Titre éditable */}
									<div className="flex items-center gap-3">
										<PenLine className="text-primary" size={20} />
										<input
											className="text-2xl md:text-3xl font-bold w-full bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none pb-2"
											value={editableTitle}
											disabled={customData && customData.length > 0}
											onChange={(e) => setEditableTitle(e.target.value)}
											placeholder="Titre du livre"
										/>
									</div>

									{/* Description */}
									{book.description && (
										<div className="prose prose-sm max-w-none">
											<div
												className="text-muted-foreground leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: book.description,
												}}
											/>
										</div>
									)}

									{/* Boutons d'action */}
									<div className="flex gap-3 pt-4">
										{(!customData || customData.length === 0) && (
											<Button onClick={handleAddToLibrary} className="gap-2">
												<Plus size={16} />
												<span>Ajouter à mes bibliothèques</span>
											</Button>
										)}
										{customData && customData.length > 0 && (
											<Button
												onClick={() =>
													router.push(
														`/library/${customData[0].library_id}/book/${book.id}`
													)
												}
												className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
												<Palette size={16} />
												<span>Aller à ma page perso</span>
											</Button>
										)}
									</div>
								</div>
							</div>
						</Card>

						{/* Informations détaillées */}
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center">
									<BookOpen className="text-primary mr-3" size={24} />
									<h2 className="text-2xl font-bold">
										Informations détaillées
									</h2>
								</div>
								{nbNotes > 0 && (
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground">
											{nbNotes} {nbNotes > 1 ? 'notes' : 'note'}
										</span>
										<Stars note={medianeNote} editable={false} />
									</div>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{book.published_date && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Calendar className="text-blue-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">
												Date de publication
											</p>
											<p className="font-medium">
												{new Date(book.published_date).toLocaleDateString(
													'fr-FR',
													{
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													}
												)}
											</p>
										</div>
									</div>
								)}

								{book.author && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Users className="text-green-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Auteur</p>
											<p className="font-medium">{book.author}</p>
										</div>
									</div>
								)}

								{book.publisher && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Building2 className="text-purple-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Éditeur</p>
											<p className="font-medium">{book.publisher}</p>
										</div>
									</div>
								)}

								{book.language && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Globe2 className="text-orange-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Langue</p>
											<p className="font-medium">{book.language}</p>
										</div>
									</div>
								)}

								{book.page_count !== undefined && book.page_count !== null && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Hash className="text-pink-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">
												Nombre de pages
											</p>
											<p className="font-medium">
												{book.page_count > 0
													? book.page_count
													: 'Aucune information'}
											</p>
										</div>
									</div>
								)}

								{book.genres && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border md:col-span-2">
										<BookOpen className="text-teal-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Genres</p>
											<p className="font-medium">
												{Array.isArray(book.genres)
													? book.genres.join(', ')
													: book.genres}
											</p>
										</div>
									</div>
								)}
							</div>
						</Card>

						{/* Section des avis communautaires */}
						<Card className="p-6">
							<div className="flex items-center mb-6">
								<MessageSquare className="text-primary mr-3" size={24} />
								<h2 className="text-2xl font-bold">Avis de la communauté</h2>
							</div>
							<DetailsReviews usersReviews={usersReviews} />
						</Card>
					</div>
				</div>

				{/* Colonne droite - Notes personnelles */}
				<div className="lg:w-80 space-y-6">
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
				</div>
			</div>
		</div>
	);
}
