'use client';
import { SetStateAction, useState, Dispatch, FormEvent, useEffect } from 'react';
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

function AddToLibraryModal({ isOpen, setIsOpen, bookId, note, review }: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    bookId: string;
    note?: number;
    review?: string;
}) {
    const [libraries, setLibraries] = useState<any[]>([]);
    const [selectedLibrary, setSelectedLibrary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoadingLibraries, setIsLoadingLibraries] = useState(true);

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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'ajout du livre');
            }

            setIsOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-dark text-background rounded-2xl">
                <DialogHeader>
                    <DialogTitle className='text-center'>Ajouter à une bibliothèque</DialogTitle>
                    <DialogDescription className='text-center'>
                        Choisissez la bibliothèque où vous souhaitez ajouter ce livre.
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {isLoadingLibraries ? (
                        <p className="text-center">Chargement des bibliothèques...</p>
                    ) : libraries.length === 0 ? (
                        <div className="text-center">
                            <p>Vous n'avez pas encore de bibliothèque.</p>
                            <Button
                                className="mt-2 bg-primary text-background"
                                onClick={() => {
                                    setIsOpen(false);
                                    // Ici vous pourriez ajouter une redirection vers la création de bibliothèque
                                }}
                            >
                                Créer une bibliothèque
                            </Button>
                        </div>
                    ) : (
                        <label className="flex flex-col">
                            <span className="text-sm font-medium">Bibliothèque</span>
                            <select
                                className="mt-1 p-2 border rounded bg-background text-primary"
                                value={selectedLibrary}
                                onChange={(e) => setSelectedLibrary(e.target.value)}
                                required
                            >
                                {libraries.map((library) => (
                                    <option key={library.id} value={library.id}>
                                        {library.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {libraries.length > 0 && (
                        <DialogFooter className="flex justify-between">
                            <Button
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" className="bg-primary text-background" disabled={isLoading}>
                                {isLoading ? 'Ajout en cours...' : 'Ajouter'}
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

    const openModal = (id: string, noteValue?: number, reviewValue?: string) => {
        setBookId(id);
        setNote(noteValue);
        setReview(reviewValue);
        setIsOpen(true);
    };

    const AddToLibraryModalComponent = () => {
        return (
            <AddToLibraryModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                bookId={bookId}
                note={note}
                review={review}
            />
        );
    };

    return {
        openModal,
        setIsOpen,
        AddToLibraryModal: AddToLibraryModalComponent,
    };
}