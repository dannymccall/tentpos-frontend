import {  FaPlus, FaTruckLoading, FaUpload } from "react-icons/fa";
import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";
import AddSupplier from "./AddSupplier";
import AllSuppliers from "./AllSuppliers";
import BulkUploadSuppliers from "./BulkUploadSupplier";



const Suppliers = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "suppliers";
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
        navigate(`/suppliers?query=${key}`);
      }}
    
      tabs={[
        {
          key: "suppliers",
          label: "All Suppliers",
          icon: <FaTruckLoading className="text-[#8a76f9]" />,
          panel: <AllSuppliers />,
          code: "suppliers.view"
        },
        {
          key: "add_supplier",
          label: "Add Supplier",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddSupplier />,
          code: "suppliers.create"
        },
         {
          key: "bulk_upload",
          label: "Bulk Upload",
          icon: <FaUpload className="text-[#0f172b] " />,
          panel: <BulkUploadSuppliers />,
          code: "suppliers.create"
        },
      ]}
    />
  );
};

export default Suppliers;
