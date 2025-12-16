import Tabs from "../Tabs";

import { useNavigate } from "react-router-dom";
import ExpenseCreation from "./AddExpense";
import { ClipboardList, CreditCard } from "lucide-react";
import AllExpenses from "./components/AllExpenses";

const Expenses = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "expenses";
  query = params.get("query")!;
  const navigate = useNavigate();
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
        },
        {
          key: "add_expenses",
          label: "Add Expense",
          icon: <CreditCard className='text-[#8a76f9]' />,
          panel: <ExpenseCreation />,
        },
      ]}
    />
  );
};

export default Expenses;
