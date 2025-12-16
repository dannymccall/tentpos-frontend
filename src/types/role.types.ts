type Permission = {
  code_name: string;
  name: string;
  category: string;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  permissions:  Permission[];
};

export interface RoleProps {
  role: Role;
  permissionCount: number;
}

export interface RolesProps {
  roles: Role[];
}

export type UserRole = {
    id:number;
   userId: number;
   roleId: number;
   role: Role
}
