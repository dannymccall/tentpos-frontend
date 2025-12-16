import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { PermissionGate } from "./PermissionGate";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  disabled?: boolean;
  viewPermission?: string;
  editPermission?: string;
  deletePermission?: string;
  permissionMode?: "hide" | "disable"; // global mode
}

export const TableActions: React.FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  showView = false,
  showEdit = false,
  showDelete = false,
  disabled = false,
  viewPermission = "clients.view",
  editPermission = "clients.update",
  deletePermission = "clients.delete",
  permissionMode = "hide",
}) => {
  return (
    <div className="flex items-center gap-2 z-auto">
      {showView && (
        <PermissionGate code={viewPermission} mode={permissionMode}>
          <button
            onClick={onView}
            disabled={disabled}
            className="p-2 rounded-md cursor-pointer text-green-600 hover:bg-green-50 hover:text-green-800 disabled:opacity-50"
            title="View"
          >
            <FaEye size={15} />
          </button>
        </PermissionGate>
      )}

      {showEdit && (
        <PermissionGate code={editPermission} mode={permissionMode}>
          <button
            onClick={onEdit}
            disabled={disabled}
            className="p-2 rounded-md cursor-pointer text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
            title="Edit"
          >
            <FaEdit size={15} />
          </button>
        </PermissionGate>
      )}

      {showDelete && (
        <PermissionGate code={deletePermission} mode={permissionMode}>
          <button
            onClick={onDelete}
            disabled={disabled}
            className="p-2 rounded-md cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
            title="Delete"
          >
            <FaTrash size={15} />
          </button>
        </PermissionGate>
      )}
    </div>
  );
};
