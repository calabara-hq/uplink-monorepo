"use client";
import { useSession } from "@/providers/SessionProvider";
import { Admin } from "@/types/space";

export const AdminWrapper = ({ admins, children }: { admins: Array<Admin>, children: React.ReactNode }) => {
    const { data: session, status } = useSession();

    if (status !== 'authenticated') return null;
    if (status === "authenticated" && session?.user?.address) {
        const isAdmin = admins.some((admin) => admin.address === session?.user?.address);
        if (isAdmin) return <>{children}</>;
        return null;
    }
};