import { useState, useEffect } from "react";
import { Check, Edit2 } from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { SearchableSelect } from "../ui/searchable-select";
import { Switch } from "../ui/switch";
import { clientOptions, partnerOptions } from "../../data/assignmentOptions";
import { cn } from "../ui/utils";
import { eqcrMasterList } from "../../data/eqcrData";
import { authApi, Claims } from "../../API/authApi";//By Isaac
import { toast } from "sonner";

interface NewAssignmentSectionProps {
  preloadedData?: {
    engagementName?: string;
    entity?: string;
    type?: "Audit" | "ESG" | "SOC";
    ceacId?: string;
    leadPartner?: string;
  } | null;
  onBack: () => void;
}

export default function NewAssignmentSection({
  preloadedData,
  onBack,
}: NewAssignmentSectionProps) {
  const [isEditingEqcr, setIsEditingEqcr] = useState(true);
  const [selectedType, setSelectedType] = useState<
    "Audit" | "ESG" | "SOC"
  >(preloadedData?.type === "Assistant" ? "Audit" : (preloadedData?.type || "Audit"));
  const [requiresAssistant, setRequiresAssistant] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState("");
const [assignmentReasons, setAssignmentReasons] = useState<any[]>([]);
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    assignmentDetails: true,
    razonEqcr: true,
    criteriaRequirements: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [formData, setFormData] = useState({
    eqcrCredentialPk: "", 
    eqcrId: "",
    eqcrName: "",
    yearOfAppointment: "",
    assignmentReason: "",
    ceacId: preloadedData?.ceacId || "",
    engagementName: preloadedData?.engagementName || "",
    localClientName: preloadedData?.entity || "",
    leadPartnerName: preloadedData?.leadPartner || "",
    partnerOrDirector: "",
    // Razon EQCR Required
    razonEqcrRequired: [] as number[],
    // Criteria checkboxes
    competence: "",
    professionalStandards: false,
    kpmgPolicies: false,
    industryKnowledge: false,
    experienceSimilar: false,
    sufficientTime: false,
    localListed: false,
    usListed: false,
    otherCountryListed: false,
    regulatedIndustry: false,
    Member_of_the_engagement: false,
    coolingOffApplied: false,
   // independent: false,
   // objectivity: false,
    //integrity: false,
   //impartiality: false,
    threatsToObjectivity: false,
    safeguards: "",
    understandingResponsibilities: false,
    legalRegulatory: false,
    relevantExpertise: false,
    
leadPartnerId: "",
  // leadPartnerName: "",

  });
  //estados para hacer el consumo por paginacion 
interface Entity {
  EntityID: string;
  EntityDescription: string;
}
const [entities, setEntities] = useState<Entity[]>([]);
const [page, setPage] = useState(1);
const [loadingEntities, setLoadingEntities] = useState(false);
const [hasMore, setHasMore] = useState(true);
const loadEntities = async () => {

  if (loadingEntities || !hasMore) return;

  try {

    setLoadingEntities(true);

    
    const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/vw_Entities?page=${page}&limit=24`,
        {
          credentials: "include",
        }
      );


    const data = await response.json();

    setEntities(prev => [...prev, ...data]);

    if (data.length < 24) {
      setHasMore(false);
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingEntities(false);
  }

};
useEffect(() => {
  loadEntities();
}, [page]);
  //
  //estado para consultar EQCR

interface EQCRCredential {
  EMT_CredentGen_PK: number;
  EMT_Credent_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
  Email_Address_Business: string;
}

const [eqcrList, setEqcrList] = useState<EQCRCredential[]>([]);
const [loadingEqcr, setLoadingEqcr] = useState(false);
useEffect(() => {
  const loadEQCRs = async () => {
    try {
      setLoadingEqcr(true);

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/getCredentialsEQCR`,
         {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading EQCR credentials");
      }

      const data = await response.json();

      setEqcrList(data);
    } catch (error) {
      console.error("Error loading EQCRs:", error);
    } finally {
      setLoadingEqcr(false);
    }
  };

  loadEQCRs();
}, []);
  //
  useEffect(() => {
  const loadReasons = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_dim_AssignationReason`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setAssignmentReasons(data ?? []);

    } catch (error) {
      console.error("Error loading assignment reasons", error);
    }
  };

  loadReasons();
}, []);
  //Estado para DDL de lead partner Name
  interface LeadPartner {
  EMT_ColabsGen_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
  Email_Address_Business: string;
}
interface FiscalYear {
  EMT_Years_ID: number;
  Is_CFY: boolean | null;
  Is_PFY: boolean | null;
  Is_Current: boolean;
}

const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
useEffect(() => {
  const loadFiscalYears = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_dim_Years`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading fiscal years");
      }

      const data = await response.json();

      console.log("Fiscal Years", data);

      setFiscalYears(data);
    } catch (error) {
      console.error("Error loading fiscal years", error);
    }
  };

  loadFiscalYears();
}, []);

