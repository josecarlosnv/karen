import { useState,useEffect } from "react";
import { Plus, FolderPlus, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FilterBar } from "../ui/FilterBar";
import { FilterSelect } from "../ui/FilterSelect";
import { sectorTypesApi } from "../../API/SectorTypeApi";//para el catalogo de type by Isaac

interface UnassignedProject {
  id: number;
  engagementName: string;
  entity: string;
  type: "Audit" | "ESG" | "SOC" | "Assistant";
  ceacId?: string;
  leadPartner?: string;
}

interface UnassignedProjectsSectionProps {
  onSelectProject: (project: UnassignedProject) => void;
  onCreateNew: () => void;
  onBack?: () => void;
}

export default function UnassignedProjectsSection({
  onSelectProject,
  onCreateNew,
  onBack,
}: UnassignedProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
 const [projects] = useState<UnassignedProject[]>([]);

  const filteredProjects = projects.filter((project) => {
    if (searchQuery) {
      const matchesSearch =
        project.engagementName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    if (selectedType !== "All" && project.type !== selectedType) {
      return false;
    }
    return true;
  });
const [sectorTypes, setSectorTypes] = useState([]);
useEffect(() => {
  const loadSectors = async () => {
    try {
      const data = await sectorTypesApi.list();
      setSectorTypes(data);
    } catch (e) {
      console.error(e);
    }
  };

  loadSectors();
}, []);

const sectorTypeOptions = [
  { value: "All", label: "All Types" },
  ...sectorTypes
];
//
  return (
    <div className="space-y-6">
      <FilterBar>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-xs font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
        />

        <FilterSelect
          value={selectedType}
          onChange={setSelectedType}
          options={sectorTypeOptions}
        />
        <div className="flex-1" />

        <Button
          onClick={onCreateNew}
          variant="outline"
          className="border-gray-300 text-[#00338d] hover:bg-gray-50 text-xs h-8"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New
        </Button>
      </FilterBar>

      {/* Projects List */}
      <div className="space-y-2">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative p-4 bg-white rounded-lg border border-gray-200/60 hover:border-[#1E49E2] hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onSelectProject(project)}
          >
            <button
              className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete project:", project.id);
              }}
              aria-label="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div>
                  <h4
                    className="text-[16px] font-medium text-[#00338d] group-hover:text-[#1E49E2] transition-colors"
                    style={{ letterSpacing: "0.01em", lineHeight: "1.3" }}
                  >
                    {project.engagementName}
                  </h4>
                  <p
                    className="text-sm mt-0.5"
                    style={{ letterSpacing: "0.01em" }}
                  >
                    <span className="text-gray-500">{project.entity}</span>
                    <span className="mx-2 text-gray-300 opacity-50">•</span>
                    <span className="text-[#1E49E2] font-medium">
                      {project.type}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="p-12 bg-white border border-gray-200 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8 text-[#00338D]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by creating a new project"}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
