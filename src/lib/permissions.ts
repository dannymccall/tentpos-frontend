import type { Permission } from "@/types/permissions.types";

export function hasPermission(permissions: Permission[], code:string): boolean{
    return permissions.some(p => p.code_name === code);
}