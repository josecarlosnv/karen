import { useState,useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Calendar, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "../components/ui/utils";
import { FilterBar } from "../components/ui/FilterBar";
import { FilterSelect } from "../components/ui/FilterSelect";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { StatusBadge } from "../components/ui/StatusBadge";
import PageBackground from "../components/assignments/PageBackground";
import ClientReappointmentSection from "../components/assignments/ClientReappointmentSection";
import UnassignedProjectsSection from "../components/assignments/UnassignedProjectsSection";
import NewAssignmentSection from "../components/assignments/NewAssignmentSection";
import { authApi, Claims } from "../API/authApi";//By Isaac
import { toast  } from "sonner";

export default function Assignments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "active-assignments" | "client-reappointment"
  >("active-assignments");
  const [currentView, setCurrentView] = useState<
    "active" | "unassigned-projects" | "new-assignment"
  >("active");
  const [groupBy, setGroupBy] = useState<"eqcr" | "client">("client");
  const [preloadedAssignmentData, setPreloadedAssignmentData] =
    useState<any>(null);
  const [isReappointmentFormOpen, setIsReappointmentFormOpen] =
    useState(false);
  const [historySelectedCount, setHistorySelectedCount] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "All",
    status: "",
    assignType: "",
  });

  const [assignmentGroups, setAssignmentGroups] = useState<any[]>([]);
//para obetner el usuario 
const [user, setUser] = useState<any>(null);
  useEffect(() => {
    authApi.getClaims()
      .then(setUser)
      .catch(console.error);
  }, []);
//
const [loadingAssignments, setLoadingAssignments] =
  useState(false);

useEffect(() => {
  loadAssignments();

  const interval = setInterval(() => {
  if (document.visibilityState === "visible") {
    loadAssignments();
  }
}, 30000);

  return () => clearInterval(interval);
}, []);

