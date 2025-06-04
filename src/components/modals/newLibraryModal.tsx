'use client';
import { SetStateAction, useState, Dispatch, FormEvent } from 'react';
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

function NewLibraryModal({ isOpen, setIsOpen }: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const userResponse = await fetch('/api/auth/session');
        if (!userResponse.ok) {
            setError('Utilisateur non authentifié');
            setIsLoading(false);
            return;
        }
        
        const userData = await userResponse.json();
        if (!userData.isAuth) {
            setError('Utilisateur non authentifié');
            setIsLoading(false);
            return;
        }
        if (!userData.userId) {
            setError('Identifiant utilisateur manquant');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/library/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([userData.userId, name, description, color]),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création de la bibliothèque');
            }

            setIsOpen(false);
            setName('');
            setDescription('');
            setColor('#ffffff');
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
                    <DialogTitle className='text-center'>Créer une nouvelle bibliothèque</DialogTitle>
                    <DialogDescription className='text-center'>
                        Créez une nouvelle bibliothèque pour organiser vos livres.
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Nom de la bibliothèque</span>
                        <input
                            type="text"
                            className="mt-1 p-2 border rounded bg-background text-primary"
                            placeholder="Entrez le nom de votre bibliothèque"
                            required
                            maxLength={30}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Description</span>
                        <textarea
                            className="mt-1 p-2 border rounded bg-background text-primary"
                            placeholder="Entrez une description de votre bibliothèque"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium">Couleur</span>
                        <input
                            type="color"
                            className="mt-1 p-2 border rounded bg-background text-primary"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </label>

                    <DialogFooter className="flex justify-between">
                        <Button
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-primary text-background" disabled={isLoading}>
                            {isLoading ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
}

export default function useNewLibraryModal() {
    const [isOpen, setIsOpen] = useState(false);

    const NewModalComponent = () => {
        return (
            <NewLibraryModal isOpen={isOpen} setIsOpen={setIsOpen} />
        )
    }
    return {
        setIsOpen,
        NewLibraryModal: NewModalComponent,
    }
}
