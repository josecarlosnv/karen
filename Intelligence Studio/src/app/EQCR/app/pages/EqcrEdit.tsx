import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import {
  Save,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { SearchableSelect } from "../components/ui/searchable-select";
import { cn } from "../components/ui/utils";
import { LocalJobLevelApi, LocalJobLevelOption } from "../../app/API/LocalLevelJobApi";//By Isaac
import { indepenceRiskApi, IndepenceRiskOption } from "../../app/API/indepenceRiskApi"//By Isaac
import { authApi, Claims } from "../../app/API/authApi";//By Isaac
import { toast } from "sonner";


export default function EqcrEdit() {    

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNew = id === "new";
  const isApprovalMode =
    searchParams.get("mode") === "approval";
  const [selectedEqcrId, setSelectedEqcrId] = useState("");
  const [showNewEqcrModal, setShowNewEqcrModal] =
    useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [indepenceOptions, setIndepenceOptions] = useState<IndepenceRiskOption[]>([]);//By Isaac
  const [newEqcrData, setNewEqcrData] = useState({
    firstName: "",
    lastName: "",
    localJobLevel: "",
    bu: "",
    office: "",
    promotionYear: "",
  });
const [jobLevels, setJobLevels] = useState<LocalJobLevelOption[]>([]);//By Isaac
const [colabsOptions, setColabsOptions] = useState([]);//By Isaac
//By Isaac
useEffect(() => {
  const load = async () => {
    try {
      const data = await LocalJobLevelApi.listOptions();
      setJobLevels(data);
    } catch (error) {
      console.error(error);
    }
  };

  load();
}, []);
//BY Isaac
const [user, setUser] = useState<any>(null);

useEffect(() => {
  authApi.getClaims()
    .then(setUser)
    .catch(console.error);
}, []);
//
//By Isaac
useEffect(() => {
  const loadColabs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_ColabsGenerated/Actives`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading collaborators");
      }

      const data = await response.json();

      console.log("Colabs:", data);

      const mapped = data.map((item: any) => ({
        value: item.Employee_ID,
        label: `${item.Full_Name} — ${item.Local_Job_Level_Name}`,
        raw: item, 
      }));

      setColabsOptions(mapped);
    } catch (error) {
      console.error("Error loading colabs:", error);
    }
  };

  loadColabs();
}, []);

//
  const [formData, setFormData] = useState({
    name: "",
    localJobLevel: "",
    bu: "",
    office: "",
    promotionYear: "",
    memberFirm: true,
    assistant: false,
    aicpa: "",
    pcaob: "",
    icfr: "",
    sec: "",
    ifrs: "",
    usGaap: "",
    other: "",
    understandingResponsibilities: false,
    qpr2022: "",
    qpr2023: "",
    qpr2024: "",
    qpr2025: "",
    qpr2026: "",
    ncEvaluation: "",
    pcaobInspection: "",
    independenceComments: "",
    industryExperience: "",
    bupppComments: "",
    deputyComments: "",
    deputyStatus: "Pre-approved",
    cpppStatus: "Ready",
    Status_Label: "",
    cppp: 0,
    deputy: 0,
  });
//By Isaac
useEffect(() => {
  const loadOptions = async () => {
    try {
      const data = await indepenceRiskApi.list();
      console.log("API DATA indepence risk:", data);
      setIndepenceOptions(data);
    } catch (error) {
      console.error("Error loading independence options", error);
    }
  };

  loadOptions();
}, []);

const ActiveSave = user?.roles === "All" ? true: false;

//By Isaac
useEffect(() => {
  const loadDetail = async () => {
    if (!id || id === "new") return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/${id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        const currentYear = new Date().getFullYear();

        setFormData({
          name: data.Full_Name,
          localJobLevel: data.Local_Job_Level_Name,
          bu: data.BU,
          office: data.Location_Name,
          promotionYear: (currentYear - Math.floor(data.Years_In_Role)).toString(),

          memberFirm: data.Is_Firm_Member,
          assistant: data.Is_Assistant,

          aicpa: data.AICPA ? Math.round(data.AICPA * 100).toString() : "",
          pcaob: data.PCAOB ? Math.round(data.PCAOB * 100).toString() : "",
          icfr: data.ICFR ? Math.round(data.ICFR * 100).toString() : "",
          sec: data.SEC ? Math.round(data.SEC * 100).toString() : "",
          ifrs: data.IFRS ? Math.round(data.IFRS * 100).toString() : "",
          usGaap: data.USGAAP ? Math.round(data.USGAAP * 100).toString() : "",

          other: data.Specific_Training || "",
          industryExperience: data.Indutry_Experience || "",
          understandingResponsibilities: !!data.Understanding_Responsabilities,

          qpr2024: data.QPR1 || "",
          qpr2025: data.QPR2 || "",
          qpr2026: data.QPR3 || "",

          ncEvaluation: data.NC_Evaluation || "",
          pcaobInspection: data.PCAOB_Inspection_Results || "",

          independenceComments: data.Indepence_Desc || "",
          deputyComments: data.Deputy_Comment || "",
          bupppComments: data.CPPP_Comment || "",

          deputyStatus: data.Deputy ? "Pre-approved" : "Pending",
          cpppStatus: data.CPPP ? "Pending" : null,
          Status_Label: data.Status_Label,
          cppp: data.CPPP ? data.CPPP: 97,
          deputy: data.Deputy ? data.Deputy: 97,
          //cppp: data.CPPP ? "1": "0",
          //deputy: data.Deputy ? "1": "0",
        });

        return; 
      }

      console.warn("No existe en CredentialsGenerated, usando Colabs...");

      const selected = colabsOptions.find(
        (c: any) => String(c.value) === String(id)
      );

      if (!selected) {
        console.error(" No encontrado en Colabs tampoco");
        return;
      }

      const data = selected.raw;
      const currentYear = new Date().getFullYear();

      setFormData((prev) => ({
        ...prev,
        name: data.Full_Name,
        localJobLevel: data.Local_Job_Level_Name,
        bu: data.BU,
        office: data.Location_Name,
        promotionYear: (currentYear - Math.floor(data.Years_In_Role)).toString(),

        aicpa: data.AICPA ? Math.round(data.AICPA * 100).toString() : "",
        pcaob: data.PCAOB ? Math.round(data.PCAOB * 100).toString() : "",
      }));

    } catch (error) {
      console.error(" Error general en loadDetail:", error);
    }
  };

  loadDetail();
}, [id, colabsOptions]);


const hasDeputy = Array.isArray(user?.roles)
  ? user.roles.some(r => r?.toLowerCase() === "deputy")
  : user?.roles?.toLowerCase() === "deputy";

const hasCppp = Array.isArray(user?.roles)
  ? user.roles.some(r => r?.toLowerCase() === "cppp")
  : user?.roles?.toLowerCase() === "cppp";

const hasAll = Array.isArray(user?.roles)
  ? user.roles.some(r => r?.toLowerCase() === "all")
  : user?.roles?.toLowerCase() === "all";

const canApprove =
  (hasDeputy && formData?.deputy !== 1) ||
  (hasCppp && formData?.cppp !== 1 && formData?.deputy === 1) ||
  hasAll;


const handleEqcrSelect = (value: string) => {
  if (value === "create-new") {
    setShowNewEqcrModal(true);
    return;
  }

  setSelectedEqcrId(value);

  navigate(`/credentials/eqcr/${value}`);

  const selected = colabsOptions.find((c) => c.value === value);

  if (selected) {
    const data = selected.raw;
    const currentYear = new Date().getFullYear();

    setFormData({
      ...formData,
      name: data.Full_Name,
      localJobLevel: data.Local_Job_Level_Name,
      bu: data.BU,
      office: data.Location_Name,
      promotionYear: (
        currentYear - Math.floor(data.Years_In_Role)
      ).toString(),
    });
  }
};
  
const handleCreateNewEqcr = async () => {
  const fullName =
    `${newEqcrData.firstName} ${newEqcrData.lastName}`.trim();

  if (!fullName || !newEqcrData.localJobLevel) {
    //alert("Please fill required fields");
    toast.error("Please fill required fields");


    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_OthersEQCR`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          First_Name: newEqcrData.firstName,
          Last_Name: newEqcrData.lastName,

          Email_Address_Business: "", 
          Location_Name: newEqcrData.office,
          Local_Job_Level_Name: newEqcrData.localJobLevel,

          Years_In_Role: newEqcrData.promotionYear,

          Area_From: newEqcrData.bu,
          Created_By: user?.email, 
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error creating EQCR");
    }

    const data = await response.json();

    console.log("Created EQCR:", data);

    //setSelectedEqcrId("new-temp");
setSelectedEqcrId(data.id.toString());//BY ISAAC
navigate(`/credentials/eqcr/${data.id}`);//By Isaac
    setFormData({
      ...formData,
      name: fullName,
      localJobLevel: newEqcrData.localJobLevel,
      bu: newEqcrData.bu,
      office: newEqcrData.office,
      promotionYear: newEqcrData.promotionYear,
    });

    setShowNewEqcrModal(false);

    setNewEqcrData({
      firstName: "",
      lastName: "",
      localJobLevel: "",
      bu: "",
      office: "",
      promotionYear: "",
    });


  } catch (error) {
    console.error("Error creating EQCR:", error);
    //alert("Error creating EQCR");
       toast.error("Error creating EQCR");

  }
};
  const handleCancelNewEqcr = () => {
    setShowNewEqcrModal(false);
    setNewEqcrData({
      firstName: "",
      lastName: "",
      localJobLevel: "",
      bu: "",
      office: "",
      promotionYear: "",
    });
  };





    const [selectedDecision, setSelectedDecision] = useState<
    "return" | "reject" | "approve" | null
  >(null);
  const renderCertText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line === "") return <div key={i} className="h-2" />;
      if (line.startsWith("•")) {
        return (
          <div key={i} className="flex gap-2 pl-2">
            <span className="text-[#1E49E2] mt-0.5 shrink-0">•</span>
            <span>{line.slice(1).trim()}</span>
          </div>
        );
      }
      return <p key={i}>{line}</p>;
    });
  };


  
