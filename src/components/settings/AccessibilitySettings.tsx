import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFetchRoles } from "@/hooks/useFetchRoles";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Replace with your API lib (axios/fetch wrapper)

export const ENTITIES = [
  "dashboard",

  // Sales
  "sales",
  "orders",
  "returns",
  "discounts",
  "holdBills",

  // Inventory
  "products",
  "categories",
  "stockAdjustments",
  "lowStock",

  // Purchases
  "suppliers",
  "purchases",

  // Customers
  "customers",
  "debtors",

  // Expenses
  "expenses",
  "expenseCategories",

  // Staff & Ops
  "branches",
  "staff",
  "roles",

  // Reports
  "salesReports",
  "inventoryReports",
  "dailyReports",

  // Accounting
  "accounts",
  "transactions",
  "ledgers",
  "financialStatements",

  "settings",
];

export const SCOPES = [
  { value: "personal", label: "Personal" },
  { value: "all", label: "All" },
  { value: "branch", label: "Branch" },
  { value: "none", label: "None" },
];

type EntityScope = { entity: string; scope: string };

type Role = {
  id: number;
  name: string;
  description?: string;
  permissions?: any[];
};

export default function AccessibilitySettings() {
  //   const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [scopes, setScopes] = useState<EntityScope[]>([]);
  const [loading, setLoading] = useState(false);

  const { roles } = useFetchRoles();
  const { showToast } = useNotification();
  useEffect(() => {
    if (!selectedRole) return;
    setLoading(true);
    api
      .get(`/api/role-data-scope?roleId=${selectedRole.id}`)
      .then((res) => {
        // normalize
        console.log(res);
        const existing = res?.data ? res?.data.scopes : [];
        // ensure all entities exist in state
        const merged = ENTITIES.map((e) => ({
          entity: e,
          scope: existing.find((s: any) => s.entity === e)?.scope || "none",
        }));
        setScopes(merged);
      })
      .finally(() => setLoading(false));
  }, [selectedRole]);

  const updateScope = (entity: string, value: string) => {
    console.log(entity, value);
    setScopes((prev) =>
      prev.map((p) => (p.entity === entity ? { ...p, scope: value } : p))
    );
  };

  const save = async () => {
    if (!selectedRole) return showToast("Select a role first");
    console.log(scopes);
    setLoading(true);
    const payload = { roleId: selectedRole.id, scopes };
    await api.post("/api/role-data-scope/update", payload);
    setLoading(false);
    showToast("Saved");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Role Data Scope Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label className="mb-3">Choose Role</Label>
              <Select
                value={String(selectedRole?.id) || ""}
                onValueChange={(value) => {
                  const id = Number(value);
                  setSelectedRole(roles.find((r) => r.id === id) || null);
                }} 
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Auto-extracted Modules (from role permissions)</Label>
              <Input
                placeholder="Example: clients, loans..."
                value={(selectedRole?.permissions || [])
                  .map((p: any) => p.category)
                  .filter(Boolean)
                  .slice(0, 5)
                  .join(", ")}
                readOnly
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scopes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Entity</th>
                  {SCOPES.map((s) => (
                    <th key={s.value} className="p-2 text-center">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scopes.map((row) => (
                  <tr key={row.entity} className="border-t">
                    <td className="p-2 capitalize">
                      {row.entity.replace(/_/g, " ")}
                    </td>
                    {SCOPES.map((s) => (
                      <td key={s.value} className="p-2 text-center">
                        <input
                          type="radio"
                          name={`scope-${row.entity}`}
                          checked={row.scope === s.value}
                          onChange={() => updateScope(row.entity, s.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (selectedRole)
                  setScopes(
                    ENTITIES.map((e) => ({ entity: e, scope: "none" }))
                  );
              }}
            >
              Reset
            </Button>
            <Button onClick={save} disabled={!selectedRole || loading}>
              {loading ? "Saving..." : "Save Scopes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Notes:</p>
        <ul className="list-disc ml-6">
          <li>
            Modules are auto-populated; you can edit scopes per module for the
            selected role.
          </li>
          <li>
            Some modules like "settings" or "roles" may only support{" "}
            <strong>all</strong> or <strong>none</strong> — consider disabling
            radios for those in UI if needed.
          </li>
        </ul>
      </div>
    </div>
  );
}
