import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BranchSelectProps {
  className?: string;
  branches?: { id: string; name: string }[];
  onChange?: (branchId: string | undefined) => void;
}

export function BranchSelect({ className, branches: branchesProp = [], onChange }: BranchSelectProps) {
  const { t } = useTranslation("dashboard");
  const user = useAuthStore((s) => s.user);
  const branches = branchesProp.length > 0 ? branchesProp : ((user as any)?.branches ?? []);
  const currentBranch = user?.branch_id;

  const isSuperAdmin = Array.isArray(user?.roles) && user.roles.includes("super_admin");

  if (!isSuperAdmin) return null;

  return (
    <Select
      onValueChange={(v) => {
        onChange?.(v === "" ? undefined : v);
      }}
    >
      <SelectTrigger className={cn("w-[200px]", className)}>
        <SelectValue placeholder={currentBranch ? branches.find((b: any) => b.id === currentBranch)?.name ?? t("selectBranch") : t("selectBranch")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{t("allBranches")}</SelectItem>
        {branches.map((b: any) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}