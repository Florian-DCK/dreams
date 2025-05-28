import Card from "./card";

export default function DetailsControls({
    className = "",
}: {
    className?: string;
}) {
    return (
        <Card className={`flex gap-4 justify-center ${className}`}>
            <button className="rounded bg-primary hover:bg-primary/90 active:bg-primary/70 text-white w-fit p-1">Ajouter à l'une de mes bibliothèques</button>
            <button className="rounded bg-primary hover:bg-primary/90 active:bg-primary/70 text-white w-fit p-1">Partager</button>
        </Card>
    );
}