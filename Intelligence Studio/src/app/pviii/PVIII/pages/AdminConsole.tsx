import { useState } from "react";
import {
  Search,
  Plus,
  Save,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TableName = "Users" | "Catalogs" | "Tables" | "Permissions" | "Audit Log";

interface TableRow {
  id: string;
  [key: string]: string | number | boolean;
}

const mockData: Record<TableName, TableRow[]> = {
  Users: [
    { id: "1", name: "John Specialist", email: "john.specialist@firm.com", role: "Partner", status: "Active" },
    { id: "2", name: "Sarah Admin", email: "sarah.admin@firm.com", role: "Admin", status: "Active" },
    { id: "3", name: "Mike Analyst", email: "mike.analyst@firm.com", role: "Analyst", status: "Active" },
  ],
  Catalogs: [
    { id: "1", name: "Service Lines", type: "Reference", entries: 12, lastUpdated: "2026-04-20" },
    { id: "2", name: "Industries", type: "Reference", entries: 24, lastUpdated: "2026-04-18" },
  ],
  Tables: [
    { id: "1", tableName: "pviii_proposals", records: 142, size: "2.4 MB", status: "Active" },
    { id: "2", tableName: "entities", records: 89, size: "1.1 MB", status: "Active" },
  ],
  Permissions: [
    { id: "1", user: "John Specialist", resource: "PVIII Proposals", access: "Full", grantedBy: "System" },
    { id: "2", user: "Sarah Admin", resource: "All Resources", access: "Admin", grantedBy: "System" },
  ],
  "Audit Log": [
    { id: "1", timestamp: "2026-04-27 06:45:12", user: "John Specialist", action: "Updated PVIII", resource: "Proposal #142" },
    { id: "2", timestamp: "2026-04-27 06:30:05", user: "Sarah Admin", action: "Created User", resource: "User #89" },
  ],
};

export default function AdminConsole() {
  const [activeTable, setActiveTable] = useState<TableName>("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Record<TableName, TableRow[]>>(mockData);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const currentData = data[activeTable];
  const columns = currentData.length > 0 ? Object.keys(currentData[0]).filter(k => k !== "id") : [];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...currentData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return aVal > bVal ? multiplier : -multiplier;
  });

  const filteredData = sortedData.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCellEdit = (rowId: string, column: string, value: string) => {
    setData(prev => ({
      ...prev,
      [activeTable]: prev[activeTable].map(row =>
        row.id === rowId ? { ...row, [column]: value } : row
      ),
    }));
  };

  const handleAddRow = () => {
    const newRow: TableRow = { id: String(Date.now()) };
    columns.forEach(col => {
      newRow[col] = "";
    });
    setData(prev => ({
      ...prev,
      [activeTable]: [...prev[activeTable], newRow],
    }));
  };

  const handleDeleteRow = (rowId: string) => {
    setData(prev => ({
      ...prev,
      [activeTable]: prev[activeTable].filter(row => row.id !== rowId),
    }));
    setShowDeleteModal(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b border-slate-200">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-6">
            <h1 className="text-2xl font-light text-[#0C233C]">Admin Console</h1>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search table…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E49E2]/20 focus:border-[#1E49E2] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Table Selector */}
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {(["Users", "Catalogs", "Tables", "Permissions", "Audit Log"] as TableName[]).map((table) => (
                <button
                  key={table}
                  onClick={() => setActiveTable(table)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTable === table
                      ? "bg-[#00338D]/10 text-[#00338D]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#00338D]"
                  }`}
                >
                  {table}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00338D] text-white rounded-lg text-sm font-medium hover:bg-[#1E49E2] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Changes are audited
              </p>
            </div>

            {/* Data Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
                          onClick={() => handleSort(column)}
                        >
                          <div className="flex items-center gap-2">
                            {column}
                            {sortColumn === column && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </motion.div>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        {columns.map((column) => (
                          <td
                            key={`${row.id}-${column}`}
                            className="px-4 py-3 text-sm text-slate-900"
                            onClick={() => setEditingCell({ rowId: row.id, column })}
                          >
                            {editingCell?.rowId === row.id && editingCell?.column === column ? (
                              <input
                                type="text"
                                value={String(row[column])}
                                onChange={(e) => handleCellEdit(row.id, column, e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                autoFocus
                                className="w-full px-2 py-1 border border-[#1E49E2] rounded focus:outline-none focus:ring-2 focus:ring-[#1E49E2]/20"
                              />
                            ) : (
                              <span className="cursor-pointer hover:text-[#00338D]">
                                {String(row[column])}
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setShowDeleteModal(row.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                            aria-label="Delete row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900 mb-1">
                    Delete Row
                  </h3>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to delete this row? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteRow(showDeleteModal)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
