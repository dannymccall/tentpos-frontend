import type { Ticket } from "@/types/ticket.types";
import { Card, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FormLoading from "@/components/loaders/FormLoading";
import { tentPosTicketCategories } from "./ticketCategories";
import { useState } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { apiBase } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
const SubmitTicket = () => {
  const {
    register,
    // reset,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Ticket>();
  const [preview, setPreview] = useState<string | null>("");
  const queryClient = new QueryClient();
  const { showToast } = useNotification();

  const createTicket = useMutation({
    mutationFn: async (payLoad: FormData) => {
      return fetch(`${apiBase}/api/tickets/create`, {
        method: "POST",
        body: payLoad,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tentpos:sessionId")}`,
        },
      });
    },

    onSuccess: async (response) => {
      if (!response.ok) {
        const error = await response.json();

        showToast(error.message, "error");
        return;
      }
      const data = await response.json();

      showToast(data.message, "success");

      queryClient.invalidateQueries({
        queryKey: ["/api/tickets/tickets", 10],
      });
    },

    onError: (error: any) => {
      showToast(error.message ?? "Something went wrong", "error");
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    const formData = new FormData();

    // ---------- Primitive fields ----------
    formData.append("email", data.email);
    formData.append("subject", data.subject);

    // if (data.provisioningUrl) {
    formData.append("description", data.description);
    // }

    // ---------- Features ----------
    formData.append("priority", data.priority);
    formData.append("errorMessage", data.errorMessage);
    formData.append("category", data.category);

    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments as File[]).forEach((file: File) => {
        formData.append("attachments", file);
      });
    }

    // Screenshot captions + existing URLs

    createTicket.mutate(formData);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-5">
          <CardTitle>Submit a new ticket</CardTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="">
              <Label>Contact Email</Label>
              <Input
                {...register("email", { required: "Email required" })}
                className={`${
                  errors.email?.message ? "border-red-500" : ""
                } mt-2`}
                placeholder="example@gmail.com"
              />
              {errors.email?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label>Ticket Subject</Label>
              <Input
                {...register("subject", { required: "Subject required" })}
                className={`${
                  errors.subject?.message ? "border-red-500" : ""
                } mt-2`}
                placeholder="eg. error updating loans"
              />
              {errors.subject?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Problem Description</Label>
              <Textarea
                placeholder="Description you issue..."
                {...register("description", {
                  required: "Description required",
                })}
                className={`${
                  errors.description?.message ? "border-red-500" : ""
                } mt-2`}
              />
              {errors.description?.message && (
                <p className="text-red-500 mt-2 font-semibold text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Priority/Severity</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Category/Type</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {tentPosTicketCategories.map((c) => (
                        <SelectItem value={c.value} key={c.value}>
                          {c.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Error Code/Message</Label>
              <Input
                {...register("errorMessage")}
                className={`mt-2`}
                placeholder="eg. Internal Server error"
              />
            </div>
            <div>
              <Label>Time of Incident</Label>
              <Input
                type="time"
                {...register("time")}
                className={`mt-2`}
                placeholder="eg. 13:54"
              />
            </div>
            <div className="col-span-2">
              <Label>Attachments</Label>
              <Input
                type="file"
                multiple
                {...register("attachments")}
                className="mt-2"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {/* <Avatar className="h-16 w-16">
                {preview && <AvatarImage src={preview} />}
              </Avatar> */}
              <img src={preview!} className="w-32 mt-3" />
            </div>
          </div>

          <div className="flex md:justify-end">
            <Button disabled={createTicket.isPending}>
              {createTicket.isPending ? <FormLoading /> : "Submit Ticket"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SubmitTicket;
