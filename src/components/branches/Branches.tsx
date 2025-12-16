import Tabs from "../Tabs";
import { FaBuilding, FaPlus } from "react-icons/fa";
import AddBranch from "./AddBranch";
import AllBranches from "./branches_table/AllBranches";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { Unauthorized } from "../Unauthorzed";

const Branches = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "branches";
  query = params.get("query")!;
  const navigate = useNavigate();

    const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "operations.view.branches");
 
   if(!isAllowed) return <Unauthorized />
  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({top:0, behavior: "smooth"})
        navigate(`/operations/branches?query=${key}`)}
      } 
      tabs={[
        {
          key: "branches",
          label: "All Branches",
          icon: <FaBuilding className='text-[#8a76f9]' />,
          panel: <AllBranches />,
          code: "operations.view.branches"
        },
        {
          key: "add_branch",
          label: "Add Branch",
          icon: <FaPlus className='text-[#8a76f9]' />,
          panel: <AddBranch />,
          code: "operations.create.branch"
        },
      ]}
    />
  );
};

export default Branches;
