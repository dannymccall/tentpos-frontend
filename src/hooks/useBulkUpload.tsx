import { useState } from "react";
import * as XLSX from "xlsx";

export function useBulkUpload<T>() {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        if (!bstr) return;

        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsed: T[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        setData(parsed);
      } catch (err) {
        console.error(err);
        setError("Error parsing Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Download Template
  const handleDownloadTemplate = (headers: Partial<T>, fileName: string = "template.xlsx") => {
    const ws = XLSX.utils.json_to_sheet([headers]);

    // Optional: format DOB if exists
    if ("dob" in headers) {
      const dobCell = ws["dob"];
      if (dobCell) {
        dobCell.t = "d";
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, fileName);
  };

  // Submit (pass your API call/mutation fn)
  const handleSubmit = async (uploadFn: (data: T[]) => any) => {
    try {
      if (data.length === 0) throw new Error("No data to upload");
      await uploadFn(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Bulk upload failed");
    }
  };

  return {
    data,
    error,
    setData,
    handleFileUpload,
    handleDownloadTemplate,
    handleSubmit,
  };
}
