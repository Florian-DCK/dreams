

export default function Card({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className="px-5 py-3 bg-white rounded-lg shadow-[10px_7px_0px_0px_#00000024]">
            {children}
        </div>
    );
}