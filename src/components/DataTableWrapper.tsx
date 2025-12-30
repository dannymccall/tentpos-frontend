import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import Pagination from "./Pagination";
import NoDataFound from "./NoDataFound";
import { SpinnerCustom } from "./loaders/Spinner";

interface ItemProps<T> {
  data: T[];
  handleOnSelect: (value: number) => void;
  children: React.ReactNode;
  loading: boolean;
  title: string;
  limit: number;
  onSearch: (query: string) => void;
  query: string;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  exportCSV: () => void;
  exportPDF: () => void;
}

const DataTableWrapper: React.FC<ItemProps<any>> = ({
  data,
  limit,
  query,
  onSearch,
  handleOnSelect,
  title,
  children,
  loading,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
  exportCSV,
  exportPDF,
}) => {
  const [search, setSearch] = useState(query);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ duration: 0.4 }}
        className="w-full px-4 md:px-8 h-screen"
      >
        <Card className="shadow-lg border border-slate-200 py-0 ">
          <CardHeader className="border-b bg-slate-900 rounded-md text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-6">
            {/* Title Section */}
            <div>
              <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
              <div className="text-sm text-slate-300 mt-1">
                Manage and review data efficiently
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              {/* Limit Selector */}
              <Select
                value={limit.toString()}
                onValueChange={(val) => handleOnSelect(Number(val))}
              >
                <SelectTrigger className="w-40 bg-slate-800 text-white border-slate-700">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-slate-800 text-white placeholder:text-slate-400 border-slate-700"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    onSearch(e.target.value);
                  }}
                />
              </div>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={exportCSV}>
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 mr-2" />{" "}
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportPDF}>
                    <FileText className="h-4 w-4 text-red-600 mr-2" /> Export
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="bg-white p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <SpinnerCustom
                 />
              </div>
            ) : data && data.length > 0 ? (
              <>
                {/* Table or Content */}
                <div className="overflow-x-auto">{children}</div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <NoDataFound onRefresh={onRefresh} />
                {/* <Button
                  variant="ghost"
                  className="mt-4 text-slate-600 hover:text-slate-900 flex items-center gap-2"
                  onClick={onRefresh}
                >
                  <RefreshCcw className="w-4 h-4" /> Refresh
                </Button> */}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataTableWrapper;
