import { useAuth } from "@/context/AuthContext";
import { Card, CardTitle } from "../ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import { Button } from "../Button";

const PersonalProfileSettings = () => {
  const { user, businessProfile,  updateProfilePicture} = useAuth();
  const { showToast } = useNotification();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const role = businessProfile?.userRole?.role;
  const permissions = role?.permissions || [];

  const handleUpload = async () => {
    if (!logoPreview) return;
    setLoading(true);
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = fileInput?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // call your API
      // await updateAvatar(formData);
      const res = await api.put(
        `/api/users/avatar?id=${businessProfile?.id}`,
        formData,
        { headers: { "x-app-name": "tentpos" } },
      );
      setLoading(false);
      if (res.success === true) {
        showToast(res.message, "success");
        setLogoPreview(null);
        // fetchMe();
        updateProfilePicture(res.avatar)
        return
      }

      showToast("Something happened", "error");
    } catch (err) {
      setLoading(false);
      console.error("❌ Upload failed", err);
    }
  };
  return (
    <div className="p-2 md:py-10 h-full">
      <Card className="mx-auto w-full md:w-3xl p-5 space-y-6">
        <CardTitle className="text-sm">Professional Profile</CardTitle>

        {/* Avatar Section */}
        <div className="relative flex gap-5 items-center">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24 border border-gray-200 shadow-sm">
              <AvatarImage
                src={logoPreview || businessProfile?.avatar!}
                alt={businessProfile?.fullName}
              />
              <AvatarFallback>
                {businessProfile?.fullName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <label className="text-xs cursor-pointer text-blue-600 hover:underline">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>
            {logoPreview && (
              <Button
                className="text-xs bg-black text-white  rounded"
                onClick={handleUpload}
                size={"sm"}
                loading={loading}
              >
                Save Avatar
              </Button>
            )}
          </div>

          <div>
            <h1 className="text-sm font-semibold">{user?.fullName}</h1>
            <p className="text-sm text-gray-500">{businessProfile?.email}</p>
            <p className="text-xs text-gray-400 capitalize">
              {businessProfile?.appRole}
            </p>
          </div>
        </div>

        <Separator />
        <p className="text-xs text-gray-400">
          Profile details are managed in App Center
        </p>
        {/* Basic Info */}
        <div className="space-y-2">
          <InfoRow label="Full Name" value={businessProfile?.fullName} />
          <InfoRow label="Email" value={businessProfile?.email} />
          <InfoRow label="Branch" value={businessProfile?.branch?.name} />
          <InfoRow label="Role" value={role?.name} />
        </div>

        <Separator />

        {/* Permissions */}
        <PermissionsSection permissions={permissions} />
      </Card>
    </div>
  );
};

export default PersonalProfileSettings;

const PermissionsSection = ({ permissions }: { permissions: any[] }) => {
  if (!permissions || permissions.length === 0) return null;

  const groupPermissions = (permissions: any[]) => {
    return permissions.reduce((acc: any, perm: any) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {});
  };
  const grouped = groupPermissions(permissions);

  return (
    <div className="mt-4 space-y-4">
      <h2 className="font-semibold text-sm">Permissions</h2>

      {Object.entries(grouped).map(([category, perms]: any) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {perms.map((p: any) => (
              <span
                key={p.code_name}
                className="px-2 py-1 text-xs bg-gray-100 rounded-md"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;

  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
};
