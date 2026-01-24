import { TableActions } from '@/components/TableActions';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, getSaleStatusColor } from '@/lib/helperFunctions';
import type { Sale } from '@/types/sale.types';
import { useNavigate } from 'react-router-dom';
const UserRecentSales = ({sales}: {sales: Sale[]}) => {
    const navigate = useNavigate()
  return (
     <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Sales #</TableHead>
            <TableHead className="font-semibold">Invoice #</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">Subtotal</TableHead>
            <TableHead className="font-semibold">Amount Paid</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Payment Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.saleNumber}</TableCell>
              <TableCell>{sale.invoice?.invoiceNumber}</TableCell>
              <TableCell>{formatDate((sale as any).createdAt)}</TableCell>
              <TableCell>
                {sale.customer
                  ? `${sale.customer?.firstName} ${sale.customer?.lastName}`
                  : "Walk-In Customer"}
              </TableCell>
              <TableCell>{sale.total}</TableCell>
              <TableCell>{sale.subtotal}</TableCell>
              <TableCell>{sale.amountPaid}</TableCell>
              <TableCell>{sale.balance}</TableCell>
              <TableCell>
                <Badge className={getSaleStatusColor(sale.status)}>
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getSaleStatusColor(sale.paymentStatus)}>
                  {sale.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end gap-1">
                  <TableActions
                    showView
                    onView={() =>
                      navigate(`/sales/sale-details?saleId=${sale.id}`)
                    }
                    viewPermission="sales.view"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}

export default UserRecentSales