import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
interface DialogProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  actionChildren?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  size?: string
}
const DialogModal: React.FC<DialogProps> = ({
  title,
  children,
  actionChildren,
  open,
  setOpen,
  size = "sm:max-w-[600px]"
}) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{actionChildren && actionChildren}</DialogTrigger>

      <DialogContent className={`${size}`}>
        <DialogHeader>
          {title && title}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