const handleDecisionSelect = (
  decision: "return" | "reject" | "approve",
) => {
  setSelectedDecision(decision);
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("EQCR saved as draft:", formData);
};

  /*
  const handleDecisionSelect = (
    decision: "return" | "reject" | "approve",
  ) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("EQCR saved as draft:", formData);
  };
*/


const handleSubmitDraft = async () => {
  try {
    const employeeId = Number(id);

    if (!employeeId) {
      //alert("Invalid Employee ID");
     toast.error("Invalid Employee ID");
      return;
    }

    const payload = {
      Employee_ID: employeeId,

      Is_Firm_Member: formData.memberFirm ? 1 : 0,
      Is_Assistant: formData.assistant ? 1 : 0,

      Understanding_Responsabilities: formData.understandingResponsibilities ? 1 : 0,

      NC_Evaluation: formData.ncEvaluation,
      PCAOB_Inspection_Results: formData.pcaobInspection,

      Specific_Training: formData.other,

      Indutry_Experience: formData.industryExperience,
      Indepence_Desc: formData.independenceComments,
      Ready_to_Approve: 0,
      Created_By: user?.email,
    };

    console.log("PAYLOAD LIMPIO:", payload);

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BACKEND ERROR:", errorText);
      throw new Error("Error inserting Credentials");
    }

    const data = await response.json();

    console.log(" Inserted:", data);

   // alert("Saved & Sent successfully ");

    navigate("/credentials");

  } catch (error) {
    console.error(" Error Save & Send:", error);
    //alert("Error saving data");
       toast.error("Please capture the requiered fields");

  }
};

  //By Isaac
