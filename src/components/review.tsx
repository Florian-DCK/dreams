import Stars from "./stars";

export default function Review({className = "", username = "Unknown", note = null, review = ""}: { className?: string, username?: string, note?: number | null, review?: string }) {
    return (
        <div className={`flex gap-4 ${className}`}>
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold text-left">{username}</h1>
                    {note !== null ? (
                        <Stars className="text-yellow-500 font-bold" note={note} editable={false}></Stars>
                    ) : (
                        <p className="text-gray-500">Note non fournie</p>
                    )}
            </div>
            <div className="border border-gray-300"></div>
            <p className="text-gray-700">{review || "Aucun avis fourni."}</p>
        </div>
    );


}