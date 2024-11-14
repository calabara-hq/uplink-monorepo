"use client";
import { useState } from "react";
import { Modal } from "@/ui/Modal/Modal";

export const ExpandSection = ({
    data,
    label,
    children,
}: {
    data: any[];
    label: string;
    children: React.ReactNode;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div>
            {data.length > 3 && (
                <a
                    className="hover:underline text-blue-500 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    {label}
                </a>
            )}
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-full max-w-[500px]">
                {children}
            </Modal>
        </div>
    );
};
