"use client";
import { useEffect, useRef, useState } from 'react';
import { Button } from '../DesignKit/Button';

const ExpandableTextSection = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpandVisible, setIsExpandVisible] = useState(false);
    const textRef = useRef(null);

    const updateVisibility = () => {
        if (textRef.current) {
            setIsExpandVisible(textRef.current.scrollHeight > 230);
        }
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(updateVisibility);
        if (textRef.current) {
            resizeObserver.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                resizeObserver.unobserve(textRef.current);
            }
        };
    }, [textRef, children]);

    return (
        <div className="relative ">
            <div className={`relative h-full ${!isOpen && 'max-h-[50vh] overflow-hidden'}`} ref={textRef}>
                {children}
                {isOpen && (
                    <div className="flex items-end gap-2 justify-center w-full">
                        <Button variant="outline" className="bg-base shadow-black shadow-lg" size="sm" onClick={() => setIsOpen(false)}>Show Less</Button>
                    </div>
                )}
            </div>
            {!isOpen && isExpandVisible && (
                <div className="flex items-end gap-2 justify-center w-full h-24 absolute -bottom-2 left-0 bg-gradient-to-b from-[#12121200] to-[#121212]">
                    <Button variant="outline" className="bg-base shadow-black shadow-lg" size="sm" onClick={() => setIsOpen(true)}>Show More</Button>
                </div>
            )}
        </div>
    );
};


export default ExpandableTextSection;