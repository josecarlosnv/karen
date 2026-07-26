import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SegmentedControl } from "../../components/ui/segmented-control";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Search,
  AlertTriangle,
  User,
  FileText,
  BookOpen,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { staffApi } from "../../api/staffApi";
import { pviiiApi } from "../../api/pviiiApi";
import { catalogoSegmentoApi } from "../../Api/CatalogoSegmentoApi";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";
import type { TeamLeaderStats } from "../../api/staffApi";

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

const availableFiscalYears = ["2027", "2026", "2025", "2024", "2023"];

// ---------- Types ----------
interface StaffItem {
  id: string;
  name: string;
}

interface Person {
  id: string;
  name: string;
  role: string;
  yearsInRole: number;
  initials: string;
  qprRating: "high" | "low";
  isFirstYear: boolean;
  openPD: boolean;
}

interface PeoplePickerProps {
  label: string;
  selectedPerson: Person | null;
  availablePeople: Person[];
  onSelectPerson: (person: Person) => void;
  placeholder?: string;

  showFirstYearBadge?: boolean;
}

const sectionTitleClass =
  "text-[13px] font-normal tracking-[0.08em] text-[#00338D] capitalize";
const labelClass = "text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80";

const selectValueText = "text-sm font-normal leading-none";
const selectItemText = "text-sm font-normal leading-none";

function buildInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
}

function toPerson(
  item: { id: number | string; name: string },
  stats?: TeamLeaderStats
): Person {
  const isFirstYear = stats?.isFirstYear ?? false;

  return {
    id: String(item.id),
    name: item.name,

    role: stats?.levelLabel ?? "Unknown",

    initials: buildInitials(item.name),
    yearsInRole: isFirstYear ? 0 : 1,
    isFirstYear,

    qprRating: stats?.qprResult === true ? "low" : "high",
    openPD: stats?.openPdIndicator ?? false,
  };
}

