'use client';
import Bookshelf from '@/components/bookshelf';
import Book from '@/components/book';
import Card from '@/components/card';
import Button from '@/components/button';
import Stars from '@/components/stars';
import { useEffect, useState, useContext } from 'react';
import {
	BookOpen,
	Star,
	TrendingUp,
	Clock,
	Users,
	Plus,
	ArrowRight,
	Sparkles,
	Target,
	Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NewLibraryModalContext } from '@/components/modals/providers';

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [libraries, setLibraries] = useState<any[]>([]);
	const [stats, setStats] = useState<any>({});
	const [recentReviews, setRecentReviews] = useState([]);
	const router = useRouter();
	const { setIsOpen } = useContext(NewLibraryModalContext);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Récupérer les bibliothèques
				const librariesResponse = await fetch('/api/library/retrieve');
				if (librariesResponse.ok) {
					const librariesData = await librariesResponse.json();
					if (Array.isArray(librariesData)) {
						setLibraries(librariesData);
					}
				}

				// Récupérer les statistiques
				const statsResponse = await fetch('/api/library/retrieve/stats');
				if (statsResponse.ok) {
					const statsData = await statsResponse.json();
					setStats(statsData);
				}

				// Récupérer les derniers avis de la communauté
				const reviewsResponse = await fetch('/api/reviews?global=true');
				console.log('Reviews response status:', reviewsResponse.status);
				if (reviewsResponse.ok) {
					const reviewsData = await reviewsResponse.json();
					console.log('Reviews data:', reviewsData);
					const filteredReviews = reviewsData.filter(
						(review: any) => review.review || review.note
					);
					console.log('Filtered reviews:', filteredReviews);
					setRecentReviews(filteredReviews.slice(0, 3));
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const StatCard = ({ icon: Icon, label, value, color = 'text-primary' }) => (
		<div className="flex items-center p-4 bg-card/50 rounded-lg border hover:bg-card/70 transition-colors">
			<Icon className={`${color} mr-3`} size={24} />
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="text-xl font-bold">{value}</p>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">
						Chargement de votre tableau de bord...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 mt-5 space-y-8">
			{/* En-tête de bienvenue */}
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<Sparkles className="text-primary mr-3" size={32} />
					<h1 className="text-3xl font-bold">
						Bienvenue dans votre univers littéraire
					</h1>
				</div>
				<p className="text-muted-foreground text-lg">
					Découvrez vos statistiques, vos dernières lectures et explorez de
					nouveaux horizons
				</p>
			</div>

			{/* Statistiques rapides */}
			{stats && Object.keys(stats).length > 0 && (
				<Card className="p-6">
					<div className="flex items-center mb-6">
						<TrendingUp className="text-primary mr-3" size={24} />
						<h2 className="text-2xl font-bold">Vos statistiques</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							icon={BookOpen}
							label="Livres lus"
							value={stats.total_books || 0}
							color="text-blue-500"
						/>
						<StatCard
							icon={Clock}
							label="Heures de lecture"
							value={`${stats.estimated_reading_hours || 0}h`}
							color="text-green-500"
						/>
						<StatCard
							icon={Users}
							label="Auteurs découverts"
							value={stats.unique_authors || 0}
							color="text-purple-500"
						/>
						<StatCard
							icon={Star}
							label="Note moyenne"
							value={
								stats.average_rating
									? Number(stats.average_rating).toFixed(1)
									: '0'
							}
							color="text-yellow-500"
						/>
					</div>
				</Card>
			)}
			{/* Derniers avis */}
			{recentReviews.length > 0 && (
				<Card className="p-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center">
							<Star className="text-primary mr-3" size={24} />
							<h2 className="text-2xl font-bold">
								Derniers avis de la communauté
							</h2>
						</div>
						<Button
							onClick={() => router.push('/profile')}
							className="gap-2 bg-transparent border hover:bg-card/50 items-center">
							Voir tous mes avis
							<ArrowRight size={16} />
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{recentReviews.map((review: any, index: number) => (
							<div
								key={index}
								className="bg-card/30 rounded-lg border p-4 hover:bg-card/50 transition-colors cursor-pointer"
								onClick={() =>
									router.push(
										`/library/${review.library_id}/book/${review.book_id}`
									)
								}>
								<div className="flex items-start gap-3">
									{review.cover_image && (
										<img
											src={review.cover_image}
											alt={review.title}
											className="w-12 h-16 object-cover rounded"
										/>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1">
											<h3 className="font-medium text-sm truncate">
												{review.title}
											</h3>
											<span className="text-xs text-muted-foreground flex-shrink-0">
												par {review.username}
											</span>
										</div>
										{review.note && (
											<div className="flex items-center gap-1 mb-2">
												<Stars note={review.note} editable={false} />
												<span className="text-xs text-muted-foreground">
													{review.note}/5
												</span>
											</div>
										)}
										{review.review && (
											<p className="text-xs text-muted-foreground line-clamp-2">
												{review.review}
											</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}
			{/* Mes bibliothèques */}
			<Card className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center">
						<BookOpen className="text-primary mr-3" size={24} />
						<h2 className="text-2xl font-bold">Mes bibliothèques</h2>
					</div>
					<Button
						onClick={() => setIsOpen(true)}
						className="bg-primary text-background hover:bg-primary/90 gap-2 items-center">
						<Plus size={16} />
						Nouvelle bibliothèque
					</Button>
				</div>

				{libraries.length === 0 ? (
					<div className="text-center py-12">
						<BookOpen
							className="mx-auto text-muted-foreground mb-4"
							size={64}
						/>
						<h3 className="text-xl font-semibold mb-2">
							Aucune bibliothèque créée
						</h3>
						<p className="text-muted-foreground mb-6">
							Commencez votre aventure littéraire en créant votre première
							bibliothèque
						</p>
						<Button
							onClick={() => setIsOpen(true)}
							className="bg-primary text-background hover:bg-primary/90 gap-2 items-center">
							<Plus size={16} />
							Créer ma première bibliothèque
						</Button>
					</div>
				) : (
					<div className="space-y-6">
						{libraries.slice(0, 3).map((library, index) => (
							<div key={index}>
								<Bookshelf library={library} className="mb-4">
									{library.books
										.slice(0, 6)
										.map((book: any, bookIndex: number) => (
											<Book
												key={bookIndex}
												backgroundImage={book.details.cover_image}
												url={`/library/${library.id}/book/${book.book_id}`}
											/>
										))}
								</Bookshelf>
								{library.books.length > 6 && (
									<div className="text-center mt-2">
										<Button
											onClick={() => router.push(`/library/${library.id}`)}
											className="gap-2 text-sm bg-transparent border hover:bg-card/50 items-center">
											Voir tous les livres ({library.books.length})
											<ArrowRight size={14} />
										</Button>
									</div>
								)}
							</div>
						))}

						{libraries.length > 3 && (
							<div className="text-center">
								<Button
									onClick={() => router.push('/profile')}
									className="gap-2 items-center">
									Voir toutes mes bibliothèques
									<ArrowRight size={16} />
								</Button>
							</div>
						)}
					</div>
				)}
			</Card>

			{/* Actions rapides */}
			<Card className="p-6">
				<div className="flex items-center mb-6">
					<Target className="text-primary mr-3" size={24} />
					<h2 className="text-2xl font-bold">Actions rapides</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Button
						onClick={() => {
							const searchInput = document.getElementById('search');
							if (searchInput) {
								window.scrollTo({ top: 0, behavior: 'smooth' });
								searchInput.focus();
							}
						}}
						className="p-6 h-auto flex-col gap-3 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20">
						<BookOpen className="text-blue-500" size={32} />
						<div className="text-center">
							<p className="font-semibold text-blue-500">Rechercher un livre</p>
							<p className="text-xs text-muted-foreground">
								Découvrez de nouveaux titres
							</p>
						</div>
					</Button>

					<Button
						onClick={() => setIsOpen(true)}
						className="p-6 h-auto flex-col gap-3 bg-green-500/10 hover:bg-green-500/20 border-green-500/20">
						<Plus className="text-green-500" size={32} />
						<div className="text-center">
							<p className="font-semibold text-green-500">
								Nouvelle bibliothèque
							</p>
							<p className="text-xs text-muted-foreground">
								Organisez vos lectures
							</p>
						</div>
					</Button>

					<Button
						onClick={() => router.push('/profile')}
						className="p-6 h-auto flex-col gap-3 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20">
						<Users className="text-purple-500" size={32} />
						<div className="text-center">
							<p className="font-semibold text-purple-500">Mon profil</p>
							<p className="text-xs text-muted-foreground">
								Gérez votre compte
							</p>
						</div>
					</Button>
				</div>
			</Card>
		</div>
	);
}
