import React from "react";
import type { User } from "../../../types/staff.type";
import UserRow from "./User";
import type { ActionProps } from "../../../types/types";

interface IUserList extends ActionProps<User> {
  users: User[];
  selectedUser:User
}
const UserList: React.FC<IUserList> = ({
selectedUser,
  users,
  onView,
  isOpen,
  onClose,
  mode,
  onEdit,
  onDelete,
  onHandleDelete,
  onSuccess
}) => {
  return (
   
      <table className="table w-full bg-white overflow-x-auto">
        <thead>
          <tr className="text-gray-500 font-semibold border-b-gray-300 bg-[#fafafa]">
            <td className="p-2 border border-gray-300">Full name</td>
            <td className="p-2 border border-gray-300">App role</td>
            <td className="p-2 border border-gray-300">Company role</td>
            <td className="p-2 border border-gray-300">Branch</td>
            <td className="p-2 border border-gray-300">Actions</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              user={user}
              key={user.id}
              isOpen={isOpen}
              onView={onView}
              mode={mode}
              onClose={onClose}
              onDelete={onDelete}
              onEdit={onEdit}
              onHandleDelete={onHandleDelete}
              onSuccess={onSuccess}
              selectedUser={selectedUser!}
            />
          ))}
        </tbody>
      </table>

  );
};

export default UserList;
