import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// import { useLocation } from "react-router-dom";
// import type { RootState } from "../redux/store";
// import type { SidebarProps } from "../../types/sidebar.types";

const Sidebar: React.FC<SidebarProps> = ({ items, isOpen }) => {
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [counts, setCounts] = useState<Record<string, number>>({
    pendingLoans: 0,
    defaulters: 0,
  });
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { settings, permissions, businessProfile, logout } = useAuth();

  console.log({ permissions });
  // Simulated API call for badges
  useEffect(() => {
    let interval;

    async function fetchCounts() {
      try {
        const res = await api.get(`/api/dashboard/counts`);
        setCounts({
          pendingApproval: res.data.pendingApproval ?? 0,
          defaulters: res.data.defaultedLoans ?? 0,
        });
      } catch (e) {
        console.warn("Failed to fetch counts:", e);
      }
    }

    fetchCounts();
    interval = setInterval(fetchCounts, 30_000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Assume user role from global store
  // const userRole = useSelector((state: any) => state.auth.user?.role || "admin");

  const canView = (code: string) =>
    businessProfile?.appRole === "owner" ||
    code === "default" ||
    permissions.find((p) => p.code_name === code);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>),
      [label]: !prev[label],
    }));
  };
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0f172b] text-white transition-all duration-300 z-40
      ${isOpen ? "w-64" : "w-20"} shadow-lg flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-5 border-b border-gray-700">
        <div
          className={`flex flex-col items-center justify-center space-y-1 ${
            isOpen ? "bg-[#152242] px-12" : ""
          }  py-2   rounded-lg`}
        >
          <span className="font-semibold text-xl tracking-tight text-center flex items-center gap-2">
            {isOpen ? (
              settings.logo ? (
                <>
                  <img
                    src={`${settings.logo}`}
                    alt="Logo Preview"
                    className="h-10 w-10 object-contain rounded border-gray-300"
                  />
                  <span>
                    {(settings.companyName || "Company").split(" ")[0]}
                  </span>
                </>
              ) : (
                <span>{settings.companyName || "Company"}</span>
              )
            ) : settings.logo ? (
              <img
                src={`${settings.logo}`}
                alt="Logo Preview"
                className="h-10 w-10 object-contain rounded border-gray-300 mx-auto"
              />
            ) : (
              (settings.companyName || "Company").slice(0, 2).toUpperCase()
            )}
          </span>

          {isOpen && (
            <p className="text-[10px] text-gray-500 font-semibold ">
              powered by TentHub
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-3 flex-1 overflow-y-auto">
        {items.map((section, sIdx) => (
          <div key={sIdx} className="mb-2">
            {canView(section.code!) && section.title && isOpen && (
              <div className="px-5 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700">
                {section.title}
              </div>
            )}

            {section.links.map((item, idx) => {
              const isActive = pathname.startsWith(item.path || "");
              const hasSublinks = item.sublinks && item.sublinks.length > 0;
              const isOpenMenu = openMenus[item.label];

              return (
                <div key={idx}>
                  {canView(item.code!) && (
                    <button
                        onClick={() => {
                        if (hasSublinks) {
                          toggleMenu(item.label);
                        } else if (
                          item.label.toLowerCase().includes("logout")
                        ) {
                          logout();
                        } else if (item.path) {
                          navigate(item.path);
                        }
                      }}
                      className={`w-full flex items-center rounded-md hover:bg-gray-800 transition-colors duration-200
                    ${isOpen ? "gap-4 px-5 py-3" : "justify-center py-3"} ${
                        isActive ? "bg-[#0f172b]" : ""
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>

                      {isOpen && (
                        <div className="flex justify-between items-center w-full">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {hasSublinks && (
                            <span className="text-xs">
                              {isOpenMenu ? (
                                <FaChevronDown />
                              ) : (
                                <FaChevronRight />
                              )}
                            </span>
                          )}
                          {item.badgeKey !== undefined && (
                            <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full">
                              {counts[item.badgeKey]}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )}

                  {/* Sublinks */}
                  {hasSublinks && isOpen && (
                    <div
                      className={`ml-8 border-l border-gray-700 overflow-hidden transition-all duration-300 ${
                        isOpenMenu ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {item.sublinks!.map((sub, subIdx) => {
                        const subActive = pathname === sub.path;
                        return (
                          <div
                            className="flex items-center gap-3 hover:bg-gray-800 rounded-md pl-2"
                            key={subIdx}
                          >
                            {canView(sub.code!) && (
                              <>
                                 <div
                                    onClick={() => navigate(sub.path!)}
                                    className={`block cursor-pointer text-sm py-2 pl-4 pr-2 rounded-md transition-colors duration-150 ${
                                      subActive
                                        ? "bg-[#0f172b] text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                    }`}
                                  >
                                    {sub.label}
                                  </div>
                                {sub.badgeKey !== undefined && (
                                  <span className="text-[10px] bg-red-600 px-1 py-0.2 rounded-full">
                                    {counts[sub.badgeKey]}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

// Grouped default items (unchanged)

export interface SidebarLink {
  label: string;
  icon?: React.ReactElement;
  path?: string;
  badge?: number;
  roles?: string[];
  badgeKey?: string;
  sublinks?: SidebarLink[];
  code?: string;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
  code?: string;
}

interface SidebarProps {
  items: SidebarSection[];
  isOpen: boolean;
}

export default Sidebar;
