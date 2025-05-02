export default function Book({
	backgroundImage,
	url,
}: Readonly<{ backgroundImage?: string; url?: string }>) {
	return (
		<a href={`${url ? url : ''}`} className="relative w-40 rounded-[3px_0.5px_0.5px_3px] aspect-[115/180] -ml-32 first:ml-0 group">
				<div
					className="absolute w-full h-full block transition-all duration-300 ease-out shadow-[0px_1px_1px_rgba(0,0,0,0.25),inset_10px_0px_2px_1px_rgba(29,27,27,0.2)] bg-[#f3f3f3] bg-center bg-cover bg-no-repeat transform group-hover:translate-y-[-55%] group-hover:transition-transform group-hover:duration-600 group-hover:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
					style={
						backgroundImage
							? { backgroundImage: `url(${backgroundImage})` }
							: { backgroundImage: 'url(https://placehold.co/150x250)' }
					}></div>
		</a>
	);
}
