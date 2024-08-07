"use client";

import { FastAverageColor } from "fast-average-color";
import { useEffect, useState } from "react";
import { Card } from "@/ui/DesignKit/Card";

const fac = new FastAverageColor();


export const ColorCards = ({ children, imageUrl, className }: { children: React.ReactNode, imageUrl: string, className?: string }) => {
    const [bgColor, setBgColor] = useState("#000000");

    useEffect(() => {
        fac.getColorAsync(imageUrl, { algorithm: 'dominant' }).then(color => setBgColor(color.hex)).catch(err => console.error(err));
    }, [imageUrl]);


    return (
        <Card
            style={{
                backgroundColor: bgColor,
                transition: 'all 0.3s ease',

            }}
            className={`w-full h-full  overflow-hidden border-none shadow-[inset_0_-200px_300px_-25px_rgb(38,38,38,0.7)] hover:shadow-[inset_0_-50px_300px_-25px_rgb(38,38,38,0.7)] no-select ${className}`}
        >
            {children}
        </Card >
    )
}
