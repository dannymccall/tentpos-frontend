import { FaFileInvoiceDollar, FaPlus } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import Tabs from "@/components/Tabs";
import AddPurchase from "./AddPurchase";
import { Unauthorized } from "@/components/Unauthorzed";
import AllPurchases from "./AllPurchases";




const Purchases = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "purchases";
  const navigate = useNavigate();
  query = params.get("query")!;

    const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "suppliers.view");
  
  console.log({isAllowed})
   if(!isAllowed) return <Unauthorized />

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/purchases?query=${key}`);
      }}
    
      tabs={[
        {
          key: "purchases",
          label: "All Purchases",
          icon: <FaFileInvoiceDollar className="text-[#8a76f9]" />,
          panel: <AllPurchases />,
          code: "suppliers.view"
        },
        {
          key: "new_purchase",
          label: "Add Purchase",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddPurchase />,
          code: "suppliers.create"
        },
        //  {
        //   key: "bulk_upload",
        //   label: "Bulk Upload",
        //   icon: <FaUpload className="text-[#0f172b] " />,
        //   panel: <BulkUploadSuppliers />,
        //   code: "suppliers.create"
        // },
      ]}
    />
  );
};

export default Purchases;
