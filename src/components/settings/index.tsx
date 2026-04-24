import { useNavigate } from "react-router-dom";
import Tabs from "../Tabs";
import AppProfileSettings from "@/components/settings/AppProfileSettings";
import { ImProfile } from "react-icons/im";
import AccessibilitySettings from "./AccessibilitySettings";
import PersonalProfileSettings from "./PersonalProfileSettings";
import { RiProfileFill } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";
const Settings = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "loan_settings";
  const navigate = useNavigate();
  query = params.get("settings")!;

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
          icon: <ImProfile className="text-[#8a76f9]" />,
          panel: <AppProfileSettings />,
          code: "settings.view",
        },
        {
          key: "accessibility_settings",
          label: "Accessbility Control",
          icon: <MdSecurity className="text-[#8a76f9]" />,
          panel: <AccessibilitySettings />,
          code: "settings.view",
        },
        {
          key: "personal_settings",
          label: "Personal Profile",
          icon: <RiProfileFill className="text-[#8a76f9]" />,
          panel: <PersonalProfileSettings />,
          code: "default",
        },
      ]}
    />
  );
};

export default Settings;
