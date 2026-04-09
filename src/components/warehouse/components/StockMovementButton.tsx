import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { FaWarehouse, FaExchangeAlt } from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface StockMovementButtonProps {
  // You can add props here if needed, e.g. onMoveStock: (type: string) => void;
  onClickMovementType: (
    type: "warehouse_to_warehouse" | "warehouse_to_branch",
  ) => void;
}
const StockMovementButton: React.FC<StockMovementButtonProps> = ({
  onClickMovementType,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 👉 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 👉 Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      {/* 🌫 BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-3"
      >
        {/* ACTION BUTTONS */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 mb-2"
            >
              {/* Warehouse → Warehouse */}
              <Tooltip label="Move stock between warehouses">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <Button
                    className="flex items-center gap-2 shadow-lg"
                    onClick={() => {
                      setOpen(false);
                      onClickMovementType("warehouse_to_warehouse");
                    }}
                  >
                    <FaWarehouse />
                    <FaExchangeAlt className="text-xs" />
                    <FaWarehouse />
                    <span className="ml-2">Warehouse → Warehouse</span>
                  </Button>
                </motion.div>
              </Tooltip>

              {/* Warehouse → Branch */}
              <Tooltip label="Move stock from warehouse to branch">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Button
                    className="flex items-center gap-2 shadow-lg"
                    onClick={() => {
                      setOpen(false);
                      onClickMovementType("warehouse_to_branch");
                    }}
                  >
                    <FaWarehouse />
                    <FaExchangeAlt className="text-xs" />
                    <FaCodeBranch />
                    <span className="ml-2">Warehouse → Branch</span>
                  </Button>
                </motion.div>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN BUTTON */}
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          <Button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-xl"
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaExchangeAlt />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default StockMovementButton;

// 🔥 SIMPLE TOOLTIP COMPONENT
export const Tooltip = ({
  children,
  label,
  className="w-fit"
}: {
  children: React.ReactNode;
  label: string;
  className?: string
}) => {
  return (
    <div className={cn(className, `relative group`)}>
      {children}

      <div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
        whitespace-nowrap rounded-md bg-black text-white text-xs px-2 py-1
        opacity-0 group-hover:opacity-100 transition pointer-events-none"
      >
        {label && label}
      </div>
    </div>
  );
};
