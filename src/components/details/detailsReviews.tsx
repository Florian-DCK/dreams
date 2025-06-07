import Card from "../card";
import Review from "./review";

export default function DetailsReviews({
    className = "",
    usersReviews,
}: {
    className?: string;
    usersReviews?: any[];
}) {
    
    return (
        <Card className={`flex flex-col gap-4 ${className}`}>
            <h2 className=" text-xl font-bold ">Critiques de nos utilisateurs :</h2>
            {usersReviews && (Array.isArray(usersReviews) ? (
                usersReviews.length > 0 ? (
                    usersReviews.map((review, index) => (
                        <Review
                            key={index}
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
                    username={usersReviews.username}
                    note={usersReviews.note}
                    review={usersReviews.review}
                />
            ))}
        </Card>
    );
}