import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";

interface InventoryBreakdownProps {
  inventory: number;
  branch: {
    name: string;
  };
}
const InventoryBreakdown = ({}) => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");

  const { data, isLoading } = useQuery({
    queryKey: ["get-product", productId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/products/inventory-breakdown?id=${productId}`
      );
      console.log(res.data.collaterals);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  console.log(data);
  if (isLoading) return <SpinnerCustom />;
  if (data.length === 0) return null;

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Inventory Breakdown</CardTitle>
        <div className="rounded-md border">

        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Branch</TableHead>
              <TableHead className="font-semibold text-right">
                Inventory
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 && data.map((i:InventoryBreakdownProps, idx:number) => (
              <TableRow key={idx}>
                <TableCell>{i.branch.name}</TableCell>
                <TableCell className="text-right">{i.inventory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardHeader>
    </Card>
  );
};

export default InventoryBreakdown;
