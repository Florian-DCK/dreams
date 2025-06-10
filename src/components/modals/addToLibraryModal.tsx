'use client';
import {
	SetStateAction,
	useState,
	Dispatch,
	FormEvent,
	useEffect,
} from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import Button from '../button';
import { Toggle } from '@/components/ui/toggle';
import {
	BookPlus,
	Library,
	Eye,
	EyeOff,
	Plus,
	AlertCircle,
	Loader2,
} from 'lucide-react';

function AddToLibraryModal({
	isOpen,
	setIsOpen,
	bookId,
	note,
	review,
	customTitle,
	isPublic = false,
}: {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	bookId: string;
	note?: number;
	review?: string;
	customTitle?: string;
	isPublic?: boolean;
}) {
	const [libraries, setLibraries] = useState<any[]>([]);
	const [selectedLibrary, setSelectedLibrary] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [isLoadingLibraries, setIsLoadingLibraries] = useState(true);
	const [isReviewPublic, setIsReviewPublic] = useState(isPublic);

	useEffect(() => {
		const fetchLibraries = async () => {
			try {
				setIsLoadingLibraries(true);
				const response = await fetch('/api/library/retrieve');
				if (!response.ok) {
					throw new Error('Erreur lors de la récupération des bibliothèques');
				}
				const data = await response.json();
				if (Array.isArray(data)) {
					setLibraries(data);
					if (data.length > 0) {
						setSelectedLibrary(data[0].id);
					}
				}
			} catch (err) {
				setError('Impossible de charger les bibliothèques');
				console.error(err);
			} finally {
				setIsLoadingLibraries(false);
			}
		};

		if (isOpen) {
			fetchLibraries();
		}
	}, [isOpen]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedLibrary) {
			setError('Veuillez sélectionner une bibliothèque');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('/api/library/addBook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					libraryId: selectedLibrary,
					bookId: bookId,
					note: note,
					review: review,
					customTitle: customTitle || undefined, // Changé de null à undefined
					isPublic: isReviewPublic,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Erreur lors de l'ajout du livre");
			}

			// Effectuer d'abord la redirection, puis fermer la modal
			window.location.href = `/library/${selectedLibrary}/book/${bookId}`;
			setIsOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Une erreur est survenue');
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-lg bg-card border-border/20 rounded-2xl shadow-2xl">
				<DialogHeader className="space-y-4 pb-6">
					<div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-2xl">
						<BookPlus className="w-8 h-8 text-primary" />
					</div>
					<DialogTitle className="text-center text-2xl font-bold text-foreground">
						Ajouter à une bibliothèque
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground max-w-sm mx-auto">
						Choisissez la bibliothèque où vous souhaitez ajouter ce livre
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
						<AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
						<p className="text-destructive text-sm">{error}</p>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit}>
					{isLoadingLibraries ? (
						<div className="flex flex-col items-center justify-center py-8 space-y-3">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
							<p className="text-muted-foreground">
								Chargement des bibliothèques...
							</p>
						</div>
					) : libraries.length === 0 ? (
						<div className="text-center py-8 space-y-4">
							<div className="flex items-center justify-center w-16 h-16 mx-auto bg-muted/20 rounded-2xl">
								<Library className="w-8 h-8 text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<p className="font-medium text-foreground">
									Aucune bibliothèque trouvée
								</p>
								<p className="text-sm text-muted-foreground">
									Vous devez d'abord créer une bibliothèque
								</p>
							</div>
							<Button
								className="bg-primary text-primary-foreground hover:bg-primary/90"
								onClick={() => {
									setIsOpen(false);
								}}>
								<Plus className="w-4 h-4 mr-2" />
								Créer une bibliothèque
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-foreground">
									<Library className="w-4 h-4" />
									Bibliothèque de destination
								</label>
								<select
									className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
									value={selectedLibrary}
									onChange={(e) => setSelectedLibrary(e.target.value)}
									required>
									{libraries.map((library) => (
										<option
											key={library.id}
											value={library.id}
											className="bg-background">
											{library.name}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-foreground">
									{isReviewPublic ? (
										<Eye className="w-4 h-4 text-green-500" />
									) : (
										<EyeOff className="w-4 h-4 text-muted-foreground" />
									)}
									Visibilité de votre critique
								</label>
								<div className="p-4 bg-background/50 border border-border rounded-xl">
									<Toggle
										pressed={isReviewPublic}
										onPressedChange={setIsReviewPublic}
										className="w-full justify-start gap-3 h-auto p-3 bg-background data-[state=on]:bg-primary/10 data-[state=on]:text-primary rounded-lg border border-border/50">
										{isReviewPublic ? (
											<>
												<Eye className="w-4 h-4" />
												<div className="text-left">
													<div className="font-medium">Critique publique</div>
													<div className="text-xs text-muted-foreground">
														Votre critique sera visible par les autres
														utilisateurs
													</div>
												</div>
											</>
										) : (
											<>
												<EyeOff className="w-4 h-4" />
												<div className="text-left">
													<div className="font-medium">Critique privée</div>
													<div className="text-xs text-muted-foreground">
														Votre critique restera privée
													</div>
												</div>
											</>
										)}
									</Toggle>
								</div>
							</div>
						</div>
					)}

					{libraries.length > 0 && (
						<DialogFooter className="flex gap-3 pt-6 border-t border-border/20">
							<Button
								onClick={() => setIsOpen(false)}
								disabled={isLoading}
								className="flex-1 bg-secondary/20 text-foreground hover:bg-secondary/30 border border-border/20">
								Annuler
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
								disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										Ajout en cours...
									</div>
								) : (
									<div className="flex items-center gap-2">
										<BookPlus className="w-4 h-4" />
										Ajouter
									</div>
								)}
							</Button>
						</DialogFooter>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function useAddToLibraryModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [bookId, setBookId] = useState<string>('');
	const [note, setNote] = useState<number | undefined>(undefined);
	const [review, setReview] = useState<string | undefined>(undefined);
	const [customTitle, setCustomTitle] = useState<string>('');
	const [isPublic, setIsPublic] = useState<boolean>(false);

	const openModal = (
		id: string,
		noteValue?: number,
		reviewValue?: string,
		customTitleValue?: string,
		isPublicValue?: boolean
	) => {
		setBookId(id);
		setNote(noteValue);
		setReview(reviewValue);
		setIsOpen(true);
		setCustomTitle(customTitleValue || '');
		setIsPublic(isPublicValue || false);
	};

	const AddToLibraryModalComponent = () => {
		return (
			<AddToLibraryModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				bookId={bookId}
				note={note}
				review={review}
				customTitle={customTitle}
				isPublic={isPublic}
			/>
		);
	};

	return {
		openModal,
		setIsOpen,
		AddToLibraryModal: AddToLibraryModalComponent,
	};
}
