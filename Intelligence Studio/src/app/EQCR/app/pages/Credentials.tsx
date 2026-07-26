import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { FilterBar } from "../components/ui/FilterBar";
import { FilterSelect } from "../components/ui/FilterSelect";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { StatusBadge } from "../components/ui/StatusBadge";
import PageBackground from "../components/assignments/PageBackground";
import { authApi, Claims } from "../../app/API/authApi";//By Isaac

import { BuOfficeApi, BUOption, OfficeOption } from "../API/BuOfficeApi";
import { toast } from "sonner";
import { Security } from "../../app/API/security";
export default function Credentials() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: "",
    localJobLevel: "",
    bu: "",
    Status_Label: "",
    Deputy: "",
    CPPP: "",
    office: "",
    status: "Progress",
  });

  const [buOptions, setBuOptions] = useState<BUOption[]>([]);
  const [officeOptions, setOfficeOptions] = useState<OfficeOption[]>([]);
  const [allData, setAllData] = useState([]);
  const [eqcrProfiles, setEqcrProfiles] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await BuOfficeApi.list();
        setAllData(rows);
        const unique = new Map<number, BUOption>();
        rows.forEach((r) => {
          if (!unique.has(r.BU_ID)) {
            unique.set(r.BU_ID, {
              id: r.BU_ID,
              value: r.BU_Desc,
              label: r.BU_Desc,
            });
          }
        });
        setBuOptions(Array.from(unique.values()));
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const handleBUChange = (val: string) => {
    setFilters({ ...filters, bu: val, office: "" });

    const selectedBU = buOptions.find((b) => b.value === val);

    if (!selectedBU) {
      setOfficeOptions([]);
      return;
    }

    const filtered = allData
      .filter((r) => r.BU_ID === selectedBU.id)
      .map((r) => ({
        id: r.Office_ID,
        value: r.Office_Desc,
        label: r.Office_Desc,
      }));

    setOfficeOptions(filtered);
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching credentials");
        }

        const data = await response.json();

        const currentYear = new Date().getFullYear();

        const mapped = data.map((item: any) => ({
          credentialId: Number(item.EMT_Credent_PK),//este es para los metodos post
          id: Number(item.Employee_ID),//este es para UI ambos son importantes
          name: item.Full_Name,
          localJobLevel: item.Local_Job_Level_Name,
          promotionYear: (
            currentYear - Math.floor(item.Years_In_Role)
          ).toString(),
          bu: item.BU,
          office: item.Location_Name,
          Status_Label: item.Status_Label,
          Deputy: item.Deputy,
          CPPP: item.CPPP,
          deputyStatus: item.Deputy ? "Pre-approved" : "Pending",
        }));

        setEqcrProfiles(mapped);
      } catch (error) {
        console.error("Error loading credentials:", error);
      }
    };

    loadCredentials();
  }, []);

  const getYearsInRole = (promotionYear: string) => {
    const currentYear = new Date().getFullYear();
    const years = currentYear - parseInt(promotionYear);
    return years === 1 ? "1 year" : `${years} years`;
  };

  const getCpppStatus = (deputyStatus: string, id: number) => {
    if (deputyStatus === "Draft") return "Draft";
    if (deputyStatus === "CPPP and Deputy Rejected") return "CPPP and Deputy Rejected";
    if (deputyStatus === "Deputy Rejected") return "Deputy Rejected";
    if (deputyStatus === "CPPP Rejected") return "CPPP Rejected";

    if (deputyStatus === "CPPP and Deputy returned to review") return "CPPP and Deputy returned to review";
    if (deputyStatus === "CPPP returned to review") return "CPPP returned to review";
    if (deputyStatus === "Deputy returned to review") return "Deputy returned to review";
    
    if (deputyStatus === "Approved") return "Approved";

    if (deputyStatus === "CPPP Pending") return "CPPP Pending";
    if (deputyStatus === "Deputy Pending") return "Deputy Pending";
    if (deputyStatus === "Draft") return "Draft";
    
    if (deputyStatus === "Pending") return "Pending";
    
  };
//BY Isaac
const [user, setUser] = useState<any>(null);