const [leadPartners, setLeadPartners] = useState<LeadPartner[]>([]);
const [loadingLeadPartners, setLoadingLeadPartners] = useState(false);
useEffect(() => {
  const loadLeadPartners = async () => {
    try {
      setLoadingLeadPartners(true);

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/getColabsGeneratedLead`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading Lead Partners");
      }

      const data = await response.json();

      setLeadPartners(data);
    } catch (error) {
      console.error("Error loading Lead Partners:", error);
    } finally {
      setLoadingLeadPartners(false);
    }
  };

  loadLeadPartners();
}, []);
  //
  //Metodo para DDL para asistant
  interface Assistant {
  EMT_ColabsGen_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
}

const [assistants, setAssistants] = useState<Assistant[]>([]);
const [loadingAssistants, setLoadingAssistants] = useState(false);
useEffect(() => {
  const loadAssistants = async () => {
    try {
      setLoadingAssistants(true);

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_ColabsGenerated/getColabsGeneratedAsistant`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading Assistants");
      }

      const data = await response.json();

      setAssistants(data);
    } catch (error) {
      console.error("Error loading Assistants:", error);
    } finally {
      setLoadingAssistants(false);
    }
  };

  loadAssistants();
}, []);
 
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    authApi.getClaims()
      .then(setUser)
      .catch(console.error);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const basicInformationPayload = {
      Key_EMT_PFY: null,
      Fiscal_Year_EMT: new Date().getFullYear(),
      Employee_ID: formData.eqcrId,
      Year_Appointment: Number(formData.yearOfAppointment),
      Year_Reappointment: null,
      EMT_Type_PK:
        selectedType === "Audit"
          ? 1
          : selectedType === "ESG"
          ? 3
          : 5,
      EMT_Reason_ID: Number(formData.assignmentReason),
      CEAC_ID: formData.ceacId,
      Engagement_Name: formData.engagementName,
      Entity_ID: formData.localClientName,
      LeadPartner_Employee_ID: formData.leadPartnerId || null,
      Requires_Assistant: requiresAssistant,
      Assistant_Employee_ID: requiresAssistant
        ? selectedAssistant
        : null,
      Ready_to_Approve: true,
      Created_By: user?.email,
    };

    const basicResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(basicInformationPayload),
      }
    );

    if (!basicResponse.ok) {
      throw new Error(
        "Error saving Basic Information"
      );
    }

    const basicResult =
      await basicResponse.json();