function PeoplePicker({
  label,
  selectedPerson,
  availablePeople,
  onSelectPerson,
  placeholder,
  showFirstYearBadge = true, 
}: PeoplePickerProps) {
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

  const filteredPeople = availablePeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label className={labelClass}>{label}</Label>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors duration-200 group"
        >
          {selectedPerson ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">
                  {selectedPerson.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedPerson.name}
                </p>
              </div>

              {showFirstYearBadge && selectedPerson.isFirstYear && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#00B8F5]/5 text-[#00B8F5] border border-[#00B8F5]/20 tracking-[0.02em] flex-shrink-0">
                  1st year in role
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-400">
              {placeholder || "Select person"}
            </span>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 group-hover:text-[#00338D] transition-all duration-200 flex-shrink-0 ml-2 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-80 flex flex-col">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E49E2] focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {filteredPeople.length > 0 ? (
                filteredPeople.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      onSelectPerson(person);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {person.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {person.name}
                      </p>
                      <p className="text-xs text-slate-500">{person.role}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneralData() {
  const navigate = useNavigate();
  const { p8Id } = useParams();
  const STEP_NUMBER = 2;
    const originalPayloadRef = useRef<string | null>(null);
  const { getStepStatus, saveStep, markStepInProgress, editStep, isStepCompleted } =
    useProject();

  const [partners, setPartners] = useState<Person[]>([]);
  const [managers, setManagers] = useState<Person[]>([]);
  const [offices, setOffices] = useState<StaffItem[]>([]);
  const [p8Data, setP8Data] = useState<any>(null);

  const [segmentos, setSegmentos] = useState<any[]>([]);
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [segmentSearchQuery, setSegmentSearchQuery] = useState("");

  const suppressEditRef = useRef(true);
  const runSilentUpdate = (fn: () => void) => {
    suppressEditRef.current = true;
    fn();
    setTimeout(() => {
      suppressEditRef.current = false;
    }, 0);
  };

  const [formData, setFormData] = useState({
    auditModality: "",
    responsibleOffice: "",
    segment: 0,
    auditAddress: "",
    postalCode: "",
    phoneNumber: "",
    projectDescription: "",
    auditYear: "",
    reportsToGroupAuditor: "",
    consolidated: "",
    engagementLeader: null as Person | null,
    engagementManager: null as Person | null,
  });

  const [teamLeaderStats, setTeamLeaderStats] = useState<TeamLeaderStats[]>([]);
  useEffect(() => {
    staffApi.getTeamLeaderStats().then(setTeamLeaderStats);
  }, []);

  const findLeaderStats = (employeeId?: string | number) => {
    if (!employeeId) return null;
    return teamLeaderStats.find((s) => String(s.employeeId) === String(employeeId));
  };

  const enrichWithStats = (person: Person): Person => {
    const stats = findLeaderStats(person.id);

    if (!stats) return person;

    return {
      ...person,
      yearsInRole:
        stats.yearsInRole != null
          ? Math.floor(stats.yearsInRole)
          : stats.isFirstYear
            ? 0
            : 1,
      isFirstYear: stats.isFirstYear,
      openPD: stats.openPdIndicator ?? false,
      qprRating: stats.qprResult === true ? "low" : "high",
    };
  };

  useEffect(() => {
    markStepInProgress(STEP_NUMBER);
    suppressEditRef.current = false;
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (!suppressEditRef.current) editStep(STEP_NUMBER);
  };

  const isFormValid = () => {
    return (
      !!formData.engagementLeader &&
      !!formData.engagementManager &&
      !!formData.auditModality &&
      !!formData.responsibleOffice &&
      !!formData.segment &&
      formData.auditAddress.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.auditYear.trim() !== "" &&
      formData.phoneNumber.length === 10 &&
      formData.postalCode.length === 5 &&
      formData.projectDescription.trim() !== "" &&
      (formData.reportsToGroupAuditor === "Yes" ||
        formData.reportsToGroupAuditor === "No") &&
      (formData.consolidated === "Yes" || formData.consolidated === "No")
    );
  };

    const buildPayload = () => ({
        engagementLeadEmployeeId: Number(formData.engagementLeader!.id),
        engagementManagerEmployeeId: Number(formData.engagementManager!.id),

        auditModality: formData.auditModality,
        responsibleOfficeLabel: formData.responsibleOffice,
        addressLine: formData.auditAddress,

        segmentId : Number(formData.segment),
        postalCode: formData.postalCode || null,
        phoneNumber: formData.phoneNumber,
        projectServiceDescription: formData.projectDescription,
        auditYear: Number(formData.auditYear),

        isReportToGroup: formData.reportsToGroupAuditor === "Yes",
        isConsolidated: formData.consolidated === "Yes",
    });
  const syncAndSaveStep = async (_navigateTo?: string) => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, formData, isComplete);

    try {
      const payload = buildPayload();
      await pviiiApi.updateEngagementDetails(p8Id, payload);
    } catch (error) {
    }
    };
    const normalizeFormData = (data: typeof formData) => ({
        engagementLeaderId: data.engagementLeader?.id ?? null,
        engagementManagerId: data.engagementManager?.id ?? null,

        auditModality: data.auditModality,
        responsibleOffice: data.responsibleOffice,
        segment: Number(data.segment) || 0,
        auditAddress: data.auditAddress.trim(),
        postalCode: data.postalCode.trim(),
        phoneNumber: data.phoneNumber.trim(),
        projectDescription: data.projectDescription.trim(),
        auditYear: data.auditYear,

        reportsToGroupAuditor: data.reportsToGroupAuditor,
        consolidated: data.consolidated,
    });
    const getNormalizedPayload = () => {
        return JSON.stringify(normalizeFormData(formData));
    };
    useEffect(() => {
        if (!p8Data) return;
        if (!formData.engagementLeader || !formData.engagementManager) return;

        if (originalPayloadRef.current !== null) return;

        originalPayloadRef.current = getNormalizedPayload();
        console.log("✅ GeneralData snapshot initialized");
    }, [p8Data, formData]);
    const hasChanges = (): boolean => {
        if (originalPayloadRef.current === null) return false;
        return originalPayloadRef.current !== getNormalizedPayload();
    };
    const [originalData, setOriginalData] = useState<any>(null);
    const saveBackendIfChanged = async () => {
        if (!hasChanges()) return;

        const payload = buildPayload();
        await pviiiApi.updateEngagementDetails(p8Id, payload);

        originalPayloadRef.current = getNormalizedPayload();
    };

    const handleNext = async () => {
        if (!isFormValid()) return;

        saveStep(STEP_NUMBER, formData, true);

        await saveBackendIfChanged();

        navigate(`/p8/quality/${p8Id}`);
    };
    
  const handleBack = async () => {
    await syncAndSaveStep(`/p8/leadership/${p8Id}`);
    navigate(`/p8/leadership/${p8Id}`);
  };

    const handleSaveDraft = async () => {
        if (!isFormValid()) {
            toast.error("Please complete all required fields before saving");
            return;
        }

        saveStep(STEP_NUMBER, formData, isFormValid());

        await saveBackendIfChanged();

        navigate("/p8/new");
    };

  useEffect(() => {
    loadSegmentos();
  }, []);

  const loadSegmentos = async () => {
    try {
      const data = await catalogoSegmentoApi.listSegmentos();
      setSegmentos(data);
    } catch (err) {
      console.error("Error loading segments", err);
    }
  };

  useEffect(() => {
    if (!teamLeaderStats.length) return;
    let mounted = true;

    (async () => {
      try {
        const [partnersRaw, managersRaw, officesRaw] = await Promise.all([
          staffApi.getPartners(),
          staffApi.getManagers(),
          staffApi.getOffices(),
        ]);

        if (!mounted) return;

        setPartners(
          (partnersRaw || []).map((p: StaffItem) =>
            toPerson(
              p,
              teamLeaderStats.find((s) => String(s.employeeId) === String(p.id))
            )
          )
        );

        setManagers(
          (managersRaw || []).map((m: StaffItem) =>
            toPerson(
              m,
              teamLeaderStats.find((s) => String(s.employeeId) === String(m.id))
            )
          )
        );

        setOffices(officesRaw || []);
      } catch (err) {
        console.error("Failed to load staff catalogs", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [teamLeaderStats]);

  useEffect(() => {
    if (!p8Id) return;

    let mounted = true;
    pviiiApi
      .getById(p8Id)
      .then((data: any) => {
        if (!mounted) return;
        setP8Data(data);
      })
      .catch((err: any) => {
        console.error("Failed to load p8 data", err);
      });

    return () => {
      mounted = false;
    };
  }, [p8Id]);

  useEffect(() => {
    if (!p8Data || !teamLeaderStats.length) return;

    const cp = p8Data.createProject;
    if (!cp) return;

    const leaderStats = teamLeaderStats.find(
      (s) => String(s.employeeId) === String(cp.partnerEmployeeId)
    );

    const managerStats = teamLeaderStats.find(
      (s) => String(s.employeeId) === String(cp.srManagerEmployeeId)
    );

    const leader: Person | null = cp.partnerEmployeeId
      ? toPerson({ id: cp.partnerEmployeeId, name: cp.partnerName }, leaderStats)
      : null;

    const manager: Person | null = cp.srManagerEmployeeId
      ? toPerson(
          { id: cp.srManagerEmployeeId, name: cp.srManagerName },
          managerStats
        )
      : null;

    runSilentUpdate(() => {
      setFormData((prev) => ({
        ...prev,
        engagementLeader: leader,
        engagementManager: manager,
      }));
    });
  }, [p8Data, teamLeaderStats]);

  useEffect(() => {
    if (!segmentos.length) return;
    if (!p8Data) return;

    const apiSegmentId = p8Data.segmentId;
    if (!apiSegmentId || apiSegmentId === 0) return;

    setFormData((prev) => {
      if (prev.segment === apiSegmentId) return prev;
      if (prev.segment !== 0) return prev;

      return {
        ...prev,
        segment: apiSegmentId,
      };
    });
  }, [p8Data?.segmentId, segmentos]);

  useEffect(() => {
    const ed = p8Data?.engagementDetails;
    if (!ed) return;

    const userHasEdited =
      ed.responsibleOfficeLabel !== null ||
      ed.addressLine !== null ||
      ed.postalCode !== null ||
      ed.phoneNumber !== null ||
      ed.projectServiceDescription !== null ||
      ed.isReportToGroup !== null ||
      ed.isConsolidated !== null;

    if (!userHasEdited) return;

    runSilentUpdate(() => {
      setFormData((prev) => ({
        ...prev,
        auditModality: ed.auditModality ?? "",
        responsibleOffice: ed.responsibleOfficeLabel ?? "",
        auditAddress: ed.addressLine ?? "",
        postalCode: ed.postalCode?.toString() ?? "",
        phoneNumber: ed.phoneNumber ?? "",
        projectDescription: ed.projectServiceDescription ?? "",
        auditYear: ed.auditYear?.toString() ?? "",
        reportsToGroupAuditor: ed.isReportToGroup ? "Yes" : "No",
        consolidated: ed.isConsolidated ? "Yes" : "No",
        segment: p8Data.segmentId ?? prev.segment,
      }));
    });
  }, [p8Data]);

  const calculateLeadershipRisk = (): { level: "low" | "high"; triggers: string[] } => {
    if (!formData.engagementLeader || !formData.engagementManager) {
      return { level: "low", triggers: [] };
    }

    const leader = formData.engagementLeader;
    const manager = formData.engagementManager;

    const leaderIsFirstYear = leader.isFirstYear;

    const leaderHasLowQPR = leader.qprRating === "low";
    const managerHasLowQPR = manager.qprRating === "low";

    const leaderHasOpenPD = leader.openPD === true;
    const managerHasOpenPD = manager.openPD === true;

    const triggers: string[] = [];

    // 1) Leader Low QPR
    if (leaderHasLowQPR) triggers.push("Engagement Leader has Non Compliance");

    if (managerHasLowQPR) triggers.push("Engagement Manager has Non Compliance");

    if (leaderIsFirstYear) triggers.push("Leader is 1st year in role");

    if (leaderHasOpenPD) triggers.push("Leader has low OpenPD score");

    // 2) Leader First Year + Manager Low QPR
    if (leaderIsFirstYear && managerHasLowQPR) {
      triggers.push("Leader is 1st year in role AND Manager has Non Compliance");
    }

    // 3) Both Low QPR
    if (leaderHasLowQPR && managerHasLowQPR) {
      triggers.push("Both Leader and Manager have Non Compliance");
    }

    // 4) Both Open PD
    if (leaderHasOpenPD && managerHasOpenPD) {
      triggers.push("Both Leader and Manager have low OpenPD score");
    }

    // 5) Leader Open PD + Leader First Year
    if (leaderHasOpenPD && leaderIsFirstYear) {
      triggers.push("Leader has low OpenPD score AND is 1st year in role");
    }

    // 6) Leader Open PD + Manager Low QPR
    if (leaderHasOpenPD && managerHasLowQPR) {
      triggers.push("Leader has low OpenPD score AND Manager has Non Compliance");
    }

    // 7) Manager Open PD + Leader Low QPR
    if (managerHasOpenPD && leaderHasLowQPR) {
      triggers.push("Manager has OpenPD AND Leader has Non Compliance");
    }

    const level: "low" | "high" = triggers.length > 0 ? "high" : "low";
    return { level, triggers };
  };

  const leadershipAssessment = calculateLeadershipRisk();
  const leadershipRisk = leadershipAssessment.level;
  const leadershipTriggers = leadershipAssessment.triggers;

  const handleStepClick = async (stepIndex: number) => {
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

    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, formData, isComplete);

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
            currentStep={1}
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
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2
                className="text-[#1e49e2] font-light text-[24px] tracking-[0.02em] transition-colors duration-300"
                style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
              >
                Engagement Details
              </h2>
            </div>

            <div className="max-w-5xl space-y-8">
              <div className="rounded-xl border border-[#00338D]/10 overflow-visible bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={sectionTitleClass}>Engagement Leadership</h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PeoplePicker
                      label="Engagement Leader"
                      selectedPerson={formData.engagementLeader}
                      availablePeople={partners}
                      onSelectPerson={(person) =>
                        handleChange("engagementLeader", enrichWithStats(person))
                      }
                      placeholder={
                        partners.length ? "Select engagement leader" : "Loading leaders..."
                      }
                    />

                    <PeoplePicker
                      label="Engagement Manager"
                      selectedPerson={formData.engagementManager}
                      availablePeople={managers}
                      onSelectPerson={(person) =>
                        handleChange("engagementManager", enrichWithStats(person))
                      }
                      placeholder={
                        managers.length ? "Select engagement manager" : "Loading managers..."
                      }
                      showFirstYearBadge={false}
                    />
                  </div>

                  {formData.engagementLeader &&
                    formData.engagementManager &&
                    leadershipRisk === "high" && (
                      <div className="mt-6 pt-6 border-t border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-[#00338D] tracking-wider capitalize">
                                Leadership Risk Assessment
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                High Risk
                              </span>
                            </div>

                            <p className="text-sm text-slate-600 mt-2">
                              Engagement leadership may present an elevated risk.
                            </p>

                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="rounded-xl border border-[#00338D]/10 overflow-hidden bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={sectionTitleClass}>Engagement Logistics</h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Audit Modality <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.auditModality}
                        onValueChange={(value) => handleChange("auditModality", value)}
                        options={[
                          { value: "On-site", label: "On-site" },
                          { value: "Hybrid", label: "Hybrid" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Responsible Office <span className="text-red-500">*</span>
                      </Label>

                      <Select
                        value={formData.responsibleOffice}
                        onValueChange={(value) => handleChange("responsibleOffice", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              offices.length
                                ? "Select responsible office"
                                : "Loading offices..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {offices.map((office) => (
                            <SelectItem key={office.id} value={office.name}>
                              {office.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <Label className={labelClass}>
                        Segment <span className="text-red-500">*</span>
                      </Label>

                      <Popover open={segmentOpen} onOpenChange={setSegmentOpen}>
                        <PopoverTrigger asChild>
                          {/*nuewvo erik*/}
                        <button
                          type="button"
                          className="w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors group"
                        >
                          <span
                            className={[
                              selectValueText,
                              "truncate",
                              formData.segment ? "text-slate-900" : "text-slate-400",
                            ].join(" ")}
                          >
                            {formData.segment
                              ? segmentos.find(
                                  (s) => String(s.segmentoId) === String(formData.segment)
                                )?.segmentoNombre
                              : "Select a segment"}
                          </span>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span
                              className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#00338D]/5 text-[#00338D] border border-[#00338D]/15 tracking-[0.02em]"
                            >
                              {formData.segment
                                ? segmentos.find(
                                    (s) => String(s.segmentoId) === String(formData.segment)
                                  )?.businessUnitIdLabel
                                : ""}
                            </span>

                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#00338D] transition-all" />
                          </div>
                        </button>
                                  
                        {/*old
                          <button
                            type="button"
                            className="w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors group"
                          >
                            <span
                              className={[
                                selectValueText,
                                "truncate",
                                formData.segment ? "text-slate-900" : "text-slate-400",
                              ].join(" ")}
                            >
                              {formData.segment
                                ? segmentos.find(
                                    (s) => String(s.segmentoId) === String(formData.segment)
                                  )?.segmentoNombre
                                : "Select a segment"}
                            </span>
                           
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#00338D] transition-all" />
                          </button>
                          */}

                        </PopoverTrigger>

                        <PopoverContent
                          align="start"
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                        >
                          <div className="p-2 border-b border-slate-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                type="text"
                                placeholder="Search segments..."
                                value={segmentSearchQuery}
                                onChange={(e) => setSegmentSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                                autoFocus
                              />
                            </div>
                          </div>

                          <div className="max-h-[250px] overflow-y-auto p-1">
                            {segmentos
                              .filter((s) =>
                                s.segmentoNombre
                                  .toLowerCase()
                                  .includes(segmentSearchQuery.toLowerCase())
                              )
                              .map((s) => {
                                const selected =
                                  String(formData.segment) === String(s.segmentoId);

                                return (
                                  <button
                                    key={s.segmentoId}
                                    onClick={() => {
                                      handleChange("segment", s.segmentoId);
                                      setSegmentOpen(false);
                                      setSegmentSearchQuery("");
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-between ${
                                      selected ? "bg-[#1E49E2]/10" : ""
                                    }`}
                                  >
                                    <span
                                      className={[
                                        selectItemText,
                                        "truncate",
                                        selected ? "text-[#1E49E2]" : "text-slate-900",
                                      ].join(" ")}
                                    >
                                      {s.segmentoNombre}
                                    </span>

                                    {selected && <Check className="w-4 h-4 text-[#1E49E2]" />}
                                  </button>
                                );
                              })}

                            {segmentos.filter((s) =>
                              s.segmentoNombre
                                .toLowerCase()
                                .includes(segmentSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="px-3 py-6 text-center text-sm text-slate-500">
                                No segments found
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="auditAddress" className={labelClass}>
                        Audit Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="auditAddress"
                        value={formData.auditAddress}
                        autoComplete="off"
                        onChange={(e) => handleChange("auditAddress", e.target.value)}
                        placeholder="Enter audit address"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className={labelClass}>
                        Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 5) handleChange("postalCode", value);
                        }}
                        placeholder="Enter postal code"
                        className="h-11"
                        maxLength={5}
                      />
                      {formData.postalCode.length > 0 && formData.postalCode.length < 5 && (
                        <p className="text-[12px] text-red-500">
                          Postal Code must be 5 digits
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className={labelClass}>
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) handleChange("phoneNumber", value);
                        }}
                        placeholder="Enter 10-digit phone number"
                        className="h-11"
                      />
                      {formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && (
                        <p className="text-[12px] text-red-500">
                          Phone number must be 10 digits
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#00338D]/10 overflow-hidden bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={sectionTitleClass}>
                    Engagement Description &amp; Group Reporting
                  </h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription" className={labelClass}>
                        Project / Service Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="projectDescription"
                        value={formData.projectDescription}
                        onChange={(e) => handleChange("projectDescription", e.target.value)}
                        placeholder="Enter detailed description of the engagement"
                        className="min-h-[60px] resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className={labelClass}>
                          Audit Year <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.auditYear}
                          onValueChange={(value) => handleChange("auditYear", value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select audit year" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFiscalYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className={labelClass}>
                          Reports to Group Auditor <span className="text-red-500">*</span>
                        </Label>
                        <SegmentedControl
                          value={formData.reportsToGroupAuditor}
                          onValueChange={(value) =>
                            handleChange("reportsToGroupAuditor", value)
                          }
                          options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                          ]}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className={labelClass}>
                          Consolidated <span className="text-red-500">*</span>
                        </Label>
                        <SegmentedControl
                          value={formData.consolidated}
                          onValueChange={(value) => handleChange("consolidated", value)}
                          options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                          ]}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                              onClick={handleSaveDraft} 
                className="border-slate-300 text-slate-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save &amp; Exit
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isFormValid()}
                className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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