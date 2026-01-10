import type { TicketMessage as TicketMessageProps } from "@/types/ticket.types";

const TicketMessage = ({ message }: { message: TicketMessageProps }) => {
  const isUser = message.senderType === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      {/* Message bubble */}
      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 text-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        <p className="break-words">{message.message}</p>
        <span className="block mt-1 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Attachments below bubble */}
      {message.messageAttachments && message.messageAttachments.length > 0 && (
        <div className={`mt-2 flex flex-col space-y-2 ${isUser ? "items-end" : "items-start"}`}>
          {message.messageAttachments.map((a, idx) => (
            <img
              key={idx}
              src={a.fileUrl}
              className="rounded-md max-h-64 object-cover"
              alt="attachment"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketMessage;
