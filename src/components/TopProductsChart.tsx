import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const TopProductsChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white p-4 rounded-lg text-sm overflow-y-auto w-full">
      <h2 className="mb-4 font-semibold">Top Products</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis className="text-xs"/>
          <Tooltip />
          <Bar dataKey="quantity" fill="#2b7fff"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};