import { useNavigate } from "react-router-dom";
import Tabs from "../Tabs";
import AppProfileSettings from "@/components/settings/AppProfileSettings";
import { ImProfile } from "react-icons/im";
import AccessibilitySettings from "./AccessibilitySettings";
import { useAuth } from "@/context/AuthContext";
import { Unauthorized } from "../Unauthorzed";
import { hasPermission } from "@/lib/permissions";
const Settings = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "loan_settings";
  const navigate = useNavigate();
  query = params.get("settings")!;


  const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "settings.view");
 
   if(!isAllowed) return <Unauthorized />
  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/account/settings?query=${key}`);
      }}
      tabs={[
        {
          key: "profile_settings",
          label: "Profile Settings",
          icon: <ImProfile className="text-[#0f172b]" />,
          panel: <AppProfileSettings />,
          code: "settings.view",
        },
        {
          key: "accessibility_settings",
          label: "Accessbility Control",
          icon: <ImProfile className="text-[#0f172b]" />,
          panel: <AccessibilitySettings />,
          code: "settings.view",
        },
      ]}
    />
  );
};

export default Settings;
