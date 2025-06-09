import { useRef, useState, useEffect } from "react";
import { Canvas} from "fabric";
import { ShapesMenu } from "./canvas/menus";
import Settings from "./canvas/setting";
import Card from "./card";


export default function ArtCanvas({
    className = "",
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    useEffect(() => {
        if(canvasRef.current && containerRef.current) {
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            
            // Calculer la largeur disponible pour le canvas (2/3 de l'écran moins le gap)
            const availableWidth = (rect.width * 3) / 4 - 16; // 16px pour le gap
            
            const initCanvas = new Canvas(canvasRef.current, {
                width: availableWidth,
                height: rect.height,
            })

            initCanvas.backgroundColor = "#f0f0f0"; 
            initCanvas.renderAll();
            setCanvas(initCanvas);

            const handleResize = () => {
                const newRect = container.getBoundingClientRect();
                const newAvailableWidth = (newRect.width * 3) / 4 - 16;
                initCanvas.setDimensions({
                    width: newAvailableWidth,
                    height: newRect.height
                });
                initCanvas.renderAll();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                initCanvas.dispose();
            };
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full bg-secondary flex gap-4 ${className}`}
        >
            <Card className="w-1/4 flex-shrink-0">
                <ShapesMenu canvas={canvas} />
                <Settings canvas={canvas} />
            </Card>
            <canvas className="rounded-2xl flex-1" ref={canvasRef}></canvas>
        </div>
    );
}