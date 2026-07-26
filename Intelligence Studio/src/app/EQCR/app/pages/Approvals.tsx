import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Security } from "../../app/API/security";
import { authApi, Claims } from "../../app/API/authApi";//By Isaac

export default function Approvals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"eqcr" | "assignments">("eqcr");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [groupBy, setGroupBy] = useState<"eqcr" | "client">("eqcr");
//BY Isaac
const [user, setUser] = useState<any>(null);

useEffect(() => {
  authApi.getClaims()
    .then(setUser)
    .catch(console.error);
}, []);
//

  // By Isaac
  const [eqcrApprovals, setEqcrApprovals] = useState<any[]>([]);

  useEffect(() => {
    const loadEQCR = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/Ready`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Error fetching EQCR approvals");
        }

        const data = await response.json();

        const mapped = data.map((item: any) => {
          const currentYear = new Date().getFullYear();

          return {
            id: item.Employee_ID,
            name: item.Full_Name,
            localJobLevel: item.Local_Job_Level_Name,
            promotionYear: (
              currentYear - Math.floor(item.Years_In_Role)
            ).toString(),
            bu: item.BU,
            office: item.Location_Name,
            Status_Label: item.Status_Label,            
            deputyStatus: item.Deputy === 1 //? "Approved" : "Pending",
              ? "Approved"
              : item.Deputy === 3
              ? "Pending"
              : item.Deputy === 4
              ? "Pending"
              : "Pending", //item.Deputy === 1 ? "Approved" : "Pending",
            cpppStatus: item.CPPP === 1 && item.Deputy === 1//? "Approved" : "Pending",
              ? "Approved"
              : item.CPPP === 3 && item.Deputy === 1
              ? "Pending"
              : item.CPPP === 4 && item.Deputy === 1
              ? "Pending"
              : item.Deputy === 1
              ? "Pending"
              : "NA", //item.CPPP === 1 ? "Approved" : "Pending",
   

          };
        });

        setEqcrApprovals(mapped);
      } catch (error) {
        console.error("Error loading EQCR:", error);
      }
    };

    loadEQCR();
  }, []);
  const [assignmentApprovals, setAssignmentApprovals] = useState<any[]>([]);
  useEffect(() => {
  const loadAssignments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsGenerated/getAssignmentsApprovals`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching assignments");
      }

      const data = await response.json();

      const mapped = data.map((item: any) => ({
        id: item.EMT_AssiGene_PK,
        engagementName: item.Engagement_Name,
        entity: item.Entity_Name,
        type: item.Assign_Desc,
        createdBy: item.Created_By,
        createdDate: item.Created?.split("T")[0],

        eqcrName: item.Full_Name,

        statusLabel: item.Status_Label,
        statusId: item.Status_ID,

        deputyStatus:
          item.Status_Label === "Deputy Pending"
            ? "Pending"
            : "Approved",

        cpppStatus:
          item.Status_Label === "CPPP Pending"
            ? "Pending"
            : null,
      }));

      setAssignmentApprovals(mapped);

    } catch (error) {
      console.error("Error loading assignments:", error);
    }
  };

  loadAssignments();
}, []);
/*
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_ActivesApprobals`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Error fetching assignments");
        }

        const data = await response.json();

        console.log("Assignments:", data);
      } catch (error) {
        console.error("Error loading assignments:", error);
      }
    };

    loadAssignments();
  }, []);
*/
  const assignmentGroups = [
  {
    id: 1,
    eqcrName: "Assignments",
    count: assignmentApprovals.length,
    items: assignmentApprovals,
  },
];

  // Group assignments by client name
  const getGroupedByClient = () => {
    const clientGroups: { [key: string]: any } = {};
    let groupIdCounter = 100;

    assignmentGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (!clientGroups[item.entity]) {
          clientGroups[item.entity] = {
            id: groupIdCounter++,
            clientName: item.entity,
            count: 0,
            items: [],
          };
        }
        clientGroups[item.entity].count++;
        clientGroups[item.entity].items.push({
          ...item,
          eqcrName: group.eqcrName,
        });
      });
    });

    return Object.values(clientGroups);
  };

  const displayedAssignmentGroups =
    groupBy === "eqcr" ? assignmentGroups : getGroupedByClient();

  const getYearsInRole = (promotionYear: string) => {
    const currentYear = new Date().getFullYear();
    const years = currentYear - parseInt(promotionYear);
    return years === 1 ? "1 year in role" : `${years} years in role`;
  };


