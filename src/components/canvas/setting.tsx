import {useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input"
import { set } from "lodash";


function Settings({ canvas }: { canvas: any }) {
    interface FabricObject {
        type: string;
        width: number;
        height: number;
        radius: number;
        scaleX: number;
        scaleY: number;
        fill: string;
        set(options: {}): any;
    }
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [diameter, setDiameter] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        if (!canvas) return;
        canvas.on('selection:created', (e: any) => {
            handleObjectSelection(e.selected[0]);
        });

        canvas.on('selection:updated', (e: any) => {
            handleObjectSelection(e.selected[0]);
        });

        canvas.on('selection:cleared', () => {
            setSelectedObject(null);
            clearSettings();
        })

        canvas.on('object:modified', (e: any) => {
            handleObjectSelection(e.target);
        })

        canvas.on('object:scaling', (e: any) => {
            handleObjectSelection(e.target);
        })
        

    }, [canvas]);

    const handleObjectSelection = (obj: any) => {
        if (!obj) return;

        setSelectedObject(obj);
        if (obj.type === 'rect') {
            setWidth(Math.round(obj.width * obj.scaleX).toString());
            setHeight(Math.round(obj.height * obj.scaleY).toString());
            setColor(obj.fill);
            setDiameter("");

        } else if (obj.type === 'circle') {
            setDiameter(Math.round(obj.radius * obj.scaleX * 2).toString());
            setColor(obj.fill);
            setWidth("");
            setHeight("");

        } else if (obj.type === 'triangle') {
            setWidth(Math.round(obj.width * obj.scaleX).toString());
            setHeight(Math.round(obj.height * obj.scaleY).toString());
            setColor(obj.fill);
            setDiameter("");
        }

    }

    const clearSettings = () => {
        setSelectedObject(null);
        setWidth("");
        setHeight("");
        setDiameter("");
        setColor("");
    }

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseFloat(e.target.value);

        setWidth(newWidth.toString());
        if (selectedObject && selectedObject.type === 'rect' && newWidth >= 0) {
            selectedObject.set({
                width: newWidth / selectedObject.scaleX,
                scaleX: 1
            });
            canvas.renderAll();
        }
    }
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseFloat(e.target.value);

        setHeight(newHeight.toString());
        if (selectedObject && selectedObject.type === 'rect' && newHeight >= 0) {
            selectedObject.set({
                height: newHeight / selectedObject.scaleY,
                scaleY: 1
            });
            canvas.renderAll();
        }
    }
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;

        setColor(newColor);
        if (selectedObject) {
            selectedObject.set({ fill: newColor });
            canvas.renderAll();
        }
    }
    const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDiameter = parseFloat(e.target.value);

        setDiameter(newDiameter.toString());
        if (selectedObject && selectedObject.type === 'circle' && newDiameter >= 0) {
            const radius = newDiameter / 2;
            selectedObject.set({
                radius: radius / selectedObject.scaleX,
                scaleX: 1,
                scaleY: 1
            });
            canvas.renderAll();
        }
    }

    return (
        <div>
            { selectedObject && selectedObject.type === 'rect' && (
                <div className="p-4 shadow-md rounded">
                    <label htmlFor="width">Largeur</label>
                    <Input placeholder="Largeur" id="width" value={width} onChange={handleWidthChange} ></Input>

                    <label htmlFor="height">Hauteur</label>
                    <Input placeholder="Hauteur" id="height" value={height} onChange={handleHeightChange} ></Input>

                    <label htmlFor="color">Couleur</label>
                    <Input placeholder="Couleur" id="color" value={color} onChange={handleColorChange} ></Input>
                </div>
                            
            )}

            { selectedObject && selectedObject.type === 'circle' && (
                <div className="p-4 shadow-md rounded">
                    <label htmlFor="diameter">Diamètre</label>
                    <Input placeholder="Diamètre" id="diameter" value={diameter} onChange={handleDiameterChange} ></Input>

                    <label htmlFor="color">Couleur</label>
                    <Input placeholder="Couleur" id="color" value={color} onChange={handleColorChange} ></Input>
                </div>
            )}

            { selectedObject && selectedObject.type === 'triangle' && (
                <div className="p-4 shadow-md rounded">
                    <label htmlFor="width">Largeur</label>
                    <Input placeholder="Largeur" id="width" value={width} onChange={handleWidthChange} ></Input>

                    <label htmlFor="height">Hauteur</label>
                    <Input placeholder="Hauteur" id="height" value={height} onChange={handleHeightChange} ></Input>

                    <label htmlFor="color">Couleur</label>
                    <Input placeholder="Couleur" id="color" value={color} onChange={handleColorChange} ></Input>
                </div>
            )}
        </div>
    )
}

export default Settings;