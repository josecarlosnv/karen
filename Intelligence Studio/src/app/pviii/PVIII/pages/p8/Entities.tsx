import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Save, ArrowRight, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion } from "motion/react";
import { pviiiEntities } from "../../api/pviiiEntities";
import { pviiiApi } from "../../api/pviiiApi";
import { useProject } from "../../context/ProjectContext";
import { catalogorevisores } from "../../api/LSQCR_EQCR";

const titleClass =
  "text-[#1e49e2] font-light text-[24px] tracking-[0.02em] transition-colors duration-300";
const titleShadow = { textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" };

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

interface Reviewer {
  fullName: string;
  employeeId: string;
  emailAddressBusiness: string;
  localJobLevelName: string;
  locationName: string;
  productoDescription: string;
}

interface SearchableReviewerSelectProps {
  value: string; 
  reviewers: Reviewer[];
  onSelect: (reviewer: Reviewer) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function SearchableReviewerSelect({
  value,
  reviewers,
  onSelect,
  placeholder = "Select reviewer",
  className = "",
  disabled = false,
}: SearchableReviewerSelectProps) {
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

  const normalizedValue = (value ?? "").trim();

  const selectedReviewer =
    reviewers.find((r) => (r.employeeId ?? "").trim() === normalizedValue) ?? null;

  const filtered = reviewers.filter((r) => {
    const haystack = `${r.fullName ?? ""} ${r.employeeId ?? ""} ${r.emailAddressBusiness ?? ""}`
      .toLowerCase()
      .trim();
    return haystack.includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg
          ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-[#00338D]/30 cursor-pointer"}
          transition-colors duration-200 group`}
        aria-disabled={disabled}
      >
        {selectedReviewer ? (
          <div className="min-w-0">
            <div className="text-sm text-[#00338D] truncate">
              {selectedReviewer.fullName}
            </div>
            
          </div>
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

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] max-h-80 flex flex-col">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, id or email..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E49E2] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filtered.length > 0 ? (
              filtered.map((r) => {
                const isSelected = (r.employeeId ?? "").trim() === normalizedValue;

                return (
                  <button
                    key={(r.employeeId ?? "").trim()}
                    type="button"
                    onClick={() => {
                      onSelect(r);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                      isSelected ? "bg-[#00338D]/5" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-sm truncate ${
                          isSelected ? "font-medium text-[#00338D]" : "text-slate-700"
                        }`}
                      >
                        {r.fullName}
                      </div>
                            
                    </div>

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

type EntitySearchResult = {
  id: number;
  name: string;
  entityId: number;
  groupName?: string;
};

function SearchableEntitySelect({
  value,
  onSelect,
  placeholder = "Search entity...",
  className = "",
}: {
  value?: { id: number; name: string } | null;
  onSelect: (entity: { id: number; name: string }) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<EntitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setResults([]);
    setHasMore(true);
  }, [searchQuery, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !hasMore) return;

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await pviiiApi.searchEntities(searchQuery || undefined, page, 20);

        const mapped: EntitySearchResult[] = (res || []).map((e: any) => ({
          id: e.id,
          name: e.description !== "#" ? e.description : `Entity ${e.id}`,
          entityId: e.id,
          groupName: e.groupDescription,
        }));

        setResults((prev) => [...prev, ...mapped]);

        if (mapped.length < 20) setHasMore(false);
      } catch (e) {
        console.error("Error searching entities", e);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [page, searchQuery, isOpen, hasMore]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-3 flex items-center justify-between bg-white border-0 shadow-none hover:bg-slate-50 rounded-lg transition-colors duration-200 cursor-pointer"
      >
        {value?.name ? (
          <span className="text-sm font-semibold text-[#00338D] truncate block tracking-[0.01em]">
            {value.name}
          </span>
        ) : (
          <span className="text-sm text-slate-400">{placeholder}</span>
        )}

        <svg
          className={`w-4 h-4 text-slate-400 transition-all duration-200 flex-shrink-0 ${
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] max-h-80 flex flex-col">
          {value?.name && (
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="text-xs font-semibold text-slate-500 mb-2">Current entity</div>

              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                onClick={() => {
                  onSelect({ id: value.id, name: value.name });
                  setIsOpen(false);
                }}
              >
                <div className="text-sm font-medium text-slate-900 truncate">{value.name}</div>
              </button>
            </div>
          )}

          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type at least 2 characters"
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E49E2] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div
            className="overflow-y-auto flex-1"
            onScroll={(e) => {
              const target = e.currentTarget;
              if (!loading && hasMore && target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
            )}

            {!loading && results.length > 0 ? (
              results.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onSelect({ id: c.id, name: c.name });
                    setIsOpen(false);
                    setSearchQuery("");
                    setResults([]);
                  }}
                  className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                    value?.id === c.id ? "bg-[#00338D]/5" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div
                      className={`text-sm truncate ${
                        value?.id === c.id ? "font-medium text-[#00338D]" : "text-slate-700"
                      }`}
                    >
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                       {c.entityId}
                      {c.groupName ? ` · ${c.groupName}` : ""}
                    </div>
                  </div>

                  {value?.id === c.id && (
                    <svg className="w-4 h-4 text-[#00338D] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              !loading &&
              searchQuery.length >= 2 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">No results found</div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ReportType {
  idCat: number;
  typeId: number | null;
    typeDescription: string | null;
    qualityReviewIndicator: boolean;
}

interface Entity {
  id: string;
  backendKeyId?: number;
  entityId?: number | null;

  name: string;
  reportType: string;
  reportTypeId?: number | null;
    qualityReviewIndicator: boolean;
  opinionDate: string;
  reviewerType: string;

  auditFees: string;
  reportFees: string;
    taxFees: string;
    isDeleted?: boolean;
}

export default function Entities() {
  const navigate = useNavigate();
  const { p8Id } = useParams();
  const STEP_NUMBER = 4;
    const originalPayloadRef = useRef<string | null>(null);
   

  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();
    const mapBackendEntities = (source: any[], projectDetail: any): Entity[] => {
        if (!Array.isArray(source)) return [];

        return source.map((e: any) => ({
            id: String(e.keyId ?? crypto.randomUUID()),

            backendKeyId: e.keyId ?? null,
            entityId: e.entityId ?? null,

            name: e.entityName ?? projectDetail.clientName ?? "",
            reportType: e.reportTypeLabel ?? "",
            reportTypeId: e.reportTypeId ?? null,

            opinionDate: e.opinionDate
                ? e.opinionDate.substring(0, 10)
                : "",

            reviewerType: e.reviewerTypeLabel ?? "None",

            auditFees: String(e.auditFeeAmount ?? ""),
            reportFees: String(e.reportFeeAmount ?? ""),
            taxFees: String(e.taxFeeAmount ?? ""),

            qualityReviewIndicator: e.reviewerTypeLabel !== null,
            isDeleted: e.isDeleted === true,
        }));
    };
  const [projectDetail, setProjectDetail] = useState<any>(null);

  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loadingReviewers, setLoadingReviewers] = useState(false);

  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [loadingReportTypes, setLoadingReportTypes] = useState(false);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [reviewerData, setReviewerData] = useState({
    lsqcrReviewerName: "",
    lsqcrEmployeeId: null as number | null,

    eqcrReviewerName: "",
    eqcrEmployeeId: null as number | null,

    eqcrHours: "",
  });
    const hasAnyQualityReviewEntity = entities.some(
        (e) => e.qualityReviewIndicator !== false
    );
    const visibleEntities = entities.filter(
        (e) => !e.isDeleted
    );
    
    const hasLSQCR = visibleEntities.some(e => e.reviewerType === "LSQCR");
    const hasEQCR = visibleEntities.some(e => e.reviewerType === "EQCR");
  const [expandedEntityId, setExpandedEntityId] = useState<string | null>(null);

    const disableReviewerAssignment =
        visibleEntities.length === 0 ||
        !visibleEntities.some(e => e.qualityReviewIndicator !== false);

  const suppressEditRef = useRef(true);
  const hasLocalDraftRef = useRef(false);

  const runSilentUpdate = (fn: () => void) => {
    suppressEditRef.current = true;
    fn();
    setTimeout(() => {
      suppressEditRef.current = false;
    }, 0);
  };

  const markEdited = () => {
    if (!suppressEditRef.current) editStep(STEP_NUMBER);
  };

  const calculateTotalFees = (entity: Entity) => {
    const audit = parseFloat(entity.auditFees) || 0;
    const report = parseFloat(entity.reportFees) || 0;
    const tax = parseFloat(entity.taxFees) || 0;
    return audit + report + tax;
  };
    

    const calculateLSQCRHours = () => {
        const lsqcrEntities = visibleEntities.filter(
            (e) => e.reviewerType === "LSQCR"
        );
        return lsqcrEntities.length * 2;
    };
   
    const hasEQCREntity = () => {
        return visibleEntities.some((e) => e.reviewerType === "EQCR");
    };
  
    const calculateGlobalTotalFees = () => {
        return visibleEntities.reduce(
            (sum, entity) => sum + calculateTotalFees(entity),
            0
        );
    };
  const isFormValid = () => {

      if (visibleEntities.length === 0) return false;

    for (const entity of entities) {
      if (!entity.name || !entity.reportType) return false;


        const noQualityReview = entity.qualityReviewIndicator === false;

        if (!noQualityReview && !entity.reviewerType) return false;

        if (
            entity.reportType !== "Fiscal" &&
            !noQualityReview &&
            (!entity.opinionDate || entity.opinionDate.trim() === "")
        ) {
            return false;
        }

      const totalFees = calculateTotalFees(entity);
      if (totalFees <= 0) return false;
    }


      const hasLSQCR = visibleEntities.some(e => e.reviewerType === "LSQCR");

      if (hasLSQCR && !reviewerData.lsqcrEmployeeId) return false;

    const hasEQCR = hasEQCREntity();
    if (hasEQCR) {
      if (!reviewerData.eqcrEmployeeId) return false;
      if (!reviewerData.eqcrHours || Number(reviewerData.eqcrHours) <= 0) return false;
    }

    return true;
  };

  const persistStep = () => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, { entities, reviewerData }, isComplete);
    return isComplete;
  };

  const toggleEntityExpansion = (entityId: string) => {
    setExpandedEntityId(expandedEntityId === entityId ? null : entityId);
  };

  const addEntity = () => {
    const newEntity: Entity = {
      id: Date.now().toString(),
      name: "",
      reportType: "",
        reportTypeId: null,
        qualityReviewIndicator: true,
      opinionDate: "",
      reviewerType: "",
      auditFees: "",
      reportFees: "",
      taxFees: "",
    };
    setEntities((prev) => [...prev, newEntity]);
    markEdited();
  };

    const deleteEntity = (id: string) => {
        setEntities((prev) =>
            prev.map((e) =>
                e.id === id
                    ? { ...e, isDeleted: true }
                    : e
            )
        );
        markEdited();
    };

  const updateEntity = (id: string, field: keyof Entity, value: string) => {
    setEntities((prev) =>
      prev.map((entity) => {
        if (entity.id !== id) return entity;

        let updates: Partial<Entity> = { [field]: value };

        if (field === "reportType") {
          if (value === "Fiscal") {
            updates.reviewerType = "None";
            updates.opinionDate = "";
          } else if (!value) {
            updates.reviewerType = "";
          }
        }

        return { ...entity, ...updates };
      })
    );
    markEdited();
  };

  const handleReviewerChange = (field: string, value: any) => {
    setReviewerData((prev) => ({ ...prev, [field]: value }));
    markEdited();
  };

    const uniqueReviewers = Array.from(
        new Map(reviewers.map(r => [r.employeeId, r])).values()
    );

  const buildPayload = () => {
    return entities.map((e) => {
      const isLSQCR = e.reviewerType === "LSQCR";
      const isEQCR = e.reviewerType === "EQCR";

      const opinionDateIso =
        e.reportType === "Fiscal" || !e.opinionDate ? null : new Date(e.opinionDate).toISOString();

        return {
            keyId: e.backendKeyId ?? null,
            entityId: e.entityId ?? null,
            entityName: e.name,
            reportTypeLabel: e.reportType,
            reportTypeId: e.reportTypeId ?? null,
            opinionDate: opinionDateIso,

            reviewerTypeLabel: e.reviewerType === "None" ? "" : e.reviewerType,

            auditFeeAmount: Number(e.auditFees) || 0,
            reportFeeAmount: Number(e.reportFees) || 0,
            taxFeeAmount: Number(e.taxFees) || 0,

            LsqcrReviewerName: isLSQCR ? reviewerData.lsqcrReviewerName : null,
            EmployeeIdLsqcr: isLSQCR ? reviewerData.lsqcrEmployeeId : null,
            LsqcrReviewerHours: isLSQCR ? calculateLSQCRHours() : null,

            Eqcrreviewer: isEQCR ? reviewerData.eqcrReviewerName : null,
            EmployeeIdEqcr: isEQCR ? reviewerData.eqcrEmployeeId : null,
            Eqcrhours: isEQCR ? Number(reviewerData.eqcrHours) : null,

            IsDeleted: e.isDeleted === true,
        };
    });
    };
    const normalizeEntitiesForCompare = (list: Entity[]) => {
        return list
            .filter(e => !e.isDeleted) 
            .map(e => ({
                entityId: e.entityId ?? null,
                name: e.name.trim(),
                reportType: e.reportType,
                reportTypeId: e.reportTypeId ?? null,
                reviewerType: e.reviewerType,
                opinionDate: e.opinionDate || null,
                auditFees: Number(e.auditFees) || 0,
                reportFees: Number(e.reportFees) || 0,
                taxFees: Number(e.taxFees) || 0,
            }))
            .sort((a, b) => (a.entityId ?? 0) - (b.entityId ?? 0));
    };
    const normalizeReviewerData = (r: typeof reviewerData) => ({
        lsqcrEmployeeId: r.lsqcrEmployeeId ?? null,
        eqcrEmployeeId: r.eqcrEmployeeId ?? null,
        eqcrHours: Number(r.eqcrHours) || 0,
    });
    const getNormalizedPayload = () => {
        return JSON.stringify({
            entities: normalizeEntitiesForCompare(entities),
            reviewerData: normalizeReviewerData(reviewerData),
        });
    };
    
    useEffect(() => {
        if (!projectDetail) return;
        if (hasLocalDraftRef.current) return;


        const source =
            (projectDetail.entitiesCurrent?.length ?? 0) > 0
                ? projectDetail.entitiesCurrent
                : projectDetail.entities;

        if (!Array.isArray(source) || source.length === 0) {
            runSilentUpdate(() => {
                setEntities([]);
                setReviewerData({
                    lsqcrReviewerName: "",
                    lsqcrEmployeeId: null,
                    eqcrReviewerName: "",
                    eqcrEmployeeId: null,
                    eqcrHours: "",
                });
            });
            return;
        }

        const mappedEntities = mapBackendEntities(source, projectDetail);

        const lsqcrEntity = source.find(
            (e: any) => e.employeeIdLsqcr != null
        );

        const eqcrEntity = source.find(
            (e: any) => e.employeeIdEqcr != null
        );

        runSilentUpdate(() => {
            setEntities(mappedEntities);
            setReviewerData({
                lsqcrReviewerName: lsqcrEntity?.lsqcrReviewerName ?? "",
                lsqcrEmployeeId: lsqcrEntity?.employeeIdLsqcr ?? null,

                eqcrReviewerName: eqcrEntity?.eqcrreviewer ?? "",
                eqcrEmployeeId: eqcrEntity?.employeeIdEqcr ?? null,
                eqcrHours: eqcrEntity?.eqcrhours
                    ? String(eqcrEntity.eqcrhours)
                    : "",
            });
        });
    }, [projectDetail]);
    useEffect(() => {
        if (!projectDetail) return;
        if (entities.length === 0) return;
        if (originalPayloadRef.current !== null) return;

        originalPayloadRef.current = getNormalizedPayload();

        console.log("✅ Entities snapshot initialized");
    }, [projectDetail, entities, reviewerData]);
    const hasChanges = (): boolean => {
        if (originalPayloadRef.current === null) return false;
        return originalPayloadRef.current !== getNormalizedPayload();
    };
 
  useEffect(() => {
    const loadReportTypes = async () => {
      try {
        setLoadingReportTypes(true);
        const data = await pviiiEntities.listReportTypes();
        setReportTypes(data ?? []);
      } catch (error) {
        console.error("Error loading report types", error);
        setReportTypes([]);
      } finally {
        setLoadingReportTypes(false);
      }
    };
    loadReportTypes();
  }, []);

  useEffect(() => {
    const loadReviewers = async () => {
      try {
        setLoadingReviewers(true);
            const data = await catalogorevisores.listrevisores();

          const normalized = data.map((r: any) => ({
              employeeId: String(r.employeeId ?? "").trim(),
              fullName: r.fullName ?? "",
              emailAddressBusiness: r.emailAddressBusiness ?? "",
              localJobLevelName: r.localJobLevelName ?? "",
              locationName: r.locationName ?? "",
              productoDescription: r.productoDescription ?? "",
          }));

          const unique = Array.from(
              new Map(normalized.map(r => [r.employeeId, r])).values()
          );

          setReviewers(unique);


      } catch (error) {
        console.error("Error loading reviewers", error);
      } finally {
        setLoadingReviewers(false);
      }
    };
    loadReviewers();
  }, []);

  useEffect(() => {
    if (!p8Id) return;
    pviiiApi.getById(p8Id).then(setProjectDetail).catch(console.error);
  }, [p8Id]);

    const saveEntities = async () => {
        if (!p8Id) return;

        persistStep();

        const payload = {
            generalDetails: {
                natureOfEngagementLabel:
                    projectDetail?.generalDetails?.natureOfEngagementLabel ?? null,
                auditWorkflowLabel:
                    projectDetail?.generalDetails?.auditWorkflowLabel ?? null,
                statutoryExaminerLabel:
                    projectDetail?.generalDetails?.statutoryExaminerLabel ?? null,
            },
            entityConfigurations: buildPayload(),

        };

        await pviiiEntities.InUpEntiti(p8Id, payload);
    };

    const handleSaveDraft = async () => {
        try {
            persistStep();

            if (!hasChanges()) {
                navigate("/p8/new");
                return;
            }

            await saveEntities();

            originalPayloadRef.current = getNormalizedPayload();
            navigate("/p8/new");
        } catch (error) {
            console.error("Error saving", error);
        }
    };
   
    const handleNext = async () => {
        if (!isFormValid() || !p8Id) return;

        try {
            persistStep();

            if (!hasChanges()) {
                navigate(`/p8/staffing/${p8Id}`);
                return;
            }

            await saveEntities();

            originalPayloadRef.current = getNormalizedPayload();
            navigate(`/p8/staffing/${p8Id}`);
        } catch (error) {
            console.error("Error saving", error);
        }
    };
  const handleBack = () => {
    persistStep();
    navigate(`/p8/quality/${p8Id}`);
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
            currentStep={3}
            onStepClick={(stepIndex) => {
              persistStep();
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
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className={titleClass} style={titleShadow}>
                Entities &amp; Fees
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-[#1E49E2]/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-[#00338D] capitalize tracking-wider"></h3>

                  <Button
                    onClick={addEntity}
                    className="text-[13px] font-medium tracking-[0.04em] bg-gradient-to-r from-[#1E49E2] to-[#1E49E2] text-white shadow-sm hover:from-[#00338D] hover:to-[#163FCC] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Entity
                  </Button>
                </div>

                <div className="space-y-3">

                                  {entities
                                      .filter(entity => !entity.isDeleted)
                                      .map((entity) => {

                    const isExpanded = expandedEntityId === entity.id;
                    const entityTotal = calculateTotalFees(entity);

                    return (
                      <div
                        key={entity.id}
                        className="group border border-slate-200 rounded-lg bg-white overflow-visible hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div
                          className={`relative flex items-center gap-4 px-4 cursor-pointer transition-all ${
                            isExpanded ? "py-3 bg-[#1E49E2]/10" : "py-2.5 hover:bg-[#1E49E2]/10"
                          }`}
                          onClick={() => toggleEntityExpansion(entity.id)}
                        >
                          <button className="text-[#0C233C]/50 hover:text-[#0C233C]/70 transition-colors flex-shrink-0">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>

                          {!isExpanded ? (
                            <div className="flex-1 flex items-center gap-4 min-w-0">
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-[#00338D] truncate block text-[15px] tracking-[0.01em]">
                                  {entity.name || (
                                    <span className="text-[#0C233C]/50 italic font-normal">No entity selected</span>
                                  )}
                                </span>
                              </div>

                              <div className="hidden md:flex items-center gap-2.5 text-xs text-[#0C233C]/60">
                                <span className="truncate max-w-[180px]">
                                  {entity.reportType || <span className="text-[#0C233C]/40 italic">No report type</span>}
                                </span>

                                {entity.reportType && <span className="text-slate-300">•</span>}

                                {entity.reviewerType ? (
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      entity.reviewerType === "EQCR"
                                        ? "bg-[#00338D]/10 text-[#00338D]"
                                        : entity.reviewerType === "LSQCR"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-slate-100 text-[#0C233C]/70"
                                    }`}
                                  >
                                    {entity.reviewerType}
                                  </span>
                                ) : (
                                  <span className="text-[#0C233C]/40 italic text-[10px]">No reviewer</span>
                                )}

                                <span className="text-slate-300">•</span>

                                <span className="font-semibold text-[#0C233C] whitespace-nowrap text-sm">
                                  ${entityTotal.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                              <SearchableEntitySelect
                                value={entity.entityId ? { id: entity.entityId, name: entity.name } : null}
                                onSelect={(client) => {
                                  setEntities((prev) =>
                                    prev.map((e) =>
                                      e.id === entity.id
                                        ? { ...e, entityId: client.id, name: client.name }
                                        : e
                                    )
                                  );
                                  markEdited();
                                }}
                                placeholder="Search entity name..."
                                className="w-full"
                              />
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntity(entity.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#0C233C]/50 hover:text-red-600 hover:bg-red-50 rounded p-1 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-slate-200 bg-[#F7F9FC]">
                            <div className="p-5 space-y-5">
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Report Type <span className="text-red-500">*</span>
                                    </Label>

                                                    <Select
                                                        value={entity.reportType}
                                                        onValueChange={(value) => {
                                                            const selected = reportTypes.find((r) => r.typeDescription === value);
                                                            setEntities((prev) =>
                                                                prev.map((e) =>
                                                                    e.id === entity.id
                                                                        ? {
                                                                            ...e,
                                                                            reportType: value,
                                                                            reportTypeId: selected?.typeId ?? null,
                                                                            qualityReviewIndicator: selected?.qualityReviewIndicator ?? true,
                                                                            ...(selected?.qualityReviewIndicator === false
                                                                                ? { reviewerType: "None" }
                                                                                : {})
                                                                        }
                                                                        : e
                                                                )
                                                            );
                                                            markEdited();
                                                        }}
                                                    >

                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder={loadingReportTypes ? "Loading..." : "Select type"} />
                                      </SelectTrigger>

                                      <SelectContent>
                                        {reportTypes.map((rt) => (
                                          <SelectItem key={rt.idCat} value={rt.typeDescription ?? ""}>
                                            {rt.typeDescription}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Opinion Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      type="date"
                                      value={entity.opinionDate}
                                      onChange={(e) => updateEntity(entity.id, "opinionDate", e.target.value)}
                                      className="h-9"

                                                        required={entity.qualityReviewIndicator !== false && entity.reportType !== "Fiscal"}
                                                    />

                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Reviewer Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                      value={entity.reviewerType}
                                      onValueChange={(value) => updateEntity(entity.id, "reviewerType", value)}
                                       disabled={!entity.reportType || entity.qualityReviewIndicator === false}

                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select reviewer" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="LSQCR">LSQCR</SelectItem>
                                        <SelectItem value="EQCR">EQCR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h5 className="text-[12px] font-medium text-[#00338D]/90 capitalize tracking-[0.08em] mb-3">
                                  Fees Breakdown
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Audit Fees
                                    </Label>
                                    <Input
                                      type="number"
                                      value={entity.auditFees}
                                      onChange={(e) => updateEntity(entity.id, "auditFees", e.target.value)}
                                      placeholder="0"
                                      className="h-9"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Report Fees
                                    </Label>
                                    <Input
                                      type="number"
                                      value={entity.reportFees}
                                      onChange={(e) => updateEntity(entity.id, "reportFees", e.target.value)}
                                      placeholder="0"
                                      className="h-9"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <Label className="text-[11px] font-normal text-[#00338D]/80 capitalize tracking-[0.08em]">
                                      Tax Fees
                                    </Label>
                                    <Input
                                      type="number"
                                      value={entity.taxFees}
                                      onChange={(e) => updateEntity(entity.id, "taxFees", e.target.value)}
                                      placeholder="0"
                                      className="h-9"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                                  <span className="text-sm font-medium text-slate-700">
                                    Entity Total <span className="text-red-500">*</span>
                                  </span>
                                  <span className="text-lg font-semibold text-[#0C233C]">
                                    ${entityTotal.toLocaleString()}
                                  </span>
                                </div>

                                {entityTotal === 0 && (
                                  <p className="text-xs text-red-500 mt-2">
                                    At least one fee must be greater than zero
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                              {visibleEntities.length > 0 && (
                                  <div className="mt-6 bg-gradient-to-r from-[#1E49E2]/5 to-[#1E49E2]/5 border-2 border-[#1E49E2]/10 rounded-lg p-4">
                                      <div className="flex items-center justify-between">
                                          <div>
                                              <div className="text-xs font-medium text-[#1E49E2] capitalize tracking-wider">
                                                  Global Engagement Total
                                              </div>
                                              <div className="text-[11px] text-[#0C233C]/70 mt-0.5">
                                                  Sum of all {visibleEntities.length}{" "}
                                                  {visibleEntities.length === 1 ? "entity" : "entities"}
                                              </div>
                                          </div>
                                          <div className="text-xl font-bold text-[#1E49E2]">
                                              ${calculateGlobalTotalFees().toLocaleString()}
                                          </div>
                                      </div>
                                  </div>
                              )}
              </div>


                          <div
                              className={`bg-gradient-to-br from-[#00338D]/[0.02] to-[#1E49E2]/[0.02] rounded-lg border border-[#1E49E2]/10 p-6
    ${disableReviewerAssignment ? "opacity-50 pointer-events-none" : ""}
  `}
                          >
                              <h3 className="text-sm font-semibold text-[#1E49E2] capitalize tracking-wider mb-5">
                                  Reviewer Assignment
                              </h3>

                              <div className="space-y-6">
                                  <>
                                      {hasLSQCR && (
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                              <div className="space-y-2">
                                                  <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                      LSQCR Reviewer <span className="text-red-500">*</span>
                                                  </Label>

                                                  <SearchableReviewerSelect
                                                      value={reviewerData.lsqcrEmployeeId?.toString() ?? ""}
                                                      reviewers={reviewers}
                                                      disabled={loadingReviewers || !hasLSQCR}
                                                      placeholder="Select LSQCR reviewer"
                                                      onSelect={(r) => {
                                                          setReviewerData((prev) => ({
                                                              ...prev,
                                                              lsqcrEmployeeId: Number((r.employeeId ?? "").trim()),
                                                              lsqcrReviewerName: r.fullName ?? "",
                                                          }));
                                                          markEdited();
                                                      }}
                                                  />
                                              </div>

                                              <div className="space-y-2">
                                                  <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                      LSQCR Hours
                                                  </Label>
                                                  <div className="h-11 flex items-center px-3 border border-slate-200 rounded-md bg-slate-50 font-medium text-slate-700">
                                                      {calculateLSQCRHours()} hours
                                                      <span className="ml-2 text-xs text-[#0C233C]/60">
                                                          (2 hours per entity)
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                      )}

                                      {hasEQCREntity() && (
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                              <div className="space-y-2">
                                                  <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                      EQCR Reviewer <span className="text-red-500">*</span>
                                                  </Label>

                                                  <SearchableReviewerSelect
                                                      value={reviewerData.eqcrEmployeeId?.toString() ?? ""}
                                                      reviewers={reviewers}
                                                      disabled={loadingReviewers || !hasEQCR}
                                                      placeholder="Select EQCR reviewer"
                                                      onSelect={(r) => {
                                                          setReviewerData((prev) => ({
                                                              ...prev,
                                                              eqcrEmployeeId: Number((r.employeeId ?? "").trim()),
                                                              eqcrReviewerName: r.fullName ?? "",
                                                          }));
                                                          markEdited();
                                                      }}
                                                  />
                                              </div>

                                              <div className="space-y-2">
                                                  <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                      EQCR Hours <span className="text-red-500">*</span>
                                                  </Label>
                                                  <Input
                                                      type="number"
                                                      value={reviewerData.eqcrHours}
                                                      onChange={(e) =>
                                                          handleReviewerChange("eqcrHours", e.target.value)
                                                      }
                                                      placeholder="0"
                                                      className="h-11"
                                                  />
                                              </div>
                                          </div>
                                      )}
                                  </>
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
                disabled={!isFormValid()}
                onClick={handleSaveDraft}
                className="border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
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