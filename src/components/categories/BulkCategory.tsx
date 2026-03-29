import { useState } from "react";
import FormLoading from "../loaders/FormLoading";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useBulkUpload } from "../../hooks/useBulkUpload";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import type { BulkCategory } from "@/types/bulkupload.types";
import { bulkCategory } from "@/lib/essentials";
import Pagination from "../Pagination";
import ExcelUploadField from "../ExcelUploadField";
export default function BulkUploadCategories() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // use the reusable hook for bulk upload
  const {
    data: categories,
    error,
    handleFileUpload,
    handleDownloadTemplate,
    handleSubmit,
    setData: setCategories, // exposed from hook
  } = useBulkUpload<BulkCategory>();

  const { mutate: bulkUpload, isPending } = useApiMutation({
    url: `/api/categories/bulk-upload`,
    method: "POST",
    invalidateKey: "/api/categories/get-categories",
    onSuccessCallback: () => setCategories([]),
  });

  // Pagination
  const totalPages = Math.ceil(categories.length / pageSize);
  const paginatedClients = categories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-2"
      >
        <div className="p-6 bg-white rounded-md">
           <ExcelUploadField
            onFileUpload={handleFileUpload}
            onDownloadTemplate={() =>
              handleDownloadTemplate(bulkCategory, "categories-template.xlsx")
            }
          />

          {error && <p className="text-red-500">{error}</p>}

          {/* Preview Table */}
          {categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">
                Preview ({categories.length} categories)
              </h3>
              <div className="overflow-x-auto border border-gray-300 rounded-md shadow-md">
                <table className="min-w-full text-sm table table-sm">
                  <thead>
                    <tr className="text-gray-500 font-semibold bg-[#fafafa]">
                      <th className="p-2 border border-gray-300">Name</th>
                      <th className="p-2 border border-gray-300">
                        Parent Category
                      </th>
                      <th className="p-2 border border-gray-300">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-300">{c.name}</td>
                        <td className="p-2 border border-gray-300">
                          {c.parentCategory}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-3 text-sm">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </div>

              {/* Upload Button */}
              <Button
                type="button"
                onClick={() => handleSubmit(bulkUpload)}
                disabled={isPending}
                className="disable:opacity-50 mt-7"
              >
                {isPending ? <FormLoading /> : "Upload All"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
