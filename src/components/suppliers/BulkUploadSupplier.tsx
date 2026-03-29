import { useState } from "react";
import FormLoading from "../loaders/FormLoading";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useBulkUpload } from "../../hooks/useBulkUpload";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import type { BulkUploadSupplier } from "@/types/bulkupload.types";
import {  bulkUploadSupplier } from "@/lib/essentials";
import Pagination from "../Pagination";
import ExcelUploadField from "../ExcelUploadField";

export default function BulkUploadSuppliers() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // use the reusable hook for bulk upload
  const {
    data: products,
    error,
    handleFileUpload,
    handleDownloadTemplate,
    handleSubmit,
    setData: setCategories, // exposed from hook
  } = useBulkUpload<BulkUploadSupplier>();

  const { mutate: bulkUpload, isPending } = useApiMutation({
    url: `/api/suppliers/bulk-upload`,
    method: "POST",
    invalidateKey: "/api/suppliers",
    onSuccessCallback: () => setCategories([]),
  });

  // Pagination
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedClients = products.slice(
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
        <div className="p-6 bg-white rounded-md ">


            <ExcelUploadField
            onFileUpload={handleFileUpload}
            onDownloadTemplate={() =>
              handleDownloadTemplate(bulkUploadSupplier, "suppliers-template.xlsx")
            }
          />

          {error && <p className="text-red-500">{error}</p>}

          {/* Preview Table */}
          {products.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold mb-2">
                Preview ({products.length} products)
              </h3>
              <div className="overflow-x-auto border border-gray-300 rounded-md shadow-md">
                <table className="min-w-full text-sm table table-sm">
                  <thead>
                    <tr className="text-gray-500 font-semibold bg-[#fafafa]">
                      <th className="p-2 border border-gray-300">Name</th>
                      <th className="p-2 border border-gray-300">
                        Email
                      </th>
                      <th className="p-2 border border-gray-300">
                        Phone
                      </th>
                      <th className="p-2 border border-gray-300">
                        Address
                      </th>
                      <th className="p-2 border border-gray-300">
                        Contact Person
                      </th>
                      <th className="p-2 border border-gray-300">
                        Notes
                      </th>
                      <th className="p-2 border border-gray-300">
                        Opening Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-300">
                          {c.name}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.email}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.phone}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.address}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.contactPerson}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.notes}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.openingBalance}
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
