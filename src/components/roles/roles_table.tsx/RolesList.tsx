import Role from "./Role";
import type { Role as RoleProps } from "../../../types/role.types";
interface RoleListProps {
  roles: RoleProps[] | any[];
  selectedRole: RoleProps;
  onView: (selectRole: RoleProps) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete";
  onEdit: (role: RoleProps) => void;
  onDelete: (role: RoleProps) => void;
  onHandleDelete: () => void;
}
const RolesList = ({
  roles,
  selectedRole,
  onView,
  isOpen,
  onDelete,
  onEdit,
  mode,
  onClose,
  onHandleDelete,
}: RoleListProps) => {
  return (
   
      <table className="table w-full bg-white overflow-x-auto">
        <thead>
          <tr className="text-gray-500 font-semibold border-b-gray-300 bg-[#fafafa]">
            <th className="p-2 border border-gray-300">Role</th>
            <th className="p-2 border border-gray-300">Description</th>
            <th className="p-2 border border-gray-300">Permissions</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <Role
              role={role}
              key={role.id}
              permissionCount={role.permissions.length}
              selectedRole={selectedRole}
              onView={onView}
              isOpen={isOpen}
              onClose={onClose}
              mode={mode}
              onDelete={onDelete}
              onEdit={onEdit}
              onHandleDelete={onHandleDelete}
              onSuccess={onHandleDelete}
            />
          ))}
        </tbody>
      </table>
  
  );
};

export default RolesList;