const handleSaveAndSend = async () => {
  try {
    const employeeId = Number(id);

    if (!employeeId) {
      //alert("Invalid Employee ID");
     toast.error("Invalid Employee ID");
      return;
    }

    const payload = {
      Employee_ID: employeeId,

      Is_Firm_Member: formData.memberFirm ? 1 : 0,
      Is_Assistant: formData.assistant ? 1 : 0,

      Understanding_Responsabilities: formData.understandingResponsibilities ? 1 : 0,

      NC_Evaluation: formData.ncEvaluation,
      PCAOB_Inspection_Results: formData.pcaobInspection,

      Specific_Training: formData.other,

      Indutry_Experience: formData.industryExperience,
      Indepence_Desc: formData.independenceComments,
      Ready_to_Approve: 1,
      Created_By: user?.email,
    };

    console.log("PAYLOAD LIMPIO:", payload);

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BACKEND ERROR:", errorText);
      throw new Error("Error inserting Credentials");
    }

    const data = await response.json();

    console.log(" Inserted:", data);

   // alert("Saved & Sent successfully ");

    navigate("/credentials");

  } catch (error) {
    console.error(" Error Save & Send:", error);
    //alert("Error saving data");
       toast.error("Please capture the requiered fields");

  }
};

  const handleCancel = () => {
    if (isApprovalMode) {
      navigate("/approvals");
    } else {
      navigate("/credentials");
    }
  };

const handleApprove = async () => {
  if (!approvalComment.trim()) {
    toast.error("Please provide a comment for your approval");
    return;
  }

  const level = getApproveLevel();

  if (formData.Status_Label == 'Approved') {
    toast.error("No pending approval for this record");
    return;
  }

  try {
    const employeeId = Number(id);

    const approvalResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsApprobals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          Employee_ID: employeeId,
          Approve_Level: String(user?.roles), //erik
          Approve_Status: 1,
          Approve_Email_Address_Business: user?.email,
          Approve_Comment: approvalComment
        }),
      }
    );

    if (!approvalResponse.ok) {
      throw new Error("Error saving approval");
    }

    navigate("/approvals");
  } catch (error) {
    console.error("Error approving:", error);
    toast.error("Error saving approval");

  }
};


const handleReturn = async () => {
  if (!approvalComment.trim()) {
    //alert("Please provide a comment for your approval");
           toast.error("Please provide a comment for your approval");
    return;
  }
  const level = getApproveLevel();
  if (formData.Status_Label == 'Approved') {
               toast.error("No pending approval for this record");
    return;
  }
  try {
    const employeeId = Number(id);
    const approvalResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsApprobals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          Employee_ID: employeeId,
          Approve_Level: String(user?.roles), //erik
          Approve_Status: 2,
          Approve_Email_Address_Business: user?.email,
          Approve_Comment: approvalComment
        }),
      }
    );

    if (!approvalResponse.ok) {
      throw new Error("Error saving approval");
    }
    navigate("/approvals");
  } catch (error) {
    console.error("Error approving:", error);
    toast.error("Error saving approval");
  }
};


const handleReject = async () => {
  if (!approvalComment.trim()) {
    //alert("Please provide a comment for your approval");
           toast.error("Please provide a comment for your approval");
    return;
  }
  const level = getApproveLevel();
  if (formData.Status_Label == 'Approved') {
               toast.error("No pending approval for this record");
    return;
  }
  try {
    const employeeId = Number(id);
    const approvalResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsApprobals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          Employee_ID: employeeId,
          Approve_Level: String(user?.roles), //erik
          Approve_Status: 3,
          Approve_Email_Address_Business: user?.email,
          Approve_Comment: approvalComment
        }),
      }
    );

    if (!approvalResponse.ok) {
      throw new Error("Error saving approval");
    }
    navigate("/approvals");
  } catch (error) {
    console.error("Error approving:", error);
    toast.error("Error saving approval");
  }
};

  const getYearsInRole = (promotionYear: string) => {
    if (!promotionYear) return "";
    const currentYear = new Date().getFullYear();
    const years = currentYear - parseInt(promotionYear);
    return years === 1
      ? "1 year in role"
      : `${years} years in role`;
  };
  
  // Calculate overall status based on deputy and CPPP status
  const getOverallStatus = () => {
    if (formData.Status_Label === "CPPP and Deputy Rejected")
      return "CPPP and Deputy Rejected";
    if (formData.Status_Label === "CPPP Rejected")
      return "CPPP Rejected";
    if (formData.Status_Label === "Deputy Rejected")
      return "Deputy Rejected";

    if (formData.Status_Label === "CPPP and Deputy returned to review")
      return "CPPP and Deputy returned to review";
    if (formData.Status_Label === "CPPP returned to review")
      return "CPPP returned to review";
    if (formData.Status_Label === "Deputy returned to review")
      return "Deputy returned to review";



    if (formData.Status_Label === "Pending") //erik
      return "Pending";
    if (formData.Status_Label === "CPPP Pending")
      return "CPPP Pending";
    if (formData.Status_Label === "Deputy Pending")
      return "Deputy Pending";
    if (formData.Status_Label === "Draft")
      return "Draft";
    if (formData.Status_Label === "Approved")
      return "Approved";
    return "";
  };
