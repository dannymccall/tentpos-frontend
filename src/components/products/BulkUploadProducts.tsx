import { useState } from "react";
import FormLoading from "../loaders/FormLoading";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useBulkUpload } from "../../hooks/useBulkUpload";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import type { BulkCategory } from "@/types/bulkupload.types";
import { bulkCategory, bulkUploadProducts } from "@/lib/essentials";
import Pagination from "../Pagination";
import type { BulkUploadProduct } from "@/types/bulkupload.types";

export default function BulkUploadProducts() {
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
  } = useBulkUpload<BulkUploadProduct>();

  const { mutate: bulkUpload, isPending } = useApiMutation({
    url: `/api/products/bulk-upload`,
    method: "POST",
    invalidateKey: "/api/categories/get-categories",
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
      >
        <div className="p-6 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">
            Bulk Upload Products (Excel)
          </h2>

          <div className="flex items-center gap-4 mb-4">
            {/* File Upload */}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />

            {/* Download Template */}
            <button
              onClick={() =>
                handleDownloadTemplate(bulkUploadProducts, "products-template.xlsx")
              }
              className="px-4 py-2 bg-[#1d3449] text-white text-[15px] rounded-md hover:bg-gray-700"
            >
              Download Template
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Preview Table */}
          {products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">
                Preview ({products.length} products)
              </h3>
              <div className="overflow-x-auto border border-gray-300 rounded-md shadow-md">
                <table className="min-w-full text-sm table table-sm">
                  <thead>
                    <tr className="text-gray-500 font-semibold bg-[#fafafa]">
                      <th className="p-2 border border-gray-300">Name</th>
                      <th className="p-2 border border-gray-300">
                        Price
                      </th>
                      <th className="p-2 border border-gray-300">
                        Description
                      </th>
                      <th className="p-2 border border-gray-300">
                        Cost
                      </th>
                      <th className="p-2 border border-gray-300">
                        Weight
                      </th>
                      <th className="p-2 border border-gray-300">
                        Bar Code
                      </th>
                      <th className="p-2 border border-gray-300">
                        SKU
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-300">
                          {c.title}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.price}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.description}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.cost}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.weight}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.barcode}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {c.sku}
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
