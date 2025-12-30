import {  FaFileInvoiceDollar, FaPlus } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import Tabs from "@/components/Tabs";
import { Unauthorized } from "@/components/Unauthorzed";
import QuickSale from "./QuickSale";
import AddSale from "./AddSale";
import AllSales from "./AllSales";





const Sales = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "sales";
  const navigate = useNavigate();
  query = params.get("query")!;

    const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "sales.view");
  
  console.log({isAllowed})
   if(!isAllowed) return <Unauthorized />

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/sales?query=${key}`);
      }}
    
      tabs={[
        {
          key: "sales",
          label: "All Sales",
          icon: <FaFileInvoiceDollar className="text-[#8a76f9]" />,
          panel:<AllSales />,
          code: "sales.view"
        },
        {
          key: "new_sale",
          label: "Add Sale",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddSale/>,
          code: "sales.create"
        },
        {
          key: "quick_sale",
          label: "Quick Sale",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <QuickSale />,
          code: "sales.create"
        },
      
      ]}
    />
  );
};

export default Sales;
