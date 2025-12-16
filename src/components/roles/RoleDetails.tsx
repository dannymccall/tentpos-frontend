import React from "react";
import AddRoleForm from "./AddRole";
import { useQuery } from "@tanstack/react-query";
import { SpinnerCustom } from "../loaders/Spinner";
import api from "@/lib/api";

const RoleDetails = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["role-details"],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(`/api/roles/get-role?id=${id}`);
      console.log(res);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <SpinnerCustom />;

  if (!data) return;
  return (
    <div className="py-10">
      <AddRoleForm role={data} refetch={refetch} />
    </div>
  );
};

export default RoleDetails;
