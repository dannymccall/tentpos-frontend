import React from "react";
import type { User } from "../../../types/staff.type";
import { toCapitalized } from "../../../lib/helperFunctions";
import { TableActions } from "../../TableActions";
import type { ActionProps } from "../../../types/types";
import UserModal from "../UserModal";
import { useNavigate } from "react-router-dom";
interface IUser extends ActionProps<User> {
  user: User;
  selectedUser: User;
}
const UserRow: React.FC<IUser> = ({
  selectedUser,
  user,
  onView,
  onDelete,
  onEdit,
  onClose,
  onSuccess,
  mode,
  isOpen,
  onHandleDelete,
}) => {

  const navigate = useNavigate()
  return (
    <>
      <UserModal
        selectedUser={selectedUser}
        onView={onView}
        onClose={onClose}
        onDelete={onDelete}
        onSuccess={onSuccess}
        mode={mode}
        isOpen={isOpen}
        onEdit={onEdit}
        onHandleDelete={onHandleDelete}
      />
      <tr>
        <td className="p-1 border border-gray-300">{user.fullName}</td>
        <td className="p-1 border border-gray-300">
          {toCapitalized(user.appRole)}
        </td>
        <td className="p-1 border border-gray-300">
          {user.userRole ? user.userRole.role.name : "N/A"}
        </td>
        <td className="p-1 border border-gray-300">
          {user.branch?.name || "N/A"}
        </td>
        <td className="p-1 border border-gray-300">
          {" "}
          <TableActions
            showView
            showEdit
            // showDelete
            onView={() => navigate(`/operations/staff/staff-details?id=${user.id}`)}
            onEdit={() => onEdit(user)}
            // onDelete={() => onDelete(user)}
            permissionMode="disable"
          />
        </td>
      </tr>
    </>
  );
};

export default UserRow;