//By Isaac
const getApproveLevel = () => {
  if (formData.deputyStatus === "Pending") {
    return "CPPP";
  }

  if (
    formData.deputyStatus === "Pre-approved" &&
    (formData.cpppStatus === "Pending" || formData.cpppStatus === "Ready")
  ) {
    return "Deputy";
  }

  return null;
};

//
  const getQprIcon = (
    rating: string,
    size: string = "w-3 h-3",
  ) => {
    switch (rating) {
      case "NC":
        return <X className={size} />;
      case "CIN":
        return <AlertTriangle className={size} />;
      case "AC":
        return <Check className={size} />;
      default:
        return null;
    }
  };

  const getQprPillStyle = (
    rating: string,
    isSelected: boolean,
  ) => {
    if (!isSelected) {
      return "bg-white/50 text-gray-600 border-gray-200/60 hover:bg-gray-50 hover:border-gray-300";
    }

    switch (rating) {
      case "NC":
        return "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-100";
      case "CIN":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100";
      case "AC":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-100";
      default:
        return "bg-white/50 text-gray-600 border-gray-200/60";
    }
  };

  const renderProgressBar = (label: string, value: string) => {
    const percentage = parseInt(value) || 0;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[12px]">
          <span
            className="text-black"
            style={{ letterSpacing: "0.01em" }}
          >
            {label}
          </span>
          <span className="text-gray-900 font-medium">
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00338D] to-[#1E49E2] rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
  <div
    className="min-h-screen overflow-x-hidden relative"
    style={{
      backgroundColor: "#f4f7fb",
      backgroundImage: `
        radial-gradient(900px 400px at 0% 20%, rgba(30, 73, 226, 0.10), transparent 70%),
        radial-gradient(800px 350px at 100% 60%, rgba(114, 19, 234, 0.08), transparent 70%),
        radial-gradient(700px 300px at 50% 100%, rgba(0, 51, 141, 0.06), transparent 70%),

        repeating-linear-gradient(
          110deg,
          rgba(0, 51, 141, 0.035) 0px,
          rgba(0, 51, 141, 0.035) 2px,
          transparent 2px,
          transparent 50px
        ),

        linear-gradient(180deg, #f8faff 0%, #eef3ff 100%)
      `,
      backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat, no-repeat",
      backgroundSize: "auto, auto, auto, auto, auto",
    }}
  >
    <div
      className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm px-8 py-6"
      style={{ borderBottomColor: "rgba(30, 73, 226, 0.08)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <h1
          className="text-xl font-regular text-[#1E49E2]/80 cursor-pointer"
          style={{
            letterSpacing: "0.08em",
            lineHeight: "1.2",
            textShadow: "0 1px 1px rgba(30, 73, 226, 0.08)",
          }}
          onClick={() => navigate("/credentials")}
        >
          Credentials
        </h1>
      </div>
    </div>

    <div className="px-8 py-8 relative z-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {isNew && !selectedEqcrId ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="eqcrSelect" className="text-[12px] text-gray-600">
                Select EQCR
              </Label>

              <SearchableSelect
                id="eqcrSelect"
                value={selectedEqcrId}
                onChange={handleEqcrSelect}
                options={[
                  ...colabsOptions,
                  {
                    value: "create-new",
                    label: "➕ Create new EQCR",
                  },
                ]}
                placeholder="Search for an EQCR or create new..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="space-y-2">
                  <div>
                    <h2
                      className="text-[20px] font-medium text-[#00338D]"
                      style={{
                        letterSpacing: "0.01em",
                        lineHeight: "1.25",
                      }}
                    >
                      {formData.name}
                    </h2>

                    <p
                      className="text-[13px] text-[#5A6B8A]"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      <span className="text-[#1E49E2] font-medium">
                        {formData.localJobLevel}
                      </span>

                      {formData.promotionYear &&
                        ` • ${getYearsInRole(formData.promotionYear)}`}
                    </p>
                  </div>
                </div>

                {(formData.bu || formData.office) && (
                  <div className="flex items-center gap-2 text-xs">
                    {formData.bu && (
                      <span
                        className="text-[#00338D] font-medium"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        {formData.bu}
                      </span>
                    )}

                    {formData.bu && formData.office && (
                      <span className="text-[#C7D2E5]">•</span>
                    )}

                    {formData.office && (
                      <span
                        className="text-[#7B8CA8]"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        {formData.office}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isNew && (
                <div className="flex items-end">
                  <span className="px-4 py-1.5 rounded-md text-xs font-medium text-white bg-gradient-to-r from-[#00338d] to-[#1E49E2] shadow-sm">
                    {getOverallStatus()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {(!isNew || selectedEqcrId) && (
          <>
            {!isNew && (
              <div className="space-y-4">
                <h3
                  className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                  style={{ letterSpacing: "0.03em" }}
                >
                  Basic Information
                </h3>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      disabled={isApprovalMode}
                      id="memberFirm"
                      checked={formData.memberFirm}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          memberFirm: checked as boolean,
                        })
                      }
                    />

                    <Label
                      htmlFor="memberFirm"
                      className={cn(
                        "text-[12px] font-normal cursor-pointer transition-colors",
                        formData.memberFirm ? "text-[#00338D]" : "text-[#9AA8C7]",
                      )}
                    >
                      Member Firm
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      disabled={isApprovalMode}
                      id="assistant"
                      checked={formData.assistant}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          assistant: checked as boolean,
                        })
                      }
                    />

                    <Label
                      htmlFor="assistant"
                      className={cn(
                        "text-[12px] font-normal cursor-pointer transition-colors",
                        formData.assistant ? "text-[#00338D]" : "text-[#9AA8C7]",
                      )}
                    >
                      Assistant
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3
                className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                style={{ letterSpacing: "0.03em" }}
              >
                Auditing Standards & Framework Curricula
              </h3>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60 space-y-4">
                {renderProgressBar("AICPA", formData.aicpa)}
                {renderProgressBar("PCAOB", formData.pcaob)}
                {renderProgressBar("ICFR", formData.icfr)}
                {renderProgressBar("SEC", formData.sec)}
                {renderProgressBar("IFRS", formData.ifrs)}
                {renderProgressBar("US GAAP", formData.usGaap)}

                <div className="pt-2">
                  <Label htmlFor="otherTrainings" className="text-[12px] text-gray-600">
                    Other trainings (comments)
                  </Label>

                  <Input
                    disabled={isApprovalMode}
                    id="otherTrainings"
                    value={formData.other}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        other: e.target.value,
                      })
                    }
                    className="mt-1.5 border-gray-300/60"
                    placeholder="Enter additional training information..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Label
                    htmlFor="industryExperience"
                    className="text-[12px] text-gray-600"
                  >
                    Industry Experience
                  </Label>

                  <Input
                    disabled={isApprovalMode}
                    id="industryExperience"
                    value={formData.industryExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        industryExperience: e.target.value,
                      })
                    }
                    className="mt-1.5 border-gray-300/60"
                    placeholder="e.g. Financial Services, Technology, Manufacturing"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3
                className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                style={{ letterSpacing: "0.03em" }}
              >
                QPR Results
              </h3>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
                <div className="flex items-start gap-6 flex-wrap">
                  {["2024", "2025", "2026"].map((year) => {
                    const key = `qpr${year}` as keyof typeof formData;
                    const value = formData[key] as string;

                    return (
                      <div key={year} className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {year}
                        </span>

                        <div className="inline-flex items-center gap-1 p-1 bg-gray-50/50 rounded-lg border border-gray-200/40">
                          {["NC", "CIN", "AC"].map((rating) => (
                            <button
                              disabled={isApprovalMode}
                              key={rating}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  [key]: value === rating ? "" : rating,
                                })
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all",
                                getQprPillStyle(rating, value === rating),
                              )}
                            >
                              {getQprIcon(rating, "w-3.5 h-3.5")}
                                   {/*{rating} esta linea estaba cuando era AC */}
                               {rating === "AC" ? "C" : rating}  {/*esta linea se agrego para cambiar en la interfaz de AC a C */}                        
                          </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3
                className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                style={{ letterSpacing: "0.03em" }}
              >
                Evaluation & Compliance
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ncEvaluation" className="text-[12px] text-gray-600">
                    NC evaluation: nature, severity, and impact
                  </Label>

                  <textarea
                    disabled={isApprovalMode}
                    id="ncEvaluation"
                    value={formData.ncEvaluation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ncEvaluation: e.target.value,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[80px]"
                    placeholder="Describe nature, severity, and impact..."
                  />
                </div>

                <div>
                  <Label
                    htmlFor="pcaobInspection"
                    className="text-[12px] text-gray-600"
                  >
                    PCAOB inspection results evaluation
                  </Label>

                  <textarea
                    disabled={isApprovalMode}
                    id="pcaobInspection"
                    value={formData.pcaobInspection}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pcaobInspection: e.target.value,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[80px]"
                    placeholder="Describe PCAOB inspection results..."
                  />
                </div>

                <div className="mt-4">
                  <Label
                    htmlFor="independenceComments"
                    className="text-[12px] text-gray-600"
                  >
                    Independence and risk compliance documentation
                  </Label>

                  <textarea
                    id="independenceComments"
                    disabled={isApprovalMode}
                    value={formData.independenceComments}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        independenceComments: e.target.value,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[80px]"
                    placeholder="Enter comments..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    disabled={isApprovalMode}
                    id="understandingResponsibilities"
                    checked={formData.understandingResponsibilities}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        understandingResponsibilities: checked as boolean,
                      })
                    }
                  />

                  <Label
                    htmlFor="understandingResponsibilities"
                    className={cn(
                      "text-[12px] font-normal cursor-pointer transition-colors",
                      formData.understandingResponsibilities
                        ? "text-[#00338D]"
                        : "text-[#9AA8C7]",
                    )}
                  >
                    Understanding of EQCR responsibilities
                  </Label>
                </div>
              </div>
            </div>

            {!!formData?.deputyComments?.trim() && (
              <div className="space-y-4">
                <h3
                  className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                  style={{ letterSpacing: "0.03em" }}
                >
                  Deputy Comments
                </h3>

                {(formData.deputy === 1) || (formData.deputy === 3) ? // 'Approved' || formData.Status_Label === 'CPPP Pending' || formData.Status_Label === 'Deputy Rejected' || formData.Status_Label === 'CPPP Rejected'
                <div className="bg-grey/150 backdrop-blur-sm rounded-lg p-5 border border-black-200/60">
                        <p className="text-[12px] text-black whitespace-pre-line">
                  {(formData.deputy === 1) //(formData.Status_Label === 'Approved' || formData.Status_Label === 'CPPP Pending' || formData.Status_Label === 'CPPP Rejected') 
                  ? `He revisado la información del(la) socio(a) / el(la) director(a), confirmando que:
• Es un socio(a) y/o director(a) que tiene la autoridad para actuar como un socio a cargo de una auditoría,
• Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,
• Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma,
• Tiene un entendimiento de las responsabilidades de un EQCR al desempeñar y documentar una revisión como EQCR.
He revisado los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICF´s identificadas, cuando existieron, y el impacto de estas en el desempeño de su función como EQCR.
He revisado los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificados, cuando existieron, y el impacto de estos en el desempeño de su función como EQCR.
Asimismo, he considerado otros indicadores de cumplimiento como los resultados de auditorías de independencia, cumplimiento con el, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR.`
: (formData.deputy === 3) ? `Considerando la información evaluada concluyo que el(la) socio(a) / el(la) director(a) no es elegible para ser acreditado(a) como EQCR.` : ""}
                </p>
                </div>: <div></div> }

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
                  <p className="text-[12px] text-black">
                    {formData.deputyComments || "Deputy Pending."}
                  </p>
                </div>
              </div>
            )}

            {!!formData?.bupppComments?.trim() && (
              <div className="space-y-4">
                <h3
                  className="text-[13px] font-medium text-[#1E49E2] capitalize tracking-wider"
                  style={{ letterSpacing: "0.03em" }}
                >
                  CPPP Comments
                </h3>

                {(formData.cppp === 1) || (formData.cppp === 3) ?
                <div className="bg-grey/150 backdrop-blur-sm rounded-lg p-5 border border-black-200/60">
                        <p className="text-[12px] text-black whitespace-pre-line">
                  {(formData.cppp === 1) ? `He revisado la información del(la) socio(a) / el(la) director(a), confirmando que:
• Es un socio(a) y/o director(a) que tiene la autoridad para actuar como un socio a cargo de una auditoría,
• Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,
• Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma,
• Tiene un entendimiento de las responsabilidades de un EQCR al desempeñar y documentar una revisión como EQCR.
He revisado los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICF´s identificadas, cuando existieron, y el impacto de estas en el desempeño de su función como EQCR.
He revisado los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificados, cuando existieron, y el impacto de estos en el desempeño de su función como EQCR.
Asimismo, he considerado otros indicadores de cumplimiento como los resultados de auditorías de independencia, cumplimiento con Sentinel, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR.
Considerando lo anterior concluyo que el(la) socio(a) / el(la) director(a) es aprobado(a) para ser acreditado(a) como EQCR.`
: (formData.cppp === 3) ? `Considerando la información evaluada concluyo que el(la) socio(a) / el(la) director(a) no es elegible para ser acreditado(a) como EQCR.` : ""}
                </p>
                </div>: <div></div>}

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
                  <p className="text-[12px] text-black">
                    {formData.bupppComments || "CPPP Pending."}
                  </p>
                </div>
              </div>
            )}

            {isApprovalMode &&
              (() => {
                if (formData.Status_Label === "Approved") {
                  return (
                    <div className="space-y-4 pt-8 mt-8 border-t border-gray-200/70">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-gray-200/60">
                        <p className="text-[12px] text-black">
                          This record has already been approved.
                        </p>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleCancel}
                          className="text-gray-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                }

                const isDeputyStage = formData.Status_Label === "Deputy Pending";

                const deputyApprovalText = `He revisado la información del(la) socio(a) / el(la) director(a), confirmando que:
• Es un socio(a) y/o director(a) que tiene la autoridad para actuar como un socio a cargo de una auditoría,
• Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,
• Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma,
• Tiene un entendimiento de las responsabilidades de un EQCR al desempeñar y documentar una revisión como EQCR.
He revisado los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICF´s identificadas, cuando existieron, y el impacto de estas en el desempeño de su función como EQCR.
He revisado los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificados, cuando existieron, y el impacto de estos en el desempeño de su función como EQCR.
Asimismo, he considerado otros indicadores de cumplimiento como los resultados de auditorías de independencia, cumplimiento con el, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR.`;

                const cpppApprovalText = `He revisado la información del(la) socio(a) / el(la) director(a), confirmando que:
• Es un socio(a) y/o director(a) que tiene la autoridad para actuar como un socio a cargo de una auditoría,
• Tiene una experiencia mínima de 2 años como socio(a) y/o director(a) de auditoría,
• Ha completado el entrenamiento global requerido y específico de EQCR, así como el entrenamiento anual requerido por la firma,
• Tiene un entendimiento de las responsabilidades de un EQCR al desempeñar y documentar una revisión como EQCR.
He revisado los resultados de su revisión de QPR de los últimos 3 años; así como la naturaleza y severidad de las ICF´s identificadas, cuando existieron, y el impacto de estas en el desempeño de su función como EQCR.
He revisado los resultados de la última inspección externa; así como la naturaleza y severidad de los comentarios identificados, cuando existieron, y el impacto de estos en el desempeño de su función como EQCR.
Asimismo, he considerado otros indicadores de cumplimiento como los resultados de auditorías de independencia, cumplimiento con Sentinel, CEAC, políticas y procedimientos; y cuando han existido incidencias he evaluado el impacto de estas en el desempeño de su función como EQCR.
Considerando lo anterior concluyo que el(la) socio(a) / el(la) director(a) es aprobado(a) para ser acreditado(a) como EQCR.`;

                const approvalText = isDeputyStage
                  ? deputyApprovalText
                  : cpppApprovalText;

                return (
                  <div className="space-y-5 pt-8 mt-8 border-t border-gray-200/70">
                    <h3
                      className="text-[13px] font-medium text-[#1E49E2] tracking-wider"
                      style={{ letterSpacing: "0.03em" }}
                    >
                      Approval Decision
                    </h3>

                    {selectedDecision && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                          <p className="text-[12px] font-medium text-gray-800">
                            {selectedDecision === "return" && "Return for review"}
                            {selectedDecision === "reject" && "Rejection"}
                            {selectedDecision === "approve" && "Approval"}
                          </p>
                        </div>

                        <div className="px-5 py-4 space-y-4">
                          {selectedDecision === "return" && (
                            <>
                              <p className="text-[12px] text-[#7B8CA8] leading-relaxed">
                                Please add the comments required for the
                                information to be reviewed or updated before a
                                final decision is made.
                              </p>

                              <div>
                                <Label
                                  htmlFor="decisionComment"
                                  className="text-[12px] text-gray-600 block mb-1.5"
                                >
                                  Review comments{" "}
                                  <span className="text-rose-500">*</span>
                                </Label>

                                <textarea
                                  id="decisionComment"
                                  disabled={!canApprove}
                                  value={approvalComment}
                                  onChange={(e) =>
                                    setApprovalComment(e.target.value)
                                  }
                                  placeholder="Enter your review comments..."
                                  className="w-full px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[90px] resize-y"
                                />
                              </div>
                            </>
                          )}

                          {selectedDecision === "reject" && (
                            <>
                              <p className="text-[12px] text-gray-700 leading-relaxed italic border-l-2 border-rose-200 pl-3">
                                Considerando la información evaluada concluyo
                                que el(la) socio(a) / el(la) director(a) no es
                                elegible para ser acreditado(a) como EQCR.
                              </p>

                              <div>
                                <Label
                                  htmlFor="decisionComment"
                                  className="text-[12px] text-gray-600 block mb-1.5"
                                >
                                  Comments{" "}
                                  <span className="text-rose-500">*</span>
                                </Label>

                                <textarea
                                  id="decisionComment"
                                  disabled={!canApprove}
                                  value={approvalComment}
                                  onChange={(e) =>
                                    setApprovalComment(e.target.value)
                                  }
                                  placeholder="Enter your rejection comments..."
                                  className="w-full px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[90px] resize-y"
                                />
                              </div>
                            </>
                          )}

                          {selectedDecision === "approve" && (
                            <>
                              <div className="text-[12px] text-gray-700 leading-relaxed space-y-1 border-l-2 border-[#1E49E2]/20 pl-3">
                                {renderCertText(approvalText)}
                              </div>

                              <div>
                                <Label
                                  htmlFor="decisionComment"
                                  className="text-[12px] text-gray-600 block mb-1.5"
                                >
                                  Comments{" "}
                                  <span className="text-rose-500">*</span>
                                </Label>

                                <textarea
                                  id="decisionComment"
                                  disabled={!canApprove}
                                  value={approvalComment}
                                  onChange={(e) =>
                                    setApprovalComment(e.target.value)
                                  }
                                  placeholder="Enter your approval comments..."
                                  className="w-full px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 min-h-[90px] resize-y"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-3.5 py-1.5 text-[12px] text-gray-500 hover:text-gray-700 rounded-md transition-colors hover:bg-gray-100/60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!canApprove}
                        onClick={() => handleDecisionSelect("return")}
                        className={cn(
                          "px-3.5 py-1.5 text-[12px] rounded-md border transition-all",
                          !canApprove
                            ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 bg-gray-50"
                            : selectedDecision === "return"
                              ? "border-amber-400 text-amber-700 bg-amber-50 shadow-sm"
                              : "border-gray-300 text-gray-600 bg-white hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/40",
                        )}
                      >
                        Return
                      </button>

                      <button
                        type="button"
                        disabled={!canApprove}
                        onClick={() => handleDecisionSelect("reject")}
                        className={cn(
                          "px-3.5 py-1.5 text-[12px] rounded-md border transition-all",
                          !canApprove
                            ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 bg-gray-50"
                            : selectedDecision === "reject"
                              ? "border-rose-400 text-rose-700 bg-rose-50 shadow-sm"
                              : "border-gray-300 text-gray-600 bg-white hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/40",
                        )}
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={!canApprove}
                        onClick={() => handleDecisionSelect("approve")}
                        className={cn(
                          "px-3.5 py-1.5 text-[12px] rounded-md border transition-all",
                          !canApprove
                            ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 bg-gray-50"
                            : selectedDecision === "approve"
                              ? "border-[#00338D] text-[#00338D] bg-[#00338D]/5 shadow-sm"
                              : "border-gray-300 text-gray-600 bg-white hover:border-[#00338D]/50 hover:text-[#00338D] hover:bg-[#00338D]/5",
                        )}
                      >
                        Approve
                      </button>

                      {selectedDecision && (
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedDecision === "return") {
                              handleReturn();
                            }

                            if (selectedDecision === "reject") {
                              handleReject();
                            }

                            if (selectedDecision === "approve") {
                              handleApprove();
                            }
                          }}
                          disabled={!canApprove || !approvalComment.trim()}
                          className={cn(
                            "px-4 py-1.5 text-[12px] rounded-md text-white transition-all ml-1",
                            !canApprove || !approvalComment.trim()
                              ? "bg-gray-300 cursor-not-allowed"
                              : selectedDecision === "reject"
                                ? "bg-rose-600 hover:bg-rose-700 shadow-sm"
                                : selectedDecision === "approve"
                                  ? "bg-[#00338D] hover:bg-[#0044b8] shadow-sm"
                                  : "bg-amber-600 hover:bg-amber-700 shadow-sm",
                          )}
                        >
                          {selectedDecision === "return" && "Confirm Return"}
                          {selectedDecision === "reject" && "Confirm Rejection"}
                          {selectedDecision === "approve" && "Confirm Approval"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

            {!isApprovalMode && (
              <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-gray-600"
                >
                  Cancel
                </Button>

                {formData?.Status_Label !== "Approved" && (
                  <>
                    <Button
                      type="submit"
                      variant="outline"
                      onClick={handleSubmitDraft}
                      className="border-gray-300 text-gray-900"
                    >
                      <Save className="w-4 h-4 mr-1.5" />
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSaveAndSend}
                      className="bg-[#00338D] text-white hover:bg-[#0055B8]"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Save & Send
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </form>

      {showNewEqcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New EQCR
              </h3>

              <button
                type="button"
                onClick={handleCancelNewEqcr}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-[12px] text-gray-600">
                    First Name *
                  </Label>

                  <Input
                    id="firstName"
                    value={newEqcrData.firstName}
                    onChange={(e) =>
                      setNewEqcrData({
                        ...newEqcrData,
                        firstName: e.target.value,
                      })
                    }
                    className="mt-1.5 border-gray-300/60"
                    placeholder="e.g. John"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-[12px] text-gray-600">
                    Last Name *
                  </Label>

                  <Input
                    id="lastName"
                    value={newEqcrData.lastName}
                    onChange={(e) =>
                      setNewEqcrData({
                        ...newEqcrData,
                        lastName: e.target.value,
                      })
                    }
                    className="mt-1.5 border-gray-300/60"
                    placeholder="e.g. Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="newLocalJobLevel"
                  className="text-[12px] text-gray-600"
                >
                  Job Level *
                </Label>

                <select
                  id="newLocalJobLevel"
                  value={newEqcrData.localJobLevel}
                  onChange={(e) =>
                    setNewEqcrData({
                      ...newEqcrData,
                      localJobLevel: e.target.value,
                    })
                  }
                  className="w-full mt-1.5 px-3 py-2 border border-gray-300/60 rounded-md text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30"
                  required
                >
                  <option value="">Select...</option>

                  {jobLevels.map((j) => (
                    <option key={j.id} value={j.value}>
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="newBu" className="text-[12px] text-gray-600">
                  Business Unit
                </Label>

                <Input
                  id="newBu"
                  value={newEqcrData.bu}
                  onChange={(e) =>
                    setNewEqcrData({
                      ...newEqcrData,
                      bu: e.target.value,
                    })
                  }
                  className="mt-1.5 border-gray-300/60"
                  placeholder="e.g. CIM"
                />
              </div>

              <div>
                <Label htmlFor="newOffice" className="text-[12px] text-gray-600">
                  Office
                </Label>

                <Input
                  id="newOffice"
                  value={newEqcrData.office}
                  onChange={(e) =>
                    setNewEqcrData({
                      ...newEqcrData,
                      office: e.target.value,
                    })
                  }
                  className="mt-1.5 border-gray-300/60"
                  placeholder="e.g. Ciudad de México"
                />
              </div>

              <div>
                <Label
                  htmlFor="newPromotionYear"
                  className="text-[12px] text-gray-600"
                >
                  Promotion Year
                </Label>

                <Input
                  id="newPromotionYear"
                  type="number"
                  value={newEqcrData.promotionYear}
                  onChange={(e) =>
                    setNewEqcrData({
                      ...newEqcrData,
                      promotionYear: e.target.value,
                    })
                  }
                  className="mt-1.5 border-gray-300/60"
                  placeholder="e.g. 2018"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelNewEqcr}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCreateNewEqcr}
                className="bg-[#00338D] text-white hover:bg-[#0055B8]"
                disabled={
                  !newEqcrData.firstName ||
                  !newEqcrData.lastName ||
                  !newEqcrData.localJobLevel
                }
              >
                <Check className="w-4 h-4 mr-1.5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}