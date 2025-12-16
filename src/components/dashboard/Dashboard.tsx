
import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  BarChart,
  Bar,
} from "recharts";

import { FiRefreshCw } from "react-icons/fi";
import { formatCurrency } from "@/lib/helperFunctions";

/** -------------------------
 * MOCK DATA FOR TENTPOS
 * ------------------------- */

const KPIS = [
  {
    title: "Total Sales Today",
    value: 12500,
    delta: "+14%",
    color: "#6366F1",
  },
  {
    title: "Monthly Revenue",
    value: 312000,
    delta: "+9%",
    color: "#10B981",
  },
  {
    title: "Transactions Today",
    value: 89,
    delta: "+4",
    color: "#8B5CF6",
  },
  {
    title: "Items Low in Stock",
    value: 12,
    delta: "-2",
    color: "#EF4444",
  },
  {
    title: "Active Cashiers",
    value: 4,
    delta: "+1",
    color: "#f59e0b",
  },
  {
    title: "Total Products",
    value: 842,
    delta: "+6",
    color: "#7C3AED",
  },
];

const MONTHLY_SALES = [
  { month: "Jan", sales: 24000, transactions: 540 },
  { month: "Feb", sales: 21000, transactions: 490 },
  { month: "Mar", sales: 32000, transactions: 680 },
  { month: "Apr", sales: 28000, transactions: 610 },
  { month: "May", sales: 36000, transactions: 720 },
  { month: "Jun", sales: 41000, transactions: 790 },
];

const PAYMENT_METHODS = [
  { name: "Cash", value: 45 },
  { name: "Mobile Money", value: 35 },
  { name: "Card", value: 20 },
];

const RECENT_SALES = [
  { id: "S-001", product: "Rice 5kg", amount: 80, cashier: "John", date: "2025-11-20" },
  { id: "S-002", product: "Milk 1L", amount: 15, cashier: "Sandra", date: "2025-11-20" },
  { id: "S-003", product: "Sugar 2kg", amount: 28, cashier: "Daniel", date: "2025-11-19" },
  { id: "S-004", product: "Oil 1L", amount: 22, cashier: "Angela", date: "2025-11-19" },
];

const LOW_STOCK = [
  { name: "Indomie Pack", qty: 3 },
  { name: "Milk Powder", qty: 5 },
  { name: "Battery AAA", qty: 4 },
  { name: "Body Lotion", qty: 2 },
];

const COLORS = ["#6366F1", "#10B981", "#8B5CF6"];

/** -------------------------
 * COMPONENT
 * ------------------------- */

export default function TentPOSDashboard() {
  const [q, setQ] = useState("");

  const filteredSales = useMemo(() => {
    if (!q) return RECENT_SALES;
    return RECENT_SALES.filter(
      (s) =>
        s.product.toLowerCase().includes(q.toLowerCase()) ||
        s.cashier.toLowerCase().includes(q.toLowerCase()) ||
        s.id.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Search bar + refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div></div>

        <div className="flex items-center gap-3 w-full md:w-auto">
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
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map((kpi, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">{kpi.title}</div>
                <div className="text-xl font-bold mt-1">
                  {formatCurrency(kpi.value)}
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
                <LineChart data={MONTHLY_SALES}>
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
                    data={PAYMENT_METHODS}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label
                  >
                    {PAYMENT_METHODS.map((entry, idx) => (
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
              {filteredSales.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {s.product.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{s.product}</div>
                      <div className="text-xs text-muted-foreground">
                        Cashier: {s.cashier}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(s.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.date}
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
              {LOW_STOCK.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md bg-red-50"
                >
                  <div>{item.name}</div>
                  <div className="font-bold text-red-600">{item.qty} left</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
