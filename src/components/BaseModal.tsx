import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional max width (e.g., 'max-w-lg', 'max-w-2xl') */
  maxWidth?: string;
  /** Optional title for header (can omit if you want custom header in children) */
  title?: string;
  /** Whether clicking the backdrop should close the modal */
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}

/**
 * A professional, reusable modal shell with animations, backdrop, and responsive layout.
 * Use it to wrap any custom modal content (delete dialogs, forms, confirmations, etc).
 */
const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  maxWidth = "max-w-md",
  title,
  closeOnBackdrop = true,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="base-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            key="modal-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl p-6 z-10`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-start justify-between mb-4 border-b border-b-gray-300">
                <h2 className="text-lg font-semibold text-gray-800 m-auto">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Body (Your custom content) */}
            <div className="text-gray-700">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;
