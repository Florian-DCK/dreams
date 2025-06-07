import Card from "@/components/card";
import Stars from "../stars";
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle"

export default function Notes({ 
    className = "", 
    onReviewChange,
    onRatingChange,
    note = 0,
    userReview = "",
    setIsPublic
}: { 
    className?: string;
    onReviewChange?: (review: string) => void;
    onRatingChange?: (rating: number) => void;
    setIsPublic?: (isPublic: boolean) => void;
    note?: number;
    userReview?: string;
    isPublic?: boolean;
}) {
    const [review, setReview] = useState("");

    useEffect(() => {
        setReview(userReview);
    }, [userReview]);
    
    const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newReview = e.target.value;
        setReview(newReview);
        if (onReviewChange) {
            onReviewChange(newReview);
        }
    };

    const handlePublicChange = (pressed: boolean) => {
        if (setIsPublic) {
            setIsPublic(pressed);
        }
    };

    return (
        <Card className={`flex flex-col py-0 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-left">Notes</h1>
                <Stars onRatingChange={onRatingChange} note={note} />
            </div>
            <textarea 
                name="notes" 
                id="notes" 
                className="border-2 border-primary rounded resize-none h-full" 
                placeholder="Des choses à dire sur cette oeuvre avant de l'ajouter à votre bibliothèque ?"
                value={review}
                onChange={handleReviewChange}
            ></textarea>
        </Card>
    );
}