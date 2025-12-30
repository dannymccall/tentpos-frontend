import  { useState } from "react";
import {
  CalendarIcon,
  Filter,
  Store,
  Boxes,
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
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useFetchCategories } from "@/hooks/useFetchCatgories";
import api from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

// import RenderInventoryReport from "./components/RenderInventoryReport";
import FormLoading from "../loaders/FormLoading";
import { FaTags } from "react-icons/fa";
import RenderInventoryReport from "./components/RenderInventoryReport";

export default function InventoryReportDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [branch, setBranch] = useState<number>();
  const [product, setProduct] = useState<number>();
  const [movementType, setMovementType] = useState<string>("SUMMARY");
  const [data, setData] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const [category, setCategory] = useState<number>()
  const { branches } = useFetchBranches();
  const { products } = useFetchProducts();
  const {categories} = useFetchCategories()
  const { showToast } = useNotification();

  const dateFormat = (date?: Date | null) =>
    date ? date.toISOString().split("T")[0] : null;

  const onSubmit = async () => {
    setPending(true);
    try {
      const payload = {
        startDate: dateFormat(dateRange?.from),
        endDate: dateFormat(dateRange?.to),
        branchId: branch,
        productId: product,
        status: movementType,
        categoryId: category
      };

      const res = await api.post("/api/reports/inventory", payload);

      if (!res.data) {
        showToast("No inventory data found for this filter", "warning");
        setPending(false);
        return;
      }

      setData(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load inventory report", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-slate-50/50 min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory Report
          </h1>
          <p className="text-sm text-muted-foreground">
            Track stock levels, movements, and valuation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
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
                {dateRange
                  ? `${formatDate(dateRange.from!)} - ${formatDate(
                      dateRange.to!
                    )}`
                  : "Pick a date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Branch */}
          <Select onValueChange={(v) => setBranch(Number(v))}>
            <SelectTrigger className="w-40">
              <Store className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Product */}
          <Select onValueChange={(v) => setProduct(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <Boxes className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setCategory(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <FaTags className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Report Type */}
          <Select
            defaultValue="SUMMARY"
            onValueChange={(v) => {
              setMovementType(v);
              setData(null);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <Activity className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUMMARY">Stock Summary</SelectItem>
              <SelectItem value="ADJUSTMENT">Stock Adjustments</SelectItem>
              <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
              <SelectItem value="VALUATION">Inventory Valuation</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onSubmit} disabled={pending}>
            {pending ? <FormLoading /> : "Generate"}
          </Button>
        </div>
      </div>

      {/* DATA AREA */}
      <div className="grid gap-6">
        <Card className="min-h-[400px] flex border-dashed">
          {data ? (
            <RenderInventoryReport
              data={data}
              status={movementType}
            />
          ) : (
            <div className="m-auto text-center">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Ready to generate inventory report
              </h3>
              <p className="text-sm text-muted-foreground">
                Select filters above to view inventory data.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
