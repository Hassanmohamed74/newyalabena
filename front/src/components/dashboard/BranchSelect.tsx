import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { branchesApi } from "@/api/branches";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BranchSelectProps {
  triggerClassName?: string;
  onChange?: (branchId: string | undefined) => void;
}

export function BranchSelect({ triggerClassName, onChange }: BranchSelectProps) {
  const { t } = useTranslation("dashboard");
  const user = useAuthStore((s) => s.user);
  const currentBranch = user?.branch_id;

  const isSuperAdmin = Array.isArray(user?.roles) && user.roles.includes("super_admin");

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: () => branchesApi.findAll(),
    enabled: isSuperAdmin,
  });

  if (!isSuperAdmin) return null;

  return (
    <Select
      onValueChange={(v) => {
        onChange?.(v === "" ? undefined : v);
      }}
      defaultValue={currentBranch ?? ""}
    >
      <SelectTrigger className={triggerClassName ?? "w-[200px]"}>

        <SelectValue placeholder={currentBranch ? branches.find((b) => b.id === currentBranch)?.name ?? t("selectBranch") : t("selectBranch")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{t("allBranches")}</SelectItem>
        {branches.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}