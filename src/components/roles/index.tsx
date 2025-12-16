import { FaPlus, FaUserShield } from "react-icons/fa";
import Tabs from "../Tabs";
import AllRoles from "./roles_table.tsx/AllRoles";
import AddRoleForm from "./AddRole";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";


const Roles = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "roles";
  const navigate = useNavigate();
  query = params.get("query")!;

    const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "settings.roles.view");
  
  console.log({isAllowed})
   if(!isAllowed) return <Unauthorized />

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/operations/roles?query=${key}`);
      }}
    
      tabs={[
        {
          key: "roles",
          label: "All Roles",
          icon: <FaUserShield className="text-[#8a76f9]" />,
          panel: <AllRoles />,
          code: "settings.roles.view"
        },
        {
          key: "add_role",
          label: "Add Role",
          icon: <FaPlus className="text-[#8a76f9]" />,
          panel: <AddRoleForm />,
          code: "settings.roles.create"
        },
      ]}
    />
  );
};

export default Roles;
