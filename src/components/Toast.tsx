import { useNotification } from "../context/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareMore } from "lucide-react";
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi";
import { getResponseMessageBgColor, getStatusColor } from "@/lib/helperFunctions";
const getIcon = (type: string) => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "success":
      return <HiCheckCircle className={`${iconClass} text-gray-100`} />;
    case "error":
      return <HiXCircle className={`${iconClass} text-gray-100`} />;
    case "warning":
      return <HiExclamationCircle className={`${iconClass} text-gray-100`} />;
    case "message":
      return <MessageSquareMore className={`${iconClass} text-gray-100`} />;
    case "info":
    default:
      return <HiInformationCircle className={`${iconClass} text-gray-100`} />;
  }
};

export default function ToastContainer() {
  const { toasts } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-9999 space-y-2">
      <AnimatePresence initial={false}>
        {toasts.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start  gap-3 ${getResponseMessageBgColor(
              type as any
            )} border border-gray-200 shadow-lg rounded-lg px-4 py-3 w-[280px]`}
          >
            {getIcon(type)}
            <p className={`text-sm ${getStatusColor(type as any)}`}>{message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