const getStatusLabel = (
  Status_Label: string | null,
): string => {

  if (Status_Label === "CPPP and Deputy Rejected")
    return "Rejected";

  if (Status_Label === "CPPP Rejected")
    return "Rejected";

  if (Status_Label === "Deputy Rejected")
    return "Rejected";

  if (Status_Label === "CPPP Pending")
    return "Pending";

  if (Status_Label === "Deputy Pending")
    return "Pending";

  if (Status_Label === "Approved")
    return "Approved";

  if (Status_Label === "Pending")
    return "Pending";

  return "";
};


  const handleEqcrCardClick = (eqcrId: number) => {
    navigate(`/credentials/eqcr/${eqcrId}?mode=approval`);
  };

  const handleAssignmentCardClick = (assignmentId: number) => {
    navigate(`/assignments/view/${assignmentId}?mode=approval`);
  };

  // Filter EQCR approvals
  const filteredEqcrApprovals = eqcrApprovals.filter((eqcr: any) => {
    // Search filter
    if (
      searchQuery &&
      !eqcr.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !eqcr.localJobLevel.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !eqcr.bu.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !eqcr.office.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    const statusLabel = getStatusLabel(eqcr.Status_Label);
    if (statusFilter === "Pending" && !statusLabel.includes("Pending")) {
      return false;
    }
    if (statusFilter === "Approved" && !statusLabel.includes("Approved")) {
      return false;
    }
    if (statusFilter === "Rejected" && !statusLabel.includes("Rejected")) {
      return false;
    }

    // Role filter
    if (roleFilter === "Deputy" && eqcr.deputyStatus !== "Pending") {
      return false;
    }
    if (roleFilter === "CPPP" && eqcr.cpppStatus !== "Pending") {
      return false;
    }

    return true;
  });

  // Filter assignment groups
  const filteredAssignmentGroups = displayedAssignmentGroups
    .map((group: any) => {
      const filteredItems = group.items.filter((item: any) => {
        // Search filter
        if (
          searchQuery &&
          !item.engagementName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.entity.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(item.eqcrName && item.eqcrName.toLowerCase().includes(searchQuery.toLowerCase())) &&
          !(item.createdBy && item.createdBy.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }

        // Status filter
        const statusLabel = getStatusLabel(item.Status_Label, item.Status_Label);
        if (statusFilter === "Pending" && !statusLabel.includes("Pending")) {
          return false;
        }
        if (statusFilter === "Approved" && !statusLabel.includes("Approved")) {
          return false;
        }
        if (statusFilter === "Rejected" && !statusLabel.includes("Rejected")) {
          return false;
        }

        // Role filter
        if (roleFilter === "Deputy" && item.deputyStatus !== "Pending") {
          return false;
        }
        if (roleFilter === "CPPP" && item.cpppStatus !== "Pending") {
          return false;
        }
        if (roleFilter === "BU Leader") {
          // BU Leader filter - show items that are in BU approval stage
          if (item.deputyStatus === "Pre-approved" || item.cpppStatus) {
            return false;
          }
        }

        return true;
      });

      return {
        ...group,
        items: filteredItems,
        count: filteredItems.length,
      };
    })
    .filter((group: any) => group.count > 0);

if (!user) return <div>Cargando...</div>;

if (!Security.canAccess(user, "APPROVALS")) {
  return <div>NO ACCESS</div>;
}
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
      {/* Page Header with Sub-Navigation */}
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
            Approvals
          </h1>

          {/* Centered Sub-Navigation */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveTab("eqcr");
                setRoleFilter("");
              }}
              className={cn(
                "text-sm font-normal transition-all relative pb-1",
                activeTab === "eqcr"
                  ? "text-[#00338D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
              style={{ letterSpacing: "0.03em" }}
            >
              EQCR
              {activeTab === "eqcr" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("assignments");//comentar para server y bloquear
                setRoleFilter("");
              }}
              className={cn(
                "text-sm font-normal transition-all relative pb-1",
                activeTab === "assignments"
                  ? "text-[#00338D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
              style={{ letterSpacing: "0.03em" }}
            >
              Assignments
              {activeTab === "assignments" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className="px-8 py-8 relative z-10">
        {/* Filters */}
        <div className="mb-6 py-2.5 px-4 bg-[#A5B6F3]/50 rounded-lg border border-gray-200/50">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-sm font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
            />

            {/* Status Toggle */}
            <div className="inline-flex items-center gap-1 p-0.5 bg-white rounded-md border border-gray-200/60">
              <button
                onClick={() => setStatusFilter("")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === ""
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("Pending")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === "Pending"
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("Approved")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === "Approved"
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter("Rejected")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === "Rejected"
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Rejected
              </button>
            </div>

            {/* Role Filter - For EQCR Tab */}
            {activeTab === "eqcr" && (
              <div className="inline-flex items-center gap-1 p-0.5 bg-white rounded-md border border-gray-200/60">
                <button
                  onClick={() => setRoleFilter("")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === ""
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setRoleFilter("Deputy")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === "Deputy"
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  Deputy
                </button>
                <button
                  onClick={() => setRoleFilter("CPPP")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === "CPPP"
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  CPPP
                </button>
              </div>
            )}

            {/* Role Filter - For Assignments Tab */}
            {activeTab === "assignments" && (
              <div className="inline-flex items-center gap-1 p-0.5 bg-white rounded-md border border-gray-200/60">
                <button
                  onClick={() => setRoleFilter("")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === ""
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setRoleFilter("BU Leader")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === "BU Leader"
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  BU Leader
                </button>
                <button
                  onClick={() => setRoleFilter("Deputy")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === "Deputy"
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  Deputy
                </button>
                <button
                  onClick={() => setRoleFilter("CPPP")}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                    roleFilter === "CPPP"
                      ? "bg-blue-50 text-[#00338D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  CPPP
                </button>
              </div>
            )}
            {/* Group By Toggle - Only for Assignments Tab */}
            {activeTab === "assignments" && (
              <>
                <div className="h-5 w-px bg-gray-300/50" />

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-normal">
                    Group:
                  </span>
                  <div className="inline-flex items-center gap-1 p-0.5 bg-white rounded-md border border-gray-200/60">
                    <button
                      onClick={() => setGroupBy("eqcr")}
                      className={cn(
                        "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                        groupBy === "eqcr"
                          ? "bg-blue-50 text-[#00338D]"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      EQCR
                    </button>
                    <button
                      onClick={() => setGroupBy("client")}
                      className={cn(
                        "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                        groupBy === "client"
                          ? "bg-blue-50 text-[#00338D]"
                          : "text-gray-500 hover:text-gray-700",
                      )}
                    >
                      Client
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* EQCR Approvals Tab */}
        {activeTab === "eqcr" && (
          <div className="space-y-3">
            {filteredEqcrApprovals.map((eqcr: any) => {
              const statusLabel = getStatusLabel(eqcr.Status_Label, eqcr.Status_Label);

              return (
                <div
                  key={eqcr.id}
                  className="relative p-4 bg-white rounded-xl border border-[#E4ECFF] hover:border-[#1E49E2] hover:shadow-md hover:bg-white transition-all cursor-pointer group"
                  onClick={() => handleEqcrCardClick(eqcr.id)}
                >
                  <div className="flex items-center justify-between gap-4">
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
                          • {getYearsInRole(eqcr.promotionYear)}
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
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            {filteredAssignmentGroups.map((group: any) => (
              <div key={group.id} className="space-y-3">
                {/* Minimal Group Header */}
                <div className="flex items-baseline gap-2 px-1">
                  <h3
                    className="text-sm font-normal text-gray-500"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {groupBy === "eqcr" ? group.eqcrName : group.clientName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {group.count} assignment{group.count !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Assignment Cards */}
                <div className="space-y-3">
                  {group.items.map((item: any) => {
                    const statusLabel = getStatusLabel(
                      item.deputyStatus,
                      item.cpppStatus,
                    );

                    return (
                      <div
                        key={item.id}
                        className="relative p-4 bg-white rounded-xl border border-[#E4ECFF] hover:border-[#1E49E2] hover:shadow-md hover:bg-white transition-all cursor-pointer group"
                        onClick={() => handleAssignmentCardClick(item.id)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div>
                              <h4
                                className="text-[16px] font-medium text-[#00338d] group-hover:text-[#1E49E2] transition-colors"
                                style={{ letterSpacing: "0.01em", lineHeight: "1.3" }}
                              >
                                {item.engagementName}
                              </h4>
                              <p className="text-sm mt-0.5 text-[#5A6B8A]">
                                {groupBy === "client" ? item.eqcrName : item.entity}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-[#00266A]/80 font-medium">
                                Created by {item.createdBy}
                              </span>
                              <span className="text-[#C7D2E5]">•</span>
                              <span className="text-[#7B8CA8]">
                                {item.createdDate}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <StatusBadge status={statusLabel} />
                            <span className="text-xs text-gray-400 font-normal">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "eqcr" && filteredEqcrApprovals.length === 0) ||
          (activeTab === "assignments" &&
            filteredAssignmentGroups.length === 0)) && (
          <div className="text-center py-12 text-gray-500">
            <p
              className="text-sm"
              style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
            >
              {searchQuery || statusFilter || roleFilter
                ? "No approvals match your filters"
                : "No pending approvals"}
            </p>
            <p
              className="text-xs mt-2"
              style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
            >
              {searchQuery || statusFilter || roleFilter
                ? "Try adjusting your search or filter criteria"
                : "All items have been reviewed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
