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
	}

	return (
		<div className="bg-primary rounded-2xl p-4 shadow-sm flex flex-col h-full">
			<h2 className="text-xl font-semibold text-white mb-2">
				{book.volumeInfo.title}
			</h2>
			<div className="flex flex-grow">
				{book.volumeInfo.imageLinks?.thumbnail && (
					<img
						src={book.volumeInfo.imageLinks.thumbnail}
						alt={`Couverture de ${book.volumeInfo.title}`}
						className="h-48 mr-5 object-contain"
					/>
				)}
				<div className="flex flex-col w-full">
					<span className="flex justify-between w-full mb-5">
						<p className="text-white opacity-60">
							{book.volumeInfo.authors?.join(', ')}
						</p>
						<p className="text-white opacity-60">
							{formatDate(book.volumeInfo.publishedDate)}
						</p>
					</span>
					<p className="text-white opacity-60 mt-2 w-full">
						{truncateText(book.volumeInfo.description, 256) ||
							'Aucune description disponible.'}
					</p>
				</div>
			</div>
			<div className="flex mt-auto pt-5 items-center justify-between">
				<span className="flex items-center space-x-2">
					<Button
						onClick={() => router.push(`/details/${book.id}`)}
						className="lg:space-x-2">
						<NotebookTabs />
						<span className='hidden lg:block'>Voir les détails</span>
					</Button>
					<Button className="lg:space-x-2" onClick={handleAddToLibrary}>
						<Plus />
						<span className='hidden lg:block'>Ajouter</span>
					</Button>
				</span>
				{ book.nbReviews && book.nbReviews > 0 && (
					<div className="flex items-center space-x-2">
					<span className="text-white opacity-60">
						{book.nbReviews} {book.nbReviews > 1 ? 'avis' : 'avis'}
					</span>
					<Stars
						note={book.reviews}
						editable={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
