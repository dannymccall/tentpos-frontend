import { cn } from "@/lib/utils";
import { Button } from "../Button";
import { SiQuicktime } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiUsers } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import {   MdOutlineToday } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { HiOutlineDocumentReport, HiOutlineSwitchHorizontal } from "react-icons/hi";
import { FcSalesPerformance } from "react-icons/fc";

interface QuickButtonProps {
  icon: React.ReactNode;
  title: string;
  page: string;
  className: string;
}
const QuickButtons = () => {
  const navigator = useNavigate();
 const buttons: QuickButtonProps[] = [
  {
    icon: <FiPlusCircle className="text-2xl" />,
    title: "Add Customer",
    page: "/customers?query=add_customer",
    className: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
  },
  {
  icon: <FaBoxOpen className="text-2xl" />,
  title: "Products",
  page: "/inventory/products?query=products",
  className: "bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200",
},
  {
  icon: <HiOutlineSwitchHorizontal className="text-2xl" />,
  title: "Stock Transfers",
  page: "/warehousing/transfers",
  className: "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200",
},
  {
    icon: <HiOutlineDocumentReport className="text-2xl" />,
    title: "Sales Report",
    page: "/reports/sales",
    className: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
  },
  {
    icon: <FiUsers className="text-2xl" />,
    title: "Customers",
    page: "/customers?query=customers",
    className: "bg-indigo-100 border-indigo-300 text-indigo-800 hover:bg-indigo-200",
  },
  {
    icon: <RiMoneyDollarCircleLine className="text-2xl" />,
    title: "Debtors",
    page: "/customers/debtors?query=debtors",
    className: "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
  },
  {
    icon: <FcSalesPerformance className="text-2xl" />,
    title: "Quick Sale",
    page: "/sales?query=quick_sale",
    className: "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
  },
 {
  icon: <MdOutlineToday className="text-2xl" />,
  title: "Daily Summary",
  page: "/reports/daily",
  className: "bg-teal-100 border-teal-300 text-teal-800 hover:bg-teal-200",
}
];
  return (
    <div className="bg-white p-4 rounded-lg">
      <div>
        <h1 className="flex flex-row items-center gap-2 mb-5 text-sm md:text-base font-bold">
          <SiQuicktime className="bg-gray-100 text-2xl rounded-md text-blue-800  p-2 "/> Quick Buttons
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buttons.map((b, i) => (

          <Button
            key={i}
            className={cn(b.className, "flex flex-col h-32 gap-5 border active:scale-95 hover:scale-105")}
            onClick={() => navigator(b.page)}
          >
            {b.icon}
            {b.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickButtons;
