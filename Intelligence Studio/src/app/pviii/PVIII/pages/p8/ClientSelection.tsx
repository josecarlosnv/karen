import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Building2,
  Trash2,
  MoreVertical,
  Copy,
  CircleAlert,
  ChevronDown,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { p8GeneralesApi } from "../../api/p8GeneralesApi";
import { catalogoSegmentoApi } from "../../api/CatalogoSegmentoApi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type StatusFilter = "approved" | "pending" | "progress" | "draft" | null;

export default function ClientSelection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [segmentDropdownOpen, setSegmentDropdownOpen] = useState(false);
  const [segmentSearchQuery, setSegmentSearchQuery] = useState("");
  const segmentDropdownRef = useRef<HTMLDivElement>(null);

  const [ingresoFilter, setIngresoFilter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [segmentos, setSegmentos] = useState<any[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    p8GeneralesApi.list().then((list) => {
      const normalized = list.map((c: any) => ({
        ...c,
        _search: [
          c.name,
          c.partner,
          c.manager,
          c.IdP8,
          c.id,
          c.lastP8,
          c.ingreso,
          c.segment,
          c.status,
          c.BU, 
        ]
          .join(" ")
          .toLowerCase()
          .replace(/\r?\n|\r/g, "")
          .trim(),
      }));

      setClients(normalized);
    });

    loadSegmentos();
  }, []);
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const list = await p8GeneralesApi.list();

                const normalized = list.map((c: any) => ({
                    ...c,
                    _search: [
                        c.name,
                        c.partner,
                        c.manager,
                        c.IdP8,
                        c.id,
                        c.lastP8,
                        c.ingreso,
                        c.segment,
                        c.status,
                        c.BU,
                    ]
                        .join(" ")
                        .toLowerCase()
                        .replace(/\r?\n|\r/g, "")
                        .trim(),
                }));

                setClients(normalized);
            } catch (err) {
                console.error("Error refreshing clients", err);
            }
        };

        fetchClients();

        const interval = setInterval(fetchClients, 10000); 

        return () => clearInterval(interval);
    }, []);
  useEffect(() => {
    if (!segmentDropdownOpen) return;

    const handleOutside = (e: MouseEvent) => {
      if (
        segmentDropdownRef.current &&
        !segmentDropdownRef.current.contains(e.target as Node)
      ) {
        setSegmentDropdownOpen(false);
        setSegmentSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [segmentDropdownOpen]);

  const clean = (s: any) => {
    if (s === null || s === undefined) return "";
    return String(s).replace(/\r?\n|\r/g, "").trim().toLowerCase();
  };

  const normalizeStatus = (
    status: any
  ): "approved" | "pending" | "progress" | "draft" | "" => {
    const value = clean(status);

    if (value === "approved") return "approved";
    if (
      value === "pending" ||
      value === "pending-approval" ||
      value === "pending approval"
    )
      return "pending";
    if (value === "progress" || value === "in progress") return "progress";
    if (value === "draft") return "draft";

    return "";
  };

  const loadSegmentos = async () => {
    try {
      const data = await catalogoSegmentoApi.listSegmentos();
      setSegmentos(data);
    } catch (err) {
      console.error("Error loading segmentos", err);
    }
  };

  const segmentOptions = useMemo(() => {
    return segmentos.map((s) => ({
      value: s.segmentoNombre,
      label: s.segmentoNombre,
      key: s.segmentoId ?? s.segmentoNombre,
    }));
  }, [segmentos]);

  const filteredSegmentOptions = useMemo(() => {
    const text = clean(segmentSearchQuery);

    if (!text) return segmentOptions;

    return segmentOptions.filter(
      (opt) =>
        clean(opt.label).includes(text) || clean(opt.value).includes(text)
    );
  }, [segmentOptions, segmentSearchQuery]);

  const toggleSegment = (value: string) => {
    setSelectedSegments((prev) =>
      prev.includes(value)
        ? prev.filter((segment) => segment !== value)
        : [...prev, value]
    );
  };

  const clearSegments = () => {
    setSelectedSegments([]);
    setSegmentSearchQuery("");
  };

  const segmentTriggerLabel =
    selectedSegments.length === 0
      ? "All segments"
      : selectedSegments.length === 1
      ? selectedSegments[0]
      : `${selectedSegments.length} segments selected`;

  const baseFilteredClients = useMemo(() => {
    const text = searchQuery.toLowerCase().trim();

    return clients.filter((c) => {
      const matchesSearch = text === "" || c._search?.includes(text);

      const matchesSegment =
        selectedSegments.length === 0 ||
        selectedSegments.some(
          (segment) => clean(c.segment) === clean(segment)
        );

      const ingreso = clean(c.ingreso);

      const matchesIngreso =
        ingresoFilter === "all" ||
        (ingresoFilter === "Current" && ingreso === "recurring") ||
        (ingresoFilter === "Contingent" && ingreso !== "recurring");

      return matchesSearch && matchesSegment && matchesIngreso;
    });
  }, [clients, searchQuery, selectedSegments, ingresoFilter]);

  const kpis = useMemo(() => {
    return baseFilteredClients.reduce(
      (acc, c) => {
        const status = normalizeStatus(c.status);

        if (status === "approved") acc.approved++;
        if (status === "pending") acc.pending++;
        if (status === "progress") acc.progress++;
        if (status === "draft") acc.draft++;

        return acc;
      },
      { approved: 0, pending: 0, progress: 0, draft: 0 }
    );
  }, [baseFilteredClients]);

  const filteredClients = useMemo(() => {
    return baseFilteredClients.filter((c) => {
      const status = normalizeStatus(c.status);
      return selectedStatus === null || status === selectedStatus;
    });
  }, [baseFilteredClients, selectedStatus]);

  const getStatusLabel = (status: string) => {
    const normalized = normalizeStatus(status);

    if (normalized === "approved") return "Approved";
    if (normalized === "pending") return "Pending";
    if (normalized === "progress") return "Progress";
    if (normalized === "draft") return "Draft";

    return status ?? "";
  };

  const handleKpiClick = (status: Exclude<StatusFilter, null>) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  const openDeleteModal = (client: any) => {
    setClientToDelete(client);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setClientToDelete(null);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      setIsDeleting(true);

      const idToDelete = clientToDelete.IdP8;
      await p8GeneralesApi.deactivate(idToDelete);

      setClients((prev) => prev.filter((c) => c.IdP8 !== idToDelete));

      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting project", err);
    } finally {
      setIsDeleting(false);
    }
  };
    const handleMarkAsLostClient = async (client: any) => {
        try {
            await p8GeneralesApi.IsLost(client.IdP8);

            setClients((prev) =>
                prev.map((c) =>
                    c.IdP8 === client.IdP8
                        ? {
                            ...c,
                            lostClient: true,
                        }
                        : c
                )
            );
        } catch (err) {
            console.error("Error marking as lost client", err);
        }
    };
    const handleDuplicate = async (client: any) => {
        try {
            const res = await p8GeneralesApi.duplicate(client.IdP8);

            const newProject = res.data.object;

            const list = await p8GeneralesApi.list();
            setClients(list);


        } catch (err) {
            console.error("Error duplicating project", err);
        }
    };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient
            id="kpmgBlueGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00338D" />
            <stop offset="100%" stopColor="#1E49E2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-br from-[#00338D]/8 via-[#1E49E2]/8 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#1E49E2]/8 via-[#00338D]/8 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60vh] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-[#00338D]/6 via-[#1E49E2]/6 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00338D 1px, transparent 1px),
              linear-gradient(to bottom, #00338D 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative bg-slate-50/50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="mb-5">
            <h1
              className="text-[#00338d] font-light text-[28px] tracking-[0.02em] transition-colors duration-300"
              style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
            >
              Portfolio
            </h1>
          </div>

          <div className="flex items-start gap-6 mb-5 flex-wrap">
            <KpiBox
              value={kpis.approved}
              label="Approved"
              active={selectedStatus === "approved"}
              onClick={() => handleKpiClick("approved")}
            />
            <KpiBox
              value={kpis.pending}
              label="Pending"
              active={selectedStatus === "pending"}
              onClick={() => handleKpiClick("pending")}
            />
            <KpiBox
              value={kpis.progress}
              label="Progress"
              active={selectedStatus === "progress"}
              onClick={() => handleKpiClick("progress")}
            />
            <KpiBox
              value={kpis.draft}
              label="Drafts"
              active={selectedStatus === "draft"}
              onClick={() => handleKpiClick("draft")}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by client, lead engagement, id pviii..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 text-xs border-slate-200/80 focus:outline-none focus:border-[#1E49E2] focus:ring-0 focus-visible:outline-none focus:ring-offset-0 placeholder:text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-0.5 bg-slate-50/60 p-0.5 rounded-md border border-slate-200/60">
              <button
                onClick={() => setIngresoFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  ingresoFilter === "all"
                    ? "bg-white text-[#00338D] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setIngresoFilter("Current")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  ingresoFilter === "Current"
                    ? "bg-white text-[#00338D] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setIngresoFilter("Contingent")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  ingresoFilter === "Contingent"
                    ? "bg-white text-[#00338D] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Contingent
              </button>
            </div>

            <div className="relative w-full lg:w-72" ref={segmentDropdownRef}>
              <button
                type="button"
                onClick={() => setSegmentDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between w-full h-9 px-3 text-sm font-normal text-slate-700 bg-white border border-slate-200/80 rounded-md hover:border-slate-300 transition-colors"
              >
                <span className="truncate">{segmentTriggerLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
              </button>

              <AnimatePresence>
                {segmentDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.13 }}
                    className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md overflow-hidden"
                  >
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          value={segmentSearchQuery}
                          onChange={(e) => setSegmentSearchQuery(e.target.value)}
                          placeholder="Search segment..."
                          className="h-9 pl-9 pr-3 text-sm border-slate-200 focus:outline-none focus:border-[#1E49E2] focus:ring-0 focus-visible:outline-none focus:ring-offset-0"
                        />
                      </div>

                      {selectedSegments.length > 0 && (
                        <button
                          type="button"
                          onClick={clearSegments}
                          className="mt-2 text-xs text-[#00338D] hover:text-[#1E49E2] transition-colors"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto py-1">
                      {filteredSegmentOptions.length > 0 ? (
                        filteredSegmentOptions.map((opt) => {
                          const selected = selectedSegments.includes(opt.value);

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => toggleSegment(opt.value)}
                              className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <span className="truncate text-left pr-3">
                                {opt.label}
                              </span>
                              {selected && (
                                <Check className="h-4 w-4 text-[#00338D] shrink-0" />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-3 text-sm text-slate-500">
                          No segments found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/p8/new-project">
              <Button
                variant="outline"
                className="h-9 text-sm border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              >
                <Building2 className="w-3.5 h-3.5 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <ClientCard
                key={client.id ?? client.IdP8}
                client={client}
                index={index}
                getStatusLabel={getStatusLabel}
                onDelete={openDeleteModal}
                onDuplicate={handleDuplicate}
                onMarkAsLost={handleMarkAsLostClient}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Filter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No clients found
            </h3>
            <p className="text-sm text-slate-600">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteModal();
          else setDeleteOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              {clientToDelete ? (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{clientToDelete.name}</span>?
                  <br />
                  This action cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this project? This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>

            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientCard({
  client,
  index,
  getStatusLabel,
  onDelete,
  onDuplicate,
  onMarkAsLost,
}: {
  client: any;
  index: number;
  getStatusLabel: (status: string) => string;
  onDelete: (client: any) => void;
  onDuplicate: (client: any) => void;
  onMarkAsLost: (client: any) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.div
      key={client.id ?? client.IdP8}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMenuOpen(false);
      }}
    >
      <div
        className="absolute top-4 right-4 z-30"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          animate={{ opacity: isHovered ? 0.55 : 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200/60 shadow-sm transition-colors duration-150"
          aria-label="Options"
        >
          <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
        </motion.button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.13 }}
              className="absolute right-0 top-9 z-50 w-56 bg-white rounded-lg shadow-[0_8px_28px_rgba(0,0,0,0.13)] border border-slate-200/70 py-1 overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onMarkAsLost(client);
                }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-normal text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <CircleAlert className="w-4 h-4 text-slate-400" />
                Mark as Lost Client
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDuplicate(client);
                }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-normal text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                Duplicate PVIII
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete(client);
                }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-normal text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

          <div
              className={`h-full ${client.lostClient
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
              onClick={() => {
                  if (client.lostClient === true) return;
                  
                  navigate(`/p8/leadership/${client.IdP8}`);
              }}
          >
        <div
          className="rounded-lg p-[1px] transition-all duration-300 h-full"
          style={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(0,51,141,0.25) 0%, rgba(30,73,226,0.20) 50%, rgba(0,51,141,0.25) 100%)"
              : "linear-gradient(135deg, rgba(0,51,141,0.15) 0%, rgba(30,73,226,0.10) 50%, rgba(0,51,141,0.15) 100%)",
          }}
        >
          <div
            className="bg-white rounded-lg flex flex-col h-full transition-all duration-300"
            style={{
              boxShadow: isHovered
                ? "0 8px 24px rgba(30,73,226,0.15)"
                : "0 4px 12px rgba(0,0,0,0.06)",
              transform: isHovered ? "translateY(-2px)" : "none",
            }}
          >
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center shadow-sm">
                    <Building2 size={22} className="text-white" strokeWidth={2} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <h3
                    className="text-xl font-bold mb-1 leading-tight transition-colors duration-300 truncate"
                    style={{ color: isHovered ? "#1E49E2" : "#00338D" }}
                  >
                    {client.name}
                  </h3>
                  <p className="text-xs text-[#1E49E2] tracking-[0.02em] truncate">
                    {client.segment}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Engagement Lead</p>
                    <p className="text-sm text-[#00338d] font-normal tracking-[0.05em] truncate">
                      {client.partner}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Engagement Manager</p>
                    <p className="text-sm text-[#00338d] font-normal tracking-[0.05em] truncate">
                      {client.manager}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Income Type</p>
                    <p className="text-sm text-[#00338d] font-normal tracking-[0.05em] truncate">
                      {client.ingreso}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Fiscal Year</p>
                    <p className="text-sm text-[#00338d] font-normal tracking-[0.05em] truncate">
                      {client.lastP8}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Id PVIII</p>
                  <p
                    className="text-[11px] text-slate-500 font-normal tracking-[0.02em] truncate max-w-[220px]"
                    title={client.IdP8}
                  >
                    {client.IdP8}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 flex justify-end">
              <span
                className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white px-4 py-1.5 rounded text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {getStatusLabel(client.status)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KpiBox({
  value,
  label,
  active = false,
  onClick,
}: {
  value: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-32 text-left transition-all duration-200 ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div
        className="absolute inset-0 rounded-md"
        style={{
          padding: "0.8px",
          background: "linear-gradient(0deg, #1E49E2 50%, #00338d 50%)",
          opacity: active ? 1 : 0.6,
        }}
      >
        <div
          className={`h-full w-full rounded-md transition-all duration-200 ${
            active ? "bg-[#F5F9FF]" : "bg-white"
          }`}
        />
      </div>

      <div
        className={`relative rounded-md px-4 py-3 transition-all duration-200 ${
          active ? "shadow-sm" : ""
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl font-normal text-[#00338d]"
            style={{ letterSpacing: "-0.01em" }}
          >
            {value}
          </span>
          <span className="text-xs text-[#666666]">{label}</span>
        </div>
      </div>
    </button>
  );
}