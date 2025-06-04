import Card from "../card";
import Button from "../button";
import { useContext } from "react";
import { AddToLibraryModalContext } from "../modals/providers";
import { Plus } from "lucide-react";

export default function DetailsControls({
    className = "",
    book
}: {
    className?: string;
    book: string;
}) {
    const { openModal } = useContext(AddToLibraryModalContext);

    const handleAddToLibrary = () => {
        openModal(book);
    };

    return (
        <Card className={`flex gap-4 justify-center ${className}`}>
            <Button onClick={handleAddToLibrary} ><Plus /><span>Ajouter à l'une de mes bibliothèques</span></Button>
        </Card>
    );
}