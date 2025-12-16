export type Notification = {
     id: number;
   userId?: number; // optional, staff or client
   text: string;
   read: boolean;
   tenantId: string;
   branchId: number;
   title: string;
   type: string;
   payload: Object | null;
   roleId: number;
   createdAt?:Date;
   updatedAt?:Date;
}