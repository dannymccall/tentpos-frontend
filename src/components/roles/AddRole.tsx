import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { useApiMutation } from "@/hooks/useApiMutation";
import { makeRequest } from "tenthub-request";
import { toCapitalized } from "@/lib/helperFunctions";
import { apiBase } from "@/lib/api";
import FormLoading from "../loaders/FormLoading";

type PermissionItem = { name: string; code_name: string; category: string };
type PermissionCategory = { category: string; permissions: PermissionItem[] };

type RoleFormValues = {
  name: string;
  description?: string;
  permissions: PermissionItem[];
  id?:number
};

const AddRoleForm = ({
  role,
  refetch,
}: {
  role?: RoleFormValues;
  refetch?: () => void;
}) => {
  const [permissionsCatalog, setPermissionCatalog] = useState<
    PermissionCategory[]
  >([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<RoleFormValues>({
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const watchedPermissions = watch("permissions") ?? [];

  async function fetchPermissions() {
    try {
      const response = await makeRequest(
        `/api/permissions/get-permissions`,
        { method: "GET" },
        apiBase
      );

      const grouped = response.data.data.reduce((acc: any, role: any) => {
        const category = toCapitalized(role.category);
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          code_name: role.code_name,
          name: role.permission_name,
          category,
        });
        return acc;
      }, {});

      const permissions: any = Object.entries(grouped).map(
        ([category, perms]) => ({
          category,
          permissions: perms,
        })
      );

      setPermissionCatalog(permissions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        
      });
    }
  }, [role, reset]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const toggleCategory = (cat: PermissionCategory) => {
    const catPerms = cat.permissions;
    console.log({catPerms})
    const current = getValues("permissions") ?? [];
    const allSelected = catPerms.every((perm) =>
      current.some((c: any) => c.code_name === perm.code_name)
    );

    if (allSelected) {
      setValue(
        "permissions",
        current.filter(
          (perm: any) => !catPerms.some((c) => c.code_name === perm.code_name)
        )
      );
    } else {
      const merged = [...current];
      catPerms.forEach((perm: any) => {
        if (!merged.some((c: any) => c.code_name === perm.code_name)) {
          merged.push(perm);
        }
      });
      setValue("permissions", merged);
    }
  };

  let url;
  let method;
  let validateKey;
  if (role) {
    url = `/api/roles/update-role`;
    method = "PUT" as any;
    validateKey = `role-details`;
  } else {
    url = `/api/roles/add-role`;
    method = "POST";
    validateKey = "/api/roles/get-roles";
  }

  const { mutate: addRole, isPending } = useApiMutation({
    url: url,
    method: method,
    invalidateKey: validateKey,
    onSuccessCallback: () => {
      if (role) {
        refetch && refetch();
        return;
      }
      reset();
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    const finalPayload = {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    };
    addRole(role ? {...finalPayload, id: role.id} : finalPayload);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
      >
        <Card className="w-full m-10  border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">
              Add New Role
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Administrator"
                    {...register("name", { required: "Role name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <Textarea
                    placeholder="e.g. Full access to manage users and loans"
                    {...register("description")}
                  />
                </div>
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-700">
                  Permissions
                </h3>
                <ScrollArea className=" rounded-md border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionsCatalog.map((cat, index) => {
                      const allSelected = cat.permissions.every((p) =>
                        watchedPermissions.some(
                          (w: any) => w.code_name === p.code_name
                        )
                      );

                      return (
                        <Card
                          key={index}
                          className="border border-gray-100 shadow-sm p-4 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">
                              {cat.category}
                            </h4>
                            <Button
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              variant="ghost"
                              size="sm"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {allSelected ? "Unselect all" : "Select all"}
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                            {cat.permissions.map((perm, idx) => (
                              <Controller
                                key={idx}
                                name="permissions"
                                control={control}
                                render={({ field }) => {
                                  const selected = field.value ?? [];
                                  const isChecked = selected.some(
                                    (c: any) => c.code_name === perm.code_name
                                  );

                                  return (

                                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                          let next: any[] = [...selected];
                                          if (checked) {
                                            if (
                                              !next.some(
                                                (c: any) =>
                                                  c.code_name === perm.code_name
                                              )
                                            ) {
                                              next.push(perm);
                                            }
                                          } else {
                                            next = next.filter(
                                              (c) =>
                                                c.code_name !== perm.code_name
                                            );
                                          }
                                          field.onChange(next);
                                        }}
                                      />
                                      <span>{perm.name}</span>
                                    </label>
                                  );
                                }}
                                />
                              ))}
                              </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#0f172b] hover:bg-[#182547] text-white font-medium px-6"
                >
                  {isPending ? <FormLoading /> : "Save Role"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddRoleForm;
