import { TableActions } from "../../TableActions";
import type { Role as RoleProps } from "../../../types/role.types";
import RoleModal from "./RoleModal";
import { useNavigate } from "react-router-dom";
interface IRole {
  role: RoleProps;
  permissionCount: number;
  selectedRole: RoleProps;
  onView: (selectRole: RoleProps) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete";
  onEdit: (role: RoleProps) => void;
  onDelete: (role: RoleProps) => void;
  onHandleDelete: () => void;
  onSuccess: () => void;
}

const Role = ({
  role,
  permissionCount,
  isOpen,
  onClose,
  selectedRole,
  mode,
  onEdit,
  onDelete,
  onHandleDelete,
  onSuccess
}: IRole) => {
  const navigate = useNavigate();
  return (
    <>
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        role={selectedRole}
        mode={mode}
        onDelete={onHandleDelete}
        onEdit={onEdit}
        onSuccess={onSuccess}
      />
      <tr className=" border-b-gray-300 hover:bg-gray-50">
        <td className="p-1 border border-gray-300">{role.name}</td>
        <td className="p-1 border border-gray-300">{role.description}</td>
        <td className="p-1 border border-gray-300">{permissionCount}</td>
        <td className="p-1 border border-gray-300">
          {" "}
          <TableActions
            showView
            showEdit
            showDelete
            onView={() => navigate(`/operations/roles/role-details?id=${role.id}`)}
            onEdit={() => navigate(`/operations/roles/role-details?id=${role.id}`)}
            onDelete={() => onDelete(role)}
          />
        </td>
      </tr>
    </>
  );
};

export default Role;
