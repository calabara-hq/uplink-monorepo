"use client";
import { useEffect, useRef, useState } from 'react';

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
            <div className={`relative h-full ${!isOpen && 'max-h-[30vh] overflow-hidden'}`} ref={textRef}>
                {children}
                {isOpen && (
                    <div className="flex items-end gap-2 justify-center w-full">
                        <button className="btn btn-ghost bg-base btn-sm normal-case shadow-black shadow-lg" onClick={() => setIsOpen(false)}>Show Less</button>
                    </div>
                )}
            </div>
            {!isOpen && isExpandVisible && (
                <div className="flex items-end gap-2 justify-center w-full h-24 absolute -bottom-2 left-0 bg-gradient-to-b from-[#12121200] to-[#121212]">
                    <button className="btn btn-ghost bg-base btn-sm normal-case shadow-black shadow-lg border border-border" onClick={() => setIsOpen(true)}>Show More</button>
                </div>
            )}
        </div>
    );
};


export default ExpandableTextSection;