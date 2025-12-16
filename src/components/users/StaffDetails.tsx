"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import UserLogs, { type UserLog } from "./UserLogs";
import { formatCurrency } from "@/lib/helperFunctions";
import {
  Users,
  Briefcase,
  Building2,
  Coins,
  DollarSign,
  CheckCircle2,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";

export interface MonthlyData {
  month: string;
  loansApplied: number;
  recoveries: number;
}

export interface StaffDetailsProps {
  id: number;
  fullName: string;
  role: string;
  branch: { id: number; name: string };
  numberOfClientsRegistered: number;
  numberOfLoansApplied: number;
  recoveries: number;
  monthlyData: MonthlyData[];
  userLogs: UserLog[];
  numberOfClosedLoans: number;
  amountDisbursed: number;
}

export default function StaffDetails() {
  const params = new URLSearchParams(window.location.search);
  const staffId = params.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["staff-details", staffId],
    queryFn: async () => {
      const res = await api.get<{ data: StaffDetailsProps }>(
        `/api/users/staff-details?staffId=${staffId}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="text-gray-500 text-lg">Loading staff details...</span>
      </div>
    );
  }

  const staff = data;

  const metrics = [
    {
      title: "Full Name",
      value: staff.fullName,
      icon: Users,
      color: "text-sky-600",
    },
    { title: "Role", value: staff.role, icon: Briefcase, color: "text-purple-600" },
    {
      title: "Branch",
      value: staff.branch.name,
      icon: Building2,
      color: "text-amber-600",
    },
    {
      title: "Clients Registered",
      value: staff.numberOfClientsRegistered,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Loans Applied",
      value: staff.numberOfLoansApplied,
      icon: Coins,
      color: "text-green-600",
    },
    {
      title: "Loans Closed",
      value: staff.numberOfClosedLoans,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "Amount Disbursed",
      value: formatCurrency(Number(staff.amountDisbursed).toFixed(2) as any),
      icon: DollarSign,
      color: "text-indigo-600",
    },
    {
      title: "Recoveries",
      value: formatCurrency(Number(staff.recoveries).toFixed(2) as any),
      icon: PiggyBank,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* --- Staff Info Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="shadow-md hover:shadow-xl transition-shadow rounded-2xl border border-gray-100"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-gray-800">
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Monthly Loans vs Recoveries Chart --- */}
      <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-gray-800 text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Monthly Loans vs Recoveries
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={staff.monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 14 }} />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 6,
                  borderColor: "#e5e7eb",
                  padding: "10px",
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="totalDisbursed"
                fill="#22c55e"
                name="Loans Disbursed"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="totalRecoveries"
                fill="#3b82f6"
                name="Recoveries"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* --- User Activity Logs --- */}
      <UserLogs logs={staff.userLogs} />
    </div>
  );
}
