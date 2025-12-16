import React from "react";
import DialogModal from "../Dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DialogTitle } from "../ui/dialog";

interface InventoryUpdateProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  qty: string;
  setQty: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleUpdate: (qty: string) => void;
}
const InventoryUpdate: React.FC<InventoryUpdateProps> = ({
  open,
  setOpen,
  qty,
  setQty,
  handleUpdate,
}) => {
  return (
    <DialogModal
      open={open}
      setOpen={setOpen}
      title={<DialogTitle>Update Inventory</DialogTitle>}
    >
      <div>
        <Input
          onChange={(e) => setQty(e.target.value)}
          placeholder="Enter update quantity"
          className="mb-3"
        />
        <Button type="button" onClick={() => handleUpdate(qty)}>
          Update
        </Button>
      </div>
    </DialogModal>
  );
};

export default InventoryUpdate;
