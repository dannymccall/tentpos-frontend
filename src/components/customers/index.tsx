import { FaBoxOpen, FaPlus, FaUpload, FaUsers } from "react-icons/fa";
import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";
import AddCustomer from "./AddCustomer";
import AllCustomers from "./AllCustomers";
import BulkUploadCustomers from "./BulkUploadCusomters";

const Customers = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "customers";
  const navigate = useNavigate();
  query = params.get("query")!;

  const { permissions, businessProfile } = useAuth();

  const isAllowed =
    businessProfile?.appRole === "owner" ||
    hasPermission(permissions, "inventory.products.view");

  console.log({ isAllowed });
  if (!isAllowed) return <Unauthorized />;

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/customers?query=${key}`);
      }}
      tabs={[
        {
          key: "customers",
          label: "All Customers",
          icon: <FaUsers className="text-[#8a76f9]" />,
          panel: <AllCustomers />,
          code: "inventory.products.view",
        },
        {
          key: "add_customer",
          label: "Add Customer",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddCustomer />,
          code: "inventory.products.create",
        },
        {
          key: "bulk_upload",
          label: "Bulk Upload",
          icon: <FaUpload className="text-[#0f172b] " />,
          panel: <BulkUploadCustomers />,
          code: "inventory.products.create",
        },
      ]}
    />
  );
};

export default Customers;
