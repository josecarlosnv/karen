import { useState, useEffect } from "react";
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
import { SegmentedControl } from "../../components/ui/segmented-control";
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Building2,
  Shield,
  TrendingUp,
  Save,
} from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { toast } from "sonner";
import { pviiiApi } from "../../api/pviiiApi";
import { catalogoIndustrias } from "../../api/CatIndustrias";

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

const STEP_NUMBER = 1;



interface MultiSelectPillsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

function MultiSelectPills({
  options,
  selected,
  onChange,
  className = "",
}: MultiSelectPillsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                isSelected
                  ? "bg-[#00338D] text-white border-2 border-[#00338D] shadow-sm"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#00338D]/30 hover:bg-slate-50"
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface IndustryCatalogItem {
  industryRiskId: number;
  industryLabel: string;
  riskLevelLabel: string;
}

type RiskLevel = "High" | "Medium" | "Low" | "NA" | "";

export default function Leadership() {
  const navigate = useNavigate();
  const { p8Id } = useParams();

  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();

  const [industryCatalog, setIndustryCatalog] = useState<IndustryCatalogItem[]>(
    []
  );
    const [countries, setCountries] = useState<string[]>([]);
    useEffect(() => {
        async function loadCountries() {
            try {
                const data = await pviiiApi.getCountry();

                const countryNames = data.map(
                    (item: any) => item.countryLabel
                );

                setCountries(countryNames);
            } catch (err) {
                console.error("Error loading countries:", err);
            }
        }

        loadCountries();
    }, []);
  useEffect(() => {
    async function loadIndustries() {
      try {
        const data = await catalogoIndustrias.listIndustrias();
        setIndustryCatalog(data);
      } catch (err) {
        console.error("Error loading industries:", err);
      }
    }
    loadIndustries();
  }, []);

  const savedData = getStepData(STEP_NUMBER);

  const [formData, setFormData] = useState({
    clientName: savedData.clientName || "",
    firstYearClient: savedData.firstYearClient || "No",

    accountingFramework: savedData.accountingFramework ?? [],
    auditingStandards: savedData.auditingStandards ?? [],
    icofr: savedData.icofr || "No",

    localOrReferred: savedData.localOrReferred || "",
    referredCountry: savedData.referredCountry || "",

    industry: savedData.industry || "",
  });

  const [preliminaryRisk, setPreliminaryRisk] = useState<RiskLevel>(
    (savedData.preliminaryRisk as RiskLevel) || "Medium"
  );

  useEffect(() => {
    markStepInProgress(STEP_NUMBER);
  }, []);

  useEffect(() => {
    if (isStepCompleted(STEP_NUMBER)) {
      const currentData = JSON.stringify(formData);
      const savedDataStr = JSON.stringify(savedData);
      if (currentData !== savedDataStr) {
        editStep(STEP_NUMBER);
      }
    }
  }, [formData]);

  useEffect(() => {
    const { accountingFramework, auditingStandards, icofr, localOrReferred } =
      formData;

    if (
      accountingFramework.length === 0 ||
      auditingStandards.length === 0 ||
      !icofr ||
      !localOrReferred
    ) {
      setPreliminaryRisk("");
      return;
    }

    // Rule: US GAAP + ISAs → NA
    if (
      accountingFramework.includes("US GAAP") &&
      auditingStandards.includes("ISAs")
    ) {
      setPreliminaryRisk("NA");
      return;
    }

    // Rule: PCAOB + ICOFR = Yes → High
    if (auditingStandards.includes("PCAOB") && icofr === "Yes") {
      setPreliminaryRisk("High");
      return;
    }

    // Rule: PCAOB + ICOFR = No + Local → High
    if (
      auditingStandards.includes("PCAOB") &&
      icofr === "No" &&
      localOrReferred === "Local"
    ) {
      setPreliminaryRisk("High");
      return;
    }

        // Rule: IFRS + US GAAS → NA
    if (
      accountingFramework.includes("IFRS") &&
      auditingStandards.includes("US GAAS")
    ) {
      setPreliminaryRisk("Medium");
      return;
    }

    // Rule: IFRS + PCAOB + Referred → Medium
    if (
      accountingFramework.includes("IFRS") &&
      auditingStandards.includes("PCAOB") &&
      localOrReferred === "Referred"
    ) {
      setPreliminaryRisk("Medium");
      return;
    }

    // Rule: NIF  + PCAOB + Referred → Medium
    if (
      accountingFramework.includes("NIF") &&
      auditingStandards.includes("PCAOB") &&
      localOrReferred === "Referred"
    ) {
      setPreliminaryRisk("Medium");
      return;
    }

    // Rule: US GAAP + PCAOB + Referred → Medium
    if (
      accountingFramework.includes("US GAAP") &&
      auditingStandards.includes("PCAOB") &&
      localOrReferred === "Referred"
    ) {
      setPreliminaryRisk("Medium");
      return;
    }

    // Rule: US GAAP + US GAAS → Medium
    if (
      accountingFramework.includes("US GAAP") &&
      auditingStandards.includes("US GAAS")
    ) {
      setPreliminaryRisk("Medium");
      return;
    }

    // Rule: (NIF OR IFRS) + ISAs → Low
    if (
      (accountingFramework.includes("NIF") ||
        accountingFramework.includes("IFRS")) &&
      auditingStandards.includes("ISAs")
    ) {
      setPreliminaryRisk("Low");
      return;
    }



    setPreliminaryRisk("Medium");
  }, [
    formData.accountingFramework,
    formData.auditingStandards,
    formData.icofr,
    formData.localOrReferred,
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    async function loadFramework() {
      try {
        const general = await pviiiApi.getById(p8Id);
        const fw = await pviiiApi.getFramework(p8Id);
          const normalizeArray = (value: any) =>
              Array.isArray(value) ? value.filter(v => v && v !== "NA") : [];

          const normalizeString = (value: any) =>
              value === "NA" || value == null ? "" : value;
        if (fw) {
          const loaded = {
            clientName: general.clientName,
            firstYearClient: fw.firstYearClient ? "Yes" : "No",


              accountingFramework: normalizeArray(fw.accountingFrameworks),
              auditingStandards: normalizeArray(fw.auditingStandards),

              icofr: fw.icofr ? "Yes" : "No",


              localOrReferred: normalizeString(fw.localOrReferred),
              referredCountry: normalizeString(fw.referredCountry),

              industry: normalizeString(fw.industry),

          };

          setFormData(loaded);
          setOriginalData(loaded);
        } else {
          const empty = {
            clientName: general.clientName,
            firstYearClient: "No",

            accountingFramework: [],
            auditingStandards: [],
            icofr: "No",

            localOrReferred: "",
            referredCountry: "",

            industry: "",
          };

          setFormData(empty);
          setOriginalData(empty);
        }
      } catch (error) {
        console.error("Error loading Context:", error);
      }
    }

    loadFramework();
  }, [p8Id]);

  useEffect(() => {
    if (!originalData) return;

    const current = JSON.stringify(formData);
    const original = JSON.stringify(originalData);

    setHasChanges(current !== original);
  }, [formData, originalData]);

  
    useEffect(() => {
        if (formData.localOrReferred === "Local") {
            if (formData.referredCountry !== "") {
                setFormData(prev => ({ ...prev, referredCountry: "" }));
            }
        }
    }, [formData.localOrReferred]);

    const isFormValid = () => {
        if (formData.accountingFramework.length === 0) return false;
        if (formData.auditingStandards.length === 0) return false;

        if (formData.icofr !== "Yes" && formData.icofr !== "No") return false;

        if (!formData.localOrReferred) return false;
        if (!formData.industry.trim()) return false;

        if (!preliminaryRisk || preliminaryRisk === "NA") return false;

        if (
            formData.localOrReferred === "Referred" &&
            !formData.referredCountry.trim()
        ) {
            return false;
        }

        return true;
    };
    
  const handleNext = async () => {

      if (!isFormValid()) {
          toast.error("Please complete all required fields before saving");
          return;
      }


    if (hasChanges) {
      const payload: any = {
        clientName: formData.clientName,
        firstYearClient: formData.firstYearClient === "Yes",
        accountingFrameworks: formData.accountingFramework,
        auditingStandards: formData.auditingStandards,
          ICOFR: formData.icofr === "Yes",
        localOrReferred: formData.localOrReferred,
        referredCountry: formData.referredCountry,

          industry: formData.industry,
          preliminaryRiskProject: preliminaryRisk
      };

      await pviiiApi.saveFramework(p8Id!, payload);
      saveStep(STEP_NUMBER, { ...formData, preliminaryRisk }, true);
    }

    saveStep(STEP_NUMBER, { ...formData, preliminaryRisk }, true);
    navigate(`/p8/general-data/${p8Id}`);
  };

    const handleSave = async () => {

        if (!isFormValid()) {
            toast.error("Please complete all required fields before saving");
            return;
        }

    if (!hasChanges) {
        toast.info("No changes to save");
        navigate("/p8/new");
      return;
    }

    try {
        const payload: any = {
            clientName: formData.clientName,
            firstYearClient: formData.firstYearClient === "Yes",
            accountingFrameworks: formData.accountingFramework,
            auditingStandards: formData.auditingStandards,
            ICOFR: formData.icofr === "Yes",
            localOrReferred: formData.localOrReferred,
            referredCountry: formData.referredCountry,

            industry: formData.industry,
            preliminaryRiskProject: preliminaryRisk
        };

      await pviiiApi.saveFramework(p8Id!, payload);

      const isComplete = isFormValid() && hasChanges;
      saveStep(STEP_NUMBER, { ...formData, preliminaryRisk }, isComplete);

        toast.success("Saved successfully");
        navigate("/p8/new");
    } catch (err) {
      console.error(err);
        toast.error("Error saving ");
    }
  };

  const handleBack = () => {
    navigate("/p8/client-selection");
  };

  const handleStepClick = (stepIndex: number) => {
    const isComplete = isFormValid();
    saveStep(STEP_NUMBER, { ...formData, preliminaryRisk }, isComplete);

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return <AlertTriangle className="w-4 h-4" />;
      case "Medium":
        return <TrendingUp className="w-4 h-4" />;
      case "Low":
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getInvalidFrameworkMessage = () => {
    const { accountingFramework, auditingStandards } = formData;

    const invalidIFRS_USGAAS =
      accountingFramework.includes("IFRS") &&
      auditingStandards.includes("US GAAS");

    const invalidUSGAAP_ISAs =
      accountingFramework.includes("US GAAP") &&
      auditingStandards.includes("ISAs");

    if (invalidIFRS_USGAAS) {
      return "IFRS Accounting Framework cannot be combined with US GAAS Auditing Standards.";
    }

    if (invalidUSGAAP_ISAs) {
      return "US GAAP Accounting Framework cannot be combined with ISAs Auditing Standards.";
    }

    return "Selected Accounting Framework and Auditing Standards combination is not allowed. Please review your selections.";
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <Stepper
            steps={wizardSteps.map((step, index) => ({
              ...step,
              status: getStepStatus(index + 1),
              completed: isStepCompleted(index + 1),
            }))}
            currentStep={0}
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
                Engagement Context
              </h2>
            </div>

            <div className="max-w-5xl space-y-8">
              <div className="rounded-xl border border-[#00338D]/10 overflow-hidden bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-normal tracking-[0.08em] text-[#00338D] capitalize">
                    Client Context
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="clientName"
                      className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80"
                    >
                      Client Name
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      readOnly
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                      First-year client?
                    </Label>
                    <SegmentedControl
                      value={formData.firstYearClient}
                      onValueChange={(value) =>
                        handleChange("firstYearClient", value)
                      }
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                      className="w-full max-w-md"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#00338D]/10 overflow-hidden bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-normal tracking-[0.08em] text-[#00338D] capitalize">
                    Preliminary Risk Assessment
                  </h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                        Financial Reporting Standards{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <MultiSelectPills
                        options={["IFRS", "US GAAP", "NIF"]}
                        selected={formData.accountingFramework}
                        onChange={(selected) =>
                          handleChange("accountingFramework", selected)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                        Auditing Standards <span className="text-red-500">*</span>
                      </Label>
                      <MultiSelectPills
                        options={["ISAs", "US GAAS", "PCAOB"]}
                        selected={formData.auditingStandards}
                        onChange={(selected) =>
                          handleChange("auditingStandards", selected)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                        PCAOB ICOFR (Internal Control Over Financial Reporting)
                      </Label>
                      <SegmentedControl
                        value={formData.icofr}
                        onValueChange={(value) => handleChange("icofr", value)}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-full max-w-md"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                          Engagement Origin <span className="text-red-500">*</span>
                        </Label>
                        <SegmentedControl
                          value={formData.localOrReferred}
                          onValueChange={(value) => {
                            handleChange("localOrReferred", value);
                            if (value === "Local") {
                              handleChange("referredCountry", "");
                            }
                          }}
                          options={[
                            { value: "Local", label: "Local" },
                            { value: "Referred", label: "Referred" },
                          ]}
                          className="w-full"
                        />
                      </div>

                      {formData.localOrReferred === "Referred" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="referredCountry"
                            className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80"
                          >
                            Country <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.referredCountry}
                            onValueChange={(value) =>
                              handleChange("referredCountry", value)
                            }
                          >
                            <SelectTrigger id="referredCountry" className="h-11">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {preliminaryRisk && (
                      <div className="pt-4 border-t border-slate-200">
                        {preliminaryRisk === "NA" ? (
                          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-900">
                                Invalid Framework Combination
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                {getInvalidFrameworkMessage()} Please review your selections.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-600">
                              Calculated Risk Level:
                            </span>
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-sm ${getRiskColor(
                                preliminaryRisk
                              )}`}
                            >
                              {getRiskIcon(preliminaryRisk)}
                              {preliminaryRisk}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#00338D]/10 overflow-hidden bg-white">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-normal tracking-[0.08em] text-[#00338D] capitalize">
                    Industry Classification
                  </h3>
                </div>

                <div className="mt-6 px-6 pb-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                      Industry <span className="text-red-500">*</span>
                    </Label>

                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleChange("industry", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>

                      <SelectContent>
                        {industryCatalog.map((item) => (
                          <SelectItem
                            key={item.industryRiskId}
                            value={item.industryLabel}
                          >
                            {item.industryLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!hasChanges}
                className="border-slate-300 text-slate-700 disabled:opacity-50"
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