export default function Bookshelf({children, className, library}: Readonly<{children: React.ReactNode, className?: string, library?: any}>) {
    const bgColor = library?.color || '#855b56';
    const bgColorWithOpacity = convertToRgba(bgColor, 0.3);

    
    function convertToRgba(hex: string, opacity: number) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return (
        <div className={`relative flex flex-col items-center justify-start w-[80%] mx-auto  ${className || ''}`}>
            <nav style={{ backgroundColor: bgColor }} className="w-full h-12 flex items-center justify-center text-white text-lg font-semibold shadow-md rounded-tl-2xl rounded-tr-2xl">
                {library?.name}
            </nav>
            <section className=" w-full h-full flex gap-6 transform py-4 relative z-10 px-10 rounded-bl-2xl rounded-br-2xl " style={{ backgroundColor: bgColorWithOpacity }}>
                {children}
            </section>
        </div>
    );
}