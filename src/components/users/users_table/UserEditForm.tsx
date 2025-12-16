import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { makeRequest } from "tenthub-request";
import type { User } from "../../../types/staff.type";
import type { Branch } from "../../../types/branch.type";
import { useNotification } from "../../../context/NotificationContext";
import FormLoading from "../../loaders/FormLoading";
import { toCapitalized } from "../../../lib/helperFunctions";
import RoleSelector from "../../roles/RoleSelector";
import { apiBase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormProps {
  mode: "add" | "view" | "edit";
  selectedUser?: User;
  branches: Branch[]; // populate from backend
  onSuccess: () => void;
}

const EditUserForm: React.FC<UserFormProps> = ({
  mode,
  selectedUser,
  branches,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { showToast } = useNotification();
  const isReadOnly = mode === "view";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<User>();

  useEffect(() => {
    if (selectedUser && (mode === "view" || mode === "edit")) {
      reset({
        fullName: selectedUser.fullName,
        branchId: selectedUser.branchId,
        tenantId: selectedUser.tenantId,
        appRole: selectedUser.appRole,
        userId: selectedUser.userId,
      });
    } else if (mode === "add") {
      reset({
        fullName: "",
        branchId: 0,
        tenantId: "",
        appRole: "user",
        userId: 0,
      });
    }
  }, [selectedUser, mode, reset]);

  const onSubmit = async (data: User) => {
    setLoading(true);
    console.log({ ...data, role: selectedRoleId, id: selectedUser?.id });
    try {
      const response = await makeRequest(
        `/api/users/update-user`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...data,
            id: selectedUser?.id,
            role: selectedRoleId,
          }),
        },
        apiBase
      );

      if (response.status === "error") {
        showToast(response.error?.message!, "error");
        setLoading(false);
        return;
      }

      showToast(response.message!, "success");
      setLoading(false);
      onSuccess();
    } catch (error: any) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className=" rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label className="w-40 text-[15px] font-semibold text-gray-600 text-start ">
              Full Name
            </label>
            <div className="w-full flex flex-col">
              <Input
                placeholder="eg. John Doe"
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          {/* Branch */}

          <div className="flex items-center flex-col md:flex-row gap-5">
            <label className="w-40 text-[15px] font-semibold text-gray-600 text-start ">
              Branch
            </label>
            {mode === "view" ? (
              <div className="w-full flex flex-col">
                <Input
                  placeholder="eg. John Doe"
                  type="text"
                  readOnly={isReadOnly}
                  value={selectedUser?.branch?.name || "N/A"}
                  className={` w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col">
                <select
                  {...register("branchId")}
                  disabled={isReadOnly}
                  className={` w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">-- Select Branch --</option>
                  {branches &&
                    branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                </select>
                {errors.branchId && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.branchId.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tenant ID */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label className="w-40 text-[15px] font-semibold text-gray-600 text-start ">
              Tenant ID
            </label>
            <div className="w-full flex flex-col">
              <Input
                placeholder="Tenant ID"
                type="text"
                {...register("tenantId", { required: "Tenant ID is required" })}
                readOnly
                className={`text-slate-700 w-full font-semibold border rounded p-2 cursor-not-allowed ${
                  errors.tenantId ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 " : ""}`}
              />
              {errors.tenantId && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.tenantId.message}
                </p>
              )}
            </div>
          </div>

          {/* App Role */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label className="w-40 text-[15px] font-semibold text-gray-600 text-start ">
              App Role
            </label>
            {mode === "view" ? (
              <Input
                placeholder="eg. John Doe"
                type="text"
                readOnly={isReadOnly}
                value={toCapitalized(selectedUser?.appRole!)}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
            ) : (
              <div className="w-full flex flex-col">
                <select
                  {...register("appRole", { required: "App role is required" })}
                  disabled
                  className={` w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-not-allowed ${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="owner">Owner</option>
                  <option value="user">User</option>
                </select>
                {errors.appRole && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.appRole.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              className={`${
                mode === "view" ? "w-40" : "w-40"
              }  text-[15px]  font-semibold text-gray-600 text-start `}
            >
              {mode === "view" ? "Company Role" : "Assign Role"}
            </label>
            {mode === "view" ? (
              <Input
                placeholder="eg. John Doe"
                type="text"
                readOnly={isReadOnly}
                value={
                  selectedUser?.userRole!
                    ? toCapitalized(selectedUser.userRole.role.name)
                    : "N/A"
                }
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
            ) : (
              <div>
                <RoleSelector
                  initialRoleId={
                    selectedUser?.userRole && selectedUser?.userRole.role.id
                  } // pass user’s existing roleId here if editing
                  onSelect={(roleId) => setSelectedRoleId(roleId)}
                />
              </div>
            )}
          </div>
          {/* Submit */}
          {mode !== "view" && (
            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={() => {}}
                disabled={Object.keys(dirtyFields).length === 0 || loading}
                className="disabled:opacity-50"
              >
                {loading ? (
                  <FormLoading />
                ) : mode === "add" ? (
                  "Add User"
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
