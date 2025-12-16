import type {  UserRole } from "./role.types";

export type Branch = {
      id: number;
   name: string;
   code?: string;
   address?: string;
   city?: string;
   region?: string;
   phone?: string;
   email?: string;
   tenantId:string;
   createdAt?: Date;
   updatedAt?: Date;
}

export type BusinessProfile = {
    name:string;
    email:string;
    fullName:string;
    id:number;
    branch: Branch;
    userRole: UserRole;
    appRole: "owner" | "user"
}