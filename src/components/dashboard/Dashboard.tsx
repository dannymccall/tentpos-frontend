
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,

} from "recharts";

import { formatCurrency, formatDate } from "@/lib/helperFunctions";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";

/** -------------------------
 * MOCK DATA FOR TENTPOS
 * ------------------------- */







const COLORS = ["#6366F1", "#10B981", "#8B5CF6"];

/** -------------------------
 * COMPONENT
 * ------------------------- */

export default function TentPOSDashboard() {



   const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/dashboard`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  console.log(data)
  if(!data) return
  const KPIS = [
  {
    title: "Total Sales Today",
    value: formatCurrency(data.todaySales),
    delta: "+14%",
    color: "#6366F1",
  },
  {
    title: "Total Revenue",
    value: formatCurrency(Number(data.totalRevenue.totalRevenue)),
    delta: "+9%",
    color: "#10B981",
  },
  {
    title: "Total Profit",
    value: formatCurrency(Number(data.totalProfit.totalProfit)),
    delta: "+4",
    color: "#8B5CF6",
  },
  {
    title: "Items Low in Stock",
    value: data.outOfStockCount,
    delta: "-2",
    color: "#EF4444",
  },
  {
    title: "Total Return Amount",
    value: formatCurrency(data.totalReturnAmount),
    delta: "+1",
    color: "#f59e0b",
  },
  {
    title: "Total Products",
    value: data.totalProducts,
    delta: "+6",
    color: "#7C3AED",
  },
  {
    title: "Total Sales",
    value:formatCurrency( data.totalSales),
    delta: "+6",
    color: "#7C3AED",
  },
  {
    title: "Total Debt",
    value:formatCurrency( data.totalDebt),
    delta: "+6",
    color: "#7C3AED",
  },
  {
    title: "Expected Revenue",
    value:formatCurrency( data.expectedRevenue.expectedRevenue),
    delta: "+6",
    color: "#7C3AED",
  },
];

if(isLoading) return <SpinnerCustom />
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Search bar + refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div></div>

        {/* <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Search sales, products, cashiers..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full md:w-80"
          />

          <Button variant="outline">
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div> */}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map((kpi, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">{kpi.title}</div>
                <div className="text-xl font-bold mt-1">
                  {(kpi.value)}
                </div>
              </div>
              <span className="text-xs text-green-600">{kpi.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={data.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.paymentTypeStats}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label
                  >
                    {data.paymentTypeStats.map((_:any, idx:any) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent sales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentSales.map((s:any, i:any) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {s.customer ? s.customer.firstName.slice(0, 1):"Walk-In Customer".slice(0,1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{s.customer ? `${s.customer.firstName} ${s.customer.lastName}`: "Walk-In Customer"}</div>
                      <div className="text-xs text-muted-foreground">
                        Cashier: {s.userSale.fullName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(s.amountPaid)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(s.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.outOfStock.map((item:any, i:number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md bg-red-50"
                >
                  <div>{item.product.title}</div>
                  <div className="font-bold text-red-600">{item.inventory} left</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
