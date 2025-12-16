import { useCallback } from "react";

interface UseExportCSVResult {
  exportCSV: (options: {
    headers: string[];
    data: any[];
    fileName?: string;
    mapRow?: (item: any) => (string | number)[];
  }) => void;
}

export function useExportCSV(): UseExportCSVResult {
  const exportCSV = useCallback(
    ({
      headers,
      data,
      fileName = "data.csv",
      mapRow,
    }: {
      headers: string[];
      data: any[];
      fileName?: string;
      mapRow?: (item: any) => (string | number)[];
    }) => {
      // Auto-map rows
      const rows = data.map((item) =>
        mapRow ? mapRow(item) : headers.map((h) => (item[h] ?? "").toString())
      );

      const csvContent = [
        headers.map((h) => `"${h}"`).join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  return { exportCSV };
}
