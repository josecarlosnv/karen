import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { specialistApi, ServiceLineDto } from "../../api/pviiiSpecialist";
import { StaffItem } from "../../api/pviiiSpecialist";

const wizardSteps: Step[] = [
  { id: "context", title: "Context" },
  { id: "details", title: "Details" },
  { id: "quality", title: "Quality" },
  { id: "entities", title: "Entities" },
  { id: "staffing", title: "Staffing" },
  { id: "specialists", title: "Specialists" },
  { id: "valuation", title: "Valuation" },
  { id: "review", title: "Review" },
];

interface ServiceLineOption {
  key: string;
  serviceLine: string;
  function: string;
    office: string;
    costCenter: number;
  displayText: string;
}

const auditStageOptions = ["Preliminary", "Interim", "Final"] as const;
type AuditStage = (typeof auditStageOptions)[number];

const generateMonthYearOptions = (): string[] => {
  const options: string[] = [];
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  for (let i = 0; i < 24; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    options.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
  }

  return options;
};

interface SpecialistEntry {
  id: string;
  dbKeyId?: number;
  serviceLineKey: string;
  serviceLineLeadPartnerId: string; 
  agreedFees: string;
  auditStages: AuditStage[];
  stageMonths: Partial<Record<AuditStage, string>>;
}

interface SearchableSelectOption {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  className?: string;
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((o) => o.id === value);

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between min-h-[40px] py-2 px-4 flex items-center bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors duration-200 group cursor-pointer"
      >
        {value ? (
          <span className="text-sm text-[#00338D] truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        ) : (
          <span className="text-sm text-slate-400">{placeholder}</span>
        )}
        <svg
          className={`w-4 h-4 text-slate-400 group-hover:text-[#00338D] transition-all duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-80 flex flex-col">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E49E2] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                  value === option.id ? "bg-[#00338D]/5" : ""
                }`}
              >
                <span
                  className={`text-sm ${
                    value === option.id ? "font-medium text-[#00338D]" : "text-slate-700"
                  }`}
                >
                  {option.label}
                </span>

