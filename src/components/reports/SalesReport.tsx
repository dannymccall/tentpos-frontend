import React, { useState } from "react";
import {
  CalendarIcon,
  Filter,
  Store,
  User,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { formatDate } from "@/lib/helperFunctions";
import { useFetchBranches } from "@/hooks/useFetchBranches";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import api from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import RenderReport from "./components/RenderSalesReport";
import FormLoading from "../loaders/FormLoading";
export default function POSAdvancedDashboard() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [user, setUser] = React.useState<number>();
  const [branch, setBranch] = React.useState<number>();
  const { branches } = useFetchBranches();
  const { users } = useFetchUsers();
  const [status, setStatus] = useState<string>("all");
  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(false);

  const { showToast } = useNotification();

  const dateFormat = (date?: Date | null) =>
    date ? date.toISOString().split("T")[0] : null;
  const onSubmit = async () => {
    console.log(dateRange, user, branch, status);
    try {
      const payLoad = {
        startDate: dateFormat(dateRange?.from),
        endDate: dateFormat(dateRange?.to),
        userId: user,
        branchId: user,
        status: status,
      };

      console.log(payLoad)

      const res = await api.post("/api/reports/sales", payLoad);
      console.log(res.data);
      if (status === "error") {
        showToast(res.message, "error");
        setPending(false);
        return;
      }
      console.log(res);
      if (!res.data) {
        showToast("No report available for this filter");
        setPending(false);
        return;
      }
      setData(res.data);
      setPending(false);
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  };
  return (
    <div className="flex flex-col gap-6  bg-slate-50/50 min-h-screen">
      {/* HEADER & GLOBAL FILTERS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6  border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Report</h1>
          <p className="text-sm text-muted-foreground">
            Monitor performance across branches
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-60 justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange ? (
                  `${formatDate(dateRange.from!)} - ${formatDate(
                    dateRange.to!
                  )}`
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-lg border shadow-sm"
              />
            </PopoverContent>
          </Popover>

          {/* 2. Branch Filter */}
          <Select
            defaultValue="all"
            onValueChange={(e) => setBranch(Number(e))}
          >
            <SelectTrigger className="w-40">
              <Store className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem value={String(b.id)}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 3. User/Staff Filter */}
          <Select defaultValue="all" onValueChange={(e) => setUser(Number(e))}>
            <SelectTrigger className="w-40">
              <User className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {users.map((u) => (
                <SelectItem value={String(u.id)}>{u.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 4. Transaction Status Filter */}
          <Select defaultValue="all" onValueChange={(e) => {setData([]); setStatus(e)}}>
            <SelectTrigger className="w-40">
              <Activity className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RETURN">Refunded</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mobile">Momo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="default" className="" onClick={onSubmit} disabled={pending}>
              {pending ? <FormLoading />: "Generate"}
            </Button>
            {/* <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button> */}
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS based on filters */}
      {/* <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Gross Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Refunded Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$120.50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$9,840.00</div>
          </CardContent>
        </Card>
      </div> */}

      {/* DATA AREA - Placeholder for Charts/Tables */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="min-h-[400px] flex  border-dashed">
          {data && (data.length > 0 || Object.keys(data).length >0) ? (
            <div className="m-5">

              <RenderReport data={data} status={status} />
            </div>
          ) : (
            <div className="text-center mx-auto">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Ready to filter</h3>
              <p className="text-sm text-muted-foreground">
                Adjust the filters above to update the sales data view.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