useEffect(() => {
  authApi.getClaims()
    .then(setUser)
    .catch(console.error);
}, []);
//

  const getOverallStatus = (deputyStatus: string, cpppStatus: string) => {
    if (cpppStatus === "Draft") return "Draft";
    if (cpppStatus === "CPPP and Deputy Rejected") return "CPPP and Deputy Rejected";
    if (cpppStatus === "Deputy Rejected") return "Deputy Rejected";
    if (cpppStatus === "CPPP Rejected") return "CPPP Rejected";
    if (cpppStatus === "Deputy Pending") return "Deputy Pending";
    if (cpppStatus === "CPPP Pending") return "CPPP Pending";

    if (cpppStatus === "CPPP and Deputy returned to review") return "CPPP and Deputy returned to review";
    if (cpppStatus === "CPPP returned to review") return "CPPP returned to review";
    if (cpppStatus === "Deputy returned to review") return "Deputy returned to review";
    if (cpppStatus === "Draft") return "Draft";
    
    if (cpppStatus === "Pending") return "Pending";
    if (cpppStatus === "Approved") return "Approved";
    
    //return "Approved";
  };

  const getNormalizedStatus = (eqcr: any) => {
    const cpppStatus = getCpppStatus(eqcr.Status_Label, eqcr.id);
    const overallStatus = getOverallStatus(eqcr.Status_Label, eqcr.Status_Label);
    if (overallStatus === "CPPP and Deputy returned to review")
      return "Progress";
    if (overallStatus === "CPPP returned to review")
      return "Progress";
    if (overallStatus === "Deputy returned to review")
      return "Progress";
    
    if (overallStatus === "CPPP and Deputy Rejected")
      return "Rejected";
    if (overallStatus === "CPPP Rejected")
      return "Rejected";
    if (overallStatus === "Deputy Rejected")
      return "Rejected";

    if (overallStatus === "CPPP Pending")
      return "Pending";
    if (overallStatus === "Deputy Pending")
      return "Pending";

    if (overallStatus === "Draft")
      return "Progress";
    if (overallStatus === "Approved")
      return "Approved";
    if (overallStatus === "Pending") //erik
      return "Progress";
  };

  const filteredProfiles = eqcrProfiles.filter((eqcr) => {
    if (
      filters.name &&
      !eqcr.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.localJobLevel &&
      eqcr.localJobLevel !== filters.localJobLevel
    ) {
      return false;
    }

    if (filters.bu && eqcr.bu !== filters.bu) {
      return false;
    }

    if (filters.office && eqcr.office !== filters.office) {
      return false;
    }

    if (filters.status) {
      const normalizedStatus = getNormalizedStatus(eqcr);
      if (normalizedStatus !== filters.status) return false;
    }

    return true;
  });

  const handleCardClick = (eqcr: any) => {
    navigate(`/credentials/eqcr/${eqcr.id}`);
  };

  const handleNewEqcrClick = () => {
    navigate("/credentials/eqcr/new");
  };

const handleDelete = async (
  e: React.MouseEvent,
  employeeId: number,
  eqcrName: string
) => {
  e.stopPropagation();

  toast(`Delete ${eqcrName}?`, {
    description: "This action cannot be undone",
    action: {
      label: "Delete",
      onClick: async () => {
        try {
          if (!employeeId) {
            toast.error("Invalid Employee ID");
            return;
          }

          const payload = {
            Employee_ID: employeeId,
            Created_By: String(user?.email),
          };

          const response = await fetch(
            `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Credentials/delete`,
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
            throw new Error(errorText);
          }

          setEqcrProfiles((prev) =>
            prev.filter((p) => p.id !== employeeId)
          );

          toast.success(`${eqcrName} deleted successfully`);
        } catch (error) {
          console.error("Error deleting record:", error);
          toast.error("Error deleting record");
        }
      },
    },
  });
};
//para seguridad
/*if (!user) return <div>Cargando...</div>;

if (user.NO_ACCESS) {
  return <div>NO ACCESS</div>;
}

const roles = user.roles || [];

const canViewCredentials =
  roles.includes("All") ||
  roles.includes("CPPP") ||
  roles.includes("Deputy") ||
  roles.includes("Team");

if (!canViewCredentials) {
  return <div>NO ACCESS</div>;
}*/
//
if (!user) return <div>Cargando...</div>;