                {value === option.id && (
                  <svg className="w-4 h-4 text-[#00338D]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ServiceLineSelectProps {
  value: string;
  onChange: (key: string) => void;
  usedKeys: string[];
  options: ServiceLineOption[];
  loading?: boolean;
  placeholder?: string;
  className?: string;
  getServiceLineDetails: (key: string) => ServiceLineOption | undefined;
}

function ServiceLineSelect({
  value,
  onChange,
  usedKeys,
  options,
  loading,
  getServiceLineDetails,
  placeholder = "Select service line",
  className = "",
}: ServiceLineSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = getServiceLineDetails(value);

  const filteredOptions = options.filter((option) =>
    option.displayText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between min-h-[40px] py-2 px-4 flex items-center bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors duration-200 group cursor-pointer"
      >
        {selectedOption ? (
          <span className="text-sm text-[#00338D] truncate">{selectedOption.serviceLine}</span>
        ) : (
          <span className="text-sm text-slate-400">{placeholder}</span>
        )}
        <svg
          className={`w-4 h-4 text-slate-400 group-hover:text-[#00338D] transition-all duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 flex flex-col">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service lines..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E49E2] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">Loading...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value === option.key;
                const isUsed = usedKeys.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => !isUsed && handleSelect(option.key)}
                    disabled={isUsed}
                    className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                      isSelected ? "bg-[#00338D]/5" : ""
                    } ${isUsed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className={`text-sm ${isSelected ? "font-medium text-[#00338D]" : "text-slate-700"}`}>
                      {option.displayText}
                      {isUsed && " (Already added)"}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-[#00338D] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Specialists() {
  const navigate = useNavigate();
  const { p8Id } = useParams();
    const [monthYearOptions, setMonthYearOptions] = useState<string[]>([]);
    const [loadingMonths, setLoadingMonths] = useState(false);
  const [partners, setPartners] = useState<StaffItem[]>([]);

  const STEP_NUMBER = 6;
  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();
    const originalPayloadRef = useRef<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const [serviceLines, setServiceLines] = useState<ServiceLineOption[]>([]);
  const [loadingServiceLines, setLoadingServiceLines] = useState(false);
  const [serviceLineError, setServiceLineError] = useState<string | null>(null);

  const labelField = "text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80";
  const labelSection =
    "text-[11px] font-medium tracking-[0.08em] text-[#1E49E2]/80 capitalize";

  const getServiceLineDetails = (key: string): ServiceLineOption | undefined => {
    return serviceLines.find((option) => option.key === key);
  };

  const [specialistEntries, setSpecialistEntries] = useState<SpecialistEntry[]>([]);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const mapToSpecialistsPayload = (): any[] => {
    return specialistEntries.map((entry) => {
      const serviceLine = serviceLines.find((sl) => sl.key === entry.serviceLineKey);
      if (!serviceLine) throw new Error("Service Line inválida");

      const partner = partners.find((p) => p.id === entry.serviceLineLeadPartnerId);

      return {
        keyId: entry.dbKeyId ?? 0,
        serviceLineLabel: serviceLine.serviceLine,
        agreedFeesAmount: Number(entry.agreedFees) || 0,
          officeLabel: serviceLine.office,
        auditStagePreliminaryInd: entry.auditStages.includes("Preliminary"),
        auditStageInterimInd: entry.auditStages.includes("Interim"),
        auditStageFinalInd: entry.auditStages.includes("Final"),
        functionLabel: serviceLine.serviceLine,
        auditStagePreliminaryMths: entry.stageMonths?.Preliminary ?? null,
        auditStageInterimMths: entry.stageMonths?.Interim ?? null,
        auditStageFinalMths: entry.stageMonths?.Final ?? null,

        serviceLinePartnerId: partner?.id ?? null,
        serviceLinePartnerLabel: partner?.name ?? null,
        serviceLineInChargeEmail: partner?.email ?? null,
      };
    });
  };

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await specialistApi.getPartners();
        setPartners(data);
      } catch (e) {
        console.error("Error loading partners", e);
      }
    };
    loadPartners();
  }, []);

  const markEdited = () => {
    if (!isHydrating) editStep(STEP_NUMBER);
  };

  const isServiceLineKeyUsed = (key: string, currentEntryId: string): boolean => {
    return specialistEntries.some(
      (entry) => entry.serviceLineKey === key && entry.id !== currentEntryId
    );
  };

  const getUsedServiceLineKeys = (currentEntryId: string): string[] => {
    return specialistEntries
      .filter((entry) => entry.id !== currentEntryId)
      .map((entry) => entry.serviceLineKey)
      .filter(Boolean);
  };

  const isStepComplete = (): boolean => {
    if (specialistEntries.length === 0) return false; 
    return specialistEntries.every((e) => {
      const hasServiceLine = Boolean(e.serviceLineKey?.trim());

      const feesNumber = Number(e.agreedFees);
      const hasFees =
        Boolean(e.agreedFees) && !Number.isNaN(feesNumber) && feesNumber > 0;

      const hasStages = Array.isArray(e.auditStages) && e.auditStages.length > 0;

      const stagesHaveMonths = hasStages
        ? e.auditStages.every((stage) => Boolean(e.stageMonths?.[stage]?.trim()))
        : false;

      const isDuplicate = e.serviceLineKey
        ? isServiceLineKeyUsed(e.serviceLineKey, e.id)
        : false;

      return hasServiceLine && hasFees && hasStages && stagesHaveMonths && !isDuplicate;
    });
  };

  const isFormValid = (): boolean => {
    if (specialistEntries.length === 0) return true;
    return isStepComplete();
  };

  const persistStep = (completed = false) => {
    saveStep(STEP_NUMBER, { specialistEntries, expandedEntryId }, completed);
    return true;
  };

  useEffect(() => {
    markStepInProgress(STEP_NUMBER);

    const local = getStepData(STEP_NUMBER);
    if (local && Object.keys(local).length > 0) {
      if (Array.isArray(local.specialistEntries)) {
          const normalized = local.specialistEntries.map((e: any) => ({
              ...e,
              stageMonths: e.stageMonths ?? {},
              auditStages: (e.auditStages ?? []) as AuditStage[],
          }));
        setSpecialistEntries(normalized);
      }
      if (typeof local.expandedEntryId === "string" || local.expandedEntryId === null) {
        setExpandedEntryId(local.expandedEntryId);
      }
    }

    setIsHydrating(false);
  }, []);
    const normalizeForCompare = (e: SpecialistEntry) => ({
        serviceLineKey: e.serviceLineKey || "",
        serviceLineLeadPartnerId: e.serviceLineLeadPartnerId || "",
        agreedFees: Number(e.agreedFees) || 0,
        auditStages: [...(e.auditStages ?? [])].sort(),
        stageMonths: e.stageMonths ?? {},
    });
    const getNormalizedPayload = (): string => {
        return JSON.stringify(
            specialistEntries.map(normalizeForCompare)
        );
    };
  useEffect(() => {
    const loadServiceLines = async () => {
      try {
        setLoadingServiceLines(true);

        const data: ServiceLineDto[] = await specialistApi.listServiceLines();

        const mapped: ServiceLineOption[] = data.map((sl) => ({
          key: sl.specialistServiceLineId.toString(),
          serviceLine: sl.serviceLineLabel,
          function: sl.serviceLineGroup,
            office: sl.officeLabel,
            costCenter: sl.costCenter,
          displayText: `${sl.serviceLineLabel} — ${sl.serviceLineGroup} · ${sl.officeLabel}`,
        }));

        setServiceLines(mapped);
      } catch (error) {
        console.error(error);
        setServiceLineError("Error loading service lines");
      } finally {
        setLoadingServiceLines(false);
      }
    };

    loadServiceLines();
  }, []);

    useEffect(() => {
        if (!p8Id || serviceLines.length === 0) return;

        const loadSpecialistsFromApi = async () => {
            try {
                const project = await specialistApi.getPviii(p8Id);

                const current = Array.isArray(project.specialists)
                    ? project.specialists
                    : [];

                const historical = Array.isArray(project.specialistsHistory)
                    ? project.specialistsHistory
                    : [];

                const dataToUse = current.length > 0 ? current : historical;

                if (dataToUse.length === 0) return;

                
                const mapped: SpecialistEntry[] = dataToUse.map((s: any) => {
                    const matched =
                        serviceLines.find(
                            (sl) =>
                                sl.serviceLine === s.serviceLineLabel &&
                                sl.costCenter === s.costCenter
                        ) ||
                        serviceLines.find(
                            (sl) => sl.serviceLine === s.serviceLineLabel
                        );

                    return {
                        id: s.keyId.toString(),
                        dbKeyId: s.keyId,

                        serviceLineKey: matched?.key ?? "",

                        serviceLineLeadPartnerId: s.serviceLinePartnerId
                            ? s.serviceLinePartnerId.toString()
                            : "",

                        agreedFees: (s.agreedFeesAmount ?? 0).toString(),

                        auditStages: ([
                            s.auditStagePreliminaryInd && "Preliminary",
                            s.auditStageInterimInd && "Interim",
                            s.auditStageFinalInd && "Final",
                        ].filter(Boolean) as AuditStage[]),

                        stageMonths: {
                            ...(s.auditStagePreliminaryInd && s.auditStagePreliminaryMths
                                ? { Preliminary: s.auditStagePreliminaryMths }
                                : {}),
                            ...(s.auditStageInterimInd && s.auditStageInterimMths
                                ? { Interim: s.auditStageInterimMths }
                                : {}),
                            ...(s.auditStageFinalInd && s.auditStageFinalMths
                                ? { Final: s.auditStageFinalMths }
                                : {}),
                        },
                    };
                });
                ``
                setSpecialistEntries(mapped);

                const payload = JSON.stringify(mapped.map(normalizeForCompare));
                originalPayloadRef.current = payload;

                if (mapped.length > 0) setExpandedEntryId(mapped[0].id);

            } catch (err) {
                console.error("Error loading specialists from API", err);
            }
        };

        loadSpecialistsFromApi();
    }, [p8Id, serviceLines]);
    const hasChanges = (): boolean => {
        if (originalPayloadRef.current === null) return true;
        return originalPayloadRef.current !== getNormalizedPayload();
    };
  const addSpecialistEntry = () => {
    const newEntry: SpecialistEntry = {
      id: Date.now().toString(),
      serviceLineKey: "",
      serviceLineLeadPartnerId: "",
      agreedFees: "",
      auditStages: [],
      stageMonths: {},
    };
    setSpecialistEntries((prev) => [...prev, newEntry]);
    setExpandedEntryId(newEntry.id);
    markEdited();
  };

  const deleteEntry = (id: string) => {
    setSpecialistEntries((prev) => prev.filter((e) => e.id !== id));
    if (expandedEntryId === id) setExpandedEntryId(null);
    markEdited();
  };

  const updateEntry = (id: string, field: keyof SpecialistEntry, value: any) => {
    setSpecialistEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
    markEdited();
  };

  const toggleEntryExpansion = (id: string) => {
    setExpandedEntryId((prev) => (prev === id ? null : id));
    markEdited();
  };

  const toggleAuditStage = (id: string, stage: AuditStage) => {
    setSpecialistEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;

        const isRemoving = entry.auditStages.includes(stage);
        const auditStages = isRemoving
          ? entry.auditStages.filter((s) => s !== stage)
          : [...entry.auditStages, stage];

        const stageMonths = { ...entry.stageMonths };
        if (isRemoving && stageMonths[stage]) {
          delete stageMonths[stage];
        }

        return { ...entry, auditStages, stageMonths };
      })
    );
    markEdited();
  };

  const updateStageMonth = (id: string, stage: AuditStage, month: string) => {
    setSpecialistEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;
        return {
          ...entry,
          stageMonths: { ...entry.stageMonths, [stage]: month },
        };
      })
    );
    markEdited();
  };

  const totalFees = specialistEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.agreedFees) || 0),
    0
  );
    useEffect(() => {
        const loadMonths = async () => {
            try {
                setLoadingMonths(true);

                const data = await specialistApi.getAuditMonths();

                const mapped = data.map((m: any) => m.monthyearLabel);

                setMonthYearOptions(mapped);
            } catch (err) {
                console.error("Error loading audit months", err);
            } finally {
                setLoadingMonths(false);
            }
        };

        loadMonths();
    }, []);
 
    const handleSaveDraft = async () => {
        if (!p8Id) return;

        if (!hasChanges()) {
            navigate("/p8/new");
            return;
        }

        try {
            const payload = mapToSpecialistsPayload();
            await specialistApi.upsertSpecialists(p8Id, payload);

            originalPayloadRef.current = getNormalizedPayload();

            persistStep(false);
            navigate("/p8/new");
        } catch (error) {
            console.error("Error saving", error);
        }
    };
 
    const handleNext = async () => {
        if (!p8Id) return;
        if (!isFormValid()) return;

        if (!hasChanges()) {
            navigate(`/p8/valuation/${p8Id}`);
            return;
        }

        try {
            const payload = mapToSpecialistsPayload();
            await specialistApi.upsertSpecialists(p8Id, payload);

            originalPayloadRef.current = getNormalizedPayload();

            persistStep(isStepComplete());
            navigate(`/p8/valuation/${p8Id}`);
        } catch (error) {
            console.error("Error al guardar specialists", error);
        }
    };
  const handleBack = () => {
    
    navigate(`/p8/staffing/${p8Id}`);
  };

  const handleStepClick = (stepIndex: number) => {
    persistStep(false);

    const routes = [
      `/p8/leadership/${p8Id}`,
      `/p8/general-data/${p8Id}`,
      `/p8/quality/${p8Id}`,
      `/p8/entities/${p8Id}`,
      `/p8/staffing/${p8Id}`,
      `/p8/specialists/${p8Id}`,
      `/p8/valuation/${p8Id}`,
      `/p8/review/${p8Id}`,
    ];
    navigate(routes[stepIndex]);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <Stepper
            steps={wizardSteps.map((step, index) => ({
              ...step,
              status: getStepStatus(index + 1),
              completed: isStepCompleted(index + 1),
            }))}
            currentStep={5}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-[#1e49e2] font-light text-[24px] tracking-[0.02em] transition-colors duration-300"
                  style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
                >
                  Specialist Service Lines
                </h2>
                {serviceLineError && (
                  <p className="text-xs text-red-600 mt-2">{serviceLineError}</p>
                )}
              </div>

              <Button
                onClick={addSpecialistEntry}
                className="text-[13px] font-medium tracking-[0.04em] bg-gradient-to-r from-[#1E49E2] to-[#1E49E2] text-white shadow-sm hover:from-[#5B10C8] hover:to-[#163FCC] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Specialist
              </Button>
            </div>

            <div className="space-y-2.5">
              {specialistEntries.map((entry) => {
                const serviceLineDetails = getServiceLineDetails(entry.serviceLineKey);
                const isDuplicate =
                  entry.serviceLineKey && isServiceLineKeyUsed(entry.serviceLineKey, entry.id);
                const isExpanded = expandedEntryId === entry.id;
                const usedKeys = getUsedServiceLineKeys(entry.id);

                return (
                  <div
                    key={entry.id}
                    className={`group relative border-[#1E49E2]/15 rounded-xl overflow-hidden bg-gradient-to-br from-white via-white to-[#1E49E2]/[0.03] shadow-[0_6px_18px_rgba(30,73,226,0.08)] ${
                      isExpanded ? "overflow-visible" : "overflow-hidden"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                      }}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 z-20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#1E49E2]/15 ${
                        isExpanded ? "bg-[#1E49E2]/10" : "bg-white/70 hover:bg-[#1E49E2]/[0.04]"
                      }`}
                      onClick={() => toggleEntryExpansion(entry.id)}
                    >
                      <button
                        type="button"
                        className="text-slate-400 hover:text-[#00338D] transition-colors flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEntryExpansion(entry.id);
                        }}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0 pr-8">
                        {isExpanded ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <ServiceLineSelect
                              value={entry.serviceLineKey}
                              onChange={(key) => updateEntry(entry.id, "serviceLineKey", key)}
                              usedKeys={usedKeys}
                              options={serviceLines}
                              loading={loadingServiceLines}
                              getServiceLineDetails={getServiceLineDetails}
                              placeholder="Select service line"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#1E49E2] to-[#5B10C8] shadow-md flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-white" />
                            </div>

                            <div className="flex items-center gap-3 min-w-0 flex-wrap">
                              <h4 className="font-medium text-[15px] text-[#00338D] tracking-[0.01em] truncate max-w-[420px]">
                                {serviceLineDetails?.serviceLine ? (
                                  serviceLineDetails.serviceLine
                                ) : (
                                  <span className="text-slate-400 italic font-normal">
                                    Select service line
                                  </span>
                                )}
                              </h4>

                              {serviceLineDetails && (
                                <div className="flex items-center gap-1.5">
                                  <Badge
                                    variant="outline"
                                    className="bg-[#00338D]/5 text-[#00338D] border-[#00338D]/20 text-xs px-2 py-0 h-5"
                                  >
                                    {serviceLineDetails.function}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-2 py-0 h-5"
                                  >
                                    {serviceLineDetails.office}
                                  </Badge>
                                </div>
                              )}

                              {isDuplicate && (
                                <span className="text-xs text-red-500 font-normal">
                                  (Duplicate)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
                      {isExpanded && (
                        <div className="p-4 bg-[#F7F9FC]">
                          {serviceLineDetails && (
                            <div className="mb-3 pb-3 border-b border-slate-200/50">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="bg-[#1E49E2]/5 text-[#1E49E2] border-[#1E49E2]/20 text-xs px-2 py-0 h-5"
                                >
                                  {serviceLineDetails.function}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-[#1E49E2]/5 text-slate-600 border-slate-200 text-xs px-2 py-0 h-5"
                                >
                                  {serviceLineDetails.office}
                                </Badge>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className={labelField}>Specialist Fee Owner</Label>
                              <SearchableSelect
                                value={entry.serviceLineLeadPartnerId}
                                onChange={(partnerId) =>
                                  updateEntry(entry.id, "serviceLineLeadPartnerId", partnerId)
                                }
                                options={partners.map((p) => ({ id: p.id, label: p.name }))}
                                placeholder="Select partner"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className={labelField}>
                                Agreed Fees <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="number"
                                value={entry.agreedFees}
                                onChange={(e) => updateEntry(entry.id, "agreedFees", e.target.value)}
                                placeholder="0"
                                className="h-10"
                              />
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200/50">
                            <Label className="text-[11px] font-medium tracking-[0.08em] text-[#1E49E2] mb-2.5 block">
                              Audit Stages <span className="text-red-500">*</span>
                            </Label>

                            <div className="flex flex-wrap gap-2">
                              {auditStageOptions.map((stage) => {
                                const selected = entry.auditStages.includes(stage);
                                return (
                                  <button
                                    key={stage}
                                    type="button"
                                    onClick={() => toggleAuditStage(entry.id, stage)}
                                    className={`px-3 py-1.5 rounded-md text-xs tracking-[0.04em] font-normal transition-colors shadow-sm ${
                                      selected
                                        ? "bg-[#1E49E2] text-white"
                                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                    }`}
                                  >
                                    {stage}
                                  </button>
                                );
                              })}
                            </div>

                            {entry.auditStages.length > 0 && (
                              <div className="mt-3 space-y-2.5">
                                {entry.auditStages.map((stage) => (
                                  <div key={stage} className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs text-slate-600 font-normal tracking-[0.08em] min-w-[80px]">
                                      {stage}
                                    </span>

                                    <Select
                                      value={entry.stageMonths?.[stage] || ""}
                                      onValueChange={(value) =>
                                        updateStageMonth(entry.id, stage, value)
                                      }
                                    >
                                      <SelectTrigger className="h-10 w-[220px] text-xs bg-white">
                                        <SelectValue placeholder="Select month" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {monthYearOptions.map((monthYear) => (
                                          <SelectItem key={monthYear} value={monthYear}>
                                            {monthYear}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {specialistEntries.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg mt-6">
                <p className="text-sm mb-2">No specialist services configured</p>
                <p className="text-xs">
                  This step is optional. Click "Add Specialist Service Line" to add services,
                  or continue to the next step.
                </p>
              </div>
            )}

            {specialistEntries.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200/60 bg-gradient-to-br from-[#1E49E2]/[0.04] to-[#1E49E2]/[0.03] rounded-lg border border-[#1E49E2]/20 shadow-[0_2px_4px_rgba(0,51,141,0.1),0_1px_2px_rgba(0,0,0,0.06)] p-5">
                <h3 className="text-[11px] font-medium tracking-[0.08em] text-[#1E49E2]/80 capitalize mb-4">
                  Specialist Services Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80 mb-1">
                      Total Service Lines
                    </p>
                    <p className="text-lg font-semibold text-[#1E49E2] tracking-[0.02em]">
                      {specialistEntries.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80 mb-1">
                      Total Agreed Fees
                    </p>
                    <p className="text-lg font-semibold text-[#1E49E2] tracking-[0.02em]">
                      ${totalFees.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handleBack} className="h-10 font-normal">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="h-10 border-slate-300 text-slate-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isFormValid()}
                className="h-10 bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save &amp; Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}