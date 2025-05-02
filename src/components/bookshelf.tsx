export default function Bookshelf({children, className}: Readonly<{children: React.ReactNode, className?: string}>) {
    return (
        <div className={`relative max-w-[1000px] flex justify-start flex-shrink-0 h-0 border-b-[16px] border-b-[#855b56] border-r-[20px] border-r-transparent border-t-[270px] border-t-transparent ${className || ''}`}>
            <div className="absolute top-[16px] bg-gradient-to-r from-[#92635d] to-[#a3716a] h-[26px] w-[calc(100%+20px)] shadow-[0px_-1px_6px_rgba(0,0,0,0.05),0px_4px_16px_rgba(0,0,0,0.25)] z-[2] pointer-events-none"></div>
            <div className="absolute top-[42px] h-[40px] w-[calc(100%+20px)] block bg-gradient-to-b from-[#dbd6b5] to-transparent -z-10 pointer-events-none" style={{ clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)" }}></div>
            <div className="flex gap- w-full m-auto transform translate-y-[-100%] pb-2 relative top-4 z-10 ml-[2%]">
                {children}
            </div>
        </div>
    );
}