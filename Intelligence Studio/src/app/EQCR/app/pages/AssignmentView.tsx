import { useState,useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Save, ChevronRight, MessageSquare, Edit2, Check, CheckCircle2, ThumbsUp, ThumbsDown, ArrowLeft, Send } from "lucide-react";
import { CollapsibleSection } from "../components/assignments/CollapsibleSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card } from "../components/ui/card";
import { SearchableSelect } from "../components/ui/searchable-select";
import { authApi, Claims } from "../API/authApi";//By Isaac
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import PageBackground from "../components/assignments/PageBackground";

interface Entity {
  EntityID: string;
  EntityDescription: string;
}

interface EQCRCredential {
  EMT_CredentGen_PK: number;
  EMT_Credent_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
    Email_Address_Business: string;

}

interface LeadPartner {
  EMT_ColabsGen_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
  Email_Address_Business: string;
}

interface Assistant {
  EMT_ColabsGen_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
}


export default function AssignmentView() {
  const [assignmentReasons, setAssignmentReasons] = useState<any[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isApprovalMode = searchParams.get("mode") === "approval";
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [validationData, setValidationData] = useState<any>(null);

  const [latestApprovalComment, setLatestApprovalComment] =  useState("");
 //para obetener el user
  const [user, setUser] = useState<any>(null);
   useEffect(() => {
     authApi.getClaims()
       .then(setUser)
       .catch(console.error);
   }, []);

  // ENTITIES
  const [entities, setEntities] = useState<Entity[]>([]);
  const [page, setPage] = useState(1);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // EQCR
  const [eqcrList, setEqcrList] = useState<EQCRCredential[]>([]);
  const [loadingEqcr, setLoadingEqcr] = useState(false);

  // LEAD PARTNERS
  const [leadPartners, setLeadPartners] = useState<LeadPartner[]>([]);
  const [loadingLeadPartners, setLoadingLeadPartners] = useState(false);

  // ASSISTANTS
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loadingAssistants, setLoadingAssistants] = useState(false);
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    razonEqcr: true,
    criteria: true,
    approvalComments: true,
  });
