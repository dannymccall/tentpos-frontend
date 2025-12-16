import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Branch } from "../../types/branch.type";

import FormLoading from "../loaders/FormLoading";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useAuth } from "../../context/AuthContext";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { hasPermission } from "@/lib/permissions";
import { Unauthorized } from "../Unauthorzed";
const AddBranch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
 
  const {users} = useFetchUsers()
  const {permissions, businessProfile} = useAuth();

  console.log(users)

  const isAuthorized =hasPermission(permissions, "CREATE_BRANCH") || businessProfile?.appRole === "owner"
  const filteredManagers = useMemo(() => {
    return users.filter((m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Branch>();

 
const { mutate: addBranch, isPending } = useApiMutation({
  url: "/api/branches/create-branch",
  method: "POST",
  invalidateKey: "/api/branches/get-branches",
  onSuccessCallback: () => reset(),
});

  const onSubmit = async (data: Branch) => {
   addBranch(data);
  console.log(data)
  };

  if(!isAuthorized) return <Unauthorized />

  return (
    <div className="flex justify-center items-center py-20">
      <div className="bg-white w-full md:w-3xl p-10 rounded-lg">
        <h1 className="text-center mb-5 font-semibold text-gray-600">
          Add New Branch
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="name"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              Branch Name
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. Main"
                type="text"
                {...register("name", { required: "Branch name is required" })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.name?.message && "border border-red-500"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="address"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              Address
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. 123 High Street"
                type="text"
                {...register("address", { required: "Address is required" })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.address?.message && "border border-red-500"
                }`}
              />
              {errors.address?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* City */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="city"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              City
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. Accra"
                type="text"
                {...register("city", { required: "City is required" })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.city?.message && "border border-red-500"
                }`}
              />
              {errors.city?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Region */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="region"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              Region
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. Greater Accra"
                type="text"
                {...register("region", { required: "Region is required" })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.region?.message && "border border-red-500"
                }`}
              />
              {errors.region?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.region.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="phone"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              Phone
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. +233 24 000 0000"
                type="text"
                {...register("phone", { required: "Phone number is required" })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.phone?.message && "border border-red-500"
                }`}
              />
              {errors.phone?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center flex-col md:flex-row gap-5">
            <label
              htmlFor="email"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end"
            >
              Email
            </label>
            <div className="w-full flex flex-col justify-center">
              <Input
                placeholder="eg. branch@email.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`text-slate-700 w-full font-semibold ${
                  errors.email?.message && "border border-red-500"
                }`}
              />
              {errors.email?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Branch Manager with search */}
          <div className="flex items-start flex-col md:flex-row gap-5">
            <label
              htmlFor="managerId"
              className="w-56 text-[15px] font-semibold text-gray-600 text-start md:text-end mt-2"
            >
              Branch Manager
            </label>
            <div className="w-full flex flex-col">
              {/* Search box */}
              <Input
                placeholder="Search manager..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2 text-slate-700 font-semibold"
              />

              {/* Dropdown */}
              <select
                {...register("managerId")}
                value={selectedManager ?? ""}
                onChange={(e) => {
                  setSelectedManager(e.target.value);
                  setValue("managerId", e.target.value);
                }}
                className="border rounded-lg px-3 py-2 text-slate-700 font-semibold"
              >
                <option value="">-- Select Manager --</option>
                {filteredManagers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              onClick={() => {}}
              disabled={isPending}
              className="disable:opacity-50"
            >
              {isPending ? <FormLoading /> : "Add Branch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranch;
