'use client';
import Bookshelf from '@/components/bookshelf';
import Book from '@/components/book';
import Tag from '@/components/tag';
import { useEffect, useState } from 'react';
import { set } from 'lodash';


export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [libraries, setLibraries] = useState<any[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
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
				setIsLoading(false);
				console.log('Libraries fetched successfully:', data);
			} catch (error) {
				console.error('Error fetching libraries:', error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col h-full">
			<div className="mt-2 space-y-2">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-gray-500">Chargement des bibliothèques...</p>
					</div>
				) : (
					libraries.length === 0 ? (
						<div className="flex justify-center items-center h-64">
							<p className="text-gray-500">Aucune bibliothèque trouvée</p>
						</div>
					) : (
						libraries.map((library, index) => (
							<Bookshelf key={index} className="mb-4">
								{library.books.map((book: any, bookIndex: number) => (
									<Book
										key={bookIndex}
										backgroundImage={book.details.cover_image}
										url={`/library/${library.id}/book/${book.book_id}`}
									/>
								))}
								<Tag text={library.name} className="absolute z-10 mb-2 -bottom-[34px]" color={library.color} />
							</Bookshelf>
						))
					)
				)}
			
			</div>
		</div>
	);
}
