import { FaExclamationTriangle } from "react-icons/fa";

interface ProfileBannerProps {
  branch?: string;
  role?: string;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ branch, role }) => {
  const isComplete = Boolean(branch && role);

  if (isComplete) return null; // don't show if profile is complete

  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md flex items-center gap-2 mb-4">
      <FaExclamationTriangle className="w-5 h-5" />
      <span className="text-sm font-medium">
        Your profile is not fully assigned. Please contact your Branch Owner or
        Admin to set your role and branch.
      </span>
    </div>
  );
};

export default ProfileBanner;