useEffect(() => {
  const loadReasons = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_dim_AssignationReason`
      );

      const data = await response.json();

      setAssignmentReasons(data ?? []);

    } catch (error) {
      console.error("Error loading assignment reasons", error);
    }
  };

  loadReasons();
}, []);
 const [credentials, setCredentials] =
  useState<any>(null);
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

    console.log(
      "Credential Summary",
      data
    );

    setCredentials(data);

  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  if (!assignmentData?.Employee_ID) return;

  loadCredentialSummary(
    String(assignmentData.Employee_ID)
  );
}, [assignmentData?.Employee_ID]);

  const [isEditingEqcr, setIsEditingEqcr] = useState(false);
  const [isEditingAssignmentType, setIsEditingAssignmentType] = useState(false);
  const [isEditingAssistant, setIsEditingAssistant] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  useEffect(() => {
  const loadAssignment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsGenerated/GetAssignmentGeneratedById/${id}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setAssignmentData(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadAssignment();
}, [id]);
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

      console.log("Assistants", data);

      setAssistants(data);
    } catch (error) {
      console.error("Error loading Assistants", error);
    } finally {
      setLoadingAssistants(false);
    }
  };

  loadAssistants();
}, []);
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

      const data = await response.json();

      setEqcrList(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEqcr(false);
    }
  };

  loadEQCRs();

}, []);
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

      console.log("Lead Partners", data);

      setLeadPartners(data);
    } catch (error) {
      console.error("Error loading Lead Partners", error);
    } finally {
      setLoadingLeadPartners(false);
    }
  };

  loadLeadPartners();
}, []);
useEffect(() => {
  if (!assignmentData?.Key_EMT) return;

  const loadValidationCriteria = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria/getAssignmentValidationCriteriaById/${assignmentData.Key_EMT}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Validation Criteria", data);

      setValidationData(data);

    } catch (error) {
      console.error(error);
    }
  };

  loadValidationCriteria();

}, [assignmentData?.Key_EMT]);
useEffect(() => {
  if (
    !isApprovalMode ||
    !assignmentData?.Key_EMT
  ) {
    return;
  }

  const loadApprovalComment = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsApprovals/${assignmentData.Key_EMT}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error loading approval comment"
        );
      }

      const data = await response.json();

      if (data.length > 0) {
        setApprovalComment(
          data[0].Approve_Comment || ""
        );
      }

    } catch (error) {
      console.error(error);
    }
  };

  loadApprovalComment();

}, [
  isApprovalMode,
  assignmentData?.Key_EMT
]);
const selectedReasons =
  validationData?.EMT_SR_Requi_ID_Concat
    ?.split(",")
    .map(Number) || [];
useEffect(() => {
  if (!validationData) return;

  setFormData(prev => ({
    ...prev,

    razonEqcrRequired:
      validationData.EMT_SR_Requi_ID_Concat
        ?.split(",")
        .map(Number) || [],

    experienceSimilar:
      validationData.No_responsibility ?? false,

    sufficientTime:
      validationData.Sufficient_time ?? false,

    coolingOffApplied:
      validationData.Two_Year_Cooling ?? false,

    threatsToObjectivity:
      validationData.Has_Threats ?? false,

    safeguards:
      validationData.Has_Threats_Desc ?? "",
  }));

}, [validationData]);


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
  const status = assignmentData?.Status_Label;

const isDraft = status === "Draft";
const isDeputyPending = status === "Deputy Pending";
const isCpppPending = status === "CPPP Pending";
const isApproved = status === "Approved";
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getApprovalHistory = () => {
    if (isDraft) {
      return [];
    } else if (isDeputyPending) {
      return [];
    } else if (isCpppPending) {
      return [
        {
          level: "CPPP Deputy",
          action: "Pre-approved",
          user: "David Wilson",
          date: "2026-02-20",
          comment: "The accredited EQCR has the relevant competencies, skills, and technical knowledge to be assigned to the engagement. All requirements have been verified and are compliant."
        }
      ];
    } else if (isApproved) {
      const deputyComment = {
        level: "CPPP Deputy",
        action: "Pre-approved",
        user: "David Wilson",
        date: "2026-02-20",
        comment: "The accredited EQCR has the relevant competencies, skills, and technical knowledge to be assigned to the engagement. All requirements have been verified and are compliant."
      };
      const cpppComment = {
        level: "CPPP",
        action: "Approved",
        user: "Michael Thompson",
        date: "2026-02-22",
        comment: "Final review completed. The EQCR assignment meets all professional standards and regulatory requirements. Approved for engagement."
      };
      return [deputyComment, cpppComment];
    }

    return [];
  };

  const assignment = {
  ...assignmentData,
  approvalHistory: getApprovalHistory(),
};

  const [formData, setFormData] = useState({
    eqcrId: "",
    keyEmtPfy: "",
     leadPartnerId: "",
       assistantId: "",
  eqcrName: "",
  assignmentType: "",
  requiresAssistant: false,
  assistantName: "",
  yearOfAppointment: "",
  Year_Reappointmen: 0,
  assignmentReason: "",
  ceacId: "",
  localClientName: "",
  engagementName: "",
  leadPartnerName: "",
  partnerOrDirector: "Partner",
  razonEqcrRequired: [],
  competence: "",
  professionalStandards: false,
  kpmgPolicies: false,
  industryKnowledge: false,
  experienceSimilar: false,
  sufficientTime: false,
  localListed: false,
  regulatedIndustry: false,
  independent: false,
  objectivity: false,
  integrity: false,
  impartiality: false,
  threatsToObjectivity: false,
  safeguards: "",
  emtTypePk: 0,
  understandingResponsibilities: true,
  legalRegulatory: true,
  relevantExpertise: true,
  eqcrCredentialPk: "",
   leadPartnerPk: "",
    assistantPk: "",
    Year_Reappointment: 0,
    statusID: 0,
  noSignificantChanges: false,
changesLegalRegulatory: false,
changesIndustry: false,
changesComplexity: false,
objectivityIntegrityImpartiality: false,
noResponsibilityForComponents: false,
engagementTeamInvolved: false,
coolingOffApplied: false,
usListed: false,
otherCountryListed: false,
});
useEffect(() => {
  if (!assignmentData) return;

  const selectedLeadPartner = leadPartners.find(
    p => p.Employee_ID === assignmentData.LeadPartner_Employee_ID
  );

  const selectedEntity = entities.find(
    e => e.EntityID?.toString() === assignmentData.Entity_ID?.toString()
  );

  setFormData(prev => ({
    ...prev,
    keyEmtPfy: assignmentData.Key_EMT_PFY || null,
    eqcrName: assignmentData.Full_Name || "",
    assistantId: assignmentData.Assistant_ID || null,
    eqcrId: assignmentData.Employee_ID || "",
    assignmentType: assignmentData.Sector_Desc || "",
    ceacId: assignmentData.CEAC_ID || "",
    emtTypePk: assignmentData.EMT_Type_PK || 1,
    engagementName: assignmentData.Engagement_Name || "",
    localClientName:assignmentData.Entity_ID?.toString() || "",
    leadPartnerPk: selectedLeadPartner?.EMT_ColabsGen_PK.toString() || "",
    leadPartnerId:assignmentData.LeadPartner_Employee_ID || "",
    leadPartnerName:assignmentData.LeadPartner_Full_Name || "",
    requiresAssistant: assignmentData.Assistant_required || false,
    statusID: assignmentData.Status_ID || 0,
    yearOfAppointment: assignmentData.Year_Appointment || "",
    Year_Reappointment: assignmentData.Year_Reappointment || null,
    assignmentReason: assignmentData.EMT_Reason_ID?.toString() || "",  }));
    console.log(
  "Entity_ID API:",
  assignmentData.Entity_ID
);

console.log(
  "Selected Entity:",
  selectedEntity
);
}, [assignmentData, leadPartners, entities]);


 if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      Loading...
    </div>
  );
}
  // If assignment not found, show error or redirect (but allow Draft status)
  if (!assignmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/assignments")}>Back to Assignments</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Assignment saved:", formData);
    navigate("/assignments");
  };

  const saveAssignment = async (readyToComplete: boolean, readyToApprove: boolean) => {
  try {

    const basicInformationPayload = {
      Key_EMT: assignmentData.Key_EMT,

      Key_EMT_PFY: formData.keyEmtPfy,

      Fiscal_Year_EMT:
  assignmentData.Fiscal_Year_EMT,

      Employee_ID: formData.eqcrId,

      Year_Appointment: Number(
        formData.yearOfAppointment
      ),

      Year_Reappointment: formData.Year_Reappointment,

      EMT_Type_PK: formData.emtTypePk,
      /*
        formData.assignmentType === "Audit"
          ? 1
          : formData.assignmentType === "ESG"
          ? 2
          : 3,
      */
      EMT_Reason_ID: Number(
        formData.assignmentReason
      ),

      CEAC_ID: formData.ceacId,

      Engagement_Name: formData.engagementName,

      Entity_ID: formData.localClientName,

      LeadPartner_Employee_ID: formData.leadPartnerId,

      Requires_Assistant: formData.requiresAssistant,

      Assistant_ID: formData.assistantId,
      
      Ready_to_Complete: readyToComplete,
       Ready_to_Approve: readyToApprove,
      Created_By:user?.email, 
    };

    const validationCriteriaPayload = {
      Key_EMT: assignmentData.Key_EMT,

      Key_EMT_PFY: formData.keyEmtPfy,

      Assistant_ID: formData.assistantId,

      EMT_SR_Requi_ID_Concat:
        formData.razonEqcrRequired.join(","),

      Competence: formData.competence,

      Professional_Standards:
        formData.professionalStandards,

      KPMG_Policies:
        formData.kpmgPolicies,

      Industry_Knowledge:
        formData.industryKnowledge,

      Experience_Similar:
        formData.experienceSimilar,

      Sufficient_Time:
        formData.sufficientTime,

      Local_Listed:
        formData.localListed,

      US_Listed:
        formData.usListed,

      Other_Country_Listed:
        formData.otherCountryListed,

      Regulated_Industry:
        formData.regulatedIndustry,

      Engagement_Team_Involved:
        formData.engagementTeamInvolved,

      Cooling_Off_Applied:
        formData.coolingOffApplied,

      Independent:
        formData.independent,

      Objectivity:
        formData.objectivity,

      Integrity:
        formData.integrity,

      Impartiality:
        formData.impartiality,

      Has_Threats:
        formData.threatsToObjectivity,

      Has_Threats_Desc:
        formData.safeguards,

      Understanding_Responsibilities:
        formData.understandingResponsibilities,

      Legal_Regulatory:
        formData.legalRegulatory,

      Relevant_Expertise:
        formData.relevantExpertise,
              Created_By:user?.email, 

    };

    const basicResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          basicInformationPayload
        )
      }
    );

    if (!basicResponse.ok) {
      throw new Error("Basic Information error");
    }

    const validationResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          validationCriteriaPayload
        )
      }
    );

    if (!validationResponse.ok) {
      throw new Error("Validation error");
    }

    navigate("/");

  } catch (error) {
    console.error(error);
toast.error("Error saving assignment");
  }
};
  const handleSave = async () => {
  await saveAssignment(
    false, 
    false  
  );
};

  const handleSaveAndSubmit = async () => {
  await saveAssignment(
    true, 
    true  
  );
};;

  const handleCancel = () => {
    if (isApprovalMode) {
      navigate("/approvals");
    } else {
      navigate("/assignments");
    }
  };

 const handleApprove = async () => {
  if (!approvalComment.trim()) {
    toast.warning(
      "Please add a comment before approving"
    );
    return;
  }

  try {

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsApprovals`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Key_EMT: assignmentData.Key_EMT,
          Approve_Level: user?.roles?.[0] || "",
          Approve_Status: 1,
          Approve_Email_Address_Business:
            user?.email,
          Approve_Comment: approvalComment,
          Is_Current: true
        })
      }
    );

    if (!response.ok) {
      throw new Error("Error approving");
    }

    toast.success(
      "Assignment approved successfully"
    );

    navigate("/approvals");

  } catch (error) {
    console.error(error);

    toast.error(
      "Error approving assignment"
    );
  }
};

  const handleReject = async () => {
  if (!approvalComment.trim()) {
    toast.warning(
      "Please add a comment before rejecting"
    );
    return;
  }

  try {

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsApprovals`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Key_EMT: assignmentData.Key_EMT,
          Approve_Level: user?.roles?.[0] || "",
          Approve_Status: 3,
          Approve_Email_Address_Business:
            user?.email,
          Approve_Comment: approvalComment,
          Is_Current: true,
        })
      }
    );

    if (!response.ok) {
      throw new Error("Error rejecting");
    }

    toast.success("Assignment rejected");

    navigate("/approvals");

  } catch (error) {
    console.error(error);

    toast.error(
      "Error rejecting assignment"
    );
  }
};

  const handleEqcrNameClick = () => {
    if (!isApprovalMode) {
      setIsEditingEqcr(true);
    }
  };

  const handleEqcrSelect = (selectedValue: string) => {
  const eqcr = eqcrList.find(
    e => e.EMT_Credent_PK.toString() === selectedValue
  );

  if (!eqcr) return;

  setFormData(prev => ({
    ...prev,
    eqcrCredentialPk: selectedValue,
    eqcrId: eqcr.Employee_ID,
    eqcrName: eqcr.Full_Name,
    partnerOrDirector: eqcr.Local_Job_Level_Name,
  }));

  setIsEditingEqcr(false);
};

 
  const getQprColor = (rating: string) => {
    switch(rating) {
      case "NC": return "bg-white text-[#00338D] border-[#1E49E2]";
      case "CIN": return "bg-white text-[#00338D] border-[#1E49E2]";
      case "AC": return "bg-white text-[#00338D] border-[#1E49E2]";
      default: return "bg-white text-[#00338D] border-[#00338D]";
    }
  };
  const isReappointment =
  assignmentData?.Assign_Type === "Reappointment" ||
  assignmentData?.Type_Assignment === "Reappointment" ||
  assignmentData?.Assignment_Type === "Reappointment" ||
  formData.Year_Reappointment;

const isAuditAssignment =
  formData.assignmentType === "Audit" && !isReappointment;

const isAssuranceAssignment =
  (
    formData.assignmentType === "ESG" ||
    formData.assignmentType === "SOC"
  ) &&
  !isReappointment;

const handleSendValidationForm = async () => {
  try {

    await saveAssignment(
      true,
      false
    );

    const selectedEQCR = eqcrList.find(
      e => e.Employee_ID === formData.eqcrId
    );

    const formPayload = {
      EMT_Type_PK: formData.emtTypePk,

      Key_EMT: assignmentData.Key_EMT,

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
          e =>
            e.EntityID.toString() ===
            formData.localClientName.toString()
        )?.EntityDescription,

      Year_Appointment:
        Number(formData.yearOfAppointment),

      Created_By: user?.email,
    };

    console.log(
      "FORM PAYLOAD",
      formPayload
    );

    const formResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          formPayload
        ),
      }
    );

    if (!formResponse.ok) {
      throw new Error(
        "Error creating EMT Form"
      );
    }

    toast.success(
      "Validation form sent"
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Error sending validation form"
    );
  }
};

  const EditableCriterion = ({
  id,
  label,
  checked,
  onChange,
  indented = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  indented?: boolean;
}) => (
  <div
    className={cn(
      "flex items-start gap-3 rounded-lg border border-gray-200/70 bg-white px-3 py-2.5",
      indented && "ml-8"
    )}
  >
    <Checkbox
      id={id}
      checked={checked}
      disabled={isApprovalMode}
      onCheckedChange={(value) => onChange(value === true)}
      className="mt-0.5"
    />
    <Label
      htmlFor={id}
      className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
    >
      {label}
    </Label>
  </div>
);

const ReadOnlyCriterion = ({ label }: { label: string }) => (
  <div className="flex items-start gap-2.5 rounded-lg border border-[#1E49E2]/10 bg-white/70 px-3 py-2.5">
    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1E49E2]/70" />
    <span className="text-[12px] text-[#0C233C]/80 font-normal leading-relaxed">
      {label}
    </span>
  </div>
);

  // All Razon EQCR Required reasons
  const razonReasons = [
    "	Required by applicable law, regulation or professional standards? (i.e. CUAE , others).	",
"	The is engagement  considered to be High risk, unless exempted by the Risk Management Partner.	",
"	Otherwise required by functional or member firm guidance?	",
"	Audit engagements for entities that engage in High Risk Industries/Activities. ( High Riks Industries/Activities are listed in the OA Alert) ( Note 3).	",
"	Audits of FS of a listed entity and any related review(s) of interim financial information.	",
"	Audits of financial statements of a non-listed entity with a high public profile  and any related review(s) of interim financial information.	",
"	The engagement is considered to be high risk as designated in CEAC, unless exempted by the risk management partner.	",
"	Engagements, including reviews of interim financial information, that require an EQCR review under local laws or regulations.	",
  ];

  const otherEngagementsReasons = [
    "a) Statutory Audit (under ISA 700´s) when the component is a substantial role subsidiary, according with SEC rule, for the audit of the consolidated financial statements under PCAOB.",
    "b) All Non for-Profit Entities",
    "c) SOFOMES and any other entity performing operations similar to banking and insurance entities with related parties or third parties when the LAEP is not a partner of financial services segment.",
  ];

  const pcaobReasons = [
    "Any time an opinion under PCAOB standards is issued, including the following: all audits, all reviews of interim financial information, all attestation engagements, audits or interim reviews performed by component auditors where the auditor´s report or interim report is issued to a non-KPMG group auditor Note 2",
    "Audits of internal control over financial reporting (ICFR)",
    "Audits conducted in accordance with AICPA standards where our report is included in an SEC periodic filing, an entity´s exempt offering, the first franchise offering document of a new or existing client that requires the firm´s consent",
  ];

  return (
    <PageBackground>
      <div className="min-h-screen">
        {/* Page Header with Sub-Navigation */}
        <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm px-8 py-6" style={{ borderBottomColor: "rgba(30, 73, 226, 0.08)" }}>
          <div className="flex flex-col items-center gap-4">
            <h1
              className="text-xl font-regular text-[#1E49E2]/80 cursor-pointer hover:text-[#1E49E2] transition-colors"
              style={{
                letterSpacing: "0.08em",
                lineHeight: "1.2",
                textShadow: "0 1px 1px rgba(30, 73, 226, 0.08)"
              }}
              onClick={() => navigate(isApprovalMode ? "/approvals" : "/assignments")}
            >
              {isApprovalMode ? "Approvals" : "Assignments"}
            </h1>

            {/* Centered Sub-Navigation */}
            {!isApprovalMode ? (
              <nav className="flex items-center gap-8">
                <button
                  onClick={() => navigate("/assignments")}
                  className={cn(
                    "text-sm font-normal transition-all relative pb-1",
                    "text-[#00338D]"
                  )}
                  style={{
                    letterSpacing: "0.03em"
                  }}
                >
                  Active
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
                </button>
                <button
                  onClick={() => navigate("/assignments")}
                  className={cn(
                    "text-sm font-normal transition-all relative pb-1",
                    "text-[#00338D] hover:text-gray-700"
                  )}
                  style={{
                    letterSpacing: "0.03em"
                  }}
                >
                  History
                </button>
                <button
                  onClick={() => navigate("/assignments")}
                  className="text-sm font-normal text-[#00338D] hover:text-gray-700 transition-all relative pb-1"
                  style={{
                    letterSpacing: "0.03em"
                  }}
                >
                  New
                </button>
              </nav>
            ) : (
              <nav className="flex items-center gap-8">
                <button
                  onClick={() => navigate("/approvals")}
                  className={cn(
                    "text-sm font-normal transition-all relative pb-1",
                    "text-[#00338D] hover:text-gray-700"
                  )}
                  style={{
                    letterSpacing: "0.03em"
                  }}
                >
                  EQCR
                </button>
                <button
                  onClick={() => navigate("/approvals")}
                  className={cn(
                    "text-sm font-normal transition-all relative pb-1",
                    "text-[#00338D]"
                  )}
                  style={{
                    letterSpacing: "0.03em"
                  }}
                >
                  Assignments
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
                </button>
              </nav>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with inline editable EQCR name */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-1">
                {isEditingEqcr && !isApprovalMode ? (
                  <div className="flex items-center gap-2">
                    <SearchableSelect
  value={formData.eqcrCredentialPk || ""}
  onChange={(value) => handleEqcrSelect(value)}
  options={eqcrList.map(eqcr => ({
    value: eqcr.EMT_Credent_PK.toString(),
    label: eqcr.Full_Name,
  }))}
  placeholder={
    loadingEqcr
      ? "Loading EQCRs..."
      : "Search EQCR..."
  }
  isDisabled={isApprovalMode}
/>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingEqcr(false)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2
                      className={cn(
                        "text-2xl font-semibold text-gray-900 inline-flex items-center gap-2",
                        !isApprovalMode && "cursor-pointer hover:text-[#00338D] transition-colors group"
                      )}
                      style={{ letterSpacing: '0.01em', lineHeight: '1.25' }}
                      onClick={handleEqcrNameClick}
                    >
                      {formData.eqcrName}
                      {!isApprovalMode && (
                        <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </h2>
                    <span className="text-sm text-[#00338D]">{credentials?.Local_Job_Level_Name ??
 formData.partnerOrDirector}
{" • "}
{credentials?.Years_In_Role ?? 0}
{" yrs"}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1" style={{ letterSpacing: '0.01em', lineHeight: '1.45' }}>
                {formData.assignmentType} Engagement • {formData.engagementName}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center gap-2 text-[#00338D] hover:text-gray-900"
            >
             <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* EQCR Credentials Summary - Compact inline section */}
          <div className="py-5 px-6 bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
              {/* Compliance Status */}
              <div>
                <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">Compliance</p>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Independence</span>
                    <span className="font-medium text-green-700">{credentials?.Indepence_Desc || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* QPR Results */}
              <div>
                <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">QPR Results</p>
                <div className="flex gap-2">
                  {[
  {
    year: "QPR1",
    rating: credentials?.QPR1,
  },
  {
    year: "QPR2",
    rating: credentials?.QPR2,
  },
  {
    year: "QPR3",
    rating: credentials?.QPR3,
  },
].map(({ year, rating }) => (
  <div key={year} className="text-center">
    <p className="text-xs text-gray-700 font-normal mb-1">
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
                <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">Standards</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {standards.map((standard) => (
                    <div key={standard.name} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{standard.name}</span>
                      <span className="font-semibold text-[#00338D]"> {standard.value ?? "0"}%</span>
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

          {/* Form Section */}
          {isApprovalMode && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Approval Mode:</strong> This assignment is in read-only view. You can review all details and provide your approval decision below.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
                <div className={cn("space-y-6", isApprovalMode && "[&_input]:bg-gray-50 [&_input]:cursor-not-allowed [&_select]:bg-gray-50 [&_select]:cursor-not-allowed [&_textarea]:bg-gray-50 [&_textarea]:cursor-not-allowed [&_button[role=checkbox]]:cursor-not-allowed")}>
                {/* Assignment Info */}

                {/* 1. Basic Information - Collapsible */}

                <CollapsibleSection
                  title="Basic Information"
                  isOpen={openSections.basicInfo}
                  onToggle={() => toggleSection("basicInfo")}
                >
                  <div>
                      {/* Assignment Type and Assistant Status */}
                      <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
                        {/* Assignment Type - Editable */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#00338D]">Assignment Type:</span>
                          {isEditingAssignmentType && !isApprovalMode ? (
                            <select
                              value={formData.assignmentType}
                              onChange={(e) => {
                                setFormData({ ...formData, assignmentType: e.target.value });
                                setIsEditingAssignmentType(false);
                              }}
                              onBlur={() => setIsEditingAssignmentType(false)}
                              autoFocus
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                              <option value="Audit">Audit</option>
                              <option value="ESG">ESG</option>
                              <option value="SOC">SOC</option>
                            </select>
                          ) : (
                            <span
                              onClick={() => !isApprovalMode && setIsEditingAssignmentType(true)}
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200",
                                !isApprovalMode && "cursor-pointer hover:border-indigo-300 hover:bg-indigo-100 transition-colors"
                              )}
                            >
                              {formData.assignmentType}
                            </span>
                          )}
                        </div>

                        {/* Assistant - Editable */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#00338D] text-[11px]">
                            {formData.requiresAssistant ? "Assistant:" : "Assistant Required:"}
                          </span>
                          {isEditingAssistant && !isApprovalMode ? (
                            <div className="relative">
                              <SearchableSelect
                                value={formData.assistantName}
                                onChange={(value) => {
  const assistant = assistants.find(
    a => a.EMT_ColabsGen_PK.toString() === value
  );

  setFormData(prev => ({
    ...prev,
    assistantPk: value,
    assistantId: assistant?.Employee_ID || "",
    assistantName: assistant?.Full_Name || "",
    requiresAssistant: value !== "",
  }));

  setIsEditingAssistant(false);
}}
                                options={[
                                      { value: "", label: "No assistant required" },
                                      ...assistants.map(assistant => ({
                                        value: assistant.EMT_ColabsGen_PK.toString(),
                                        label: `${assistant.Full_Name} — ${assistant.Local_Job_Level_Name}`
                                      }))
                                    ]}
                                placeholder="Search assistant..."
                                className="w-64"
                                isDisabled={isApprovalMode}
                              />
                            </div>
                          ) : (
                            <span
                              onClick={() => !isApprovalMode && setIsEditingAssistant(true)}
                              className={cn(
                                "text-xs font-medium text-gray-900",
                                !isApprovalMode && "cursor-pointer hover:text-indigo-700 transition-colors px-2 py-0.5 rounded hover:bg-gray-50"
                              )}
                            >
                              {formData.requiresAssistant ? formData.assistantName : "No"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.assignmentType === "Audit" && (
                          <>
                            <div>
                              
<Label
  htmlFor="yearOfAppointment"
  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
>Year of Appointment</Label>
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
                              <Label htmlFor="assignmentReason"  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Assignment Reason</Label>
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
                          </>
                        )}

                        <div>
                          <Label htmlFor="ceacId"  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">CEAC ID</Label>
                          <Input
                            id="ceacId"
                            value={formData.ceacId}
                            onChange={(e) => setFormData({ ...formData, ceacId: e.target.value })}
                            className="mt-1.5 "
                            disabled={isApprovalMode}
                          />
                        </div>
                        {/* {formData.keyEmtPfy} */}

                        <div>
                          <Label htmlFor="engagementName"  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Engagement Name</Label>
                          <Input
                            id="engagementName"
                            value={formData.engagementName}
                            onChange={(e) => setFormData({ ...formData, engagementName: e.target.value })}
                            className="mt-1.5 text-[12px]"
                            disabled={isApprovalMode}
                          />
                        </div>

                        <div>
                          <Label htmlFor="localClientName"  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Local Client Name</Label>
                         <SearchableSelect
  id="localClientName"
  value={formData.localClientName}
  onChange={(value) =>
    setFormData(prev => ({
      ...prev,
      localClientName: value
    }))
  }
  onScrollBottom={() => {
    if (!loadingEntities && hasMore) {
      setPage(prev => prev + 1);
    }
  }}
  options={[
  {
    value: assignmentData?.Entity_ID?.toString(),
    label: assignmentData?.Entity_Name,
  },
  ...entities.map(entity => ({
    value: entity.EntityID.toString(),
    label: entity.EntityDescription,
  })),
]}
  placeholder={
    loadingEntities
      ? "Loading clients..."
      : "Search or select client..."
  }
  className="mt-1.5"
  //triggerClassName="text-[11px]"
  isDisabled={isApprovalMode}
/>

                        </div>

                        {formData.assignmentType !== "Assistant" && (
                          <div>
                            <Label htmlFor="leadPartnerName"  className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">Lead Partner Name</Label>
                            <SearchableSelect
  id="leadPartnerName"
  value={formData.leadPartnerPk || ""}
  
  onChange={(value) => {
    const selectedPartner = leadPartners.find(
      p => p.EMT_ColabsGen_PK.toString() === value
    );

    setFormData(prev => ({
      ...prev,
      leadPartnerPk: value,
      leadPartnerId: selectedPartner?.Employee_ID || "",
      leadPartnerName: selectedPartner?.Full_Name || "",
    }));
  }}
  options={leadPartners.map(partner => ({
    value: partner.EMT_ColabsGen_PK.toString(),
    label: partner.Full_Name,
  }))}
  placeholder={
    loadingLeadPartners
      ? "Loading partners..."
      : "Search or select partner..."
  }
  className="mt-1.5 text-[11px]"
  isDisabled={isApprovalMode}
/>
                          </div>
                        )}
                      </div>
                    </div>
                 
                </CollapsibleSection>
                   <div className="space-y-6">
                   

                {/* 2. Razon EQCR Required - Collapsible (Audit only) */}
                {formData.assignmentType === "Audit" && (
  <CollapsibleSection
    title="Assignment Reason"
    isOpen={openSections.razonEqcr}
    onToggle={() => toggleSection("razonEqcr")}
  >
    <div className="space-y-1.5">

      {[
        "Required by applicable law, regulation or professional standards? (i.e. CUAE , others).",
        "The is engagement considered to be High risk, unless exempted by the Risk Management Partner.",
        "Otherwise required by functional or member firm guidance?",
        "Audit engagements for entities that engage in High Risk Industries/Activities. (High Risk Industries/Activities are listed in the OA Alert) (Note 3).",
        "Audits of FS of a listed entity and any related review(s) of interim financial information.",
        "Audits of financial statements of a non-listed entity with a high public profile and any related review(s) of interim financial information.",
        "The engagement is considered to be high risk as designated in CEAC, unless exempted by the risk management partner.",
        "Engagements, including reviews of interim financial information, that require an EQCR review under local laws or regulations."
      ].map((reason, index) => {

        const reasonId = index + 1;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-2"
          >
            <Checkbox
              id={`razon-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              disabled={isApprovalMode}
            />

            <Label
              htmlFor={`razon-${reasonId}`}
              className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
            >
              {reason}
            </Label>
          </div>
        );
      })}

      <div className="pt-2 pb-1">
        <div className="border-t border-gray-100" />
      </div>

      {[
        "Statutory Audit (under ISA 700's) when the component is a substantial role subsidiary, according with SEC rule, for the audit of the consolidated financial statements under PCAOB.",
        "All Non for-Profit Entities.",
        "SOFOMES and any other entity performing operations similar to banking and insurance entities with related parties or third parties when the LAEP is not a partner of financial services segment."
      ].map((reason, index) => {

        const reasonId = index + 9;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-3"
          >
            <Checkbox
              id={`razon-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              disabled={isApprovalMode}
            />

            <Label
              htmlFor={`razon-${reasonId}`}
              className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
            >
              {reason}
            </Label>
          </div>
        );
      })}

      <div className="pt-2 pb-1">
        <div className="border-t border-gray-100" />
      </div>

      {[
        "Any time an opinion under PCAOB standards is issued, including the following: all audits, all reviews of interim financial information, all attestation engagements, audits or interim reviews performed by component auditors where the auditor's report or interim report is issued to a non-KPMG group auditor Note 2.",
        "Audits of internal control over financial reporting (ICFR).",
        "Audits conducted in accordance with AICPA standards where our report is included in an SEC periodic filing, an entity's exempt offering, the first franchise offering document of a new or existing client that requires the firm's consent."
      ].map((reason, index) => {

        const reasonId = index + 12;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-3"
          >
            <Checkbox
              id={`razon-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              disabled={isApprovalMode}
            />

            <Label
              htmlFor={`razon-${reasonId}`}
              className="text-[12px] text-[#0C233C] font-normal leading-relaxed cursor-pointer"
            >
              {reason}
            </Label>
          </div>
        );
      })}
    </div>
  </CollapsibleSection>
)}
 </div>
                {/* 3. Criteria and Requirements - Collapsible */}
                <CollapsibleSection
                  title={
                    isReappointment
                      ? "Reappointment"
                      : isAuditAssignment
                      ? "Audit Assignment"
                      : "Assurance Assignment"
                  }
                  isOpen={openSections.criteria}
                  onToggle={() => toggleSection("criteria")}
                >
                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="competence"
                        className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
                      >
                        Competence and capabilities to perform the Engagement Quality Review for the engagement
                      </Label>

                      <textarea
                        id="competence"
                        value={String(formData.competence ?? "")}
                        disabled={isApprovalMode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            competence: e.target.value,
                          })
                        }
                        className="w-full mt-1.5 px-3 py-2 border border-gray-300/80 rounded-md min-h-[90px] text-[13px] text-[#0C233C] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/40 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Describe competence and capabilities..."
                      />
                    </div>

                    {!isReappointment && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <EditableCriterion
                            id="engagementTeamInvolved"
                            label="Has been a member of the engagement team or have any other involvement in the engagement?"
                            checked={formData.engagementTeamInvolved}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                engagementTeamInvolved: checked,
                              })
                            }
                          />

                          {formData.engagementTeamInvolved && (
                            <EditableCriterion
                              id="coolingOffApplied"
                              label="If the candidate was part of the engagement team, the 2 year cooling period was applied?"
                              checked={formData.coolingOffApplied}
                              onChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  coolingOffApplied: checked,
                                })
                              }
                            />
                          )}

                          <EditableCriterion
                            id="sufficientTime"
                            label="Has sufficient time to carry out the EQC review?"
                            checked={formData.sufficientTime}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                sufficientTime: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="threatsToObjectivity"
                            label="Has threats to his/her objectivity?"
                            checked={formData.threatsToObjectivity}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                threatsToObjectivity: checked,
                              })
                            }
                          />
                        </div>

                        {formData.threatsToObjectivity && (
                          <div>
                            <Label
                              htmlFor="safeguards"
                              className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
                            >
                              If yes, document the safeguards put in place
                            </Label>

                            <textarea
                              id="safeguards"
                              value={formData.safeguards}
                              disabled={isApprovalMode}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  safeguards: e.target.value,
                                })
                              }
                              className="w-full mt-1.5 px-3 py-2 border border-gray-300/80 rounded-md min-h-[90px] text-[13px] text-[#0C233C] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/40 disabled:bg-gray-50 disabled:cursor-not-allowed"
                              placeholder="Document safeguards..."
                            />
                          </div>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                          <p className="mb-3 text-[11px] font-semibold capitalize tracking-[0.12em] text-[#00338D]">
                            Validated requirements
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <ReadOnlyCriterion label="Professional standards" />
                            <ReadOnlyCriterion label="KPMG Mexico's policies and procedures" />
                            <ReadOnlyCriterion label="Knowledge of the entity's Industry" />
                            <ReadOnlyCriterion label="Experience of a similar nature and complexity engagements" />

                            {isAuditAssignment && (
                              <>
                                <ReadOnlyCriterion label="Local Listed" />
                                <ReadOnlyCriterion label="US Listed" />
                                <ReadOnlyCriterion label="Other country Listed" />
                                <ReadOnlyCriterion label="Regulated Industry" />
                              </>
                            )}

                            <ReadOnlyCriterion label="Be independent from the entity?" />
                            <ReadOnlyCriterion label="Has objectivity?" />
                            <ReadOnlyCriterion label="Has integrity?" />
                            <ReadOnlyCriterion label="Has impartiality?" />
                          </div>
                        </div>
                      </>
                    )}

                    {isReappointment && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <EditableCriterion
                            id="noSignificantChanges"
                            label="There have been no significant changes in the nature of the engagement that have occurred since the time of initial appointment"
                            checked={formData.noSignificantChanges}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                noSignificantChanges: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="changesLegalRegulatory"
                            label="There have been changes in the Legal & Regulatory requirements applicable to the engagement?"
                            checked={formData.changesLegalRegulatory}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                changesLegalRegulatory: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="changesIndustry"
                            label="There have been changes in the entity's Industry?"
                            checked={formData.changesIndustry}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                changesIndustry: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="changesComplexity"
                            label="There have been changes in the Complexity of the engagement?"
                            checked={formData.changesComplexity}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                changesComplexity: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="sufficientTime"
                            label="Has sufficient time to carry out the EQC review?"
                            checked={formData.sufficientTime}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                sufficientTime: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="objectivityIntegrityImpartiality"
                            label="Be able to carry out the role with objectivity, integrity and impartiality?"
                            checked={formData.objectivityIntegrityImpartiality}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                objectivityIntegrityImpartiality: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="engagementTeamInvolved"
                            label="Has been a member of the engagement team or have any other involvement in the engagement?"
                            checked={formData.engagementTeamInvolved}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                engagementTeamInvolved: checked,
                              })
                            }
                          />

                          {formData.engagementTeamInvolved && (
                            <EditableCriterion
                              id="coolingOffApplied"
                              label="If the candidate was part of the engagement team, the 2 year cooling period was applied?"
                              checked={formData.coolingOffApplied}
                              onChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  coolingOffApplied: checked,
                                })
                              }
                            />
                          )}

                          <EditableCriterion
                            id="threatsToObjectivity"
                            label="Has threats to his/her objectivity?"
                            checked={formData.threatsToObjectivity}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                threatsToObjectivity: checked,
                              })
                            }
                          />

                          <EditableCriterion
                            id="noResponsibilityForComponents"
                            label="Shall not have responsibility for the audit/review of any reporting entity's components, employee benefit plans or related entities"
                            checked={formData.noResponsibilityForComponents}
                            onChange={(checked) =>
                              setFormData({
                                ...formData,
                                noResponsibilityForComponents: checked,
                              })
                            }
                          />
                        </div>

                        {formData.threatsToObjectivity && (
                          <div>
                            <Label
                              htmlFor="safeguards"
                              className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]"
                            >
                              If yes, document the safeguards put in place
                            </Label>

                            <textarea
                              id="safeguards"
                              value={formData.safeguards}
                              disabled={isApprovalMode}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  safeguards: e.target.value,
                                })
                              }
                              className="w-full mt-1.5 px-3 py-2 border border-gray-300/80 rounded-md min-h-[90px] text-[13px] text-[#0C233C] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/40 disabled:bg-gray-50 disabled:cursor-not-allowed"
                              placeholder="Document safeguards..."
                            />
                          </div>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                          <p className="mb-3 text-[11px] font-semibold capitalize tracking-[0.12em] text-[#00338D]">
                            Validated requirements
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <ReadOnlyCriterion label="Be independent from the entity?" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CollapsibleSection>
                </div>

                {/* Action Buttons */}
                {isApprovalMode ?  (
                  <div className="pt-8 mt-8 border-t border-gray-200 space-y-4">
                    {/* Approval Guidance Card */}
{(() => {
  const approvalScenario =
    isDeputyPending && !isReappointment
      ? "DEPUTY_ASSIGNMENT"
      : isDeputyPending && isReappointment
      ? "DEPUTY_REAPPOINTMENT"
      : isCpppPending && !isReappointment
      ? "CPPP_ASSIGNMENT"
      : isCpppPending && isReappointment
      ? "CPPP_REAPPOINTMENT"
      : null;

  const approvalTexts: Record<string, string> = {
    DEPUTY_ASSIGNMENT: `CPPP Deputy | Belen Ruiz

I. He revisado la información del EQCR acreditado confirmando que:

Tiene un entendimiento de las normas profesionales relevantes para el proyecto.

Tiene un entendimiento de las políticas y procedimientos de la firma relevantes para el proyecto.

Tiene un entendimiento de los requerimientos legales y regulatorios aplicables al Engagement.

Tiene un entendimiento y experiencia relevante en proyectos similares en naturaleza y complejidad.

Tiene tiempo suficiente disponible para llevar a cabo la revisión como EQCR y se evidencia así en su workload.

No es parte del equipo de auditoría y no ha tenido otro involucramiento como parte del proyecto.

No ha tenido ninguno de los siguientes roles en los últimos 2 años: Socio líder del proyecto, socio líder de algún componente tratándose de alguna auditoría de grupo, otro socio de auditoría en el cual el socio líder del proyecto delegue responsabilidades del proyecto.

El EQCR acreditado tiene las competencias, habilidades y conocimiento técnico relevantes para ser asignado al proyecto. Asimismo, para ser asignado en cumplimiento con los requerimientos de ética e independencia relevantes, leyes y regulaciones y puede llevar a cabo el rol de EQCR con objetividad, integridad e imparcialidad.

II. Considerando la información evaluada concluyo que el(la) socio(a)/ el(la) director(a) No es elegible para ser asignado(a) como EQCR al proyecto.`,

    DEPUTY_REAPPOINTMENT: `CPPP Deputy | Belen Ruiz 

I.He revisado la información del EQCR acreditado para evaluar su continuidad concluyendo que:  

Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,  

Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma, 

 

Asimismo, He evaluado : 

Los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICFs identificadas, cuando existieron y el impacto de estas en el desempeño de su función como EQCR.   

Los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificadas, cuando existieron y el impacto de esta en el desempeño de su función como EQCR.   

Otros indicados de cumplimiento como los resultados de auditorías de independencia, cumplimiento con Sentinel, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR. 

 

 

He revisado la información siguiente para evaluar la continuidad de la asignación del EQCR acreditado, concluyendo que:  

No ha habido cambios significativos en la naturaleza del proyecto que hayan ocurrido desde la asignación inicial del EQCR que resulten en que éste no tenga la competencia y habilidades para llevar a cabo el rol de EQCR en el proyecto, 

No ha habido cambios en los requerimientos legales y regulatorios aplicables al proyecto; la industria del cliente; y la complejidad del proyecto, 

Tiene tiempo suficiente disponible para llevar a cabo la revisión como EQCR y se evidencia así en su workload,  

Su asignación está en cumplimiento con los requerimientos relevantes de ética e independencia; leyes y regulaciones y puede llevar a cabo su rol con objetividad, integridad e imparcialidad, 

No ha sido miembro el equipo de auditoria y no ha tenido algún involucramiento con el proyecto. 

Considerando lo anterior concluyo que el(la) socio(a)/ el(la) director(a) es elegible para ser reasignado(a) como EQCR en el proyecto.  

 

II. Considerando la información analizada concluyo que el(la) socio(a)/ el(la) director(a) No es elegible para ser reasignado(a) como EQCR en el proyecto.  `,
    CPPP_ASSIGNMENT: `CPPP  | Carlos Mercado 

I.He revisado la información del EQCR acreditado confirmando que:  

Tiene un   entendimiento de las normas profesionales relevantes para el proyecto,  

Tiene un entendimiento de las políticas y procedimientos de la firma relevantes para el proyecto,  

Tiene un entendimiento de los requerimientos legales y regulatorios aplicables al Engagement,  

Tiene un entendimiento y experiencia relevante en proyectos de similares en naturaleza y complejidad,  

Tiene tiempo suficiente disponible para llevar a cabo la revisión como EQCR y se evidencia así en su workload,  

No es parte del equipo de auditoría y no ha tenido otro involucramiento como parte del proyecto, 

No ha tenido ninguno de los siguientes roles en los últimos 2 años: Socio líder del proyecto, socio líder de algún componente tratándose de alguna auditoria de grupo, otro socio de auditoria en el cual el socio líder del proyecto delegue responsabilidades del proyecto. 

El EQCR acreditado es aprobado para ser asignado en el proyecto ya que tiene las competencias, habilidades y conocimiento técnico relevantes para al proyecto. Asimismo, apruebo su asignación en cumplimiento con los requerimientos de ética e independencia relevantes, leyes y regulaciones y puede llevar a cabo el rol de EQCR con objetividad, integridad e imparcialidad.    

II. Considerando la información evaluada concluyo que el(la) socio(a)/ el(la) director(a) No es aprobado para ser asignado(a) como EQCR al proyecto. `,
    CPPP_REAPPOINTMENT: `CPPP | Carlos Mercado 

 

I.He revisado la información del EQCR acreditado para evaluar su continuidad concluyendo que:  

Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,  

Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma, 

 

 

Asimismo, he evaluado : 

Los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICFs identificadas, cuando existieron y el impacto de estas en el desempeño de su función como EQCR.   

Los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificadas, cuando existieron y el impacto de esta en el desempeño de su función como EQCR.   

Otros indicados de cumplimiento como los resultados de auditorías de independencia, cumplimiento con Sentinel, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR. 

 

He revisado la información siguiente para evaluar la continuidad de la asignación del EQCR acreditado, concluyendo que:  

No ha habido cambios significativos en la naturaleza del proyecto que hayan ocurrido desde la asignación inicial del EQCR que resulten en que éste no tenga la competencia y habilidades para llevar a cabo el rol de EQCR en el proyecto, 

No ha habido cambios en los requerimientos legales y regulatorios aplicables al proyecto; la industria del cliente; y la complejidad del proyecto, 

Tiene tiempo suficiente disponible para llevar a cabo la revisión como EQCR y se evidencia así en su workload,  

Su asignación está en cumplimiento con los requerimientos relevantes de ética e independencia; leyes y regulaciones y puede llevar a cabo su rol con objetividad, integridad e imparcialidad, 

No ha sido miembro el equipo de auditoria y no ha tenido algún involucramiento con el proyecto. 

Considerando lo anterior concluyo que socio(a)/ el(la) director(a) es aprobado para ser reasignado(a) como EQCR en el proyecto. 

II.  Considerando la información evaluada concluyo que el(la) socio(a)/ el(la) director(a) NO es aprobado para ser reasignado(a) como EQCR en el proyecto. `,
  };

  if (!approvalScenario) return null;

  return (
    <Card className="mb-6 border border-[#00338D]/20 bg-[#F8FAFF]">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-[#00338D] mb-3">
          Approval Guidance
        </h3>

        <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
          {approvalTexts[approvalScenario]}
        </div>
      </div>
    </Card>
  );
})()}
                    {/* Approval Comment Section */}
                    <div>
                      <Label htmlFor="approvalComment" className="text-sm font-medium text-gray-700 mb-2 block">
                        Approval Comment <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="approvalComment"
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D] min-h-[100px]"
                        placeholder="Enter your approval or rejection comment..."
                      />
                    </div>

                    {/* Approval Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="text-gray-600"
                      >
                        Close
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReject}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1.5" />
                        Reject
                      </Button>
                      <Button
                        type="button"
                        onClick={handleApprove}
                        className="bg-green-600 text-white hover:bg-green-700 "
                      >
                        <ThumbsUp className="w-4 h-4 mr-1.5" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-gray-600 text-[12px]"
                    >
                      Close
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSave}
                      className="border-gray-300 text-gray-900 text-[12px]"
                    >
                      Save Draft
                    </Button>

                    {!isReappointment && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendValidationForm}
                        className="border-[#00338D]/30 text-[#00338D] hover:bg-[#00338D]/5 text-[12px]"
                      >
                        <Send className="w-4 h-4 mr-1.5" />
                        Send Form
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={handleSaveAndSubmit}
                      className="bg-[#00338D] text-white hover:bg-[#0055B8] text-[12px]"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Send for Approval
                    </Button>
                  </div>
                )}
              </form>
        </div>
      </div>
      </div>
    </PageBackground>
  );
}