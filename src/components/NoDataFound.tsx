import { MdRefresh } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa";

interface NoDataFoundProps {
  title?: string;
  message?: string;
  onRefresh?: () => void; // optional refresh action
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = "No data found",
  message = "Looks like there’s nothing here yet. Try adding new data or refreshing.",
  onRefresh,
}) => {
  return (
    <div className="py-20 flex justify-center items-center">
      <div className="w-full flex flex-col gap-4 justify-center items-center text-center px-6 max-w-md">
        <FaFolderOpen size={64} className="text-[#1d3449]"/>
        <h1 className="text-[#1d3449] text-xl font-semibold">{title}</h1>
        <p className="text-neutral-500">{message}</p>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-5 flex gap-2 items-center py-2 bg-[#1d3449] text-white text-sm rounded-md shadow hover:bg-[#162634] transition"
          >
            <MdRefresh  className="text-slate-50"/>
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};

export default NoDataFound;
