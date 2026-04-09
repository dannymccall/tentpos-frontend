import React from "react";
import { InfoField, type KPIsProps } from "./KPIs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface WarehouseSummaryProps extends KPIsProps {
  className?: string;
}
const WarehouseSummary: React.FC<WarehouseSummaryProps> = ({
  kpiData,
  className,
}) => {
  return (
    <Card className={cn(className, "text-white max-h-[80%]")}>
      <InfoField
        label={kpiData.label}
        icon={kpiData.icon}
        value={kpiData.value}
      />
    </Card>
  );
};
export default WarehouseSummary;
