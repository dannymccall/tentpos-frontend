import React from "react";
import type { Branch, BranchProps } from "../../../types/branch.type";
import { TableActions } from "../../TableActions";
import BranchModal from "../BranchModal";
interface IBranch extends BranchProps {
  selectedBranch: Branch;
  onView: (branch: Branch) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete";
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onHandleDelete: () => void;
  onSuccess: () => void;
}
const BranchRow = ({
  branch,
  mode,
  isOpen,
  onEdit,
  onDelete,
  onClose,
  onSuccess,
  selectedBranch,
  onView,
}: IBranch) => {
  return (
    <>
      <BranchModal
        mode={mode}
        isOpen={isOpen}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        onSuccess={onSuccess}
        branch={selectedBranch}
      />
      <tr className=" border-b-gray-300">
        <td className="p-1 border border-gray-300">{branch.name}</td>
        <td className="p-1 border border-gray-300">{branch.code}</td>
        <td className="p-1 border border-gray-300">{branch.address}</td>
        <td className="p-1 border border-gray-300">{branch.city}</td>
        <td className="p-1 border border-gray-300">{branch.region}</td>
        <td className="p-1 border border-gray-300">{branch.phone}</td>
        <td className="p-1 border border-gray-300">{branch.email}</td>
        <td className="p-1 border border-gray-300">
          <TableActions
            showView
            showEdit
            showDelete
            onView={() => onView(branch)}
            onEdit={() => onEdit(branch)}
            onDelete={() => onDelete(branch)}
          />
        </td>
      </tr>
    </>
  );
};

export default BranchRow;
