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
		<div className="bg-primary rounded-2xl p-4 shadow-sm">
			<h2 className="text-xl font-semibold text-white">
				{book.volumeInfo.title}
			</h2>
			<div className="flex">
				{book.volumeInfo.imageLinks?.thumbnail && (
					<img
						src={book.volumeInfo.imageLinks.thumbnail}
						alt={`Couverture de ${book.volumeInfo.title}`}
						className="h-48 mr-5 object-contain"
					/>
				)}
				<div className="flex flex-col">
					<span className="flex justify-between w-full mb-5">
						<p className="text-white opacity-60">
							{book.volumeInfo.authors?.join(', ')}
						</p>
						<p className="text-white opacity-60">
							{formatDate(book.volumeInfo.publishedDate)}
						</p>
					</span>
					<p className="text-white opacity-60 mt-2">
						{truncateText(book.volumeInfo.description, 256) ||
							'Aucune description disponible.'}
					</p>
				</div>
			</div>
			<div className="flex mt-5 items-center justify-between">
				<Stars
					note={book.volumeInfo.averageRating || random(0, 5)}
					editable={false}
				/>
				<span className="flex items-center space-x-2">
					<Button className=" space-x-2" onClick={handleAddToLibrary}>
						<Plus />
						<span>Ajouter</span>
					</Button>
					<Button
						onClick={() => router.push(`/details/${book.id}`)}
						className="space-x-2">
						<NotebookTabs />
						<span>Voir les détails</span>
					</Button>
				</span>
			</div>
		</div>
	);
}
