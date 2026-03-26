import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchCustomers } from "@/hooks/useFetchCustomers";
type Props = {
  customerId: number | "all";
  onChange: (customerId: number | "all") => void;
};
const CustomerFilter = ({ customerId, onChange }: Props) => {
  const { customers } = useFetchCustomers();

  return (
    <Select
      value={String(customerId)}
      onValueChange={(val) =>
        val === "all" ? onChange("all") : onChange(Number(val))
      }
    >
      <SelectTrigger className="md:w-52 w-full border-gray-800 bg-transparent">
        <SelectValue placeholder="Filter by customer" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Customers</SelectItem>
        {customers.map((c) => (
          <SelectItem key={c.id} value={String(c.id)}>
            {c.firstName} {c.lastName} - {c.phone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


export default CustomerFilter;
