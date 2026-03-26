import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { formatDate } from "@/lib/helperFunctions";
import { Calendar } from "../ui/calendar";
import FormLoading from "../loaders/FormLoading";
import type { DateRange } from "react-day-picker";
import { useNotification } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Card } from "../ui/card";
import PurchasesReportTable from "./components/PurchasesReport";

const PurchaseReport = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from:  undefined,
    to: undefined,
  });
  const [pending, setPending] = useState<boolean>(false);

  const { showToast } = useNotification();
  const [data, setData] = useState<any>();

  const dateFormat = (date?: Date | null) =>
    date ? date.toISOString().split("T")[0] : null;
  const onSubmit = async () => {
    // console.log(dateRange, status);
    try {
      const payLoad = {
        startDate: dateFormat(dateRange?.from),
        endDate: dateFormat(dateRange?.to),
      };

      // console.log(payLoad);

      const res = await api.post("/api/reports/purchases", payLoad);
      // console.log(res.data);
      //   if (status === "error") {
      //     showToast(res.message, "error");
      //     setPending(false);
      //     return;
      //   }
      // console.log(res);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 border shadow-sm">
        <div>
         
          <p className="text-sm text-muted-foreground">
            Monitor your purchases
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "md:w-40 w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {(dateRange?.from || dateRange?.to) ? (
                  `${formatDate(dateRange.from!)} - ${formatDate(dateRange.to!)}`
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

          <div className="flex gap-2">
            <Button
              variant="default"
              className=""
              onClick={onSubmit}
              disabled={pending}
            >
              {pending ? <FormLoading /> : "Generate"}
            </Button>
            {/* <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button> */}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-1 w-full overflow-x-auto">
        <Card className="min-h-[400px] flex  border-dashed">
          {data && (data.length > 0 || Object.keys(data).length > 0) ? (
            <div className="m-5">
              {/* <RenderReport data={data} status={status} /> */}
              <PurchasesReportTable data={data} />
            </div>
          ) : (
            <div className="text-center mx-auto">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Ready to filter</h3>
              <p className="text-sm text-muted-foreground">
                Adjust the filters above to update the purchases data view.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PurchaseReport;
