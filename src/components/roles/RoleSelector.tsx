// components/RoleSelector.tsx
import React, { useState, useEffect } from "react";
import { useFetchRoles } from "../../hooks/useFetchRoles";
import { Button } from "../ui/button";
type Role = {
  id: number;
  name: string;
  description?: string;
};

type RoleSelectorProps = {
  initialRoleId?: number; // pre-selected role if user already has one
  onSelect: (roleId: number) => void; // callback when a role is selected
};

const RoleSelector: React.FC<RoleSelectorProps> = ({ initialRoleId, onSelect }) => {
  const { roles, loading, error } = useFetchRoles();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(initialRoleId ?? null);

  useEffect(() => {
    if (initialRoleId) setSelectedRoleId(initialRoleId);
  }, [initialRoleId]);

  const handleSelect = (roleId: number) => {
    console.log(roleId)
    setSelectedRoleId(roleId);
    onSelect(roleId);
  };

  if (loading) return <p className="text-sm text-gray-500">Loading roles...</p>;
  if (error) return <p className="text-sm text-red-500">Failed to load roles</p>;

  return (
    <div className="flex flex-wrap gap-2">

      {roles && roles.length > 0 ? roles.map((role: Role) => (
        <Button
          key={role.id}
          type="button"
          size={"sm"}
          onClick={() => handleSelect(role.id)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
            ${
              selectedRoleId === role.id
                ? "bg-[#1d3449] text-white"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }
          `}
        >
          {role.name}
        </Button>
      )): <h1>No Roles available</h1>}
    </div>
  );
};

export default RoleSelector;
