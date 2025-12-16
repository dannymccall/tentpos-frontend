import React from "react";
import type { Ticket } from "@/types/ticket.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
import { ticketCategories } from "./ticketCategories";

const SubmitTicket = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Ticket>();

  const onSubmit = async (data: Ticket) => {
    console.log(data);
  };


  return (
    <div className="flex justify-center  py-20 max-w-7xl items-center m-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
                      {ticketCategories.map((c) => (
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
              <Input type="file" {...register("attachments")} className={`mt-2`} />
            </div>
          </div>

          <div className="flex md:justify-end">
            <Button>Submit Ticket</Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SubmitTicket;
