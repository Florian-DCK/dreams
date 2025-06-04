export default function Card({
    children,
    className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
    return (
        <div className={`px-5 py-3 bg-primary text-background rounded-2xl shadow-[10px_7px_0px_0px_#00000024] ${className}`}>
            {children}
        </div>
    );
}