"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Globe, Settings, Palette } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { blobToFile } from "@/lib/helperFunctions";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";
interface AppProfileForm {
  name: string;
  email: string;
  website: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function AppProfileSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const {setSettings} = useAuth()
  const queryClient = new QueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["profile-settings"],
    queryFn: async () => {
      const res = await api.get("/api/profile-settings/get-settings");
      console.log(res);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  console.log( data );
  const {showToast} = useNotification()
  const form = useForm<AppProfileForm>({
    defaultValues: {
      // name: "APE Credit",
      // email: "support@apecredit.com",
      // website: "https://apecredit.com",
      // description:
      //   "APE Credit helps businesses manage loans, clients, and repayments with ease.",
      // primaryColor: "#203244",
      // secondaryColor: "#00A86B",
    },
  });

  console.log(data)
  const {reset, formState:{}, } = form;

  useEffect(() => {
    if(data){
      reset(data)
    } 
  },[reset, data])

  const profileMutation = useMutation({
    mutationFn: async (payLoad: FormData) => {
      return api.put(`/api/profile-settings/save-settings`, payLoad);
    },

    onSuccess: async (response) => {
      showToast(response.message, "success");
      setSettings({logo: response.data.logo, companyName: response.data.name})
      queryClient.invalidateQueries({
        queryKey: [`profile-settings`, 10],
      });
    },

    onError: (error: any) => {
      showToast(error.message ?? "Something went wrong","error");
    },
  });
  const handleSave = async (data: AppProfileForm) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API delay
    setIsSaving(false);
    console.log({logoPreview})
    const file = await blobToFile(logoPreview!, "logo");

    const settings = { ...data, logo: file };
    const formData = new FormData();

    (Object.keys(settings) as Array<keyof typeof settings>).forEach((key) => {
      const value = settings[key];
      if (value !== undefined && value !== null) {
        if (value instanceof File && logoPreview) {
          formData.append("logo", value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value)); // handle nested objects
        } else {
          formData.append(key, String(value));
        }
      }
    });

    console.log(formData.get("logo"));
    profileMutation.mutate(formData);
    // toast.success("Profile updated successfully!");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  if(isLoading) return <SpinnerCustom />
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative px-4 h-screen"
      >
        <div className="p-6 w-full max-w-5xl mx-auto">
          {/* Header */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
            <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  {data && data.logo ? (
                    <img
                      src={logoPreview || data.logo}
                      alt="Logo"
                      className="w-full h-full rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLogoChange}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    God is Good
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    POS
                  </p>
                </div>
              </div>
              <div>
                <Switch defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full overflow-x-auto no-scrollbar bg-gray-50 dark:bg-gray-900 border-b">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> General
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Palette className="w-4 h-4" /> Branding
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuration
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={form.handleSubmit(handleSave)}
                    className="space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label>App Name</Label>
                        <Input {...form.register("name")} />
                      </div>
                      <div>
                        <Label>Business Email</Label>
                        <Input {...form.register("email")} type="email" />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input {...form.register("website")} type="url" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          {...form.register("description")}
                          rows={4}
                          placeholder="Enter app description..."
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={form.handleSubmit(handleSave)}
                    className="space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label>Primary Color</Label>
                        <Input
                          type="color"
                          {...form.register("primaryColor")}
                        />
                      </div>
                      <div>
                        <Label>Secondary Color</Label>
                        <Input
                          type="color"
                          {...form.register("secondaryColor")}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Config Tab (Future Use) */}
            <TabsContent value="config">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Future configurations for API keys, webhooks, and
                    integrations will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
