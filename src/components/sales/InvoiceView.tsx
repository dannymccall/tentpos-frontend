import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/helperFunctions";
import type { SaleItem } from "@/types/sale.types";
import { useState } from "react";
export default function InvoiceView({
  invoice,
  sale,
  tenant,
  onClose,
  onPay,
  onDownload,
  onPrint,
}: {
  invoice: any;
  sale: any;
  tenant: { name: string; logoUrl?: string };
  onClose: () => void;
  onPay: () => void;
  onDownload: () => void;
  onPrint: () => void;
}) {
  const { settings } = useAuth();
  if (!sale || !sale.saleItems.length) return;
  //   const item = sale.saleItems[0];
  const [print, setPrint] = useState(false);
  return (
    <div className="invoice-print-wrapper">
      <div className="invoice">
      <div className="p-6 max-w-xl mx-auto bg-white rounded-lg  border-gray-300 border-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex items-center gap-3 justify-center w-full">
            <h2 className="text-xl font-bold m-auto">
              {settings && settings.companyName && settings.companyName}
            </h2>
          </div>
        </div>

        {/* Invoice Title */}
        <h1 className="text-3xl font-bold text-center mb-4">Invoice</h1>

        {/* Invoice Details */}
        <div className="flex justify-between mb-4 gap-2">
          <div>
            <strong>#:</strong> {invoice.invoiceNumber}
          </div>
          <div>
            <strong>Status:</strong> {invoice.status}
          </div>
        </div>

        {/* Table */}
        <table className="w-full border border-gray-400 text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Total</th>
              {/* <th className="p-2 border">Subtotal</th> */}
            </tr>
          </thead>
          <tbody>
            {sale.saleItems.map((item: SaleItem) => (
              <tr key={item.productId}>
                <td className="p-2 border">{item.product.title || "-"}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">${Number(item.total).toFixed(2)}</td>
                {/* <td className="p-2 border">${sale.subtotal.toFixed(2)}</td> */}
              </tr>
            ))}

            <tr className="font-bold bg-gray-50">
              <td className="p-2 border text-right" colSpan={2}>
                Subtotal
              </td>
              <td className="p-2 border">
                ${Number(sale.subtotal).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <strong className="text-sm">
            Invoice Date: {formatDate(sale.date)}
          </strong>
        </div>
        {/* Action Row */}
        {!print && (
          <>
            <div className="flex justify-end mt-6">
              {/* <Button onClick={onDownload}>Download PDF</Button> */}

              <Button
                variant="outline"
                onClick={() => {
                  setPrint(true);

                  setTimeout(() => {
                    onPrint();
                    setPrint(false);
                  }, 0);
                }}
              >
                Print
              </Button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {/* <Button onClick={onPay}>Pay Now</Button> */}
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}
