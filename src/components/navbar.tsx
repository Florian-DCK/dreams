'use client';
import { useState, useRef, useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { debounce } from 'lodash';
import { LogOut, Menu, Search, User } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
import { LogoInline } from './svg/logo';
import { LogoNaked } from './svg/logoNaked';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NewLibraryModalContext } from './modals/providers';

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

	const { setIsOpen } = useContext(NewLibraryModalContext);

	const [session, setSession] = useState<Session>({
		isAuth: false,
		username: '',
	});
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Book[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	useEffect(() => {
		fetch('/api/auth/session')
			.then((res) => res.json())
			.then((data) => {
				setSession(data);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Erreur:', err);
				setIsLoading(false);
			});
			
		// Réinitialiser la visibilité de la barre de recherche sur les changements de page
		setIsSearchVisible(false);
	}, [pathname]);
	const handleLogOut = async () => {
		try {
			await signOut();
			setSession({ isAuth: false, username: '' });
			setSearchQuery('');
			setSearchResults([]);
			setIsDropdownVisible(false);
			window.location.href = '/';
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
	};

	const debouncedSearch = useRef(
		debounce(async (query: string) => {
			if (query.length > 2) {
				try {
					const response = await fetch(
						`/api/books/search?q=${encodeURIComponent(query)}`
					);
					const data = await response.json();
					setSearchResults(Array.isArray(data) ? data : data.data || []);
					setIsDropdownVisible(true);
				} catch (error) {
					console.error('Erreur lors de la recherche:', error);
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
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsDropdownVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	const handleFocus = () => {
		if (searchQuery.length > 2 && searchResults.length > 0) {
			setIsDropdownVisible(true);
		}
	};
	
	const handleResultClick = () => {
		setIsDropdownVisible(false);
		setIsSearchVisible(false);
	};

	return (
		<div className="flex justify-between items-center p-4 bg-transparent shadow-[0_10px_10px_-10px_rgba(0,0,0,0.1)]">
			<Link href="/" className='hidden md:block' >
				<LogoInline className="w-35 h-fit text-primary" />
			</Link>
			<Link href="/" className="block md:hidden">
				<LogoNaked className="w-12 h-fit text-primary" />
			</Link>

			{/* Bouton de recherche visible uniquement en mode mobile */}
			<button 
				onClick={() => setIsSearchVisible(!isSearchVisible)}
				className="md:hidden flex items-center ml-3 mr-auto p-2 text-primary"
			>
				<Search size={24} />
			</button>

			{/* Barre de recherche */}
			<div 
				className={`relative transition-all duration-300 ease-in-out ${
					!isSearchVisible 
						? 'hidden sm:hidden md:block' 
						: 'absolute top-0 left-0 right-0 z-50 px-4 md:static md:px-0 animate-[fadeIn_0.3s_ease-in-out_forwards]'
				}`} 
				ref={searchRef}
			>
				<form action="/search" method="get">
					<input
						type="text"
						id="search"
						name="q"
						value={searchQuery}
						onChange={handleSearchChange}
						onFocus={handleFocus}
						className="p-2 bg-primary rounded-full outline-none focus:border-gray-500 transition duration-200 text-foreground w-full md:w-96"
						placeholder="Rechercher..."
						autoComplete="off"
					/>				</form>
				{isDropdownVisible && searchResults.length > 0 && (
					<div className={`absolute mt-1 bg-white rounded-md shadow-lg z-50 max-h-[80vh] overflow-y-auto ${
						isSearchVisible 
							? 'transform -translate-x-1/2 left-1/2 right-0 w-[200%] md:w-1/2' 
							: 'transform -translate-x-1/2 left-1/2 right-0 w-[300%] md:w-[300%]'
					}`}>
						{[...searchResults].map((result, index) => (
							<div key={index} className="">								<a
									key={index}
									href={`/details/${result.id}`}
									onClick={handleResultClick}
									className="p-2 bg-popover hover:bg-primary flex">
									{result.volumeInfo.imageLinks &&
										result.volumeInfo.imageLinks.thumbnail && (
											<img
												src={result.volumeInfo.imageLinks.thumbnail}
												alt={result.volumeInfo.title}
												className="w-16 h-24 object-cover mr-2"
											/>
									)}									<div className="flex flex-col gap-1 overflow-hidden">
										<span className="font-medium truncate">{result.volumeInfo.title}</span>
										{result.volumeInfo.authors &&
											result.volumeInfo.authors.length > 0 && (
												<span className="text-sm text-gray-200 truncate">
													{result.volumeInfo.authors.join(', ')}
												</span>
										)}
									</div>

								</a>
								<hr className="border-gray-700" />
							</div>
						))}
					</div>
				)}
			</div>
			<nav className="flex space-x-4">
				{!isLoading && (
					<>
						{session.isAuth && (
							<div className="flex items-center gap-3">
								<a
									href="/profile"
									className="hover:text-light text-lg font-bold text-primary">
									{session.username}
								</a>
								<DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Menu color='#415a77' size={30} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" w-56 rounded">
										<DropdownMenuItem className=" rounded flex justify-between">
											<span>Mon compte</span>
											<User />
										</DropdownMenuItem>
										<DropdownMenuSeparator />										<DropdownMenuItem className=" rounded">
											<button
												onClick={handleLogOut}
												className="flex justify-between w-full">
												<span>Se déconnecter</span>
												<LogOut
													className="cursor-pointer"
													color="background"
													size={16}
												/>
											</button>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="rounded">
											<button onClick={() => setIsOpen(true)}>
												Nouvelle bibliothèque
											</button>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
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
