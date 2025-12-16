export type Permission = {
    id: number;
    name: string;
    code_name:string;
    tenantId: string;
}

export interface PermissionProps {
    permission: Permission
}
export interface Permissions {
    permissions: Permission[]
}

export type AddPermissionProps = {
    name:string;
    code_name:string
}