import Table from "@/components/Table";
import type { BranchesProps } from "../../../types/branch.type";
import type { Branch as BranchProps } from "../../../types/branch.type";

import Branch from "./Branch";
interface BranchesListProps extends BranchesProps {
  selectedBranch: BranchProps;
  onView: (branch: BranchProps) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete";
  onEdit: (branch: BranchProps) => void;
  onDelete: (branch: BranchProps) => void;
  onHandleDelete: () => void;
  onSuccess: () => void;
}
const BranchesList = ({
  branches,
  onClose,
  onView,
  isOpen,
  mode,
  onDelete,
  onEdit,
  onSuccess,
  onHandleDelete,
  selectedBranch,
}: BranchesListProps) => {
  const rows = [
    { id: 1, title: "Name" },
    { id: 2, title: "Code" },
    { id: 3, title: "Address" },
    { id: 4, title: "City" },
    { id: 5, title: "Region" },
    { id: 6, title: "Phone" },
    { id: 7, title: "Email" },
    { id: 8, title: "Actions" },
  ];
  return (
    <Table rows={rows}>
      {branches.map((branch) => (
        <Branch
          branch={branch}
          onClose={onClose}
          onView={onView}
          isOpen={isOpen}
          onDelete={onDelete}
          onEdit={onEdit}
          mode={mode}
          selectedBranch={selectedBranch}
          onSuccess={onSuccess}
          onHandleDelete={onHandleDelete}
          key={branch.id}
        />
      ))}
    </Table>
  );
};

export default BranchesList;
