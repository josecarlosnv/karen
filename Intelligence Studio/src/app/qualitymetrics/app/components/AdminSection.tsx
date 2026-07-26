import { useState, useEffect } from "react";
import { useSecurityAccess } from "@qm/app/hooks/useSecurityGuard";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "motion/react";
import networkBg from "../../imports/Image__5_.jpg";
import heroBg from "../../imports/Image__6_.jpg";
import { performanceApi, QmPerson, QmMetrics, QmScope } from "@qm/app/api/performanceApi";

const CLIENT_SEP = " # ";
const parseClients = (s?: string | null) => {
  const arr = (s ?? "").split("#").map((x) => x.trim()).filter(Boolean);
  return arr.length ? arr : [""];           // siempre 1 campo para empezar
};
const joinClients = (arr: string[]) =>
  arr.map((x) => x.trim()).filter(Boolean).join(CLIENT_SEP);
const countClients = (arr: string[]) =>
  arr.map((x) => x.trim()).filter(Boolean).length;


const typography = {
  fontFamily:
    '"Inter", "Helvetica Neue", "Aptos", "Segoe UI", Arial, sans-serif',
  heroTitle: {
    fontWeight: 300,
    letterSpacing: "-0.02em",
    color: "#F7FAFF",
  },
  heroMeta: {
    fontWeight: 400,
    letterSpacing: "0.03em",
    color: "rgba(228,236,248,0.90)",
  },
  sectionTitle: {
    fontWeight: 400,
    letterSpacing: "0.04em",
    color: "#1e49e2",
  },
  fieldLabel: {
    fontWeight: 500,
    letterSpacing: "0.10em",
    color: "#00338d",
  },
  inputText: {
    fontWeight: 400,
    letterSpacing: "0.01em",
    color: "#0C233C",
  },
  metricLabel: {
    fontWeight: 500,
    letterSpacing: "0.10em",
    color: "#00338d",
  },
  metricValue: {
    fontWeight: 300,
    letterSpacing: "-0.02em",
    color: "#16324F",
  },
  bodyText: {
    fontWeight: 400,
    letterSpacing: "0.01em",
    color: "#284563",
  },
};

const yesNoText = {
  fontFamily:
    '"Inter", "Helvetica Neue", "Aptos", "Segoe UI", Arial, sans-serif',
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "capitalize" as const,
};

const glassPanel = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.38)",
  backdropFilter: "blur(26px)",
  WebkitBackdropFilter: "blur(22px)",
  boxShadow: "0 24px 60px rgba(12,35,60,0.08)",
};

const softGlass = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.18) 100%)",
  border: "1px solid rgba(255,255,255,0.34)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 16px 42px rgba(12,35,60,0.05)",
};

const inputGlass = {
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.30)",
  color: "#17324D",
  fontFamily:
    '"Inter", "Helvetica Neue", "Aptos", "Segoe UI", Arial, sans-serif',
  fontWeight: 400,
  letterSpacing: "0.01em",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
};
const inputSolid = {
  background: "#F4F7FB",
  border: "1px solid rgba(0,51,141,0.12)",
  color: "#17324D",
  fontFamily:
    '"Inter", "Helvetica Neue", "Aptos", "Segoe UI", Arial, sans-serif',
  fontWeight: 400,
  letterSpacing: "0.01em",
};