const loadAssignments = async () => {
   if (loadingAssignments) return;
  try {
    setLoadingAssignments(true);
    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmentsGenerated/GetAssigmentsGenerated`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Error loading assignments");
    }

    const data = await response.json();

    const grouped = data.reduce((acc: any, item: any) => {
      const eqcrName = item.Full_Name;

      if (!acc[eqcrName]) {
        acc[eqcrName] = {
          id: item.EMT_AssiGene_PK,
          eqcrName,
          count: 0,
          items: [],
        };
      }

      acc[eqcrName].items.push({
        id: item.EMT_AssiGene_PK,
        keyEMT: item.Key_EMT,
        type: item.Sector_Desc,
        engagementName: item.Engagement_Name,
        entity: item.Entity_Name,
        assignType: item.Assign_Desc,
        creationDate: item.Created?.split("T")[0],
        status: item.Status_Label,
        leadPartner: item.LeadPartner_Full_Name,
        requiresAssistant: item.Assistant_required,
      });

      acc[eqcrName].count++;

      return acc;
    }, {});

    setAssignmentGroups(Object.values(grouped));
  } catch (error) {
    console.error(error);
 } finally {
  setLoadingAssignments(false);
  }
};

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

  const displayedGroups =
    groupBy === "eqcr" ? assignmentGroups : getGroupedByClient();

  // Apply filters to groups
  const filteredGroups = displayedGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        if (
          searchQuery &&
          !item.engagementName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          !item.entity
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          !(
            item.eqcrName &&
            item.eqcrName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        ) {
          return false;
        }

        if (
          selectedFilters.type !== "All" &&
          item.type !== selectedFilters.type
        ) {
          return false;
        }

        if (selectedFilters.status) {
          if (selectedFilters.status === "Pending") {
            if (!item.status.includes("Pending")) {
              return false;
            }
          } else if (item.status !== selectedFilters.status) {
            return false;
          }
        }

        if (
          selectedFilters.assignType &&
          item.assignType !== selectedFilters.assignType
        ) {
          return false;
        }

        return true;
      });

      return {
        ...group,
        items: filteredItems,
        count: filteredItems.length,
      };
    })
    .filter((group) => group.count > 0);

  const handleNewAssignment = () => {
    setCurrentView("unassigned-projects");
  };

  const handleSelectProject = (project: any) => {
    setPreloadedAssignmentData({
      engagementName: project.engagementName,
      entity: project.entity,
      type: project.type,
      ceacId: project.ceacId,
      leadPartner: project.leadPartner,
    });
    setCurrentView("new-assignment");
  };

  const handleHistorySelectionChange = (count: number) => {
    setHistorySelectedCount(count);
  };

  const handleBulkReappointment = () => {
    console.log(`Bulk reappointment for ${historySelectedCount} items`);
  };

  const handleCreateNew = () => {
    setPreloadedAssignmentData(null);
    setCurrentView("new-assignment");
  };

  const handleBackToActive = () => {
    setCurrentView("active");
    setPreloadedAssignmentData(null);
  };

const handleDeleteAssignment = async (
  e: React.MouseEvent,
  keyEMT: string,
  engagementName: string,
) => {
  e.stopPropagation();

  toast.warning("Delete assignment?", {
    description: engagementName,
    action: {
      label: "Delete",
      onClick: async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation/DeleteAssignmentBasicInformation`,
            {
              method: "POST",
              credentials: "include",
             
              body: JSON.stringify({
                Key_EMT: keyEMT,
                user: user?.email,
              }),

            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message);
          }

          toast.success("Assignment deleted successfully", {
            description: engagementName,
          });

          await loadAssignments();
        } catch (error) {
          console.error(error);

          toast.error("Error deleting assignment");
        }
      },
    },
  });
};
  const isNewView =
    currentView === "unassigned-projects" ||
    currentView === "new-assignment";

  const navActiveTab = isNewView ? "new" : activeTab;

  return (
    <PageBackground>
      {/* Page Header with Sub-Navigation */}
      <div
        className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm px-8 py-6"
        style={{ borderBottomColor: "rgba(30, 73, 226, 0.08)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <h1
            className="text-xl font-regular text-[#1E49E2]/80 cursor-pointer hover:text-[#1E49E2] transition-colors"
            style={{
              letterSpacing: "0.08em",
              lineHeight: "1.2",
              textShadow: "0 1px 1px rgba(30, 73, 226, 0.08)",
            }}
            onClick={() => {
              // (opcional) resetea vistas para que siempre vuelva al "home" de assignments
              setCurrentView("active");
              setActiveTab("active-assignments");
              setPreloadedAssignmentData(null);

              // si estabas en el form de reappointment, esto hace que se cierre por estado
              setIsReappointmentFormOpen(false);

              navigate("/assignments");
            }}
          >
            Assignments
          </h1>

          {/* Centered Sub-Navigation */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveTab("active-assignments");
                setCurrentView("active");
              }}
              className={cn(
                "text-sm font-normal transition-all relative pb-1",
                navActiveTab === "active-assignments"
                  ? "text-[#00338D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
              style={{ letterSpacing: "0.03em" }}
            >
              Active
              {navActiveTab === "active-assignments" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("client-reappointment");
                setCurrentView("active");
              }}
              className={cn(
                "text-sm font-normal transition-all relative pb-1",
                navActiveTab === "client-reappointment"
                  ? "text-[#00338D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
              style={{ letterSpacing: "0.03em" }}
            >
              History
              {navActiveTab === "client-reappointment" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
              )}
            </button>
            <button
              onClick={handleNewAssignment}
              className={cn(
                "text-sm font-normal transition-all relative pb-1",
                navActiveTab === "new"
                  ? "text-[#00338D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
              style={{ letterSpacing: "0.03em" }}
            >
              New
              {navActiveTab === "new" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#00338D]" />
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className="px-8 py-8 relative z-10">
        {/* New assignment sub-views */}
        {isNewView ? (
          <>
            {currentView === "unassigned-projects" && (
              <UnassignedProjectsSection
                onSelectProject={handleSelectProject}
                onCreateNew={handleCreateNew}
                onBack={handleBackToActive}
              />
            )}
            {currentView === "new-assignment" && (
              <NewAssignmentSection
                preloadedData={preloadedAssignmentData}
                onBack={handleBackToActive}
              />
            )}
          </>
        ) : (
          <>
            {/* History tab */}
            {activeTab === "client-reappointment" && (
              <>
                {!isReappointmentFormOpen && (
                  <FilterBar>
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-xs font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
                    />
                    <FilterSelect
                      value={selectedFilters.type}
                      onChange={(val) =>
                        setSelectedFilters({ ...selectedFilters, type: val })
                      }
                      options={[
                        { value: "All", label: "All Types" },
                        { value: "Audit", label: "Audit" },
                        { value: "ESG", label: "ESG" },
                        { value: "SOC", label: "SOC" },
                      ]}
                    />
                    {historySelectedCount > 0 && (
                      <Button
                        onClick={handleBulkReappointment}
                        className="ml-auto bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-sm hover:shadow-md transition-shadow text-xs font-medium h-7 px-3"
                      >
                        <RefreshCw className="w-3 h-3 mr-1.5" />
                        Reappoint ({historySelectedCount})
                      </Button>
                    )}
                  </FilterBar>
                )}
                <ClientReappointmentSection
                searchQuery={searchQuery}
                
  selectedType={selectedFilters.type}

                  onFormStateChange={setIsReappointmentFormOpen}
                  onSelectionChange={handleHistorySelectionChange}
                  onBulkReappointment={handleBulkReappointment}
                />
              </>
            )}

            {/* Active assignments tab */}
            {activeTab === "active-assignments" && (
              <>
                <FilterBar>
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-xs font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
                  />

                  <FilterSelect
                    value={selectedFilters.type}
                    onChange={(val) =>
                      setSelectedFilters({ ...selectedFilters, type: val })
                    }
                    options={[
                      { value: "All", label: "All Types" },
                      { value: "Audit", label: "Audit" },
                      { value: "ESG", label: "ESG" },
                      { value: "SOC", label: "SOC" },
                      { value: "Assistant", label: "EQCR Assistant" },
                    ]}
                  />

                  <SegmentedControl
                    value={selectedFilters.status}
                    onChange={(val) =>
                      setSelectedFilters({ ...selectedFilters, status: val })
                    }
                    options={[
                      { value: "", label: "All" },
                      { value: "Draft", label: "Draft" },
                      { value: "Pending", label: "Pending" },
                      { value: "Approved", label: "Approved" },
                    ]}
                  />

                  <SegmentedControl
                    value={selectedFilters.assignType}
                    onChange={(val) =>
                      setSelectedFilters({ ...selectedFilters, assignType: val })
                    }
                    options={[
                      { value: "", label: "All" },
                      { value: "Assigned", label: "Assigned" },
                      { value: "Reappointment", label: "Reappointment" },
                    ]}
                  />

                  <div className="h-5 w-px bg-gray-300/50" />

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#0C233C]/80 font-normal">
                      Group:
                    </span>
                    <SegmentedControl
                      value={groupBy}
                      onChange={(val) => setGroupBy(val as "eqcr" | "client")}
                      options={[
                        { value: "eqcr", label: "EQCR" },
                        { value: "client", label: "Client" },
                      ]}
                    />
                  </div>
                </FilterBar>

                {/* Assignments List */}
                <div className="space-y-6">
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <div className="flex items-baseline gap-2 px-1">
                        <h3
                          className="text-[13px] font-light text-[#0C233C]"
                          style={{ letterSpacing: "0.02em" }}
                        >
                          {groupBy === "eqcr"
                            ? group.eqcrName
                            : group.clientName}
                        </h3>
                        <span className="text-xs text-[#666666]/80 font-normal tracking-[0.03em]">
                          {group.count} assignment
                          {group.count !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="relative p-4 bg-white rounded-lg border border-gray-200/60 hover:border-[#1E49E2] hover:shadow-sm transition-all cursor-pointer group"
                            onClick={() =>
                              navigate(`/assignments/view/${item.id}`)
                            }
                          >
                            <button
                              onClick={(e) =>
                                handleDeleteAssignment(
                                  e,
                                  item.keyEMT,
                                  item.engagementName,
                                )
                              }
                              className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
                              aria-label="Delete assignment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center justify-between gap-4 pr-10">
                              <div className="flex-1 space-y-2">
                                <div>
                                  <h4
                                    className="text-[16px] font-medium text-[#00338d] group-hover:text-[#1E49E2] transition-colors"
                                    style={{
                                      letterSpacing: "0.01em",
                                      lineHeight: "1.3",
                                    }}
                                  >
                                    {groupBy === "client"
                                      ? item.eqcrName
                                      : item.entity}
                                  </h4>
                                  <p
                                    className="text-sm mt-0.5"
                                    style={{ letterSpacing: "0.02em" }}
                                  >
                                    <span className="text-gray-500">
                                      {groupBy === "eqcr"
                                        ? item.entity
                                        : item.engagementName}
                                    </span>
                                    <span className="mx-1 text-[#00266A]/80 font-medium">
                                      •
                                    </span>
                                    <span className="text-[#1E49E2] font-medium">
                                      {item.type}
                                    </span>
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs mt-0.5">
                                  <span
                                    className="text-gray-700"
                                    style={{ letterSpacing: "0.01em" }}
                                  >
                                    {item.leadPartner}
                                  </span>
                                  <span className="text-gray-300 opacity-50">
                                    •
                                  </span>
                                  <span
                                    className="text-gray-400"
                                    style={{ letterSpacing: "0.01em" }}
                                  >
                                    {item.creationDate}
                                  </span>
                                  <span className="text-gray-300 opacity-50">
                                    •
                                  </span>
                                  <span
                                    className="text-[#6B8EFF]"
                                    style={{ letterSpacing: "0.01em" }}
                                  >
                                    {item.assignType}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <StatusBadge status={item.status} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {assignmentGroups.length === 0 && (
                  <Card className="p-12 bg-white border border-gray-200 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-[#00338D]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Active Assignments
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        No assignments found for the current year. Create a new
                        assignment to get started.
                      </p>
                    </div>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageBackground>
  );
}
