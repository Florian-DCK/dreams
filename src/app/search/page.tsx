'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchCard from '@/components/search/searchCard';

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

export default function SearchPage() {
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Résultats pour "{searchQuery}"</h1>
            
            {isLoading ? (
                <p>Chargement des résultats...</p>
            ) : searchResults.length === 0 ? (
                <p>Aucun résultat trouvé</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {searchResults.map((book, index) => (
                        <SearchCard key={index} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}