import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface InventoryBarChartProps {
  data: { destination: string; quantity: number }[];
}

const InventoryBarChart: React.FC<InventoryBarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full  p-4 rounded-lg">
      {/* <h2 className="text-lg font-semibold mb-3">Inventory Distribution</h2> */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="destination" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#2b7fff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryBarChart;