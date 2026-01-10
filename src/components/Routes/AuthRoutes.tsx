import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import Auth from "../ui/auth/Auth";
import DashboardLayout from "../Layouts/DashboardLayout";
import TentPOSDashboard from "../dashboard/Dashboard";
import Roles from "../roles";
import Users from "../users/Users";
import Branches from "../branches/Branches";
import Settings from "../settings";
import Products from "../products";
import Categories from "../categories";
import ProductDetails from "../products/ProductDetails";
import Suppliers from "../suppliers";
import SupplierDetails from "../suppliers/SupplierDetails";
import Purchases from "@/purchases";
import PurchaseDetails from "@/purchases/PurchaseDetails";
import Sales from "../sales";
import Customers from "../customers";
import CustomerDetails from "../customers/CustomerDetails";
import SaleDetails from "../sales/SaleDetails";
import RoleDetails from "../roles/RoleDetails";
import TentPOSFAQ from "../support/FAQs";
import Expenses from "../expenses";
import Invoices from "../invoices";
import SalesOnHold from "../sales/SalesOnHold";
import Debtors from "../customers/debtors";
import AllStockAdjustments from "../products/AllStockAdjustments";
import AllLowStockAlerts from "../products/AllLowStockAlerts";
import AllSaleReturns from "../sales/AllSaleReturns";
import DailySummaryDashboard from "../dashboard/DailySummary";
import SalesReport from "../reports/SalesReport";
import InventoryReportDashboard from "../reports/InventoryReport";
import IncomeStatement from "../accounting/components/IncomeStatement";
import ProfitReportTable from "../accounting/components/ProfitReport";
import CashFlow from "../accounting/components/CashFlows";
import Tickets from "../support/tickets";
import TicketDetails from "../support/tickets/ticketDetails/TicketDetails";
export default function AuthRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Auth />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout title="Dashboard">
            <ProtectedRoute code="default">
              <TentPOSDashboard />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
      <Route
        path="operations/roles"
        element={
          <DashboardLayout title="Roles">
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />

       <Route
        path="operations/roles/role-details"
        element={
          <DashboardLayout title="Role Details">
            <ProtectedRoute>
              <RoleDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
      <Route
        path="operations/staff"
        element={
          <DashboardLayout title="Users">
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
      <Route
        path="operations/branches"
        element={
          <DashboardLayout title="Branches">
            <ProtectedRoute>
              <Branches />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="account/settings"
        element={
          <DashboardLayout title="Account Settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="inventory/products"
        element={
          <DashboardLayout title="Products">
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="inventory/categories"
        element={
          <DashboardLayout title="Categories">
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="inventory/product/product-details"
        element={
          <DashboardLayout title="Product Details">
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="suppliers"
        element={
          <DashboardLayout title="Suppliers">
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="suppliers/supplier-details"
        element={
          <DashboardLayout title="Suppliers Details">
            <ProtectedRoute>
              <SupplierDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="purchases"
        element={
          <DashboardLayout title="Purchases">
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="purchases/purchase-details"
        element={
          <DashboardLayout title="Purchases Details">
            <ProtectedRoute>
              <PurchaseDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="sales"
        element={
          <DashboardLayout title="Sales">
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/sales/hold-bills"
        element={
          <DashboardLayout title="Sales On Hold">
            <ProtectedRoute>
              <SalesOnHold />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="customers"
        element={
          <DashboardLayout title="Customers">
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="customers/customer-details"
        element={
          <DashboardLayout title="Customers Details">
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="sales/sale-details"
        element={
          <DashboardLayout title="Sale Details">
            <ProtectedRoute>
              <SaleDetails />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/support/faqs"
        element={
          <DashboardLayout title="FAQs">
            <ProtectedRoute>
              <TentPOSFAQ />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/support/tickets"
        element={
          <DashboardLayout title="Submit Ticket">
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/expenses"
        element={
          <DashboardLayout title="Expenses">
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/sales/invoices"
        element={
          <DashboardLayout title="Invoices">
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/customers/debtors"
        element={
          <DashboardLayout title="Debtors">
            <ProtectedRoute>
              <Debtors />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/inventory/stock-adjustments"
        element={
          <DashboardLayout title="Stock Adjustments">
          <ProtectedRoute>
              <AllStockAdjustments />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/inventory/low-stock"
        element={
          <DashboardLayout title="Stock Adjustments">
            <ProtectedRoute>
              <AllLowStockAlerts />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/sales/returns"
        element={
          <DashboardLayout title="Sale Returns">
            <ProtectedRoute>
              <AllSaleReturns />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/reports/daily"
        element={
          <DashboardLayout title="Daily Summary">
            <ProtectedRoute>
              <DailySummaryDashboard />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/reports/sales"
        element={
          <DashboardLayout title="Sales Report">
            <ProtectedRoute>
              <SalesReport />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/reports/inventory"
        element={
          <DashboardLayout title="Sales Report">
            <ProtectedRoute>
              <InventoryReportDashboard />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/accounting/income-statement"
        element={
          <DashboardLayout title="Income Statement">
            <ProtectedRoute>
              <IncomeStatement />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/accounting/profit"
        element={
          <DashboardLayout title="Profit Report">
            <ProtectedRoute>
              <ProfitReportTable />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
        <Route
        path="/accounting/cash-flow"
        element={
          <DashboardLayout title="Cash Flow">
            <ProtectedRoute>
              <CashFlow />
            </ProtectedRoute>
          </DashboardLayout>
        }
      />
       <Route
        path="/support/tickets/ticket"
        element={
          <ProtectedRoute>
            <DashboardLayout title="All Tickets">
              <TicketDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
