import { FaUsers } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { Unauthorized } from "@/components/Unauthorzed";
import Tabs from "@/components/Tabs";
import AllDebtors from "./AllDebtors";


const Debtors = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "debtors";
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
        navigate(`/customers/debtors?query=${key}`);
      }}
      tabs={[
        {
          key: "debtors",
          label: "All Debtors",
          icon: <FaUsers className="text-[#8a76f9]" />,
          panel: <AllDebtors />,
          code: "inventory.products.view",
        },
      ]}
    />
  );
};

export default Debtors;