console.log(basicResult)
    const generatedKeyEMT =
      basicResult.Key_EMT;

    const validationCriteriaPayload = {
      
      Key_EMT: generatedKeyEMT,

      EMT_SR_Requi_ID_Concat:
        formData.razonEqcrRequired.join(","),

      Competence_To_Perform: formData.competence,
      Member_of_the_engagement:
        formData.Member_of_the_engagement,
      Cooling_Off_Applied:
        formData.coolingOffApplied,
      Has_Threats:
        formData.threatsToObjectivity,
      Has_Threats_Desc:
        formData.safeguards,
                Sufficient_Time: formData.sufficientTime,
      Created_By: user?.email,
    };

    const validationResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          validationCriteriaPayload
        ),
      }
    );

    if (!validationResponse.ok) {
      throw new Error(
        "Error saving Validation Criteria"
      );
    }
    const selectedEQCR = eqcrList.find(
  e => e.Employee_ID === formData.eqcrId
);
console.log("SELECTED EQCR", selectedEQCR);
const formPayload = {
  EMT_Type_PK:
    selectedType === "Audit"
      ? 1
      : selectedType === "ESG"
      ? 3
      : 5,

  Key_EMT: generatedKeyEMT,
  Employee_ID: formData.eqcrId,

  Full_Name: selectedEQCR?.Full_Name,

  Email_Address_Business:
    selectedEQCR?.Email_Address_Business,

  Local_Job_Level_Name:
    selectedEQCR?.Local_Job_Level_Name,

  BU: selectedEQCR?.BU,

  Office: selectedEQCR?.Location_Name,

  Entity_ID: Number(formData.localClientName),

  Entity_Name:
    entities.find(
      e => e.EntityID === formData.localClientName
    )?.EntityDescription,

  Year_Appointment:
    Number(formData.yearOfAppointment),

  Created_By: user?.email,
};


