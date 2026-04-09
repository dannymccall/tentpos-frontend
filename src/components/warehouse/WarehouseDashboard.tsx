import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import KPIs, { type KPIsInfo } from "./components/KPIs";
import { SpinnerCustom } from "../loaders/Spinner";
import {
  MdNoTransfer,
} from "react-icons/md";
import { FaBoxOpen, FaHouse, FaMoneyBill } from "react-icons/fa6";
import Warehouses from "./components/Warehouses";
import StockMovementButton from "./components/StockMovementButton";
import { useMemo, useState } from "react";
import WarehouseTransferModal from "./components/WarehouseTransferModal";
import WarehouseTransferHeader from "./components/WarehouseTransferHeader";
import type { WarehouseProducts } from "@/types/warehouse_products.types";
import { Loader2 } from "lucide-react";
import WarehouseTransferForm from "./components/WarehouseTransferForm";
import { Separator } from "@/components/ui/separator";
import { useApiMutation } from "@/hooks/useApiMutation";
import TransferTable from "./components/view_transfers/TransferList";
import { Button } from "../Button";
import WarehouseSummary from "./components/WarehouseSummary";
import { FaBus, FaThLarge, FaTruckLoading } from "react-icons/fa";
import InventoryBarChart from "./components/InventoryBarChat";
import { useNavigate } from "react-router-dom";
interface WarehouseSummaryProps extends KPIsInfo {
  className?: string;
}
const WarehouseDashboard = () => {
  const [movementType, setMovementType] = useState<
    "warehouse_to_warehouse" | "warehouse_to_branch"
  >("warehouse_to_branch");
  const [open, setOpen] = useState(false);
  const [fromWarehouseId, setFromWarehouseId] = useState<number | null>(null);
  const [toWarehouseId, setToWarehouseId] = useState<number | null>(null);
  const [toBranchId, setToBranchId] = useState<number | null>(null);

  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ["warehouse-dashboard"],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(`/api/warehousing/dashboard`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  const { data: warehouseProducts, isLoading: isWarehouseProductsLoading } =
    useQuery({
      queryKey: [
        "warehouse-products",
        fromWarehouseId,
        toWarehouseId,
        toBranchId,
      ],
      queryFn: async () => {
        const res = await api.get<{ data: any }>(
          `/api/warehouse-products/get-products?warehouseId=${fromWarehouseId}`,
        );
        return res.data;
      },
      refetchOnWindowFocus: false,
      enabled:
        fromWarehouseId !== null &&
        (toWarehouseId !== null || toBranchId !== null), // Only fetch when both IDs are selected
    });

  console.log({ warehouseProducts });

  const products = useMemo(() => {
    if (!warehouseProducts) return [];

    return warehouseProducts.map((wp: WarehouseProducts) => ({
      id: wp.Product.id,
      title: wp.Product.title,
      available: wp.quantity,
    }));
  }, [warehouseProducts]);

  console.log(products);

  const { mutate: transferProducts, isPending } = useApiMutation({
    url: "/api/warehousing/stock-transfer",
    method: "POST",
    invalidateKey: "warehouse-dashboard",
    onSuccessCallback: () => {
      setFromWarehouseId(null);
      setToBranchId(null);
      setToWarehouseId(null);
      setOpen(false);
    },
  });

  const onSubmitTransfer = (selectedProducts: Record<string, number>) => {
    console.log("Submitting transfer with products:", selectedProducts);
    transferProducts({
      fromWarehouseId,
      toWarehouseId,
      toBranchId,
      stock: selectedProducts,
      type: movementType,
    });
    // Here you would typically call an API to create the stock transfer
  };
  const onClickMovementType = (
    type: "warehouse_to_warehouse" | "warehouse_to_branch",
  ) => {
    setMovementType(type);
    setOpen(true);
    // You can also trigger any additional logic here based on the selected movement type
  };
  if (isLoading) return <SpinnerCustom />;
  if (!data) return null;
  const {
    warehouses,
    totalWarehouse,
    totalWarehouseProducts,
    warehouseStockValue,
    stockMovements,
    inStock,
    warehouseTransfers,
    intransit,
    clearedTransfers,
    aggregateDestinationInventory
  } = data;

  const kpiData: KPIsInfo[] = [
    {
      label: "Total Products",
      icon: (
        <FaThLarge className="text-amber-500 text-xl md:text-2xl" />
      ),
      value: totalWarehouseProducts,
    },
    {
      label: "Total Warehouses",
      icon: <FaHouse className="text-blue-600 text-xl md:text-2xl" />,
      value: `${totalWarehouse} ${totalWarehouse > 1 ? "Locations" : "Location"}`,
    },
    {
      label: "Warehouse Stock Value",
      icon: <FaMoneyBill className="text-emerald-500 text-xl md:text-2xl" />,
      value: `¢ ${warehouseStockValue[0].stockValue}`,
    },
    {
      label: "Stock Movements",
      icon: <MdNoTransfer className="text-blue-600 text-xl md:text-2xl" />,
      value: `${stockMovements} Transfers`,
    },
  ];

  const warehouseSummary: WarehouseSummaryProps[] = [
    {
      label: "Total Products",
      icon: <FaThLarge className="text-3xl" />,
      className: "bg-gray-700",
      value: totalWarehouseProducts, // count of unique SKUs
    },
    {
      label: "In Stock",
      icon: <FaBoxOpen className="text-3xl" />,
      className: "bg-emerald-500",
      value: inStock, // total units available
    },
    {
      label: "In Transit",
      icon: <FaBus className="text-3xl" />,
      className: "bg-blue-500",
      value: intransit, // units moving between warehouses/branches
    },
    {
      label: "Pending Transfers",
      icon: <FaTruckLoading className="text-3xl" />,
      className: "bg-yellow-500",
      value: clearedTransfers, // units not yet accepted at destination
    },
  ];
  return (
    <main className="p-2 md:p-7 relative flex flex-col gap-7 h-full">
      <WarehouseTransferModal
        open={open}
        onClose={() => {
          setFromWarehouseId(null);
          setToBranchId(null);
          setToWarehouseId(null);
          setOpen(false);
        }}
        type={movementType}
      >
        <WarehouseTransferHeader
          type={movementType}
          selectFromWarehouse={(id: number) => setFromWarehouseId(id)}
          selectToWarehouse={(id: number) => setToWarehouseId(id)}
          selectToBranch={(id: number) => setToBranchId(id)}
          fromWarehouseId={fromWarehouseId!}
          toWarehouseId={toWarehouseId}
          toBranchId={toBranchId}
        />

        {isWarehouseProductsLoading && (
          <Loader2 className="animate-spin w-4 h-4" />
        )}
        <Separator className="my-5" />
        {products && products.length > 0 && (
          <div className="border rounded-2xl p-4 bg-white shadow-sm">
            <WarehouseTransferForm
              products={products}
              onSubmitTransfer={onSubmitTransfer}
              pending={isPending}
            />
          </div>
        )}
      </WarehouseTransferModal>
      <StockMovementButton onClickMovementType={onClickMovementType} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((data, index) => (
          <div
            key={index}
            className="
        group
        relative
        transition-all duration-300
        hover:-translate-y-1
      "
          >
            {/* Glow / depth layer */}
            <div className="absolute inset-0 rounded-2xl bg-black/5 blur-xl opacity-0 group-hover:opacity-100 transition duration-300" />

            {/* Card wrapper */}
            <div
              className="
          relative
          h-full
          rounded-2xl
          border border-gray-200/60
          bg-white/80
          backdrop-blur-sm
          shadow-sm
          hover:shadow-xl
          transition-all duration-300
          overflow-hidden
        "
            >
              {/* subtle top accent */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition" />

              <KPIs kpiData={data} />
            </div>
          </div>
        ))}
      </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  {/* LEFT SIDE */}
  <div className="md:col-span-1 flex flex-col gap-6">
    
    {/* Warehouses */}
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-semibold mb-3 ml-5">Warehouses Overview</h2>
      <Warehouses warehouses={warehouses} showActions={false}/>
      <div className="flex justify-center mt-4">
        <Button size="sm" onClick={() => navigate("/warehousing/warehouses")}>View All</Button>
      </div>
    </div>

    {/* Recent Movements */}
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-semibold mb-3 ml-5">Recent Product Movements</h2>
      <TransferTable
        transfers={warehouseTransfers}
        visibleColumns={["date", "status", "destination", "source"]}
        rowLimit={5}
        showActions={false}
      />
      <div className="flex justify-center mt-4">
        <Button size="sm" onClick={() => navigate("/warehousing/transfers")}>View All</Button>
      </div>
    </div>

  </div>

  {/* RIGHT SIDE */}
  <div className="md:col-span-2 flex flex-col gap-6">
    
    {/* Stock Summary */}
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-semibold mb-4">Stock Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {warehouseSummary.map((w, i) => (
          <WarehouseSummary
            key={i}
            kpiData={w}
            className={w.className}
          />
        ))}
      </div>
    </div>

    {/* Inventory Chart */}
    <div className="bg-white rounded-xl shadow-sm p-4 h-[400px]">
      <h2 className="font-semibold mb-4">Inventory Distribution</h2>
      <InventoryBarChart data={aggregateDestinationInventory} />
    </div>

  </div>

</div>
    </main>
  );
};

export default WarehouseDashboard;
