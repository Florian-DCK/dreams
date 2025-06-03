'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { debounce } from 'lodash';
import { LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface Session {
    isAuth: boolean;
    username: string;
}

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
    const [session, setSession] = useState<Session>({ isAuth: false, username: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                setSession(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Erreur:', err);
                setIsLoading(false);
            });
    }, [pathname]);

    const debouncedSearch = useRef(
        debounce(async (query: string) => {
            if (query.length > 2) {
                try {
                    const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    setSearchResults(Array.isArray(data) ? data : data.data || []);
                    setIsDropdownVisible(true);
                } catch (error) {
                    console.error("Erreur lors de la recherche:", error);
                }
            } else {
                setIsDropdownVisible(false);
            }
        }, 300)
    ).current;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
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
        <div className="flex justify-between items-center p-4 bg-primary shadow-[0_10px_10px_-10px_rgba(0,0,0,0.1)]">
            <a href="/">
                <h1 className="text-lg font-bold text-background">Dreams</h1>
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
                        className="p-2 border-b-2 border-gray-300 outline-none focus:border-gray-500 transition duration-200 text-background"
                        placeholder="Rechercher..."
                        autoComplete='off'
                    />
                </form>
                {isDropdownVisible && searchResults.length > 0 && (
                    <div className="absolute transform -translate-x-1/2 left-1/2 right-0 mt-1 bg-white rounded-md shadow-lg w-[300%] z-50 max-h-60 overflow-y-auto">
                        {[...searchResults].reverse().map((result, index) => (
                            <div key={index} className=''>
                                <a 
                                    key={index} 
                                    href={`/details/${result.id}`} 
                                    className="p-2 hover:bg-gray-100 flex flex-col"
                                >
                                    {result.volumeInfo.title}
                                    {result.volumeInfo.authors && result.volumeInfo.authors.length > 0 && (
                                        <span className="text-sm text-gray-500"> - {result.volumeInfo.authors.join(', ')}</span>
                                    )}
                                </a>
                                <hr className=' border-gray-200' />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <nav className="flex space-x-4">
                {!isLoading && (
                    <>
                        {session.isAuth && (
                            <div className='flex items-center'>
                                <a href="/profile" className="hover:text-gray-400 text-background">
                                    {session.username}
                                </a>
                                <form action={signOut}>
                                    <button type='submit'>
                                        <LogOut className="ml-2 cursor-pointer" color='background' size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                        {!session.isAuth && (
                            <a href="/login" className="hover:text-gray-400">
                                Connexion
                            </a>
                        )}
                    </>
                )}
            </nav>
        </div>
    );
}