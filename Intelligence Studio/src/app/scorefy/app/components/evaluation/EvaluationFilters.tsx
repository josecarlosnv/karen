import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { X, Filter } from "lucide-react";

interface EvaluationFiltersProps {
  onFilterChange?: (filters: {
    status: string;
    role: string;
    client: string;
  }) => void;
}

export function EvaluationFilters({ onFilterChange }: EvaluationFiltersProps) {
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [client, setClient] = useState("all");

  const handleFilterChange = (type: "status" | "role" | "client", value: string) => {
    const newFilters = { status, role, client };
    newFilters[type] = value;

    if (type === "status") setStatus(value);
    if (type === "role") setRole(value);
    if (type === "client") setClient(value);

    onFilterChange?.(newFilters);
  };

  const handleClearFilters = () => {
    setStatus("all");
    setRole("all");
    setClient("all");
    onFilterChange?.({ status: "all", role: "all", client: "all" });
  };

  const activeFilterCount =
    (status !== "all" ? 1 : 0) + (role !== "all" ? 1 : 0) + (client !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      </div>

      <div className="flex flex-wrap gap-2 flex-1">
        {/* Status Filter */}
        <Select value={status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-[140px]" style={{ background: "var(--gradient-card)" }}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select value={role} onValueChange={(value) => handleFilterChange("role", value)}>
          <SelectTrigger className="w-[140px]" style={{ background: "var(--gradient-card)" }}>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="staff-in-charge">Staff in Charge</SelectItem>
            <SelectItem value="supervising-senior">Supervising Senior</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="senior-manager">Senior Manager</SelectItem>
          </SelectContent>
        </Select>

        {/* Client Filter */}
        <Select value={client} onValueChange={(value) => handleFilterChange("client", value)}>
          <SelectTrigger className="w-[180px]" style={{ background: "var(--gradient-card)" }}>
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="acme">Acme Corporation</SelectItem>
            <SelectItem value="techstart">TechStart Inc</SelectItem>
            <SelectItem value="global">Global Enterprises</SelectItem>
            <SelectItem value="innovation">Innovation Labs</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