if (!Security.canAccess(user, "CREDENTIALS")) {
  return <div>NO ACCESS</div>;
}

  return (
    <PageBackground>
      {/* Page Header */}
      <div
        className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm px-8 py-6"
        style={{ borderBottomColor: "rgba(30, 73, 226, 0.08)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <h1
            className="text-xl font-regular text-[#1E49E2]/80"
            style={{
              letterSpacing: "0.08em",
              lineHeight: "1.2",
              textShadow: "0 1px 1px rgba(30, 73, 226, 0.08)",
            }}
          >
            Credentials
          </h1>
        </div>
      </div>

      <div className="px-8 py-8 relative z-10">
        <FilterBar>
          <input
            type="text"
            placeholder="Search"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-[12px] font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
          />

          <SegmentedControl
            value={filters.localJobLevel}
            onChange={(val) =>
              setFilters({ ...filters, localJobLevel: val })
            }
            options={[
              { value: "", label: "All" },
              { value: "Partner", label: "Partner" },
              { value: "Director", label: "Director" },
              { value: "Senior Manager", label: "EQCR Assistant" },
            ]}
          />

          <FilterSelect
            value={filters.bu}
            onChange={handleBUChange}
            options={[
              { value: "", label: "BU" },
              ...buOptions.map((b) => ({
                value: b.value,
                label: b.label,
              })),
            ]}
          />

          <FilterSelect
            value={filters.office}
            onChange={(val) => setFilters({ ...filters, office: val })}
            options={[
              { value: "", label: "Office" },
              ...officeOptions.map((o) => ({
                value: o.value,
                label: o.label,
              })),
            ]}
          />

          <SegmentedControl
            value={filters.status}
            onChange={(val) => setFilters({ ...filters, status: val })}
            options={[
              { value: "", label: "All" },
              { value: "Progress", label: "Progress" },
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
              
            ]}
          />

          <div className="flex-1" />

          <Button
            onClick={handleNewEqcrClick}
            variant="outline"
            className="border-gray-300 text-[#00338d] hover:bg-gray-50 text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New EQCR
          </Button>
        </FilterBar>

        {/* EQCR Profiles List */}
        <div className="space-y-3">
          {filteredProfiles.map((eqcr) => {
            const cpppStatus = getCpppStatus(eqcr.deputyStatus, eqcr.id);
            const yearsInRole = getYearsInRole(eqcr.promotionYear);
            const status =
              eqcr.deputyStatus === "Draft"
                ? "Draft"
                : eqcr.deputyStatus === "Pending"
                ? "Pending Deputy"
                : cpppStatus === "Pending"
                ? "Pending CPPP"
                : "Approved";

            return (
              <div
                key={eqcr.id}
                className="relative p-4 bg-white rounded-xl border border-[#E4ECFF] hover:border-[#1E49E2] hover:shadow-md hover:bg-white transition-all cursor-pointer group"
                onClick={() => handleCardClick(eqcr)}
              >               
              <button
                onClick={(e) =>
                  handleDelete(e, eqcr.id, eqcr.name)
                }
                className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
                aria-label="Delete credential"
              >
                <Trash2 className="w-4 h-4" />
              </button>
                <div className="flex items-center justify-between gap-4 pr-10">
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4
                        className="text-[16px] font-medium text-[#00338d] group-hover:text-[#1E49E2] transition-colors"
                        style={{ letterSpacing: "0.01em", lineHeight: "1.3" }}
                      >
                        {eqcr.name}
                      </h4>
                      <p className="text-sm mt-0.5 text-[#5A6B8A]">
                        <span className="text-[#1E49E2] font-medium">
                          {eqcr.localJobLevel}
                        </span>{" "}
                        • {yearsInRole} in role
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#00266A]/80 font-medium">
                        {eqcr.bu}
                      </span>
                      <span className="text-[#C7D2E5]">•</span>
                      <span className="text-[#7B8CA8]">{eqcr.office}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <StatusBadge status={eqcr.Status_Label} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p
              className="text-sm"
              style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
            >
              No EQCR profiles match your filters
            </p>
            <p
              className="text-xs mt-2"
              style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
            >
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </PageBackground>
  );
}