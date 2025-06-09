import Button from "../button";
import { SquareDashedTopSolid, Circle as CircleIcon, Triangle as TriangleIcon } from "lucide-react";
import { Canvas, Rect, Circle, Triangle } from "fabric";

interface ShapesMenuProps {
    canvas: any;
}

const ShapesMenu = ({ canvas }: ShapesMenuProps) => {
    const addRectangle = () => {
        if (!canvas) return;

        const rect = new Rect({
            left: 50,
            top: 50,
            fill: 'rgba(255, 0, 0, 0.5)',
            width: 100,
            height: 100,
            angle: 0,
        });

        canvas.add(rect);
        canvas.renderAll();
    }

    const addCircle = () => {
        if (!canvas) return;

        const circle = new Circle({
            left: 200,
            top: 50,
            fill: 'rgba(0, 255, 0, 0.5)',
            radius: 50,
        });

        canvas.add(circle);
        canvas.renderAll();
    }

    const addTriangle = () => {
        if (!canvas) return;

        const triangle = new Triangle({
            left: 350,
            top: 50,
            fill: 'rgba(0, 0, 255, 0.5)',
            width: 100,
            height: 100,
        });

        canvas.add(triangle);
        canvas.renderAll();
    }

    return (
        <div className=" flex absolute top-2 right-2 z-10">
            <Button onClick={addRectangle}>
                <SquareDashedTopSolid className="w-4 h-4" />
            </Button>
            <Button onClick={addCircle}>
                <CircleIcon className="w-4 h-4" />
            </Button>
            <Button onClick={addTriangle}>
                <TriangleIcon className="w-4 h-4" />
            </Button>
        </div>
    );
}

export { ShapesMenu };