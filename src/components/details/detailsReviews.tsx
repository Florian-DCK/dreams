import Card from "../card";
import Review from "./review";

export default function DetailsReviews({
    className = "",
}: {
    className?: string;
}) {
    return (
        <Card className={`flex flex-col gap-4 ${className}`}>
            <h1 className="text-2xl font-bold text-left">Reviews d'autres lecteurs :</h1>
            <Review username="Flo5GK" note={4} review="J'ai aimé le livre même si il trainait en longueur sur la fin. Les personnages sont attachants et l'intrigue est bien menée, mais certains passages auraient pu être plus concis. Malgré tout, c'est une lecture que je recommande pour les amateurs du genre." ></Review>
            <hr />
            <Review username="Lili" note={5} review="Un chef-d'œuvre ! J'ai adoré chaque page. L'auteur a su créer un univers captivant et des rebondissements inattendus. J'ai été transportée du début à la fin, et je relirai ce livre avec plaisir. À ne pas manquer !" ></Review>
        </Card>
    );
}