import Tabs from "../Tabs";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";

import AllInvoices from "./AllInvoices";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";

const Invoices: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
    let query = "invoices";
    const navigate = useNavigate();
    query = params.get("query")!;
  
      const {permissions, businessProfile} = useAuth();
     
    const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "inventory.products.view");
    

  return (
    
    <Tabs
      defaultTab="invoices"
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });

        navigate(`/sales/invoices?query=${key}`)
      }}
      tabs={[
        {
          key: "invoices",
          label: "Invoices",
          icon: <FaTruckLoading className="text-[#0f172b]" />,
          panel: <AllInvoices />,
          code: "inventory.categories.view",
        },
      ]}
    />
  );
};

export default Invoices;
