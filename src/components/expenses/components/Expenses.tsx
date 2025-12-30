"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {  ExpenseProps } from "@/types/expense.types";
import { TableActions } from "@/components/TableActions";
import ExpenseModal from "./ExpenseModal";
import { currency } from "@/lib/helperFunctions";
export const ExpenseTable: React.FC<{
  data: ExpenseProps[];
  refetch: () => void;
}> = ({ data, refetch }) => {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseProps>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
  return (
    <>
      <ExpenseModal
        expense={selectedExpense!}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        refetch={refetch}
        mode={mode}
      />
      <ScrollArea className="rounded-lg border">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="">ID</TableHead>
              <TableHead className="">Title</TableHead>
              <TableHead className="">Amount</TableHead>
              <TableHead className="">Category</TableHead>
              <TableHead className="">Description</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="">Recurring</TableHead>
              <TableHead className="">Frequency</TableHead>
              <TableHead className="">End Date</TableHead>
              <TableHead className="">Branch</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{currency(expense.amount)}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description || "-"}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.recurring ? "Yes" : "No"}</TableCell>
                <TableCell>{expense.recurrenceFrequency || "-"}</TableCell>
                <TableCell>{expense.recurrenceEndDate || "-"}</TableCell>
                <TableCell>{expense.branchExpense.name}</TableCell>
                <TableCell className="space-x-2">
                  <TableActions
                    showView
                    showDelete
                    onView={() => {
                      setMode("edit");
                      setSelectedExpense(expense);
                      setIsOpen(true)
                    }}
                    onDelete={() => {
                      setSelectedExpense(expense);
                      setIsOpen(true);
                      setMode("delete");
                    }}
                    permissionMode="hide"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
