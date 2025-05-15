'use client';
import { useState, useRef, useEffect } from 'react';

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

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    interface SearchChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

    const handleSearchChange = async (e: SearchChangeEvent) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.length > 2) {
            try {
                const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(Array.isArray(data) ? data : data.data || []);
                setIsDropdownVisible(true);
            } catch (error: unknown) {
                console.error("Erreur lors de la recherche:", error);
            }
        } else {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsDropdownVisible(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        if (searchQuery.length > 2 && searchResults.length > 0) {
            setIsDropdownVisible(true);
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-[#EBE5C2]">
            <a href="/">
                <h1 className="text-lg font-bold">Dreams</h1>
            </a>
            <div className="relative" ref={searchRef}>
                <form action="/search" method="get">
                    <input 
                        type="text" 
                        id="search" 
                        name="q" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleFocus}
                        className="p-2 rounded-md"
                        placeholder="Rechercher..."
                        autoComplete='off'
                    />
                </form>
                {isDropdownVisible && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {[...searchResults].reverse().map((result, index) => (
                            <a 
                                key={index} 
                                href={`/detail/${result.id}`} 
                                className="block p-2 hover:bg-gray-100"
                            >
                                {result.volumeInfo.title}
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <nav className="flex space-x-4">
                <a href="/" className="hover:text-gray-400">
                    Mon compte
                </a>
            </nav>
        </div>
    );
}