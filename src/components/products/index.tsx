import { FaBoxOpen, FaPlus, FaUpload } from "react-icons/fa";
import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";
import AddProduct from "./AddProduct";
import AllProducts from "./AllProducts";
import BulkUploadProducts from "./BulkUploadProducts";


const Products = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "products";
  const navigate = useNavigate();
  query = params.get("query")!;

    const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "inventory.products.view");
  
  console.log({isAllowed})
   if(!isAllowed) return <Unauthorized />

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/inventory/products?query=${key}`);
      }}
    
      tabs={[
        {
          key: "products",
          label: "All Products",
          icon: <FaBoxOpen className="text-[#8a76f9]" />,
          panel: <AllProducts />,
          code: "inventory.products.view"
        },
        {
          key: "add_product",
          label: "Add Product",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddProduct />,
          code: "inventory.products.create"
        },
         {
          key: "bulk_upload",
          label: "Bulk Upload",
          icon: <FaUpload className="text-[#0f172b] " />,
          panel: <BulkUploadProducts />,
          code: "inventory.products.create"
        },
      ]}
    />
  );
};

export default Products;
