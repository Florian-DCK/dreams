// @ts-nocheck
'use client';
import { useState, useContext, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import Notes from '@/components/details/notes';
import DetailsReviews from '@/components/details/detailsReviews';
import Button from '@/components/button';
import {
	PenLine,
	Minus,
	Library,
	NotebookTabs,
	BookOpen,
	Calendar,
	Users,
	Building2,
	Globe2,
	Hash,
	Save,
} from 'lucide-react';
import { AddToLibraryModalContext } from '@/components/modals/providers';

type PageProps = {
	params: {
		id: string;
	};
	searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Details({
	params,
}: {
	params: {
		libraryId: string;
		bookId: string;
	};
}) {
	const { libraryId, bookId } = use(params);
	const [book, setBook] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [libraryLoading, setLibraryLoading] = useState<boolean>(true);
	const [libraries, setLibraries] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [rating, setRating] = useState<number>(0);
	const [review, setReview] = useState<string>('');
	const [editableTitle, setEditableTitle] = useState<string>('');
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const { openModal } = useContext(AddToLibraryModalContext);
	const router = useRouter();

	useEffect(() => {
		const fetchBookDetails = async () => {
			try {
				const response = await fetch(
					`/api/library/retrieve/${libraryId}/${bookId}`
				);
				if (!response.ok) {
					throw new Error(
						'Erreur lors de la récupération des détails du livre.'
					);
				}
				const data = await response.json();
				setBook(data);
				setEditableTitle(data.custom_title || data.details.title);
				setRating(data.note || 0);
				setReview(data.review || '');
				setIsPublic(data.review_public || false);
				setLoading(false);
			} catch (err) {
				setError('Erreur lors de la récupération des détails du livre.');
				setLoading(false);
			}
		};
		const fetchLibraries = async () => {
			try {
				setLibraryLoading(true);
				const response = await fetch('/api/library/retrieve');
				if (!response.ok) {
					throw new Error('Failed to fetch libraries');
				}
				const data = await response.json();
				if (Array.isArray(data)) {
					setLibraries(data);
				} else {
					console.error('Unexpected data format:', data);
				}
				setLibraryLoading(false);
				console.log('Libraries fetched successfully:', data);
			} catch (error) {
				console.error('Error fetching libraries:', error);
				setLibraryLoading(false);
			}
		};
		fetchBookDetails();
		fetchLibraries();
	}, [bookId, libraryId]);

	const handleLibraryChange = async (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const newLibraryId = e.target.value;
		try {
			if (newLibraryId !== libraryId) {
				setIsUpdating(true);
				setError(null);

				const response = await fetch(`/api/library/moveBook`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						bookId: bookId,
						libraryId: newLibraryId,
					}),
				});

				if (!response.ok) {
					throw new Error(
						'Erreur lors du déplacement du livre vers la nouvelle bibliothèque.'
					);
				}

				const data = await response.json();

				// Rediriger vers la nouvelle URL plutôt que de modifier l'historique
				window.location.href = `/library/${newLibraryId}/book/${bookId}`;
			}
		} catch (err) {
			setError('Erreur lors du changement de bibliothèque.');
			console.error(err);
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				'Êtes-vous sûr de vouloir retirer ce livre de votre bibliothèque ?'
			)
		) {
			return;
		}

		try {
			setIsUpdating(true);
			setError(null);

			const response = await fetch(`/api/library/removeBook`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookId: bookId,
					libraryId,
				}),
			});

			if (!response.ok) {
				throw new Error(
					'Erreur lors de la suppression du livre de la bibliothèque.'
				);
			}

			window.location.href = '/';
		} catch (err) {
			setError('Erreur lors de la suppression du livre.');
			console.error(err);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleModifications = async () => {
		try {
			setIsUpdating(true);
			setError(null);

			const response = await fetch(`/api/library/addBook`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookId: bookId,
					libraryId,
					note: rating,
					review,
					customTitle: editableTitle,
					isPublic,
				}),
			});

			if (!response.ok) {
				throw new Error(
					'Erreur lors de la mise à jour du livre dans la bibliothèque.'
				);
			}

			const data = await response.json();

			// Mise à jour complète du livre avec les nouvelles données
			setBook((prevBook) => ({
				...prevBook,
				custom_title: editableTitle,
				note: rating,
				review: review,
			}));

			// Remplacer l'alerte par une notification moins intrusive
			// ou supprimer complètement pour éviter les problèmes de rendu
			setTimeout(() => {
				alert('Modifications enregistrées avec succès');
			}, 100);
		} catch (err) {
			setError('Erreur lors de la mise à jour du livre.');
			console.error(err);
		} finally {
			setIsUpdating(false);
		}
	};

	if (loading)
		return <div className="container mx-auto p-4">Chargement...</div>;
	if (error)
		return <div className="container mx-auto p-4 text-red-500">{error}</div>;
	if (!book)
		return <div className="container mx-auto p-4">Livre non trouvé</div>;

	return (
		<div className="container mx-auto p-4 mt-5 space-y-6">
			{/* En-tête avec bouton de sauvegarde */}
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<BookOpen className="text-primary mr-3" size={32} />
					<h1 className="text-3xl font-bold">Détails du livre</h1>
				</div>
				<Button
					className="bg-primary text-background hover:bg-primary/90 gap-2"
					onClick={handleModifications}
					disabled={isUpdating}>
					<Save size={16} />
					<span>
						{isUpdating ? 'Sauvegarde...' : 'Enregistrer les modifications'}
					</span>
				</Button>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Colonne principale - Informations du livre */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* Carte principale du livre */}
						<Card className="p-6">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Image de couverture */}
								{book.details.cover_image && (
									<div className="flex-shrink-0 mx-auto md:mx-0">
										<img
											src={book.details.cover_image}
											alt={book.custom_title || book.details.title}
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
											onChange={(e) => setEditableTitle(e.target.value)}
											placeholder="Titre du livre"
										/>
									</div>

									{/* Description */}
									{book.details.description && (
										<div className="prose prose-sm max-w-none">
											<div
												className="text-muted-foreground leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: book.details.description,
												}}
											/>
										</div>
									)}
								</div>
							</div>
						</Card>

						{/* Informations détaillées */}
						<Card className="p-6">
							<div className="flex items-center mb-6">
								<BookOpen className="text-primary mr-3" size={24} />
								<h2 className="text-2xl font-bold">Informations détaillées</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{book.details.published_date && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Calendar className="text-blue-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">
												Date de publication
											</p>
											<p className="font-medium">
												{new Date(
													book.details.published_date
												).toLocaleDateString('fr-FR', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</p>
										</div>
									</div>
								)}

								{book.details.author && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Users className="text-green-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Auteur</p>
											<p className="font-medium">{book.details.author}</p>
										</div>
									</div>
								)}

								{book.details.publisher && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Building2 className="text-purple-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Éditeur</p>
											<p className="font-medium">{book.details.publisher}</p>
										</div>
									</div>
								)}

								{book.details.language && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border">
										<Globe2 className="text-orange-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Langue</p>
											<p className="font-medium">{book.details.language}</p>
										</div>
									</div>
								)}

								{book.details.page_count !== undefined &&
									book.details.page_count !== null && (
										<div className="flex items-center p-3 bg-card/50 rounded-lg border">
											<Hash className="text-pink-500 mr-3" size={20} />
											<div>
												<p className="text-sm text-muted-foreground">
													Nombre de pages
												</p>
												<p className="font-medium">
													{book.details.page_count > 0
														? book.details.page_count
														: 'Aucune information'}
												</p>
											</div>
										</div>
									)}

								{book.details.genres && (
									<div className="flex items-center p-3 bg-card/50 rounded-lg border md:col-span-2">
										<BookOpen className="text-teal-500 mr-3" size={20} />
										<div>
											<p className="text-sm text-muted-foreground">Genres</p>
											<p className="font-medium">
												{Array.isArray(book.details.genres)
													? book.details.genres.join(', ')
													: book.details.genres}
											</p>
										</div>
									</div>
								)}
							</div>
						</Card>

						{/* Section Canvas */}
						<Card className="p-6">
							<div className="flex items-center mb-6">
								<PenLine className="text-primary mr-3" size={24} />
								<h2 className="text-2xl font-bold">Canvas créatif</h2>
							</div>
							<div className="text-center py-8">
								<PenLine
									className="mx-auto text-muted-foreground mb-4"
									size={48}
								/>
								<p className="text-muted-foreground">
									Cette section est réservée à la création artistique.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									Bientôt disponible pour exprimer votre créativité !
								</p>
							</div>
						</Card>
					</div>
				</div>

				{/* Colonne droite - Notes et actions */}
				<div className="lg:w-80 space-y-6">
					{/* Actions rapides */}
					<Card className="p-6">
						<div className="flex items-center mb-4">
							<Library className="text-primary mr-3" size={24} />
							<h2 className="text-xl font-bold">Actions</h2>
						</div>

						<div className="space-y-3">
							{/* Sélecteur de bibliothèque */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-muted-foreground">
									Bibliothèque
								</label>
								<select
									className="w-full p-2 bg-card border border-muted rounded-lg focus:border-primary outline-none"
									onChange={handleLibraryChange}
									value={libraryId}>
									{libraryLoading ? (
										<option disabled>Chargement...</option>
									) : (
										libraries.map((library) => (
											<option key={library.id} value={library.id}>
												{library.name}
											</option>
										))
									)}
								</select>
							</div>

							{/* Boutons d'action */}
							<div className="flex flex-col gap-2">
								<Button
									className="w-full gap-2 text-sm"
									onClick={() => router.push(`/details/${book.details.id}`)}>
									<NotebookTabs size={16} />
									Accéder aux détails
								</Button>
								<Button
									className="w-full gap-2 text-sm !bg-red-500 hover:!bg-red-600"
									onClick={handleDelete}>
									<Minus size={16} />
									Retirer de la bibliothèque
								</Button>
							</div>
						</div>
					</Card>

					{/* Section des notes */}
					<Notes
						className="flex-1"
						onReviewChange={setReview}
						onRatingChange={setRating}
						note={book.note || 0}
						userReview={book.review || ''}
						setIsPublic={setIsPublic}
						isPublic={isPublic}
					/>
				</div>
			</div>
		</div>
	);
}
