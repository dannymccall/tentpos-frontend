export type TicketMessage = {
    senderType: string;
    message: "string";
    id:number;
    createdAt: string;

       messageAttachments: TicketAttachments[]

}

export type TicketAttachments = {
    fileType: string,
    fileUrl: string
}
export type Ticket = {
    email: string;
    description: string;
    priority: "high" | "low" | "medium";
    category: "loans" | "savings";
    details: string;
    attachments: File[];
    errorMessage: {};
    time: string;
    subject: string;
    id: number;
    createdAt?: string;
    contactEmail: string;
    status: string;
    tenantId:string;
    branchId: number;
    ticketMessages: TicketMessage[]
     visibility: "public" | "internal";
   createdByType: "user" | "agent";
}