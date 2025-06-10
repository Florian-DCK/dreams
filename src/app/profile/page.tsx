'use client';
import Card from '@/components/card';
import Stars from '@/components/stars';
import { useEffect, useState, useContext } from 'react';
import {
	BookOpen,
	Clock,
	Users,
	Building2,
	Star,
	User,
	MessageSquare,
	Globe,
	Lock,
	Plus,
	Trash2,
	Edit,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	NewLibraryModalContext,
	EditLibraryModalContext,
} from '@/components/modals/providers';
import Button from '@/components/button';

export default function ProfilePage() {
	const [reviews, setReviews] = useState([]);
	const [stats, setStats] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [libraries, setLibraries] = useState<any[]>([]);
	const { setIsOpen } = useContext(NewLibraryModalContext);
	const { openModal: openEditModal } = useContext(EditLibraryModalContext);

	const router = useRouter();

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await fetch('/api/reviews');
				if (!response.ok) {
					throw new Error('Failed to fetch reviews');
				}
				const data = await response.json();
				setReviews(data);
			} catch (error) {
				console.error('Error fetching reviews:', error);
			}
		};
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/library/retrieve/stats');
				if (!response.ok) {
					throw new Error('Failed to fetch stats');
				}
				const data = await response.json();
				setStats(data);
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				setLoading(false);
			}
		};
		const fetchLibraries = async () => {
			try {
				const response = await fetch('/api/library/retrieve');
				if (!response.ok) {
					throw new Error('Failed to fetch libraries');
				}
				const data = await response.json();
				setLibraries(data);
			} catch (error) {
				console.error('Error fetching libraries:', error);
			}
		};

		fetchReviews();
		fetchStats();
		fetchLibraries();
	}, []);
	useEffect(() => {
		const handleLibraryCreated = () => {
			refreshLibraries();
		};

		const handleLibraryUpdated = () => {
			refreshLibraries();
		};

		window.addEventListener('library-created', handleLibraryCreated);
		window.addEventListener('library-updated', handleLibraryUpdated);

		return () => {
			window.removeEventListener('library-created', handleLibraryCreated);
			window.removeEventListener('library-updated', handleLibraryUpdated);
		};
	}, []);

	// Ajouter une fonction pour rafraîchir les bibliothèques
	const refreshLibraries = () => {
		const fetchLibraries = async () => {
			try {
				const response = await fetch('/api/library/retrieve');
				if (!response.ok) {
					throw new Error('Failed to fetch libraries');
				}
				const data = await response.json();
				setLibraries(data);
			} catch (error) {
				console.error('Error fetching libraries:', error);
			}
		};

		fetchLibraries();
	};

	const deleteLibrary = async (libraryId: string, libraryName: string) => {
		if (
			!confirm(
				`Êtes-vous sûr de vouloir supprimer la bibliothèque "${libraryName}" ? Cette action est irréversible.`
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/library/${libraryId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete library');
			}

			refreshLibraries();
		} catch (error) {
			console.error('Error deleting library:', error);
			alert('Erreur lors de la suppression de la bibliothèque');
		}
	};

	const StatCard = ({
		icon: Icon,
		label,
		value,
		color = 'text-primary',
	}: {
		icon: React.ElementType;
		label: string;
		value: string | number;
		color?: string;
	}) => (
		<div className="flex items-center p-4 bg-card/50 rounded-lg border">
			<Icon className={`${color} mr-3`} size={24} />
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="text-lg font-semibold">{value}</p>
			</div>
		</div>
	);

	return (
		<div className="container mx-auto p-4 mt-5 space-y-6">
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<User className="text-primary mr-3" size={32} />
					<h1 className="text-3xl font-bold">Mon Profil</h1>
				</div>
			</div>
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Colonne principale */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* En-tête de profil */}

						{/* Statistiques de lecture */}
						<Card className="p-6">
							<div className="flex items-center mb-6">
								<BookOpen className="text-primary mr-3" size={24} />
								<h2 className="text-2xl font-bold">Statistiques de lecture</h2>
							</div>

							{loading ? (
								<div className="flex justify-center items-center h-32">
									<p className="text-muted-foreground">
										Chargement des statistiques...
									</p>
								</div>
							) : stats && Object.keys(stats).length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<StatCard
										icon={BookOpen}
										label="Total de livres"
										value={stats.total_books || 0}
										color="text-blue-500"
									/>
									<StatCard
										icon={BookOpen}
										label="Total de pages"
										value={stats.total_pages || 0}
										color="text-green-500"
									/>
									<StatCard
										icon={Clock}
										label="Heures de lecture"
										value={`${stats.estimated_reading_hours || 0}h`}
										color="text-purple-500"
									/>
									<StatCard
										icon={Users}
										label="Auteurs uniques"
										value={stats.unique_authors || 0}
										color="text-orange-500"
									/>
									<StatCard
										icon={Building2}
										label="Éditeurs uniques"
										value={stats.unique_publishers || 0}
										color="text-pink-500"
									/>
									<div className="flex items-center p-4 bg-card/50 rounded-lg border">
										<Star className="text-yellow-500 mr-3" size={24} />
										<div>
											<p className="text-sm text-muted-foreground">
												Note moyenne
											</p>
											<div className="flex items-center">
												<Stars
													note={stats.average_rating || 0}
													editable={false}
												/>
												<span className="ml-2 text-lg font-semibold">
													{stats.average_rating
														? Number(stats.average_rating).toFixed(1)
														: '0'}
												</span>
											</div>
										</div>
									</div>
								</div>
							) : (
								<p className="text-muted-foreground text-center">
									Aucune statistique disponible
								</p>
							)}

							{/* Auteurs favoris */}
							{(stats.favorite_author || stats.most_read_author) && (
								<div className="mt-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{stats.favorite_author && (
											<StatCard
												icon={User}
												label="Auteur préféré"
												value={stats.favorite_author}
												color="text-indigo-500"
											/>
										)}
										{stats.most_read_author && (
											<StatCard
												icon={Users}
												label="Auteur le plus lu"
												value={stats.most_read_author}
												color="text-teal-500"
											/>
										)}
									</div>
								</div>
							)}
						</Card>

						{/* Section des avis */}
						<Card className="p-6">
							<div className="flex items-center mb-6">
								<MessageSquare className="text-primary mr-3" size={24} />
								<h2 className="text-2xl font-bold">Mes Avis</h2>
							</div>

							{reviews.filter((review: any) => review.review || review.note)
								.length > 0 ? (
								<div className="space-y-6">
									{reviews
										.filter((review: any) => review.review || review.note)
										.map((review: any, index: number) => (
											<div
												key={index}
												className="bg-card/20 rounded-lg border-muted/30 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
												onClick={() => {
													router.push(
														`/library/${review.library_id}/book/${review.book_id}`
													);
												}}>
												<div className="flex gap-4 p-4">
													{/* Image de couverture */}
													{review.cover_image && (
														<div className="flex-shrink-0">
															<img
																src={review.cover_image}
																alt={review.title}
																className="w-16 h-20 object-cover rounded shadow-sm"
															/>
														</div>
													)}

													{/* Contenu de l'avis */}
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between mb-2">
															<h3 className="font-semibold text-lg truncate pr-2">
																{review.title || 'Titre non disponible'}
															</h3>
															{review.note && (
																<div className="flex items-center gap-1 flex-shrink-0">
																	<Stars note={review.note} editable={false} />
																	<span className="text-sm font-medium text-muted-foreground">
																		{review.note}/5
																	</span>
																</div>
															)}
														</div>

														{/* Avis écrit */}
														{review.review ? (
															<div className="mb-3">
																<p className="text-muted-foreground leading-relaxed">
																	{review.review}
																</p>
															</div>
														) : (
															<p className="text-muted-foreground italic mb-3">
																Aucun commentaire écrit
															</p>
														)}

														{/* Statut de visibilité */}
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2 text-sm">
																{review.review_public === 'Y' ? (
																	<>
																		<Globe
																			className="text-green-500"
																			size={16}
																		/>
																		<span className="text-green-500">
																			Public
																		</span>
																	</>
																) : (
																	<>
																		<Lock className="text-gray-500" size={16} />
																		<span className="text-gray-500">Privé</span>
																	</>
																)}
															</div>

															{/* Note seule si pas d'avis écrit */}
															{!review.review && review.note && (
																<div className="flex items-center gap-1">
																	<Star
																		className="text-yellow-500 fill-current"
																		size={16}
																	/>
																	<span className="text-sm text-muted-foreground">
																		Note uniquement
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
								</div>
							) : (
								<div className="text-center py-8">
									<MessageSquare
										className="mx-auto text-muted-foreground mb-4"
										size={48}
									/>
									<p className="text-muted-foreground">
										Aucun avis rédigé pour le moment
									</p>
									<p className="text-sm text-muted-foreground mt-2">
										Commencez à noter vos lectures pour voir vos avis ici !
									</p>
								</div>
							)}
						</Card>
					</div>
				</div>

				{/* Colonne droite - Bibliothèques */}
				<div className="lg:w-80 space-y-6">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center">
								<Building2 className="text-primary mr-3" size={24} />
								<h2 className="text-xl font-bold">Mes Bibliothèques</h2>
							</div>
							<Button
								onClick={() => setIsOpen(true)}
								className="bg-primary text-background hover:bg-primary/90 p-2"
								aria-label="Créer une nouvelle bibliothèque">
								<Plus size={16} />
							</Button>
						</div>

						{loading ? (
							<div className="flex justify-center items-center h-32">
								<p className="text-muted-foreground text-sm">Chargement...</p>
							</div>
						) : libraries.length > 0 ? (
							<div className="space-y-3">
								{' '}
								{libraries.map((library: any, index: number) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 bg-card/30 rounded-lg border-muted/20 hover:bg-card/40 transition-colors">
										<div
											className="flex items-center gap-3 flex-1 cursor-pointer"
											onClick={() => router.push(`/library/${library.id}`)}>
											<div
												className="w-4 h-4 rounded-full border-2 border-muted"
												style={{ backgroundColor: library.color }}
											/>
											<div>
												<h3 className="font-medium text-sm">{library.name}</h3>
												<p className="text-xs text-muted-foreground">
													{library.books?.length || 0} livre
													{library.books?.length !== 1 ? 's' : ''}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<Button
												onClick={() => {
													openEditModal({
														id: library.id,
														title: library.name,
														description: library.description || '',
														couleur: library.color || '#ffffff',
													});
												}}
												className="p-1 text-blue-500 bg-transparent hover:bg-blue-500/10">
												<Edit size={16} />
											</Button>
											<Button
												onClick={() => {
													deleteLibrary(library.id, library.name);
												}}
												className="p-1 text-red-500 bg-transparent hover:bg-red-500/10">
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<Building2
									className="mx-auto text-muted-foreground mb-4"
									size={32}
								/>
								<p className="text-muted-foreground text-sm mb-4">
									Aucune bibliothèque créée
								</p>
								<Button
									onClick={() => setIsOpen(true)}
									className="bg-primary text-background hover:bg-primary/90">
									<Plus className="mr-2" size={16} />
									Créer ma première bibliothèque
								</Button>
							</div>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}
