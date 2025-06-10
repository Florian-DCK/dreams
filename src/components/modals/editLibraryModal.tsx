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
import { Edit, Palette, FileText, BookOpen, Save } from 'lucide-react';

interface Library {
	id: string;
	title: string;
	description: string;
	couleur: string;
}

function EditLibraryModal({
	isOpen,
	setIsOpen,
	library,
}: {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	library: Library | null;
}) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [couleur, setCouleur] = useState('#ffffff');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (library) {
			setTitle(library.title);
			setDescription(library.description);
			setCouleur(library.couleur);
		}
	}, [library]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!library) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/library/${library.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, description, couleur }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.error || 'Erreur lors de la modification de la bibliothèque'
				);
			}

			setIsOpen(false);
			window.dispatchEvent(new CustomEvent('library-updated'));
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
						<Edit className="w-8 h-8 text-primary" />
					</div>
					<DialogTitle className="text-center text-2xl font-bold text-foreground">
						Modifier la bibliothèque
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground max-w-sm mx-auto">
						Personnalisez les informations de votre bibliothèque
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
						<div className="w-2 h-2 bg-destructive rounded-full" />
						<p className="text-destructive text-sm">{error}</p>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-sm font-medium text-foreground">
								<BookOpen className="w-4 h-4" />
								Nom de la bibliothèque
							</label>
							<input
								type="text"
								className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								placeholder="Ex: Romans de science-fiction"
								required
								maxLength={30}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-sm font-medium text-foreground">
								<FileText className="w-4 h-4" />
								Description
							</label>
							<textarea
								className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
								placeholder="Décrivez votre bibliothèque..."
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-sm font-medium text-foreground">
								<Palette className="w-4 h-4" />
								Couleur de la bibliothèque
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									className="w-12 h-12 border-2 border-border rounded-xl cursor-pointer"
									value={couleur}
									onChange={(e) => setCouleur(e.target.value)}
								/>
								<div className="flex-1">
									<div className="text-sm text-muted-foreground">
										Choisissez une couleur pour identifier facilement votre bibliothèque
									</div>
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="flex gap-3 pt-6 border-t border-border/20">
						<Button 
							onClick={() => setIsOpen(false)} 
							disabled={isLoading}
							className="flex-1 bg-secondary/20 text-foreground hover:bg-secondary/30 border border-border/20"
						>
							Annuler
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
									Modification...
								</div>
							) : (
								<div className="flex items-center gap-2">
									<Save className="w-4 h-4" />
									Modifier
								</div>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function useEditLibraryModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [library, setLibrary] = useState<Library | null>(null);

	const openModal = (libraryToEdit: Library) => {
		setLibrary(libraryToEdit);
		setIsOpen(true);
	};

	const EditModalComponent = () => {
		return (
			<EditLibraryModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				library={library}
			/>
		);
	};

	return {
		openModal,
		setIsOpen,
		EditLibraryModal: EditModalComponent,
	};
}
