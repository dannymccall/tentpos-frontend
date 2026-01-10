import { FaPlus} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Tabs from "@/components/Tabs";
import SubmitTicket from "./SubmitTicket";
import { ClipboardList } from "lucide-react";
import  AllTickets from "./AllTickets";

const Tickets = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "tickets";
  const navigate = useNavigate();
  query = params.get("query")!;

  return (
    <Tabs
      defaultTab={query}
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });
        navigate(`/support/tickets?query=${key}`);
      }}
     
      tabs={[
        {
          key: "tickets",
          label: "My Tickets",
          icon: <ClipboardList className="text-[#0f172b] " />,
          panel: <AllTickets />,
        },
        {
          key: "add_ticket",
          label: "Submit New Ticket",
          icon: <FaPlus className="text-[#0f172b] " />,
          panel: <SubmitTicket />,
        },
       
      ]}
    />
  );
};

export default Tickets;
