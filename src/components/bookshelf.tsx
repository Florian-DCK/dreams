import { BookOpen, Library } from 'lucide-react';

export default function Bookshelf({
	children,
	className,
	library,
}: Readonly<{
	children: React.ReactNode;
	className?: string;
	library?: any;
}>) {
	const bgColor = library?.color || '#855b56';
	const bgColorWithOpacity = convertToRgba(bgColor, 0.08);

	function convertToRgba(hex: string, opacity: number) {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	return (
		<div
			className={`relative w-full sm:w-[90%] md:w-[80%] mx-auto ${
				className || ''
			}`}>
			<div
				className="relative overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm"
				style={{
					background: `linear-gradient(135deg, ${bgColorWithOpacity} 0%, ${convertToRgba(
						bgColor,
						0.12
					)} 100%)`,
				}}>
				<nav
					className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-medium border-b border-white/10"
					style={{
						background: `linear-gradient(135deg, ${bgColor} 0%, ${convertToRgba(
							bgColor,
							0.9
						)} 100%)`,
					}}>
					<Library className="w-5 h-5" />
					<span className="text-lg">{library?.name || 'Ma Bibliothèque'}</span>
				</nav>

				<section className="p-6 space-y-4">
					<div className="flex flex-wrap justify-center gap-4 sm:gap-6">
						{children}
					</div>
					{!children || (Array.isArray(children) && children.length === 0) ? (
						<div className="flex flex-col items-center justify-center py-12 text-gray-500">
							<BookOpen className="w-16 h-16 mb-4 opacity-50" />
							<p className="text-lg font-medium">
								Aucun livre dans cette bibliothèque
							</p>
							<p className="text-sm mt-2">
								Ajoutez votre premier livre pour commencer
							</p>
						</div>
					) : null}
				</section>
			</div>
		</div>
	);
}
