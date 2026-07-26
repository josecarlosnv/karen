import { useState, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { SegmentedControl } from "../../components/ui/segmented-control";
import { Save, ArrowRight, ArrowLeft, Search, ShieldCheck, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { toast } from "sonner";
import { pviiiApi } from "../../api/pviiiApi";
import { staffApi } from "../../api/staffApi";
import { pviiiEntities } from "../../api/pviiiEntities";
import { pviiiQualityApi } from "../../Api/pviiiQualityApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

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

const STEP_NUMBER = 3;

const sectionTitleClass =
  "text-[13px] font-normal tracking-[0.08em] text-[#00338D] capitalize";
const labelClass =
  "text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80";

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className = "",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleOption = (option: string) => {
    if (selected.includes(option)) onChange(selected.filter((item) => item !== option));
    else onChange([...selected, option]);
  };

  const removeOption = (option: string, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[44px] px-4 py-2 flex items-center gap-2 bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors duration-200 group cursor-pointer"
      >
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-2 flex-1">
            {selected.map((option) => (
              <span
                key={option}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#00338D] text-white"
              >
                {option}
                <button
                  type="button"
                  onClick={(e) => removeOption(option, e)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-slate-400 flex-1 text-left">{placeholder}</span>
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                  isSelected ? "bg-[#00338D]/5" : ""
                }`}
              >
                <span
                  className={`text-sm ${
                    isSelected ? "font-medium text-[#00338D]" : "text-slate-700"
                  }`}
                >
                  {option}
                </span>
                {isSelected && (
                  <svg className="w-4 h-4 text-[#00338D]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
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
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const handleSelect = (option: string) => {
        if (value === option) {
            onChange("");
        } else {
            onChange(option);
        }

        setIsOpen(false);
        setSearchQuery("");
    };


  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-[#00338D]/30 transition-colors duration-200 group cursor-pointer"
      >
        {value ? (
          <span className="text-sm text-slate-900">{value}</span>
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 text-left border-b border-slate-100 last:border-b-0 ${
                    value === option ? "bg-[#00338D]/5" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${
                      value === option ? "font-medium text-[#00338D]" : "text-slate-700"
                    }`}
                  >
                    {option}
                  </span>
                  {value === option && (
                    <svg className="w-4 h-4 text-[#00338D]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Quality() {
  const navigate = useNavigate();
  const { p8Id } = useParams();
  const [hasChanges, setHasChanges] = useState(false);

    const [riskLevels, setRiskLevels] = useState<any[]>([]);

  const [natureOptions, setNatureOptions] = useState<string[]>([]);
  const [auditWorkflowOptions, setAuditWorkflowOptions] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);

  async function loadCatalogs() {
    try {
      const natureRes = await pviiiEntities.listNature();
      const auditRes = await pviiiEntities.listcatAudit();
      const partnersRes = await staffApi.getComisario();

      setNatureOptions(
        (Array.isArray(natureRes) ? natureRes : natureRes?.data || [])
          .map((n: any) => n.naturaleza1?.trim())
          .filter(Boolean)
      );

      setAuditWorkflowOptions(
        (Array.isArray(auditRes) ? auditRes : auditRes?.data || [])
          .map((a: any) => a.flujoAudit1?.trim())
          .filter(Boolean)
      );

        const uniquePartners = Array.from(
            new Set(
                (Array.isArray(partnersRes) ? partnersRes : partnersRes?.data || [])
                    .map((p: any) => p.name?.trim())
                    .filter(Boolean)
            )
        );

        setPartners(["None", ...uniquePartners]);
    } catch (err) {
      console.error("Error loading catalogs:", err);
      toast.error("Error loading engagement catalogs");
    }
  }

  useEffect(() => {
    loadCatalogs();
  }, []);
   
    useEffect(() => {
        async function loadQualityFromBackend() {
            try {
                if (!p8Id) return;

                const response = await pviiiApi.getById(p8Id);

                const sourceQuality =
                    response?.qualityCFY && response.qualityCFY.recordChangeSequence
                        ? response.qualityCFY
                        : response?.quality;

                if (!sourceQuality) return;

                const mappedQuality = {
                    publicInterestEntity: sourceQuality.isPublicEntity ? "Yes" : "No",
                    regulatedEntity: sourceQuality.isRegulatedEntity ? "Yes" : "No",
                    listedEntity: sourceQuality.isListedEntity ? "Yes" : "No",

                    significantSubsidiariesMexico:
                    sourceQuality.isReportGroup === true ? "Yes" : "No",

                    secFpi: sourceQuality.isSecAffiliate ? "Yes" : "No",
                    secSubsidiary: sourceQuality.isSignificantSecSubsidiary ? "Yes" : "No",
                    aits: sourceQuality.aits ? "Yes" : "No", //erik

                    ceacPriorYear: sourceQuality.pyCeac ?? "",
                    ceacCurrentYear: sourceQuality.cyCeac ?? "",

                    natureOfEngagement:
                        sourceQuality.natureOfEngagementLabel?.split(",").map(v => v.trim()) ??
                        [],

                    auditWorkflow:
                        sourceQuality.auditWorkflowLabel?.split(",").map(v => v.trim()) ?? [],

                    statutoryExaminer: sourceQuality.statutoryExaminerLabel ?? "",
                    
                };

                setFormData({
                    publicInterestEntity: mappedQuality.publicInterestEntity,
                    regulatedEntity: mappedQuality.regulatedEntity,
                    listedEntity: mappedQuality.listedEntity,
                    significantSubsidiariesMexico:
                    mappedQuality.significantSubsidiariesMexico,
                    secFpi: mappedQuality.secFpi,
                    secSubsidiary: mappedQuality.secSubsidiary,
                    aits: mappedQuality.aits, //erik
                    ceacPriorYear: mappedQuality.ceacPriorYear,
                    ceacCurrentYear: mappedQuality.ceacCurrentYear,
                    
                });

                setFrameworkData({
                    natureOfEngagement: mappedQuality.natureOfEngagement,
                    auditWorkflow: mappedQuality.auditWorkflow,
                    statutoryExaminer: mappedQuality.statutoryExaminer,
                });

                saveStep(STEP_NUMBER, mappedQuality, true);
            } catch (error) {
                console.error("Error loading quality from backend:", error);
                toast.error("Error loading Quality data");
            }
        }

        loadQualityFromBackend();
    }, [p8Id]);
  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();

    const savedData = getStepData(STEP_NUMBER) || {};

    const [formData, setFormData] = useState({
        publicInterestEntity: savedData.publicInterestEntity ?? "No",
        regulatedEntity: savedData.regulatedEntity ?? "No",
        listedEntity: savedData.listedEntity ?? "No",
        significantSubsidiariesMexico: savedData.significantSubsidiariesMexico ?? "No",
        secFpi: savedData.secFpi ?? "No",
        secSubsidiary: savedData.secSubsidiary ?? "No",
        aits: savedData.aits ?? "No", //erik
        ceacPriorYear: savedData.ceacPriorYear ?? "",
        ceacCurrentYear: savedData.ceacCurrentYear ?? "",
        
    });
    ``

    const [frameworkData, setFrameworkData] = useState({
        natureOfEngagement: Array.isArray(savedData.natureOfEngagement)
            ? savedData.natureOfEngagement
            : [],
        auditWorkflow: Array.isArray(savedData.auditWorkflow)
            ? savedData.auditWorkflow
            : [],
        statutoryExaminer: typeof savedData.statutoryExaminer === "string"
            ? savedData.statutoryExaminer
            : "",
    });
    const initializedRef = useRef(false);

    useEffect(() => {
        const loadRiskLevels = async () => {
            try {
                const data = await pviiiQualityApi.listRisk();
                setRiskLevels(data);
            } catch (error) {
                console.error("Error loading risk levels", error);
            }
        };

        loadRiskLevels();
    }, []);
  useEffect(() => {
    markStepInProgress(STEP_NUMBER);
  }, []);

  useEffect(() => {
    const currentData = JSON.stringify({ ...formData, ...frameworkData });
    const savedDataStr = JSON.stringify(savedData);
    setHasChanges(currentData !== savedDataStr);
  }, [formData, frameworkData, savedData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      editStep(STEP_NUMBER);
      return updated;
    });
  };

  const handleFrameworkChange = (field: string, value: any) => {
    setFrameworkData((prev) => {
      const updated = { ...prev, [field]: value };
      editStep(STEP_NUMBER);
      return updated;
    });
  };

  const isFormValid = () => {
  const baseValidation =
    !!formData.publicInterestEntity &&
    !!formData.regulatedEntity &&
    !!formData.listedEntity &&
    !!formData.significantSubsidiariesMexico &&
    !!formData.secFpi &&
    !!formData.secSubsidiary &&
    //!!formData.aits && //erik
    frameworkData.natureOfEngagement.length > 0 &&
    frameworkData.auditWorkflow.length > 0;

  return (
    baseValidation &&
    formData.ceacPriorYear.trim() !== "" &&
    formData.ceacCurrentYear.trim() !== ""
  );
};

  const buildPayload = () => {
    return {
      isPublicEntity: formData.publicInterestEntity === "Yes",
      isRegulatedEntity: formData.regulatedEntity === "Yes",
      isListedEntity: formData.listedEntity === "Yes",
      hasSignificantPublicSubsidiariesMexico: formData.significantSubsidiariesMexico === "Yes",

      isSignificantSecSubsidiary: formData.secSubsidiary === "Yes",
      aits: formData.aits === "Yes",
      isSecAffiliate: formData.secFpi === "Yes",

      isReportGroup: formData.significantSubsidiariesMexico === "Yes",
      referredCountryId: null,
      pyCeac: formData.ceacPriorYear,
      cyCeac: formData.ceacCurrentYear,
      

      natureOfEngagementLabel: frameworkData.natureOfEngagement.join(","),
      auditWorkflowLabel: frameworkData.auditWorkflow.join(","),

      statutoryExaminerLabel: frameworkData.statutoryExaminer,

      recordChangeSequence: 1,
      createdByUserEmail: "usuario@miempresa.com"
    };
  };


  const handleNext = async () => {
    if (!isFormValid()) return;

    if (!hasChanges) {
      navigate(`/p8/entities/${p8Id}`);
      return;
    }

    saveStep(STEP_NUMBER, { ...formData, ...frameworkData }, true);

    try {
      await pviiiApi.updateQuality(p8Id, buildPayload());
        toast.success("Saved successfully");
      navigate(`/p8/entities/${p8Id}`);
    } catch (err) {
        toast.error("Error saving");
    }
  };

  const handleSave = async () => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, { ...formData, ...frameworkData }, isComplete);
      if (!isFormValid()) {
          toast.error("Please complete all required fields before saving");
          return;
      }
      
    try {
      await pviiiApi.updateQuality(p8Id, buildPayload());
      toast.success(
        isComplete
              ? "Saved successfully"
              : "Saved successfully"
        );

        navigate("/p8/new");

    } catch (err) {
      toast.error("Error saving ");
    }
  };

  const handleBack = async () => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, { ...formData, ...frameworkData }, isComplete);

    try {
      await pviiiApi.updateQuality(p8Id, buildPayload());
    } catch (err) {
      toast.error("Error syncing data before going back");
    }

    navigate(`/p8/general-data/${p8Id}`);
  };

  const handleStepClick = (stepIndex: number) => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, { ...formData, ...frameworkData }, isComplete);

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
            currentStep={2}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2
                className="text-[#1e49e2] font-light text-[24px] tracking-[0.02em] transition-colors duration-300"
                style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
              >
                Engagement Classification &amp; Quality
              </h2>
            </div>

            <div className="max-w-5xl space-y-8">
              <div className="rounded-xl border border-[#00338D]/10 overflow-visible bg-white mb-8">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={sectionTitleClass}>Entity &amp; Regulatory Classification</h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Public Interest Entity (PIE) <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.publicInterestEntity}
                        onValueChange={(value) => handleChange("publicInterestEntity", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Regulated Entity <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.regulatedEntity}
                        onValueChange={(value) => handleChange("regulatedEntity", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Listed Entity in Mexico <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.listedEntity}
                        onValueChange={(value) => handleChange("listedEntity", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Substantial role per group audit instructions <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.significantSubsidiariesMexico}
                        onValueChange={(value) => handleChange("significantSubsidiariesMexico", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        SEC FPI <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.secFpi}
                        onValueChange={(value) => handleChange("secFpi", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        SEC Subsidiary <span className="text-red-500">*</span>
                      </Label>
                      <SegmentedControl
                        value={formData.secSubsidiary}
                        onValueChange={(value) => handleChange("secSubsidiary", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full"
                      />
                    </div>
                    {/*erik new*/}
                    <div className="space-y-2">
                    <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                      AITS Applicable <span className="text-red-500">*</span>
                    </Label>
                    <SegmentedControl
                      value={formData.aits}
                      onValueChange={(value) => handleChange("aits", value)}
                      options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                      className="w-full"
                    />
                  </div>
                  {/*erik end*/}


                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#00338D]/10 overflow-visible bg-white mb-8">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={sectionTitleClass}>CEAC Assessment &amp; Engagement Framework</h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Prior Year CEAC Assessment <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.ceacPriorYear}
                        onValueChange={(value) => handleChange("ceacPriorYear", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select assessment" />
                        </SelectTrigger>
                                              <SelectContent>
                                                  {riskLevels.map((item) => (
                                                      <SelectItem
                                                          key={item.riskLevelId}
                                                          value={item.riskLevelLabel}
                                                      >
                                                          {item.riskLevelLabel}
                                                      </SelectItem>
                                                  ))}
                                              </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Expected Current Year CEAC <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.ceacCurrentYear}
                        onValueChange={(value) => handleChange("ceacCurrentYear", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select assessment" />
                        </SelectTrigger>

                                              <SelectContent>
                                                  {riskLevels
                                                      .filter((item) => item.riskLevelLabel !== "N/A")
                                                      .map((item) => (
                                                          <SelectItem
                                                              key={item.riskLevelId}
                                                              value={item.riskLevelLabel}
                                                          >
                                                              {item.riskLevelLabel}
                                                          </SelectItem>
                                                      ))}
                                              </SelectContent>

                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Nature of Engagement <span className="text-red-500">*</span>
                      </Label>
                      <MultiSelectDropdown
                        options={natureOptions}
                        selected={frameworkData.natureOfEngagement}
                        onChange={(selected) => handleFrameworkChange("natureOfEngagement", selected)}
                        placeholder="Select engagement types"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>
                        Audit Workflow <span className="text-red-500">*</span>
                      </Label>
                      <MultiSelectDropdown
                        options={auditWorkflowOptions}
                        selected={frameworkData.auditWorkflow}
                        onChange={(selected) => handleFrameworkChange("auditWorkflow", selected)}
                        placeholder="Select workflows"
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label className={labelClass}>Statutory Examiner (Comisario)</Label>
                      <SearchableSelect
                        value={frameworkData.statutoryExaminer}
                        onChange={(value) => handleFrameworkChange("statutoryExaminer", value)}
                        options={partners}
                        placeholder="Select examiner"
                      />
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
                    onClick={handleSave}
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

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}