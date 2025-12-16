import React from "react";
import { MdKeyboardArrowRight,MdKeyboardArrowLeft  } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-start items-center space-x-2 mt-4 p-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md border border-gray-400 text-sm shadow-md font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
      >
        <MdKeyboardArrowLeft  />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3  rounded-md py-2 border text-sm font-medium cursor-pointer ${
            page === currentPage
              ? "bg-[#1f2937] text-white border-none shadow-md font-semibold"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } ${page === "..." ? "cursor-default text-gray-400" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-gray-400 text-sm shadow-md font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
