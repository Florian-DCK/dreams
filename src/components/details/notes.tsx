import Card from "@/components/card";
import Stars from "../stars";
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle"
import { Globe, Lock } from "lucide-react";

export default function Notes({ 
    className = "", 
    onReviewChange,
    onRatingChange,
    note = 0,
    userReview = "",
    setIsPublic,
    isPublic,
    initialReview,
    initialRating,
    isAlreadyReviewed = false
}: { 
    className?: string;
    onReviewChange?: (review: string) => void;
    onRatingChange?: (rating: number) => void;
    setIsPublic?: (isPublic: boolean) => void;
    note?: number;
    userReview?: string;
    isPublic?: boolean;
    initialReview?: string;
    initialRating?: number;
    isAlreadyReviewed?: boolean;
}) {
    const [review, setReview] = useState(initialReview || userReview || "");

    useEffect(() => {
        if (initialReview !== undefined) {
            setReview(initialReview);
        } else if (userReview) {
            setReview(userReview);
        }
    }, [initialReview, userReview]);
    
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

    console.log(initialRating, note)

    return (
        <Card className={`flex flex-col py-0 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-left">Votre Avis</h1>
                { isAlreadyReviewed ? (
                    <>
                        <span className="text-sm text-muted-foreground">Vous avez déjà donné votre avis</span>
                        <Stars note={ initialRating || note} editable={!isAlreadyReviewed} />
                    </>
                ) : (
                    <Stars 
                        onRatingChange={onRatingChange} 
                        note={initialRating || note} 
                        editable={!isAlreadyReviewed} 
                        className="flex items-center"
                    />
                )
                }
            </div>
            <div className="flex items-center justify-end mb-2">
                { (setIsPublic && isPublic !== undefined) &&
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {isPublic ? "Public" : "Privé"}
                        </span>
                        <Toggle 
                            pressed={isPublic}
                            onPressedChange={handlePublicChange}
                            aria-label="Rendre l'avis public ou privé"
                            variant="default"
                            className="rounded-[8px] cursor-pointer"
                        >
                            {isPublic ? <Globe size={16} /> : <Lock size={16} />}
                        </Toggle>
                    </div>
                }
            </div>
            <textarea 
                name="notes" 
                id="notes" 
                className="border-2 border-primary rounded resize-none h-full" 
                placeholder="Des choses à dire sur cette oeuvre avant de l'ajouter à votre bibliothèque ?"
                value={ initialReview || review }
                onChange={handleReviewChange}
                disabled={isAlreadyReviewed}
            ></textarea>
        </Card>
    );
}