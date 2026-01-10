import { SpinnerCustom } from "@/components/loaders/Spinner";
import { useQuery } from "@tanstack/react-query";
import TicketHeader from "./Header";
import TicketConversation from "./TicketConversation";
import TicketSidebar from "./TicketSidebar";
import api from "@/lib/api";

const TicketDetails = () => {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("ticketId");
  console.log({id})
  const { data, isLoading } = useQuery({
    queryKey: ["ticket-details", id,],
    queryFn: async () => {
      const res = await api.get(`/api/tickets/ticket?ticketId=${Number(id)}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 5000,

  });

  console.log(data);

  if (isLoading) return <SpinnerCustom />;
    return (
    <div className="px-6 py-6 space-y-6">
      <TicketHeader ticket={data} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TicketConversation ticket={data} />
        </div>

        <div className="lg:col-span-4">
          <TicketSidebar ticket={data} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
