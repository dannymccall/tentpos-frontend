import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface ProfileBadgeProps {
  branch?: string;
  role?: string;
}

const ProfileBadge: React.FC<ProfileBadgeProps> = ({ branch, role }) => {
  const isComplete = Boolean(branch && role);

  console.log({isComplete})
  return (
    <div
      className={`ml-4 inline-flex items-center justify-center text-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isComplete ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isComplete ? (
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            {" "}
            <FaCheckCircle className="w-3 h-3" />
            <p className="flex items-center gap-2">
              {role} <span>@</span>
            </p>
          </div>
          <span>{branch}</span>
        </div>
      ) : (
        <div className="flex items-center">
          <FaExclamationCircle className="w-3 h-3" />
          <span>Not Assigned a role or branch</span>
        </div>
      )}
    </div>
  );
};

export default ProfileBadge;
