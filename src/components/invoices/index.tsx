import Tabs from "../Tabs";
import { useNavigate } from "react-router-dom";

import AllInvoices from "./AllInvoices";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { Receipt } from "lucide-react";
import { Unauthorized } from "../Unauthorzed";

const Invoices: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
    let query = "invoices";
    const navigate = useNavigate();
    query = params.get("query")!;
  
      const {permissions, businessProfile} = useAuth();
     
    const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "inventory.products.view");
    if(!isAllowed) return <Unauthorized />

  return (
    
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });

        navigate(`/sales/invoices?query=${key}`)
      }}
      tabs={[
        {
          key: "invoices",
          label: "Invoices",
          icon: <Receipt className="text-[#0f172b]" />,
          panel: <AllInvoices />,
          code: "inventory.categories.view",
        },
      ]}
    />
  );
};

export default Invoices;
