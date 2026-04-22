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

import {
  Users,
  Building2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";
import type { User } from "@/types/staff.type";
import type { Sale } from "@/types/sale.types";
import UserRecentSales from "./users_table/UserRecentSales";
import Pagination from "../Pagination";
import { useState } from "react";
import { SpinnerCustom } from "../loaders/Spinner";
import { MdSecurity } from "react-icons/md";
import { TbTransactionDollar } from "react-icons/tb";
import { FcSalesPerformance } from "react-icons/fc";
export interface MonthlyData {
  month: string;
  loansApplied: number;
  recoveries: number;
}

interface StatsProps {
  totalTransactions: number;
  totalSales: number;
  totalDiscount: number;
}

interface MonthlySales {
  month: string;
  totalDiscount: string;
  totalTransaction: number;
  totalSales: string;
}
export interface StaffDetailsProps {
  user: User;
  recentSales: Sale[];
  stats: StatsProps;
  monthlySales: MonthlySales[];
}

export default function UserDetails() {
  const params = new URLSearchParams(window.location.search);
  const staffId = params.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["staff-details", staffId],
    queryFn: async () => {
      const res = await api.get<{ data: StaffDetailsProps }>(
        `/api/users/user?staffId=${staffId}`,
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // console.log({ data });
  if(!data) return null

  const { user, recentSales, stats, monthlySales } = data!;
  const totalPages = Math.ceil(recentSales.length / 10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const paginatedSales = recentSales.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  const metrics = [
    {
      title: "Full Name",
      value: user.fullName,
      icon: Users,
      color: "text-sky-600",
    },
    {
      title: "Role",
      value: user.userRole?.role?.name,
      icon: MdSecurity,
      color: "text-purple-600",
    },
    {
      title: "Branch",
      value: user.branch?.name,
      icon: Building2,
      color: "text-amber-600",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: TbTransactionDollar,
      color: "text-blue-600",
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: FcSalesPerformance,
      color: "text-green-600",
    },
    {
      title: "Total Discounts",
      value: stats.totalDiscount,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  if (isLoading || !data) return <SpinnerCustom />;

  return (
    <div className="space-y-8 p-6">
      {/* --- Staff Info Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className=" hover:shadow-xl transition-shadow rounded-2xl border border-gray-100"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {metric.title}
                </CardTitle>
                <Icon className={`md:h-5 ms:w-5 h-4 w-4  ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base font-semibold text-gray-800">
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Monthly Loans vs Recoveries Chart --- */}
      <Card className=" hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-gray-800 text-sm md:text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Monthly Sales vs Transactions vs Discounts
          </CardTitle>
        </CardHeader>
        <CardContent className="md:h-96 h-[500px] ">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={monthlySales}
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
              <Legend verticalAlign="bottom" height={36} />
              <div></div>
              <Bar
                dataKey="totalSales"
                fill="#22c55e"
                name="Total Sales"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="totalDiscount"
                fill="#3b82f6"
                name="Total Discount"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="totalTransactions"
                fill="#3b82f6"
                name="Total Transactions"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* --- User Activity Logs --- */}
      {/* <UserLogs logs={staff.userLogs} /> */}

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800 text-sm md:text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Recent Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserRecentSales sales={paginatedSales} />
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
