import { useState, useMemo, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/app/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Label } from "@/app/components/ui/label";
import {
  Search, Plus, Pencil, Trash2, Users, ChevronDown,
  UserPlus, Shield, Building2, Vote,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/app/components/ui/utils";

type Role = "KEY" | "ALL" | "TOP" | "MGR" | "STF" | "PIE" | "HLSTM";

interface User {
  id: number;
  email: string;
  role: Role;
  bu: string | null;
  isCommittee: boolean | null;
  typeCommittee: string | null;
}

const ROLES: Role[] = ["KEY", "ALL", "TOP", "MGR", "STF", "PIE", "HLSTM"];
const BUS = ["UNNE", "UNO", "CIM", "TMT"];
const COMMITTEE_TYPES = ["Ambos", "Evaluador", "Evaluado"];

const rolePillStyles: Record<Role, { bg: string; text: string }> = {
  KEY:   { bg: "#E8EEF7", text: "#00338D" },
  ALL:   { bg: "#E6F4F1", text: "#00665E" },
  TOP:   { bg: "#F3EEF8", text: "#6B21A8" },
  MGR:   { bg: "#FEF3E2", text: "#92400E" },
  STF:   { bg: "#F1F5F9", text: "#334155" },
  PIE:   { bg: "#FFF0F0", text: "#B91C1C" },
  HLSTM: { bg: "#FFF7E6", text: "#B45309" },
};


function RolePill({ role }: { role: Role }) {
const style = rolePillStyles[role] ?? { bg: "#F1F5F9", text: "#334155" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
      style={{ background: style.bg, color: style.text }}
    >
      {role}
    </span>
  );
}

function CommitteeBadge({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-gray-400 text-sm">—</span>;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={value ? { background: "#E6F4F1", color: "#00665E" } : { background: "#F1F5F9", color: "#64748B" }}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function Null() {
  return <span className="text-gray-400 text-sm">—</span>;
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#E8EEF7" }}>
        <Users className="w-8 h-8" style={{ color: "#00338D" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: "#0C233C" }}>No users found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters, or add a new user.</p>
      </div>
      <Button size="sm" onClick={onAdd} style={{ background: "var(--gradient-primary)", color: "#fff", border: "none" }}>
        <UserPlus className="w-4 h-4 mr-1.5" />
        Add User
      </Button>
    </div>
  );
}

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" style={{ color: "#0C233C", borderColor: "#CBD5E1" }}>
          {value || label}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem onClick={() => onChange("")} className="text-xs text-gray-500">All {label}s</DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)} className="text-xs">{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface UserModalProps {
  open: boolean;
  user: Partial<User> | null;
  onClose: () => void;
  onSave: (user: Omit<User, "id"> & { id?: number }) => void;
}

function UserModal({ open, user, onClose, onSave }: UserModalProps) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState<Omit<User, "id">>({
    email: "",
    role: "STF",
    bu: null,
    isCommittee: null,
    typeCommittee: null,
  });

  useEffect(() => {
    if (open) {
      setForm({
        email: user?.email ?? "",
        role: user?.role ?? "STF",
        bu: user?.bu ?? null,
        isCommittee: user?.isCommittee ?? null,
        typeCommittee: user?.typeCommittee ?? null,
      });
    }
  }, [open, user]);

  const valid = form.email.trim().length > 0;



  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); else handleOpen(); }}>
<DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle style={{ color: "#0C233C" }}>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#0C233C" }}>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="user@kpmg.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#0C233C" }}>Role <span className="text-red-500">*</span></Label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#0C233C" }}>Business Unit</Label>
            <select
              value={form.bu ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bu: e.target.value || null }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">— None —</option>
              {BUS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#0C233C" }}>Is Committee Member</Label>
            <select
              value={form.isCommittee === null ? "" : form.isCommittee ? "1" : "0"}
              onChange={(e) => {
                const val = e.target.value;
                const parsed = val === "" ? null : val === "1";
                setForm((f) => ({ ...f, isCommittee: parsed, typeCommittee: parsed ? f.typeCommittee : null }));
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">— Not set —</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {form.isCommittee === true && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium" style={{ color: "#0C233C" }}>Committee Type</Label>
              <select
                value={form.typeCommittee ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, typeCommittee: e.target.value || null }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— None —</option>
                {COMMITTEE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!valid}
            onClick={() => onSave({ ...form, id: user?.id })}
            style={{ background: "var(--gradient-primary)", color: "#fff", border: "none" }}
          >
            {isEdit ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InactiveTab({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button disabled className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-md opacity-40 cursor-not-allowed select-none" style={{ color: "#64748B" }} title="Coming soon">
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export function Administration() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterBU, setFilterBU] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const API_BASE = import.meta.env.VITE_SCOREFY_API_URL;

  useEffect(() => {
    fetch(`${API_BASE}/api/administration/users`, { credentials: "include" })
      .then(async (r) => {
        if (r.status === 403) { setAccessDenied(true); return []; }
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) return;
setUsers(data.map((u: any) => ({
  id: u.id,
  email: u.email,
  role: u.role as Role,
  bu: u.bu,
  isCommittee: u.is_Committee,
  typeCommittee: u.typeCommittee,
})));

      })
      .catch(() => toast.error("Error cargando usuarios."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !filterRole || u.role === filterRole;
      const matchBU = !filterBU || u.bu === filterBU;
      return matchSearch && matchRole && matchBU;
    });
  }, [users, search, filterRole, filterBU]);

  const openAdd = () => { setEditingUser({}); setModalOpen(true); };
  const openEdit = (user: User) => { setEditingUser(user); setModalOpen(true); };

  const handleSave = async (data: Omit<User, "id"> & { id?: number }) => {
    const body = { email: data.email, role: data.role, bu: data.bu, isCommittee: data.isCommittee, typeCommittee: data.typeCommittee };
    try {
      if (data.id) {
        await fetch(`${API_BASE}/api/administration/users/${data.id}`, {
          method: "PUT", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setUsers((prev) => prev.map((u) => u.id === data.id ? { ...u, ...data, id: u.id } : u));
        toast.success("User updated successfully.");
      } else {
        const res = await fetch(`${API_BASE}/api/administration/users`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const { id } = await res.json();
        setUsers((prev) => [...prev, { ...data, id }]);
        toast.success("User added successfully.");
      }
    } catch {
      toast.error("Error guardando usuario.");
    }
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${API_BASE}/api/administration/users/${deleteTarget.id}`, {
        method: "DELETE", credentials: "include",
      });
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success(`${deleteTarget.email} removed.`);
    } catch {
      toast.error("Error eliminando usuario.");
    }
    setDeleteTarget(null);
  };

  const hasActiveFilters = filterRole || filterBU || search;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Shield className="w-12 h-12 text-gray-300" />
        <p className="font-semibold text-gray-500">Access Denied</p>
        <p className="text-xs text-gray-400">Only ALL role users can access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold" style={{ color: "#00338D" }}>Administration</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>Manage system data and configurations</p>
      </motion.div>

      <div className="flex items-end gap-0 border-b border-slate-200">
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px" style={{ color: "#00338D", borderBottomColor: "#00338D" }}>
          <Users className="w-4 h-4" />Users
        </button>
        <InactiveTab icon={Shield} label="Roles" />
        <InactiveTab icon={Building2} label="Business Units" />
        <InactiveTab icon={Vote} label="Committees" />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <Card className="border border-slate-200" style={{ boxShadow: "var(--shadow-md)", borderRadius: "var(--radius-xl)" }}>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-semibold" style={{ color: "#00338D" }}>User Management</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <Input placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs w-52" />
                </div>
                <FilterDropdown label="Role" options={ROLES} value={filterRole} onChange={setFilterRole} />
                <FilterDropdown label="BU" options={BUS} value={filterBU} onChange={setFilterBU} />
                {hasActiveFilters && (
                  <button onClick={() => { setSearch(""); setFilterRole(""); setFilterBU(""); }} className="text-xs underline" style={{ color: "#64748B" }}>Clear</button>
                )}
                <Button size="sm" onClick={openAdd} className="h-8 text-xs gap-1.5" style={{ background: "var(--gradient-primary)", color: "#fff", border: "none" }}>
                  <Plus className="w-3.5 h-3.5" />Add User
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                      {["ID", "Email", "Role", "BU", "Is Committee", "Committee Type", "Actions"].map((h, i) => (
                        <TableHead key={h} className={cn("text-xs font-semibold", i === 6 && "text-right pr-4")} style={{ color: "#64748B", ...(i === 0 && { width: "3rem" }) }}>
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((user, idx) => (
                      <TableRow key={user.id} className={cn("transition-colors hover:bg-blue-50/40 cursor-default border-b border-slate-50", idx % 2 === 1 && "bg-slate-50/60")}>
                        <TableCell className="text-xs text-gray-400 font-mono py-3">{String(user.id).padStart(3, "0")}</TableCell>
                        <TableCell className="text-sm font-medium py-3" style={{ color: "#0C233C" }}>{user.email}</TableCell>
                        <TableCell className="py-3"><RolePill role={user.role} /></TableCell>
                        <TableCell className="text-sm py-3" style={{ color: "#0C233C" }}>{user.bu ?? <Null />}</TableCell>
                        <TableCell className="py-3"><CommitteeBadge value={user.isCommittee} /></TableCell>
                        <TableCell className="text-sm py-3" style={{ color: "#0C233C" }}>{user.typeCommittee ?? <Null />}</TableCell>
                        <TableCell className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(user)} className="p-1.5 rounded-md transition-colors hover:bg-blue-100 group" title="Edit user">
                              <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </button>
                            <button onClick={() => setDeleteTarget(user)} className="p-1.5 rounded-md transition-colors hover:bg-red-50 group" title="Delete user">
                              <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <UserModal open={modalOpen} user={editingUser} onClose={() => { setModalOpen(false); setEditingUser(null); }} onSave={handleSave} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong className="font-semibold">{deleteTarget?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
