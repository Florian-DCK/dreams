import { formatDate, truncateText } from '@/app/utils/utils';
import Button from '../button';
import { useRouter } from 'next/navigation';
import Stars from '../stars';
import { random } from 'lodash';
import { Plus, NotebookTabs } from 'lucide-react';
import { AddToLibraryModalContext } from '../modals/providers';
import { useContext } from 'react';

export default function SearchCard({ book }: { book: any }) {
	const router = useRouter();
	const { openModal } = useContext(AddToLibraryModalContext);

	const handleAddToLibrary = () => {
		openModal(book.id);
	};

	return (
		<div className="bg-card rounded-lg p-6 shadow-sm flex flex-col h-full  hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 transition-all">
			<div className="flex gap-4 mb-4">
				{book.volumeInfo.imageLinks?.thumbnail && (
					<img
						src={book.volumeInfo.imageLinks.thumbnail}
						alt={`Couverture de ${book.volumeInfo.title}`}
						className="w-16 h-24 object-cover rounded flex-shrink-0"
					/>
				)}
				<div className="flex-1 min-w-0">
					<h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
						{book.volumeInfo.title}
					</h2>
					<p className="text-sm text-muted-foreground mb-1">
						{book.volumeInfo.authors?.join(', ') || 'Auteur inconnu'}
					</p>
					<p className="text-xs text-muted-foreground">
						{formatDate(book.volumeInfo.publishedDate)}
					</p>
				</div>
			</div>

			<p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
				{truncateText(book.volumeInfo.description, 150) ||
					'Aucune description disponible.'}
			</p>

			<div className="flex items-center justify-between mt-auto">
				<div className="flex gap-2">
					<Button
						onClick={() => router.push(`/details/${book.id}`)}
						className="gap-2 text-sm">
						<NotebookTabs size={16} />
						<span className="hidden sm:inline">Détails</span>
					</Button>
					<Button
						onClick={handleAddToLibrary}
						className="gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90">
						<Plus size={16} />
						<span className="hidden sm:inline">Ajouter</span>
					</Button>
				</div>

				{book.nbReviews && book.nbReviews > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground">
							{book.nbReviews} avis
						</span>
						<Stars note={book.reviews} editable={false} />
					</div>
				)}
			</div>
		</div>
	);
}
