export default function Tag({ text, className, color }: Readonly<{text?: string, className?: string, color?: string}>) {
    return (
        <div className={`flex items-center justify-center px-4 border-5 h-[26px] bg-gradient-to-br from-[#ffca3a] via-[#f7b900] to-[#e6ac00] rounded-[3px_0.5px_0.5px_3px] ${className || ''}`}
                style={{ borderColor: color || '#704d49', boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)' }}>
            <span className="text-sm font-bold text-[#704d49] tracking-wide" style={{ textShadow: "1px 1px 1px rgba(255,255,255,0.3)" }}>{text}</span>
        </div>
    )
}