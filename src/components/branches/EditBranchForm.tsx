import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Branch } from "../../types/branch.type";
import { useNotification } from "../../context/NotificationContext";
import FormLoading from "../loaders/FormLoading";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { makeRequest } from "@/lib/helperFunctions";

interface BranchFormProps {
  mode: "add" | "view" | "edit";
  branch?: Branch;
  onSuccess: () => void;
}

const EditBranchForm: React.FC<BranchFormProps> = ({
  mode,
  branch,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useNotification();
  const managers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Mary Jane" },
    { id: "3", name: "Kwame Mensah" },
    { id: "4", name: "Akosua Owusu" },
  ];

  const isReadOnly = mode === "view";

  const filteredManagers = useMemo(() => {
    return managers.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Branch>();

  useEffect(() => {
    if (branch && (mode === "view" || mode === "edit")) {
      reset({
        name: branch.name,
        code: branch.code || "",
        address: branch.address || "",
        city: branch.city,
        region: branch.region,
        phone: branch.phone,
        email: branch.email,
      });
    } else if (mode === "add") {
      reset({
        name: "",
        code: "",
        address: "",
        city: "",
        region: "",
        phone: "",
        email: "",
      });
    }
  }, [branch, mode]);
  const onSubmit = async (data: Branch) => {
    setLoading(true);
    console.log("Branch data:", data);

    try {
      const response = await makeRequest(
        `/api/branches/update-branch`,
        { method: "PUT", body: JSON.stringify({...data, id:branch?.id}) },
      );
      if (response.status === "error") {
        showToast(response.error?.message!, "error");
        setLoading(false);
        return;
      }
      showToast(response.message!, "success");
      setLoading(false);
      onSuccess()
    } catch (error: any) {
      setLoading(false);
      showToast(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-full md:w-3xl p-5 rounded-lg">
        {/* <h1 className="text-center mb-5 font-semibold text-gray-600">
          Add New Branch
        </h1> */}
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
                placeholder="eg. Main Branch"
                type="text"
                {...register("name", { required: "Branch name is required" })}
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.name?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.address?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.city?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.region?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.phone?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                readOnly={isReadOnly}
                className={`text-slate-700 w-full font-semibold border rounded p-2 ${
                  errors.email?.message ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            {mode !== "view" && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  onClick={() => {}}
                  disabled={loading}
                  className="disable:opacity-50"
                >
                  {loading ? (
                    <FormLoading />
                  ) : mode === "add" ? (
                    "Add Branch"
                  ) : (
                    "Update Branch"
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBranchForm;
