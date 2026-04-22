import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import ExpenseCreation from "./AddExpense";
import { ClipboardList, CreditCard } from "lucide-react";
import AllExpenses from "./components/AllExpenses";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { Unauthorized } from "../Unauthorzed";

const Expenses = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "expenses";
  query = params.get("query")!;
  const navigate = useNavigate();

   const { permissions, businessProfile } = useAuth();
  
    const isAllowed =
      businessProfile?.appRole === "owner" ||
      hasPermission(permissions, "expenses.view");
  
    // console.log({isAllowed})
    if (!isAllowed) return <Unauthorized />;
  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({top:0, behavior: "smooth"})
        navigate(`/expenses?query=${key}`)}
      } 
      tabs={[
        {
          key: "expenses",
          label: "All Expenses",
          icon: <ClipboardList className='text-[#8a76f9]' />,
          panel: <AllExpenses />,
          code:"expenses.view"
        },
        {
          key: "add_expenses",
          label: "Add Expense",
          icon: <CreditCard className='text-[#8a76f9]' />,
          panel: <ExpenseCreation />,
          code: "expenses.create"
        },
      ]}
    />
  );
};

export default Expenses;
