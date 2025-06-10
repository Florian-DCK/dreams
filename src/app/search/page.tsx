'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import SearchCard from '@/components/search/searchCard';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import Button from '@/components/button';

interface Book {
	kind?: string;
	id?: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		imageLinks?: {
			thumbnail?: string;
		};
	};
}

function SearchContent() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('q') || '';
	const [searchResults, setSearchResults] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const res = await fetch('/api/books/search?q=' + searchQuery);
			const data = await res.json();
			console.log(data.data);
			setSearchResults(Array.isArray(data) ? data : data.data || []);
			setIsLoading(false);
		};

		fetchData();
	}, [searchQuery]);

	return (
		<div className="container mx-auto p-4 mt-5 space-y-6">
			{/* En-tête */}
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<Search className="text-primary mr-3" size={32} />
					<h1 className="text-3xl font-bold">Résultats de recherche</h1>
				</div>
				<p className="text-muted-foreground">
					Recherche pour "
					<span className="font-medium text-foreground">{searchQuery}</span>"
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">Chargement des résultats...</p>
					</div>
				</div>
			) : searchResults.length === 0 ? (
				<div className="text-center py-16">
					<BookOpen className="mx-auto text-muted-foreground mb-4" size={64} />
					<h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
					<p className="text-muted-foreground mb-4">
						Essayez avec d'autres mots-clés ou vérifiez l'orthographe
					</p>
					<Button onClick={() => window.history.back()} className="gap-2">
						<ArrowLeft size={16} />
						Retour
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							{searchResults.length} résultat
							{searchResults.length > 1 ? 's' : ''} trouvé
							{searchResults.length > 1 ? 's' : ''}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{searchResults.map((book, index) => (
							<SearchCard key={index} book={book} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default function SearchPage() {
	return (
		<Suspense
			fallback={<div className="container mx-auto p-4">Chargement...</div>}>
			<SearchContent />
		</Suspense>
	);
}
