import * as React from "react";
import { motion } from "framer-motion";
import { Tabs as ShadTabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
export type TabItem = {
  key: string;
  label: string;
  panel: ReactNode;
  icon?: ReactNode;
  badge?: number | string;
  code?: string
};

type TabsProps = {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  className?: string;
  variant?: "underline" | "pill" | "segmented";
};

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = "",
  variant = "underline",
}: TabsProps) {
  const [active, setActive] = React.useState<string>(defaultTab ?? tabs[0]?.key);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const buttonsRef = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });
  const {businessProfile, permissions} = useAuth()


   const canView = (code: string) =>
    businessProfile?.appRole === "owner" ||
    code === "default" ||
    permissions.find((p) => p.code_name === code);


  const updateIndicator = React.useCallback(() => {
    const node = buttonsRef.current[active];
    if (node && listRef.current) {
      const rect = node.getBoundingClientRect();
      const parentRect = listRef.current.getBoundingClientRect();
      setIndicator({ left: rect.left - parentRect.left, width: rect.width });
    }
  }, [active]);

  React.useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active, updateIndicator]);

  React.useEffect(() => {
    if (onChange) onChange(active);
  }, [active]);

  const variantClasses = {
    underline: {
      trigger:
        "relative rounded-none px-5 py-3 text-sm font-medium transition-all data-[state=active]:text-indigo-700 data-[state=active]:bg-indigo-50 text-slate-600 hover:bg-slate-50",
      list: "border-b border-gray-200 bg-white",
    },
    pill: {
      trigger:
        "rounded-full px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-600 hover:bg-indigo-50",
      list: "bg-gray-50 p-2 rounded-full",
    },
    segmented: {
      trigger:
        "flex-1 text-center rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-600 hover:bg-slate-100",
      list: "bg-gray-100 p-1 rounded-lg flex w-full",
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <ShadTabs
        defaultValue={defaultTab ?? tabs[0]?.key}
        value={active}
        onValueChange={setActive}
        className="w-full"
      >
        {/* Tabs Header */}
        <div className="sticky top-16 z-20 bg-white">
          <TabsList
            ref={listRef}
            className={cn(
              "relative flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-8 py-2 min-h-[3.5rem]",
              variantClasses[variant].list
            )}
          >
            {tabs.map((tab) => (
              canView(tab.code!) && 
              <TabsTrigger
                key={tab.key}
                ref={(el: any) => (buttonsRef.current[tab.key] = el)}
                value={tab.key}
                className={cn("flex items-center gap-2", variantClasses[variant].trigger)}
              >
                {tab.icon && <span className="text-base">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-100 text-xs px-2 py-0.5 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}

            {/* Animated indicator (only for underline variant) */}
            {variant === "underline" && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                initial={false}
                style={{
                  left: indicator.left,
                  width: indicator.width,
                }}
                className="pointer-events-none absolute bottom-0 h-[2px] bg-indigo-500 rounded-full"
              />
            )}
          </TabsList>
        </div>

        {/* Tab Panels */}
        <div className="px-6 sm:px-10 py-8">
          {tabs.map((tab) => (
            canView(tab.code!) &&
            <TabsContent
              key={tab.key}
              value={tab.key}
              className="animate-fadeIn w-full"
            >
              {tab.panel}
            </TabsContent>
          ))}
        </div>
      </ShadTabs>
    </div>
  );
}
