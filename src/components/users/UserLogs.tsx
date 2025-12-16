"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Pagination from "../Pagination";
import {
  FilePlus2,
  Edit3,
  Trash2,
  Eye,
  Activity,
} from "lucide-react";

export interface UserLog {
  id: number;
  action: string;
  entity: string;
  entityId: number | string;
  timestamp: string;
}

interface UserLogsProps {
  logs: UserLog[];
  pageSize?: number;
}

export default function UserLogs({ logs, pageSize = 10 }: UserLogsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(logs.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getActionIcon = (action: string) => {
    const normalized = action.toLowerCase();
    if (normalized.includes("create") || normalized.includes("add"))
      return <FilePlus2 className="text-green-500" size={18} />;
    if (normalized.includes("update") || normalized.includes("edit"))
      return <Edit3 className="text-blue-500" size={18} />;
    if (normalized.includes("delete") || normalized.includes("remove"))
      return <Trash2 className="text-red-500" size={18} />;
    if (normalized.includes("view") || normalized.includes("read"))
      return <Eye className="text-amber-500" size={18} />;
    return <Activity className="text-gray-400" size={18} />;
  };

  const getActionColor = (action: string) => {
    const normalized = action.toLowerCase();
    if (normalized.includes("create") || normalized.includes("add"))
      return "text-green-600 bg-green-50";
    if (normalized.includes("update") || normalized.includes("edit"))
      return "text-blue-600 bg-blue-50";
    if (normalized.includes("delete") || normalized.includes("remove"))
      return "text-red-600 bg-red-50";
    if (normalized.includes("view") || normalized.includes("read"))
      return "text-amber-600 bg-amber-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <Card className="w-full shadow-md rounded-2xl border border-gray-100 mt-10">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          User Activity Logs
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-100/80 text-gray-50">
                <TableHead className="font-semibold text-slate-50">ID</TableHead>
                <TableHead className="font-semibold text-slate-50">Action</TableHead>
                <TableHead className="font-semibold text-slate-50">Entity</TableHead>
                <TableHead className="font-semibold text-slate-50">Entity ID</TableHead>
                <TableHead className="font-semibold text-slate-50">Timestamp</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionIcon(log.action)}
                        <span className="capitalize">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{log.entity}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    No logs available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
