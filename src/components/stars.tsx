import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Stars({ className = "", note = 0, editable = true}: { className?: string, note?: number, editable?: boolean }) {
    const [rating, setRating] = useState(note > 0 ? note : 0);
    const [animatedStar, setAnimatedStar] = useState<number | null>(null);

    return (
        <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((value) => (
                <Sparkles
                    key={value}
                    className={`transition-transform duration-300 ${value <= rating ? "fill-yellow-500 text-yellow-500" : "text-yellow-500"} cursor-pointer ${className} ${animatedStar === value ? "scale-125" : ""}`}
                    onClick={() => {
                        if (!editable) return;
                        setRating(value);
                        setAnimatedStar(value);
                        setTimeout(() => setAnimatedStar(null), 300);
                    }}
                />
            ))}
        </div>
    );
}