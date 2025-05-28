import Card from "@/components/card";
import Stars from "./stars";

export default function Notes({ className = "" }: { className?: string }) {
    return (
        <Card className={`flex flex-col py-0 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-left">Notes</h1>
                <Stars />
            </div>
            <textarea name="notes" id="notes" className="border-2 border-primary rounded resize-none h-full" placeholder="Des choses à dire sur cette oeuvre avant de l'ajouter à votre bibliothèque ?"></textarea>
        </Card>
    );
}