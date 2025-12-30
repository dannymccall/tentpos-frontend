import {  FaPlus, FaTags, FaUpload } from "react-icons/fa";
import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";
import AddCategory from "./AddCategory";
import BulkUploadCategories from "./BulkCategory";
import AllCategories from "./AllCategories";

const Categories = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "categories";
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
        navigate(`/inventory/categories?query=${key}`);
      }}
    
      tabs={[
        {
          key: "categories",
          label: "All Categories",
          icon: <FaTags className="text-[#8a76f9]" />,
          panel: <AllCategories />,
          code: "inventory.categories.view"
        },
        {
          key: "add_category",
          label: "Add Category",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddCategory />,
          code: "inventory.categories.create"
        },
         {
          key: "bulk_upload",
          label: "Bulk Upload",
          icon: <FaUpload className="text-[#0f172b] " />,
          panel: <BulkUploadCategories />,
          code: "inventory.categories.create"
        },
      ]}
    />
  );
};

export default Categories;