console.log(
  "Form Payload",
  formPayload
);
console.log("BU =>", credentials?.BU);
console.log("OFFICE =>", credentials?.Office);
console.log("EMAIL =>", credentials?.Email_Address_Business);
console.log("FORM PAYLOAD =>", formPayload);
const formResponse = await fetch(
  `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formPayload),
  }
);

if (!formResponse.ok) {
  throw new Error(
    "Error creating EMT Form"
  );
}

const formResult = await formResponse.json();

console.log(
  "Form Result",
  formResult
);
    toast.success(
      "Assignment created successfully!"
    );

    onBack();
  } catch (error) {
    console.error(error);

    toast.error(
      "Error creating assignment"
    );
  }
};

  const handleSaveDraft = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const basicInformationPayload = {
      Key_EMT_PFY: null,
      Fiscal_Year_EMT: new Date().getFullYear(),
      Employee_ID: formData.eqcrId,
      Year_Appointment: Number(
        formData.yearOfAppointment
      ),
      Year_Reappointment: null,
      EMT_Type_PK:
        selectedType === "Audit"
          ? 1
          : selectedType === "ESG"
          ? 3
          : 5,
      EMT_Reason_ID: Number(
        formData.assignmentReason
      ),
      CEAC_ID: formData.ceacId,
      Engagement_Name:
        formData.engagementName,
      Entity_ID:
        formData.localClientName,
      LeadPartner_Employee_ID:
        formData.leadPartnerId
          ? Number(formData.leadPartnerId)
          : null,
      Requires_Assistant:
        requiresAssistant,
      Assistant_Employee_ID:
        requiresAssistant
          ? selectedAssistant
          : null,
      Ready_to_Approve: false,
      Created_By: user?.email,
    };

    console.log(
      "Basic Information Payload",
      basicInformationPayload
    );

    // PRIMER INSERT
    const basicResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          basicInformationPayload
        ),
      }
    );

    if (!basicResponse.ok) {
      throw new Error(
        "Error saving Basic Information"
      );
    }

    const basicResult =
      await basicResponse.json();

    console.log(
      "Basic Result",
      basicResult
    );

    const generatedKeyEMT =
      basicResult.Key_EMT;

    console.log(
      "Generated Key EMT",
      generatedKeyEMT
    );

    // SEGUNDO INSERT
    const validationCriteriaPayload = {
      Key_EMT: generatedKeyEMT,

      EMT_SR_Requi_ID_Concat:
        formData.razonEqcrRequired.join(","),

      Competence_To_Perform:
        formData.competence,

      //Professional_Standards:        formData.professionalStandards,

      //KPMG_Policies:        formData.kpmgPolicies,

      //Industry_Knowledge:        formData.industryKnowledge,

      //Experience_Similar:        formData.experienceSimilar,

      Sufficient_Time:
        formData.sufficientTime,

      //Local_Listed:      formData.localListed,

     // US_Listed:        formData.usListed,

      //Other_Country_Listed:        formData.otherCountryListed,

      //Regulated_Industry:  formData.regulatedIndustry,

      Member_of_the_engagement:
        formData.Member_of_the_engagement,

      Cooling_Off_Applied:
        formData.coolingOffApplied,

     // Independent:        formData.independent,

     // Objectivity:      formData.objectivity,

      //Integrity:        formData.integrity,

      //Impartiality:        formData.impartiality,

      Has_Threats:
        formData.threatsToObjectivity,

      Has_Threats_Desc:
        formData.safeguards,

      //Understanding_Responsibilities:        formData.understandingResponsibilities,

     // Legal_Regulatory:        formData.legalRegulatory,

      //Relevant_Expertise:        formData.relevantExpertise,

      Created_By: user?.email,
    };

    console.log(
      "Validation Payload",
      validationCriteriaPayload
    );

    const validationResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          validationCriteriaPayload
        ),
      }
    );

    if (!validationResponse.ok) {
      throw new Error(
        "Error saving Validation Criteria"
      );
    }

    toast.success(
      "Draft saved successfully!"
    );

    onBack();
  } catch (error) {
    console.error(
      "HANDLE SAVE DRAFT ERROR",
      error
    );

    toast.error(
      "Error saving draft"
    );
  }
};
  const handleEqcrNameClick = () => {
    setIsEditingEqcr(true);
  };

  const handleEqcrSelect = (selectedValue: string) => {
  const eqcr = eqcrList.find(
    (e) => e.EMT_Credent_PK.toString() === selectedValue
  );

  if (eqcr) {
    setFormData({
      ...formData,
      eqcrCredentialPk: selectedValue,
      eqcrId: eqcr.Employee_ID, 
      eqcrName: eqcr.Full_Name,
      partnerOrDirector: eqcr.Local_Job_Level_Name,
    });
    loadCredentialSummary(
      eqcr.Employee_ID
    );
    setIsEditingEqcr(false);
  }
};

  // Mock credentials data
  const [credentials, setCredentials] = useState<any>(null);
  const standards = credentials
  ? [
      {
        name: "AICPA",
        value: credentials.AICPA,
      },
      {
        name: "PCAOB",
        value: credentials.PCAOB,
      },
      {
        name: "IFRS",
        value: credentials.IFRS,
      },
      {
        name: "US GAAP",
        value: credentials.USGAAP,
      },
    ]
  : [];
  const loadCredentialSummary = async (
  employeeId: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/getCredentialSummaryByEmployeeId/${employeeId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error loading credential summary"
      );
    }

   const data = await response.json();
console.log("credentials", data);
      setCredentials(data);

      setFormData(prev => ({
        ...prev,
        partnerOrDirector:
          data.Local_Job_Level_Name || "",
      }));
  } catch (error) {
    console.error(error);
  }
};


  const getQprColor = (rating: string) => {
    switch (rating) {
      case "NC":
        return "bg-green-100 text-green-700 border-green-200";
      case "CIN":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "AC":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with EQCR selector */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            {isEditingEqcr || !formData.eqcrName ? (
              <div className="flex items-center gap-2">

               <SearchableSelect
                    value={formData.eqcrCredentialPk}
                onChange={(value) => handleEqcrSelect(String(value))}
                options={eqcrList.map((e) => ({
                     value: e.EMT_Credent_PK.toString(),    
                     label: e.Full_Name,  }))}
                    placeholder={
                      loadingEqcr ? "Loading EQCRs..." : "Select EQCR..."
                    }
                  />
                {formData.eqcrName && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingEqcr(false)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <>
                <h2
                  className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-[#00338D] transition-colors group inline-flex items-center gap-2"
                  style={{ letterSpacing: "0.01em", lineHeight: "1.25" }}
                  onClick={handleEqcrNameClick}
                >
                  {formData.eqcrName}
                  <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <span className="text-sm text-[#00338D]">
                  {formData.partnerOrDirector} •{credentials?.Years_In_Role ?? 0} yrs
                </span>
              </>
            )}
          </div>
          <p
            className="text-sm text-gray-600 mt-1"
            style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
          >
            {selectedType} Engagement
            {formData.engagementName && ` • ${formData.engagementName}`}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back
        </Button>
      </div>

      {/* EQCR Credentials Summary - Only show after EQCR is selected */}
      {formData.eqcrName && (
        <div className="py-5 px-6 bg-[#FAFBFD] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {/* Compliance Status */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                Compliance
              </p>
              <div className="space-y-1 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Independence</span>
                  <span className="font-medium text-green-700">
                    {credentials?.Indepence_Desc ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ethics</span>
                  <span className="font-medium text-green-700">Completed</span>
                </div>
              </div>
            </div>

            {/* QPR Results */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                QPR Results
              </p>
              <div className="flex gap-2">
  {[
    {
      year: "2023",
      rating: credentials?.QPR1,
    },
    {
      year: "2024",
      rating: credentials?.QPR2,
    },
    {
      year: "2025",
      rating: credentials?.QPR3,
    },
  ].map(({ year, rating }) => (
    <div key={year} className="text-center">
      <p className="text-xs text-gray-500 mb-1">
        {year}
      </p>

      <span
        className={`px-2 py-0.5 rounded text-xs font-medium border ${getQprColor(
          rating
        )}`}
      >
        {rating ?? "N/A"}
      </span>
    </div>
  ))}
</div>
            </div>

            {/* Standards & Framework */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                Standards
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {standards.map((standard) => (
  <div
    key={standard.name}
    className="flex items-center justify-between text-xs"
  >
    <span className="text-gray-600">
      {standard.name}
    </span>

    <span className="font-semibold text-[#00338D]">
      {standard.value ?? "0"}
    </span>
  </div>
))}
              </div>
            </div>
          </div>

          {/* View full credentials link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="text-xs text-[#00338D] hover:text-[#0055B8] font-medium transition-colors"
            >
              View full credentials →
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Assignment Details - Collapsible */}
        <CollapsibleSection
          title="Assignment Details"
          isOpen={openSections.assignmentDetails}
          onToggle={() => toggleSection("assignmentDetails")}
        >
            <div className="space-y-4">
                  {/* Assignment Type Selection */}
                  <div>
                    <Label className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em] mb-3 block">
                      Assignment Type *
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Audit", "ESG", "SOC"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type as any)}
                          className={cn(
                            "px-4 py-2.5 rounded-lg border-2 text-[11px] font-medium transition-all",
                            selectedType === type
                              ? "border-[#00338D] bg-blue-50 text-[#00338D]"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Requires Assistant Toggle */}
                  <div className="flex items-center gap-3">
                    <Switch
                      id="requiresAssistant"
                      checked={requiresAssistant}
                      onCheckedChange={setRequiresAssistant}
                    />
                    <Label htmlFor="requiresAssistant" className="text-[11px] font-normal text-[#1F2937] cursor-pointer">
                      Requires Assistant?
                    </Label>
                  </div>

                  {/* Select Assistant - Conditional */}
                  {requiresAssistant && (
                    <div>
                      <Label htmlFor="selectAssistant" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                        Select Assistant
                      </Label>
                      <SearchableSelect
                        id="selectAssistant"
                        value={selectedAssistant}
                        onChange={setSelectedAssistant}
                        options={assistants.map((assistant) => ({
                          value: assistant.Employee_ID,
                          label: `${assistant.Full_Name} — ${assistant.Local_Job_Level_Name}`,
                        }))}
                      />
                    </div>
                  )}

                  {/* Form Fields - Same for all types */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearOfAppointment" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                        Year (Date) of Appointment as EQCR
                      </Label>
                      <select
                          id="yearOfAppointment"
                          value={formData.yearOfAppointment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yearOfAppointment: e.target.value,
                            })
                          }

                        className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[12px] font-normal text-[#1F2937] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value=""></option>
                        {fiscalYears.map((year) => (
                          <option
                            key={year.EMT_Years_ID}
                            value={year.EMT_Years_ID}
                          >
                            {year.EMT_Years_ID}
                          </option>
                        ))}
                      </select>           
                    </div>

                    <div>
                      <Label htmlFor="assignmentReason" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Assignment Reason</Label>
                      <select
                        id="assignmentReason"
                        value={formData.assignmentReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            assignmentReason: e.target.value,
                          })
                        }
                        className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[12px] font-normal text-[#1F2937] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select...</option>

              {assignmentReasons.map((reason) => (
                <option
                  key={reason.EMT_Reason_ID}
                  value={reason.EMT_Reason_ID}
                >
                  {reason.EMT_Reason_Desc}
                </option>
              ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="ceacId" className="text-[11px] font-nornal text-[#00338d] capitalize tracking-[0.12em]">CEAC ID</Label>
                      <Input
                        id="ceacId"
                        value={formData.ceacId}
                        onChange={(e) =>
                          setFormData({ ...formData, ceacId: e.target.value })
                        }
                        className="mt-1.5 h-9 text-[12px] font-normal text-[#1F2937]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="engagementName" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Engagement Name</Label>
                      <Input
                        id="engagementName"
                        value={formData.engagementName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            engagementName: e.target.value,
                          })
                        }
                        className="mt-1.5 h-9 text-[12px] font-normal text-[#1F2937]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="localClientName" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Local Client Name</Label>
                      
                      {/*Funcionalidad para paginacion  */}
                      <SearchableSelect
                        id="localClientName"
                        value={formData.localClientName}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            localClientName: value,
                          })
                        }
                        onScrollBottom={() => {
                          if (!loadingEntities && hasMore) {
                            setPage((prev) => prev + 1);
                          }
                        }}
                        options={entities.map((entity) => ({
                          value: entity.EntityID,
                          label: entity.EntityDescription,
                        }))}
                        placeholder="Search or select client..."
                        className="mt-1.5 h-9 text-[11px] font-normal text-[#1F2937]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="leadPartnerName" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Lead Partner Name</Label>
                      <SearchableSelect
                        id="leadPartnerName" 
                        value={formData.leadPartnerPk}
                        onChange={(value) => {
                        const selectedPartner = leadPartners.find(
                           (p) => p.EMT_ColabsGen_PK.toString() === value    );
                               setFormData({
                                      ...formData,
                                     leadPartnerPk: value,
                                     leadPartnerId: selectedPartner?.Employee_ID || "",
                                     leadPartnerName: selectedPartner?.Full_Name || "",
                                        });  }}
                                          options={leadPartners.map((partner) => ({
                                                value: partner.EMT_ColabsGen_PK.toString(),
                                                    label: partner.Full_Name,  }))}
                        placeholder={
                          loadingLeadPartners
                            ? "Loading partners..."
                            : "Search or select partner..."
                        }
                        className="mt-1.5 h-9 text-[11px] font-normal text-[#1F2937]"
                      />

                    </div>
                  </div>
            </div>
        </CollapsibleSection>

        {/* 2. Reason - EQCR Required - Collapsible */}
        <CollapsibleSection
          title="Reason – EQCR Required"
          isOpen={openSections.razonEqcr}
          onToggle={() => toggleSection("razonEqcr")}
        >
            <div>
                  <div className="space-y-2">
                    {[
                      "Required by applicable law, regulation or professional standards? (i.e. CUAE , others)",
                      "The is engagement  considered to be High risk, unless exempted by the Risk Management Partner",
                      "Otherwise required by functional or member firm guidance?",
                      "Audit engagements for entities that engage in High Risk Industries/Activities. ( High Riks Industries/Activities are listed in the OA Alert) ( Note 3)",
                      "Audits of FS of a listed entity and any related review(s) of interim financial information,",
                      "Audits of financial statements of a non-listed entity with a high public profile  and any related review(s) of interim financial information,",
                      "The engagement is considered to be high risk as designated in CEAC, unless exempted by the risk management partner,",
                      "Engagements, including reviews of interim financial information, that require an EQCR review under local laws or regulations",
                    ].map((reason, index) => {
  const reasonId = index + 1;

  return (
                      <div
                        key={index}
                        className="flex items-start gap-2"
                      >
                        <Checkbox
                          id={`razon-${index}`}
checked={formData.razonEqcrRequired.includes(reasonId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                               razonEqcrRequired: [
  ...formData.razonEqcrRequired,
  reasonId,
],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                razonEqcrRequired:
                                  formData.razonEqcrRequired.filter((r) => r !== reasonId)
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={`razon-${index}`}
                          className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
                        >
                          {reason}
                        </Label>
                      
                      </div>
                        );
                      })
                      }


                    {/* Subtitle for Other Engagements */}
                    <div className="pt-3 pb-1 px-2">
                      <p className="text-xs font-semibold text-[#00338D] capitalize tracking-wide">
                        Other engagements, including reviews of interim financial
                        information, as designated by the RMP, CPPP or country
                        head of audit:
                      </p>
                    </div>

                    {[
                      "a) Statutory Audit (under ISA 700´s) when the component is a substantial role subsidiary, according with SEC rule, for the audit of the consolidated financial statements under PCAOB.",
                      "b) All Non for-Profit Entities",
                      "c) SOFOMES and any other entity performing operations similar to banking and insurance entities with related parties or third parties when the LAEP is not a partner of financial services segment.",
                    
].map((reason, index) => {
  const reasonId = index + 9;

  return (
    <div
      key={index + 9}
      className="flex items-start gap-2"
    >
      <Checkbox
        id={`razon-${index + 9}`}
        checked={formData.razonEqcrRequired.includes(reasonId)}
        onCheckedChange={(checked) => {
          if (checked) {
            setFormData({
              ...formData,
              razonEqcrRequired: [
                ...formData.razonEqcrRequired,
                reasonId,
              ],
            });
          } else {
            setFormData({
              ...formData,
              razonEqcrRequired:
                formData.razonEqcrRequired.filter(
                  (r) => r !== reasonId
                ),
            });
          }
        }}
      />
      <Label
        htmlFor={`razon-${index + 9}`}
        className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
      >
        {reason}
      </Label>
    </div>
  );
})}


                    {/* Separator */}
                    <div className="py-2">
                      <div className="border-t border-gray-300"></div>
                    </div>

                    {[
                      "Any time an opinion under PCAOB standards is issued, including the following: all audits, all reviews of interim financial information, all attestation engagements, audits or interim reviews performed by component auditors where the auditor´s report or interim report is issued to a non-KPMG group auditor Note 2",
                      "Audits of internal control over financial reporting (ICFR)",
                      "Audits conducted in accordance with AICPA standards where our report is included in an SEC periodic filing, an entity´s exempt offering, the first franchise offering document of a new or existing client that requires the firm´s consent",
                    
].map((reason, index) => {
  const reasonId = index + 12;

  return (
    <div
      key={index + 12}
      className="flex items-start gap-2"
    >
      <Checkbox
        id={`razon-${index + 12}`}
        checked={formData.razonEqcrRequired.includes(reasonId)}
        onCheckedChange={(checked) => {
          if (checked) {
            setFormData({
              ...formData,
              razonEqcrRequired: [
                ...formData.razonEqcrRequired,
                reasonId,
              ],
            });
          } else {
            setFormData({
              ...formData,
              razonEqcrRequired:
                formData.razonEqcrRequired.filter(
                  (r) => r !== reasonId
                ),
            });
          }
        }}
      />
      <Label
        htmlFor={`razon-${index + 12}`}
        className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
      >
        {reason}
      </Label>
    </div>
  );
})}

                  </div>
            </div>
        </CollapsibleSection>

        {/* 3. Criteria and Requirements - Collapsible */}
         {/* Criteria and Requirements */}
        <CollapsibleSection
          title="Criteria and Requirements"
          isOpen={openSections.criteriaRequirements}
          onToggle={() => toggleSection("criteriaRequirements")}
        >
          <div className="grid grid-cols-1 gap-2">
         

<div className="space-y-2">
  <Label
    htmlFor="competence"
    className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
  >
    Competence and capabilities to perform the EQCR
    {requiresAssistant && " / assigned duties"}
  </Label>

  <textarea
    id="competence"
    value={formData.competence}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        competence: e.target.value,
      }))
    }
    placeholder="Describe relevant experience, certifications, industry expertise, prior EQCR assignments, or other qualifications..."
    className="w-full min-h-[90px] rounded-lg border border-gray-200 px-4 py-3 text-[11px] text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#00338D]/20 focus:border-[#00338D]"
  />
</div>
<div className="space-y-4 pt-2">

  <div className="flex items-center gap-3">
    <Checkbox
      id="Member_of_the_engagement"
      checked={formData.Member_of_the_engagement}
      onCheckedChange={(checked) =>
        setFormData((prev) => ({
          ...prev,
          Member_of_the_engagement: checked === true,
        }))
      }
    />

    <Label
      htmlFor="Member_of_the_engagement"
      className="text-[11px] font-medium text-gray-700"
    >
      Has been a member of the engagement team or had any other involvement in the engagement
    </Label>
  </div>

  {formData.Member_of_the_engagement && (
    <div className="ml-8">
      <div className="flex items-center gap-3">
        <Checkbox
          id="coolingOffApplied"
          checked={formData.coolingOffApplied}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              coolingOffApplied: checked === true,
            }))
          }
        />

        <Label
          htmlFor="coolingOffApplied"
          className="text-[11px] font-medium text-gray-700"
        >
          If the candidate was part of the engagement team, the 2-year cooling period was applied
        </Label>
      </div>
    </div>
  )}

  <div className="flex items-center gap-3">
    <Checkbox
      id="sufficientTime"
      checked={formData.sufficientTime}
      onCheckedChange={(checked) =>
        setFormData((prev) => ({
          ...prev,
          sufficientTime: checked === true,
        }))
      }
    />

    <Label
      htmlFor="sufficientTime"
      className="text-[11px] font-medium text-gray-700"
    >
      Has sufficient time to carry out the EQCR review
    </Label>
  </div>

</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="threatsToObjectivity"
                  checked={formData.threatsToObjectivity}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      threatsToObjectivity: checked === true,
                    }))
                  }
                />

                <Label
                  htmlFor="threatsToObjectivity"
                  className="text-[11px] cursor-pointer text-gray-700"
                >
                  Has threats to his/her objectivity?
                </Label>
              </div>

              {formData.threatsToObjectivity && (
                <div className="ml-8">
                  <Label
                    htmlFor="safeguards"
                    className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
                  >
                     If yes, document the safeguards put in place text input editable. :
                  </Label>

                  <textarea
                    id="safeguards"
                    value={formData.safeguards}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        safeguards: e.target.value,
                      }))
                    }
                    className="w-full mt-1.5 px-3 py-2 border border-input rounded-md text-[11px] font-normal text-gray-900 focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px]"
                    placeholder="Enter safeguards applied..."
                  />
                </div>
              )}
            </div>


          </div>
        </CollapsibleSection>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-sm font-normal text-gray-600 hover:text-gray-900"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="text-sm font-normal border-gray-300 text-gray-900 hover:bg-gray-50"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            className="text-sm font-normal bg-[#00338D] text-white hover:bg-[#0055B8]"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}