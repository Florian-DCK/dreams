import Card from "../card";
import Review from "./review";
import { useState } from "react";
import { ArrowDown10, ArrowUp01 } from "lucide-react";

export default function DetailsReviews({
    className = "",
    usersReviews,
}: {
    className?: string;
    usersReviews?: any[];
}) {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    
    const sortedReviews = usersReviews && Array.isArray(usersReviews) 
        ? [...usersReviews].sort((a, b) => 
            sortOrder === 'desc' ? b.note - a.note : a.note - b.note
          )
        : usersReviews;
    
    return (
        <Card className={`flex flex-col gap-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Critiques de nos utilisateurs :</h2>
                {usersReviews && Array.isArray(usersReviews) && usersReviews.length > 1 && (
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="px-3 py-1 text-sm bg-secondary hover:bg-light rounded-[10px] transition-colors cursor-pointer"
                    >
                        Trier par note {sortOrder === 'desc' ? (
                            <ArrowDown10 className="inline" />) : (
                            <ArrowUp01 className="inline" />)}
                    </button>
                )}
            </div>
            {sortedReviews && (Array.isArray(sortedReviews) ? (
                sortedReviews.length > 0 ? (
                    sortedReviews.map((review, index) => (
                        <Review
                            key={`${review.username}-${review.note}-${index}`}
                            username={review.username}
                            note={review.note}
                            review={review.review}
                            className="border-b border-gray-200 pb-4 last:border-b-0"
                        />
                        
                    ))
                ) : (
                    <p className="text-gray-500">Aucun avis disponible pour ce livre.</p>
                )
            ) : (
                <Review
                    username={sortedReviews.username}
                    note={sortedReviews.note}
                    review={sortedReviews.review}
                />
            ))}
        </Card>
    );
}