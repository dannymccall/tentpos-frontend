import type { Branch } from "./branch.type";
import type { Role } from "./role.types";

export type UserRole = {
    id:number
    userId: number;
    roleId: number;
    role:Role
}
export type User = {
    id:number;
    fullName:string;
    branchId:number;
    tenantId:string;
    appRole: "owner" | "user";
    userId: number;
    branch?: Branch;
    userRole: UserRole;
    email:string
}

export interface UserProps {
    user: User;
}

export interface UsersProps {
    users: User[]
}
