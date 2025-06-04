'use client';
import { useState, useRef, useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { debounce } from 'lodash';
import { LogOut, Menu, User } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';

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
	}, [pathname]);

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

	return (
		<div className="flex justify-between items-center p-4 bg-primary shadow-[0_10px_10px_-10px_rgba(0,0,0,0.1)]">
			<Link href="/">
				<h1 className="text-lg font-bold text-background">Dreams</h1>
			</Link>

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
						autoComplete="off"
					/>
				</form>
				{isDropdownVisible && searchResults.length > 0 && (
					<div className="absolute transform -translate-x-1/2 left-1/2 right-0 mt-1 bg-white rounded-md shadow-lg w-[300%] z-50 max-h-60 overflow-y-auto">
						{[...searchResults].map((result, index) => (
							<div key={index} className="">
									
								<a
									key={index}
									href={`/details/${result.id}`}
									className="p-2 hover:bg-gray-100 flex">
									{result.volumeInfo.imageLinks &&
										result.volumeInfo.imageLinks.thumbnail && (
											<img
												src={result.volumeInfo.imageLinks.thumbnail}
												alt={result.volumeInfo.title}
												className="w-16 h-24 object-cover mr-2"
											/>
									)}
									<div className="flex flex-col gap-1">
										{result.volumeInfo.title}
										{result.volumeInfo.authors &&
											result.volumeInfo.authors.length > 0 && (
												<span className="text-sm text-gray-500">
													{' '}
													- {result.volumeInfo.authors.join(', ')}
												</span>
										)}
									</div>

								</a>
								<hr className=" border-gray-200" />
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
									className="hover:text-gray-400 text-background">
									{session.username}
								</a>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Menu color="background" />
									</DropdownMenuTrigger>
									<DropdownMenuContent className=" w-56 rounded">
										<DropdownMenuItem className=" rounded flex justify-between">
											<span>Mon compte</span>
											<User />
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className=" rounded">
											<form action={signOut} className="w-full">
												<button
													type="submit"
													className="flex justify-between w-full">
													<span>Se déconnecter</span>
													<LogOut
														className="cursor-pointer"
														color="background"
														size={16}
													/>
												</button>
											</form>
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
