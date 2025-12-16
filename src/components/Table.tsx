import React, { type ReactNode } from "react";

type TableRow = {
  id: number;
  title: string;
};

type TableProps = {
  rows: TableRow[];
  children: ReactNode;
};

const Table: React.FC<TableProps> = ({ rows, children }) => {
  return (
    <table className="min-w-full w-full table-sm text-sm table-auto border-collapse border border-gray-300 z-10">
      <thead>
        <tr className="text-left text-sm text-[var(--color-text-secondary)]">
          {rows.map((row) => (
            <th key={row.id} className="p-2 border border-gray-300 text-left">
              {row.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
