import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";

export type KPIsInfo = {
  label: string;
  value: number;
  icon: React.ReactNode;
};
export interface KPIsProps {
  kpiData: KPIsInfo;
}
const KPIs: React.FC<KPIsProps> = ({ kpiData }) => {
  return (
    <Card>
      <InfoField
        label={kpiData.label}
        icon={kpiData.icon}
        value={kpiData.value}
      />
    </Card>
  );
};

export default KPIs;

type InfoFieldProps = {
  label: string;
  value: any;
  icon: React.ReactNode;
  className?: string
};

export const InfoField = ({ label, value, icon,  }: InfoFieldProps) => {
  return (
    <div className="p-2 px-5 flex">
        <span>{icon}</span>
      <CardContent className=" flex flex-col gap-3">
      <CardTitle className="text-sm">
        <span>{label}</span>
      </CardTitle>
        <div className="text-base md:text-lg font-medium">{value}</div>
      </CardContent>
    </div>
  );
};
