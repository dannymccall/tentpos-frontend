"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Category } from "@/types/category.types";
import { TableActions } from "../TableActions";
import CategoryModal from "./CategoryModal";
import type { ActionProps } from "@/types/types";

interface CategoryProps extends ActionProps<Category> {
  category: Category;
  categories: Category[];
}
const CategoryTable: React.FC<CategoryProps> = ({
  categories,
  onView,
  onDelete,
  onEdit,
  mode,
  isOpen,
  onClose,
  onSuccess,
  category,
  onHandleDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <CategoryModal
        category={category}
        onClose={onClose}
        onSuccess={onSuccess}
        isOpen={isOpen}
        mode={mode}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        onHandleDelete={onHandleDelete}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.parentCategory}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <TableActions
                    showDelete
                    showEdit
                    onDelete={() => onDelete(category)}
                    onEdit={() => onEdit(category)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
