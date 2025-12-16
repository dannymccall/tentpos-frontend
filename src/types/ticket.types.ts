export type Ticket = {
    email: string;
    description: string;
    priority: "high" | "low" | "medium";
    category: "loans" | "savings";
    details: string;
    attachments: File[];
    errorMessage: string;
    time: string;
    subject: string
}