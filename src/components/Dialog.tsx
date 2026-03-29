import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  actionChildren?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  size?: string;
}

const DialogModal: React.FC<DialogProps> = ({
  title,
  children,
  actionChildren,
  open,
  setOpen,
  size = "sm:max-w-sm",
}) => {
  return (
    <div className="max-w-sm w-full ">

    <Dialog open={open} onOpenChange={setOpen}>
      {actionChildren && <DialogTrigger asChild>{actionChildren}</DialogTrigger>}

      <DialogContent className={`w-full ${size} px-4 text-sm md:text-base`}>
        {title && <DialogHeader>{title}</DialogHeader>}
        {children}
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default DialogModal;