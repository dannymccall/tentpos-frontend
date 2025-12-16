import React, { useState } from "react";
import Header from "./Header";
import Sidebar, { type SidebarSection } from "./Sidebar";
import {
  FaBalanceScale,
  FaBook,
  FaBoxOpen,
  FaBuilding,
  FaCalendarDay,
  FaCashRegister,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaCog,
  FaEdit,
  FaEnvelope,
  FaExchangeAlt,
  FaExclamationTriangle,
 
  FaFileInvoiceDollar,
 
  FaHome,
  FaMoneyBillWave,
  FaPercent,
  FaPlus,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTags,
  FaTruckLoading,
  FaUndo,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaVideo,
} from "react-icons/fa";
import {  FaReceipt } from "react-icons/fa6";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const defaultSidebarItems: SidebarSection[] = [
  {
    title: "Overview",
    code: "default",
    links: [
      {
        label: "Dashboard",
        icon: <FaHome />,
        path: "/dashboard",
        code: "default",
      },
      {
        label: "Sales Summary",
        icon: <FaChartPie />,
        path: "/sales/summary",
        code: "sales.view",
      },
      {
        label: "Inventory Overview",
        icon: <FaChartLine />,
        path: "/inventory/overview",
        code: "inventory.view",
      },
    ],
  },

  {
    title: "Sales & Orders",
    code: "sales.view",
    links: [
      {
        label: "POS Terminal",
        icon: <FaCashRegister />,
        path: "/sales/pos",
        code: "sales.create",
      },
      // {
      //   label: "Orders",
      //   icon: <FaReceipt />,
      //   path: "/sales/orders",
      //   code: "sales.view",
      // },
      {
        label: "Sales",
        icon: <FaReceipt />,
        path: "/sales",
        code: "sales.view",
      },
      {
        label: "New Sale",
        icon: <FaPlus />,
        path: "/sales?query=new_sale",
        code: "sales.create",
      },
      {
        label: "Quick Sale",
        icon: <FaPlus />,
        path: "/sales?query=quick_sale",
        code: "sales.create",
      },
      {
        label: "Returns",
        icon: <FaUndo />,
        path: "/sales/returns",
        code: "sales.view",
      },
      // {
      //   label: "Discounts",
      //   icon: <FaPercent />,
      //   path: "/sales/discounts",
      //   code: "sales.view",
      // },
      {
        label: "Invoices",
        icon: <FaUsers />,
        path: "/sales/invoices",
        code: "sales.view",
      },
      {
        label: "Hold Bills",
        icon: <FaClipboardList />,
        path: "/sales/hold-bills",
        code: "sales.view",
      },
    ],
  },

  {
    title: "Inventory",
    code: "inventory.products.view",
    links: [
      {
        label: "Products",
        icon: <FaBoxOpen />,
        code: "inventory.products.view",
        sublinks: [
          {
            label: "All Products",
            path: "/inventory/products",
            icon: <FaBoxOpen size={12} />,
            code: "inventory.products.view",
          },
          {
            label: "Add Product",
            path: "/inventory/products?query=add_product",
            icon: <FaPlus size={12} />,
            code: "inventory.products.create",
          },
          {
            label: "Product Categories",
            path: "/inventory/categories",
            icon: <FaTags size={12} />,
            code: "inventory.categories.view",
          },
          {
            label: "Add Category",
            path: "/inventory/categories?query=add_category",
            icon: <FaPlus size={12} />,
            code: "inventory.categories.create",
          },
          {
            label: "Stock Adjustments",
            path: "/inventory/stock-adjustments",
            icon: <FaExchangeAlt size={12} />,
            code: "inventory.adjustments.view",
          },
          {
            label: "Low Stock Alerts",
            path: "/inventory/low-stock",
            icon: <FaExclamationTriangle size={12} />,
            code: "inventory.adjustments.view",
          },
        ],
      },
    ],
  },

  {
    title: "Purchases & Suppliers",
    code: "suppliers.view",
    links: [
      {
        label: "Suppliers",
        icon: <FaTruckLoading />,
        path: "/suppliers",
        code: "suppliers.view",
      },
      {
        label: "Add Supplier",
        icon: <FaPlus />,
        path: "/suppliers?query=add_supplier",
        code: "suppliers.create",
      },
      {
        label: "Purchase Orders",
        icon: <FaFileInvoiceDollar />,
        path: "/purchases",
        code: "purchases.view",
        sublinks: [
          {
            label: "All Purchases",
            path: "/purchases",
            code: "purchases.view",
          },
          {
            label: "New Purchase",
            path: "/purchases?query=new_purchase",
            code: "purchases.create",
          },
        ],
      },
    ],
  },

  {
    title: "Customers",
    code: "customers.view",
    links: [
      {
        label: "All Customers",
        icon: <FaUserFriends />,
        path: "/customers",
        code: "customers.view",
      },
      {
        label: "Add Customer",
        icon: <FaUserPlus />,
        path: "/customers?query=add_customer",
        code: "customers.create",
      },
      {
        label: "Debtors",
        icon: <FaBalanceScale />,
        path: "/customers/debtors",
        badge: 3,
        badgeKey: "debtors",
        code: "customers.view",
      },
    ],
  },

  {
    title: "Expenses",
    code: "expenses.view",
    links: [
      {
        label: "All Expenses",
        icon: <FaFileInvoiceDollar />,
        path: "/expenses",
        code: "expenses.view",
      },
      {
        label: "Add Expense",
        icon: <FaPlus />,
        path: "/expenses?query=add_expense",
        code: "expenses.create",
      },
      // {
      //   label: "Expense Categories",
      //   icon: <FaTags />,
      //   path: "/expenses/categories",
      //   code: "expenses.view",
      // },
    ],
  },

  {
    title: "Staff & Operations",
    code: "operations.view",
    links: [
      {
        label: "Branches",
        icon: <FaBuilding />,
        path: "/operations/branches",
        code: "operations.view.branches",
      },
      {
        label: "Staff",
        icon: <FaUsers />,
        path: "/operations/staff",
        code: "operations.view.staff",
      },
      {
        label: "Roles",
        icon: <FaUserShield />,
        path: "/operations/roles",
        code: "operations.view.roles",
      },
      {
        label: "Add Branch",
        icon: <FaPlus />,
        path: "/operations/branches?query=add_branch",
        code: "operations.create.branch",
      },
      // {
      //   label: "Add Staff",
      //   icon: <FaPlus />,
      //   path: "/operations/staff?query=add_staff",
      //   code: "operations.create.staff",
      // },
    ],
  },
{
  title: "Accounting",
  code: "accounting.view",
  links: [
    {
      label: "Accounting Dashboard",
      icon: <FaChartLine />,
      path: "/accounting/dashboard",
      code: "accounting.view",
    },
    {
      label: "Income Statement",
      icon: <FaFileInvoiceDollar />,
      path: "/accounting/income-statement",
      code: "accounting.view",
    },
    {
      label: "Cash Flow",
      icon: <FaMoneyBillWave />,
      path: "/accounting/cashflow",
      code: "accounting.view",
    },
    {
      label: "Balance Summary",
      icon: <FaBalanceScale />,
      path: "/accounting/balance",
      code: "accounting.view",
    },
    {
      label: "Ledgers",
      icon: <FaBook />,
      code: "accounting.ledgers",
      sublinks: [
        {
          label: "All Ledgers",
          path: "/accounting/ledgers",
          icon: <FaBook size={12} />,
          code: "accounting.ledgers",
        },
        {
          label: "Journal Entries",
          path: "/accounting/ledgers/journals",
          icon: <FaEdit size={12} />,
          code: "accounting.ledger.journals",
        },
      ],
    },
  ],
},

  {
    title: "Reports",
    code: "reports.view",
    links: [
      {
        label: "Sales Reports",
        icon: <FaChartPie />,
        path: "/reports/sales",
        code: "reports.view",
      },
      {
        label: "Inventory Reports",
        icon: <FaChartBar />,
        path: "/reports/inventory",
        code: "reports.view",
      },
      {
        label: "Daily Summary",
        icon: <FaCalendarDay />,
        path: "/reports/daily",
        code: "reports.view",
      },
    ],
  },

  {
    title: "Support",
    code: "default",
    links: [
      {
        label: "Tutorial Videos",
        icon: <FaVideo />,
        path: "/support/tutorials",
        code: "default",
      },
      {
        label: "FAQ",
        icon: <FaQuestionCircle />,
        path: "/support/faqs",
        code: "default",
      },
      {
        label: "Submit a Ticket",
        icon: <FaEnvelope />,
        path: "/support/tickets",
        code: "support.create.ticket",
      },
    ],
  },

  {
    title: "Account",
    code: "default",
    links: [
      {
        label: "Settings",
        icon: <FaCog />,
        path: "/account/settings",
        code: "settings.view",
      },
      {
        label: "Logout",
        icon: <FaSignOutAlt />,
        path: "/account/upgrade",
        code: "default",
      },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-full w-screen bg-[#f1f5f5]">
      <Sidebar items={defaultSidebarItems} isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header
          toggleSidebar={toggleSidebar}
          title={title}
          className={`fixed top-0 h-16 transition-all duration-300 z-50 ${
            isSidebarOpen
              ? "ml-64 w-[calc(100%-16rem)]"
              : "ml-24 w-[calc(100%-4rem)]"
          }`}
        />

        <main
          className={`transition-all duration-300 pt-16 min-h-screen ${
            isSidebarOpen
              ? "ml-64 w-[calc(100%-16rem)]"
              : "ml-16 w-[calc(100%-4rem)]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