export function AdminSection() {
  const navigate = useNavigate();
  const [canSelectUsers, setCanSelectUsers] = useState(false);

  const PHOTO_BASE =
    "https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-PerformanceSociosyDirectores/Shared%20Documents/PS01%20-%20Performance%20Socios%20y%20Directores/Fotos/";

  // foto por defecto: la que vive en el mismo folder de SharePoint
  const PLACEHOLDER_PHOTO = `${PHOTO_BASE}sinfoto.jpg`;

  const photoUrl = (employeeId?: string | null) =>
    employeeId ? `${PHOTO_BASE}${employeeId}.jpg` : PLACEHOLDER_PHOTO;

  // {id}.jpg -> {id}.JPG -> sinfoto.jpg (con guard para no entrar en loop)
  const handlePhotoError = (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    if (img.src === PLACEHOLDER_PHOTO) return;          // ya es el placeholder → corta el loop
    if (img.src.endsWith('.jpg')) {                     // .jpg → prueba .JPG
      img.src = img.src.slice(0, -4) + '.JPG';
      return;
    }
    img.src = PLACEHOLDER_PHOTO;                        // .JPG también falló → sin foto
  };



  const emptyForm: QmMetrics = {
    employeeId: "",
    fiscalYearLabel: 0,
    openPD: "",
    clientsGainedText: "",
    clientsLostText: "",
    keyActivitiesAssignments: "",
    academicTeachingInstitution: "",
    advancedDegreesCertifications: "",
    isAdvanceCapabilitiesUsed: false,
    isMapJeUsed: false,
    isDatasnipperFssUsed: false,
    isKcwRolloverUsed: false,
  };

  const [people, setPeople] = useState<QmPerson[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<QmMetrics>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [gainedList, setGainedList] = useState<string[]>([""]);
  const [lostList, setLostList] = useState<string[]>([""]);

  // 1) scope: yo + allegados (según seguridad)
  useEffect(() => {
    performanceApi.scope()
      .then((s: QmScope) => {
        setPeople(s.people);
        setCanSelectUsers(s.canSelectUsers);
        setSelectedId(s.myEmployeeId ?? s.people[0]?.employeeId ?? null);
      })
      .catch(() => setPeople([]));

  }, []);

  // 2) métricas de la persona seleccionada
  useEffect(() => {
    if (!selectedId) return;
    performanceApi.get(selectedId)
      .then((m) => {
        setFormData(m);
        setGainedList(parseClients(m.clientsGainedText));
        setLostList(parseClients(m.clientsLostText));
      })
      .catch(() => {
        setFormData({ ...emptyForm, employeeId: selectedId });
        setGainedList([""]);
        setLostList([""]);
      });
  }, [selectedId]);


  const selectedPartner = people.find((p) => p.employeeId === selectedId) ?? null;

  const filteredPartners = people.filter(
    (p) =>
      (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await performanceApi.save(selectedId, {
        ...formData,
        employeeId: selectedId,
        clientsGainedText: joinClients(gainedList),
        clientsLostText: joinClients(lostList),
      });
    } finally {
      setSaving(false);
    }
  };


    const renderClientList = (
    items: string[],
    setItems: (v: string[]) => void,
  ) => (
    <div className="space-y-2">
      {items.map((val, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={val}
            onChange={(e) => {
              const next = [...items];
              next[idx] = e.target.value;
              setItems(next);
            }}
            placeholder="Nombre del cliente"
            style={inputGlass}
            className="border-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const next = items.filter((_, i) => i !== idx);
              setItems(next.length ? next : [""]);
            }}
            className="shrink-0"
            style={{ color: "#B91C1C" }}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setItems([...items, ""])}
        className="px-2 text-xs"
        style={{ color: "#1e49e2" }}
      >
        <Plus className="mr-1 h-4 w-4" /> Agregar
      </Button>
    </div>
  );




  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        fontFamily: typography.fontFamily,
        backgroundImage: `url(${networkBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundColor: "#EEF3FA",
      }}
    >
      {/* Base tint */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,250,255,0.18) 0%, rgba(244,247,253,0.18) 42%, rgba(240,245,255,0.18) 100%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric overlays */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `
            radial-gradient(circle at 10% 12%, rgba(0,51,141,0.12) 0%, rgba(0,51,141,0) 30%),
            radial-gradient(circle at 92% 18%, rgba(30,73,226,0.10) 0%, rgba(30,73,226,0) 32%),
            radial-gradient(circle at 88% 82%, rgba(0,145,218,0.12) 0%, rgba(0,145,218,0) 28%),
            radial-gradient(circle at 18% 82%, rgba(0,51,141,0.05) 0%, rgba(0,51,141,0) 30%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Ambient blur */}
      <div
        className="fixed -left-20 top-16 h-72 w-72 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        style={{ background: "rgba(0,51,141,0.08)", zIndex: 0 }}
      />
      <div
        className="fixed right-0 top-0 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        style={{
          background: "rgba(30,73,226,0.08)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed bottom-0 right-10 h-96 w-96 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        style={{
          background: "rgba(0,145,218,0.08)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Hero image layer */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "280px",
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.72) saturate(0.90) contrast(1.03)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Subtle dark overlay to deepen the blue hero */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "280px",
            background:
              "linear-gradient(180deg, rgba(7,19,38,0.30) 0%, rgba(10,24,48,0.22) 45%, rgba(10,24,48,0.00) 100%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <header
          className="border-b"
          style={{
            borderColor: "rgba(255,255,255,0.28)",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(12,35,60,0.03)",
          }}
        >
          <div className="mx-auto max-w-7xl px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="rounded-full transition-all"
                  style={{
                    color: "rgba(12,35,60,0.72)",
                    background: "rgba(255,255,255,0.12)",
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div
                  className="text-sm"
                  style={{
                    fontFamily: typography.fontFamily,
                    color: "rgba(245,248,252,0.92)",
                    letterSpacing: "0.01em",
                    fontWeight: 400,
                  }}
                >
                  Performance Evaluation
                </div>
              </div>

              <Button
              onClick={handleSave}
              disabled={saving}
              
                variant="ghost"
                className="rounded-full px-5 py-2 text-xs transition-all"
                style={{
                  fontFamily: typography.fontFamily,
                  background: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  color: "rgba(246,249,252,0.92)",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  boxShadow:
                    "0 10px 26px rgba(255,255,255,0.14)",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-8 py-12 overflow-visible">
          {/* Executive Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative sticky top-6 z-30 mb-6 overflow-visible rounded-3xl px-10 p-6"
            style={glassPanel}
          >
            <div
              className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.62) 50%, rgba(255,255,255,0) 100%)",
              }}
            />

            <div className="flex items-center gap-8">
              <img
                src={photoUrl(selectedPartner?.employeeId)}
                onError={handlePhotoError}
                alt={selectedPartner?.name ?? ""}
                className="h-28 w-28 rounded-2xl object-cover"
                style={{ boxShadow: "0 18px 40px rgba(12,35,60,0.10)", border: "1px solid rgba(255,255,255,0.36)" }}
              />


              <div className="flex-1">
                <div className="relative mb-2">
                  <button
                    onClick={() => canSelectUsers && setShowSelector(!showSelector)}
                    disabled={!canSelectUsers}
                    className="group mb-2 inline-flex items-center gap-2 transition-all"
                    style={{ cursor: canSelectUsers ? "pointer" : "default" }}
                  >
                    <h1
                      className="text-3xl transition-colors"
                      style={{
                        fontFamily: typography.fontFamily,
                        ...typography.heroTitle,
                      }}
                    >
                     {selectedPartner?.name ?? "—"}
                    </h1>

                    {canSelectUsers && (
                      <ChevronDown
                        className={`h-5 w-5 transition-all ${
                          showSelector
                            ? "rotate-180 opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        style={{
                          color: showSelector
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.65)",
                        }}
                        strokeWidth={2}
                      />
                    )}
                  </button>


                  {/* Person Selector Dropdown */}
                  <AnimatePresence>
                    {canSelectUsers && showSelector && (

                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-96 rounded-2xl"
                        style={{
                          zIndex: 1000,
                          background: "#FFFFFF",
                          border: "1px solid rgba(0,51,141,0.12)",
                          boxShadow: "0 28px 70px rgba(12,35,60,0.28)",
                        }}
                      >

                        <div className="p-4">
                          <div className="relative mb-3">
                            <Search
                              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                              style={{
                                color: "#5D7694",
                              }}
                            />
                            <Input
                              placeholder="Search partners..."
                              value={searchQuery}
                              onChange={(e) =>
                                setSearchQuery(e.target.value)
                              }
                              className="pl-10"
                              style={inputSolid}
                            />
                          </div>

                          <div className="max-h-80 space-y-1 overflow-auto">
                            {filteredPartners.map(
                            ((partner) => 
                            <button
                                  key={partner.employeeId}
                                  onClick={() => {
                                    setSelectedId(partner.employeeId);
                                    setShowSelector(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all"
                                  style={{
                                    background:
                                      selectedId === partner.employeeId
                                        ? "rgba(0,163,224,0.12)"
                                        : "transparent",
                                    border:
                                      selectedId === partner.employeeId
                                        ? "1px solid rgba(0,163,224,0.30)"
                                        : "1px solid transparent",
                                  }}

                                >
                                  <img
                                    src={photoUrl(partner.employeeId)}
                                    onError={handlePhotoError}
                                    alt={partner.name ?? ""}
                                    className="h-10 w-10 rounded-lg object-cover"
                                    style={{ border: "1px solid rgba(255,255,255,0.30)" }}
                                  />


                                  <div className="flex-1">
                                    <div className="text-sm" style={{ fontFamily: typography.fontFamily, color: "#17324D", fontWeight: 400, letterSpacing: "0.01em" }}>
                                      {partner.name}
                                    </div>
                                    <div className="text-xs" style={{ color: "#5D7694", fontWeight: 400, letterSpacing: "0.03em" }}>
                                      {partner.title}
                                    </div>
                                  </div>
                                </button>

                              ),
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{
                      fontFamily: typography.fontFamily,
                      ...typography.heroMeta,
                    }}
                  >
                    <span>{selectedPartner?.title ?? ""}</span>
                    <span>·</span>
                    <span>{selectedPartner?.practice ?? ""}</span>
                    <span>·</span>
                    <span>{selectedPartner?.tenureYears ?? 0} years in  role</span>

                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4"
          >
            <div className="rounded-xl p-5" style={softGlass}>
              <div
                className="mb-2 text-xs capitalize tracking-wider"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricLabel,
                }}
              >
                Open PD
              </div>
              <div
                className="text-3xl"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricValue,
                }}
              >
                {formData.openPD || "—"}
              </div>
            </div>

            <div className="rounded-xl p-5" style={softGlass}>
              <div
                className="mb-2 text-xs capitalize tracking-wider"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricLabel,
                }}
              >
                Clientes Ganados
              </div>
              <div
                className="text-3xl"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricValue,
                }}
              >
{countClients(gainedList)}
              </div>
            </div>

            <div className="rounded-xl p-5" style={softGlass}>
              <div
                className="mb-2 text-xs capitalize tracking-wider"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricLabel,
                }}
              >
                Clientes Perdidos
              </div>
              <div
                className="text-3xl"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricValue,
                }}
              >
{countClients(lostList)}
              </div>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                border: "1px solid transparent",
                background: `
                  linear-gradient(
                    135deg,
                    rgba(255,255,255,0.30) 0%,
                    rgba(255,255,255,0.22) 100%
                  ) padding-box,
                  linear-gradient(
                    135deg,
                    rgba(0,51,141,0.46),
                    rgba(30,73,226,0.38),
                    rgba(0,145,218,0.42)
                  ) border-box
                `,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 18px 44px rgba(30,73,226,0.08)",
              }}
            >
              <div
                className="mb-2 text-xs capitalize tracking-wider"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.metricLabel,
                  color: "#5C7DA0",
                }}
              >
                Technology Adoption
              </div>
              <div
                className="text-3xl"
                style={{
                  fontFamily: typography.fontFamily,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#1A2C4E",
                }}
              >
                {Math.round(
                  ([formData.isAdvanceCapabilitiesUsed, formData.isMapJeUsed, formData.isDatasnipperFssUsed, formData.isKcwRolloverUsed].filter(Boolean).length / 4) * 100
                )}%

              </div>
            </div>
          </motion.div>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Business Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-8"
              style={glassPanel}
            >
              <h3
                className="mb-6 text-base"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.sectionTitle,
                }}
              >
                Business Performance
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{
                      fontFamily: typography.fontFamily,
                      ...typography.fieldLabel,
                    }}
                  >
                    Open PD (2026)
                  </Label>
                  <Select
                    value={formData.openPD ?? ""}
                    onValueChange={(v) => setFormData({ ...formData, openPD: v })}
                  >

                    <SelectTrigger
                      style={inputGlass}
                      className="border-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - High</SelectItem>
                      <SelectItem value="2">
                        2 - Above Average
                      </SelectItem>
                      <SelectItem value="3">
                        3 - Average
                      </SelectItem>
                      <SelectItem value="4">
                        4 - Below Average
                      </SelectItem>
                      <SelectItem value="5">
                        5 - Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{ fontFamily: typography.fontFamily, ...typography.fieldLabel }}
                  >
                    Clientes ganados
                  </Label>
                  {renderClientList(gainedList, setGainedList)}
                </div>


                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{ fontFamily: typography.fontFamily, ...typography.fieldLabel }}
                  >
                    Clientes pérdidos
                  </Label>
                  {renderClientList(lostList, setLostList)}
                </div>


                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{
                      fontFamily: typography.fontFamily,
                      ...typography.fieldLabel,
                    }}
                  >
                    Cumple con actividades asignadas en la UN
                    ¿Cuáles?
                  </Label>
                  <Input
                    value={	formData.keyActivitiesAssignments}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        keyActivitiesAssignments: e.target.value,
                      })
                    }
                    style={inputGlass}
                    className="border-0"
                  />
                </div>
              </div>
            </motion.div>

            {/* Development & Contribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl p-8"
              style={glassPanel}
            >
              <h3
                className="mb-6 text-base"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.sectionTitle,
                }}
              >
                Development & Contribution
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{
                      fontFamily: typography.fontFamily,
                      ...typography.fieldLabel,
                    }}
                  >
                    ¿Imparte cátedra? ¿Dónde?
                  </Label>
                  <Input
                    value={formData.academicTeachingInstitution}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicTeachingInstitution: e.target.value,
                      })
                    }
                    className="border-0"
                    style={inputGlass}
                    placeholder="e.g., Universidad Nacional"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-xs capitalize"
                    style={{
                      fontFamily: typography.fontFamily,
                      ...typography.fieldLabel,
                    }}
                  >
                    Maestría, Especialidad u otro como LATDP
                  </Label>
                  <Input
                    value={formData.advancedDegreesCertifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        advancedDegreesCertifications: e.target.value,
                      })
                    }
                    className="border-0"
                    style={inputGlass}
                  />
                </div>
              </div>
            </motion.div>

            {/* Technology & Innovation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl p-8"
              style={glassPanel}
            >
              <h3
                className="mb-6 text-base"
                style={{
                  fontFamily: typography.fontFamily,
                  ...typography.sectionTitle,
                }}
              >
                Technology & Innovation Adoption
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={softGlass}
                >
                  <Label
                    className="text-sm"
                    style={{
                      fontFamily: typography.fontFamily,
                      color: "#00338d",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Advance Capabilities
                  </Label>

                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        ...yesNoText,
                        color: formData.isAdvanceCapabilitiesUsed
                       ? "#1E49E2"
                          : "#5D7694",
                      }}
                    >
                      {formData.isAdvanceCapabilitiesUsed
                        ? "Yes"
                        : "No"}
                    </span>

                    <Switch
                      checked={formData.isAdvanceCapabilitiesUsed}
                      onCheckedChange={(v) =>
                        setFormData({
                          ...formData,
                          isAdvanceCapabilitiesUsed: v,
                        })
                      }
                      className="data-[state=checked]:bg-[#1E49E2]"
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={softGlass}
                >
                  <Label
                    className="text-sm"
                    style={{
                      fontFamily: typography.fontFamily,
                      color: "#00338d",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                    }}
                  >
                    MAP JE
                  </Label>

                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        ...yesNoText,
                        color: formData.isMapJeUsed
                        ? "#1E49E2"
                          : "#5D7694",
                      }}
                    >
                      {formData.isMapJeUsed ? "Yes" : "No"}
                    </span>

                    <Switch
                      checked={formData.isMapJeUsed}
                      onCheckedChange={(v) =>
                        setFormData({ ...formData, isMapJeUsed: v })
                      }
                      className="data-[state=checked]:bg-[#1E49E2]"
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={softGlass}
                >
                  <Label
                    className="text-sm"
                    style={{
                      fontFamily: typography.fontFamily,
                      color: "#00338d",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Datasnipper +FSS
                  </Label>

                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        ...yesNoText,
                        color: formData.isDatasnipperFssUsed
                         ? "#1E49E2"
                          : "#5D7694",
                      }}
                    >
                      {formData.isDatasnipperFssUsed ? "Yes" : "No"}
                    </span>

                    <Switch
                      checked={formData.isDatasnipperFssUsed}
                      onCheckedChange={(v) =>
                        setFormData({
                          ...formData,
                          isDatasnipperFssUsed: v,
                        })
                      }
                      className="data-[state=checked]:bg-[#1E49E2]"
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={softGlass}
                >
                  <Label
                    className="text-sm"
                    style={{
                      fontFamily: typography.fontFamily,
                      color: "#00338d",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                    }}
                  >
                    KCw Rollover
                  </Label>

                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        ...yesNoText,
                        color: formData.isKcwRolloverUsed
                          ? "#1E49E2"
                          : "#5D7694",
                      }}
                    >
                      {formData.isKcwRolloverUsed ? "Yes" : "No"}
                    </span>

                    <Switch
                      checked={formData.isKcwRolloverUsed}
                      onCheckedChange={(v) =>
                        setFormData({
                          ...formData,
                          isKcwRolloverUsed: v,
                        })
                      }
                      className="data-[state=checked]:bg-[#1E49E2]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
