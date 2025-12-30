import { useState } from "react";
import { CalendarIcon, Store } from "lucide-react";
import type { DateRange } from "react-day-picker";

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
import { formatDate } from "@/lib/helperFunctions";
import { useFetchBranches } from "@/hooks/useFetchBranches";
import FormLoading from "@/components/loaders/FormLoading";

type Props = {
  title: string;
  description?: string;
  onGenerate: (payload: {
    startDate: string | null;
    endDate: string | null;
    branchId?: number | string;
  }) => void;
  loading?: boolean;
};

export default function AccountingReportFilter({
  title,
  description,
  onGenerate,
  loading,
}: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [branch, setBranch] = useState<number>();
  const { branches } = useFetchBranches();

  const dateFormat = (date?: Date | null) =>
    date ? date.toISOString().split("T")[0] : null;

  const handleGenerate = () => {
    onGenerate({
      startDate: dateFormat(dateRange?.from),
      endDate: dateFormat(dateRange?.to),
      branchId: branch || "all",
    });
  };

  return (
    <Card className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-none">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
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

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <FormLoading /> : "Generate"}
        </Button>
      </div>
    </Card>
  );
}
