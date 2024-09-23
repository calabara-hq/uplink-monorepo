import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Dialog, DialogContent } from "../DesignKit/Dialog";
import { cn } from "@/lib/shadcn";

export const Modal = ({
  isModalOpen,
  onClose,
  children,
  className,
}: {
  isModalOpen: boolean,
  onClose: () => void,
  children: React.ReactNode,
  className?: string,
}) => {
  const { connectModalOpen } = useConnectModal();

  const handleChange = (val: boolean) => {
    if (!val) {
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleChange} >
      <DialogContent className={cn(
        "max-w-[900px] bg-base-100 overflow-hidden",
        className
      )} onPointerDownOutside={(e) => {
        if (connectModalOpen) e.preventDefault();
      }}>
        {children}
      </DialogContent>
    </Dialog>
  )
}