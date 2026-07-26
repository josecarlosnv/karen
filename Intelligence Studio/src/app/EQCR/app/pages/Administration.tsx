import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  Database,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { cn } from "../components/ui/utils";

export default function Administration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<"users" | "roles" | "settings" | "audit">("users");

  // Mock users data
  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "EQCR Partner",
      status: "Active",
      lastLogin: "2026-02-20",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Reviewer",
      status: "Active",
      lastLogin: "2026-02-19",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@example.com",
      role: "Assignment Team",
      status: "Active",
      lastLogin: "2026-02-18",
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "Approver",
      status: "Inactive",
      lastLogin: "2026-01-15",
    },
  ];

  // Mock roles data
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access and configuration",
      userCount: 2,
      permissions: ["All"],
    },
    {
      id: 2,
      name: "EQCR Partner",
      description: "Create and submit confirmation forms",
      userCount: 45,
      permissions: ["Create Forms", "View Own Data"],
    },
    {
      id: 3,
      name: "Reviewer",
      description: "Review and validate submitted forms",
      userCount: 12,
      permissions: ["Review Forms", "Validate", "Decline"],
    },
    {
      id: 4,
      name: "Assignment Team",
      description: "Manage assignments and reassignments",
      userCount: 8,
      permissions: ["Create Assignments", "View All Assignments"],
    },
    {
      id: 5,
      name: "Approver",
      description: "Approve or decline assignment requests",
      userCount: 6,
      permissions: ["Approve", "Decline", "View Pending"],
    },
  ];

  // Mock audit log
  const auditLog = [
    {
      id: 1,
      action: "User Created",
      user: "Admin User",
      target: "John Smith",
      timestamp: "2026-02-20 14:30:22",
      details: "New user account created",
    },
    {
      id: 2,
      action: "Form Validated",
      user: "Sarah Johnson",
      target: "EQCR Confirmation #1234",
      timestamp: "2026-02-20 12:15:10",
      details: "Form validated and approved",
    },
    {
      id: 3,
      action: "Role Modified",
      user: "Admin User",
      target: "Reviewer Role",
      timestamp: "2026-02-19 16:45:33",
      details: "Permissions updated",
    },
    {
      id: 4,
      action: "Assignment Approved",
      user: "Emily Chen",
      target: "Assignment #5678",
      timestamp: "2026-02-19 10:20:15",
      details: "EQCR assignment approved",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-8 py-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#00338D] mb-2" style={{ letterSpacing: '0.02em', lineHeight: '1.25' }}>Administration</h1>
            <p className="text-sm text-gray-600" style={{ letterSpacing: '0.01em', lineHeight: '1.45' }}>
              System configuration and user management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                "border-gray-300",
                isEditMode ? "bg-blue-50 text-[#00338D] border-[#00338D]" : "text-gray-700"
              )}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Read-only Mode
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Edit Mode
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Warning Banner for Edit Mode */}
        {isEditMode && (
          <Card className="p-4 bg-yellow-50 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Edit Mode Active</p>
                <p className="text-xs text-gray-600 mt-1">
                  Changes will be logged in the audit trail. Exercise caution with destructive actions.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="px-8 py-8">
        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Button
            variant={activeSection === "users" ? "default" : "outline"}
            onClick={() => setActiveSection("users")}
            className={cn(
              activeSection === "users"
                ? "bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md"
                : "border-gray-300 text-gray-700 hover:bg-blue-50"
            )}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeSection === "roles" ? "default" : "outline"}
            onClick={() => setActiveSection("roles")}
            className={cn(
              activeSection === "roles"
                ? "bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md"
                : "border-gray-300 text-gray-700 hover:bg-blue-50"
            )}
          >
            <Shield className="w-4 h-4 mr-2" />
            Roles & Permissions
          </Button>
          <Button
            variant={activeSection === "settings" ? "default" : "outline"}
            onClick={() => setActiveSection("settings")}
            className={cn(
              activeSection === "settings"
                ? "bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md"
                : "border-gray-300 text-gray-700 hover:bg-blue-50"
            )}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant={activeSection === "audit" ? "default" : "outline"}
            onClick={() => setActiveSection("audit")}
            className={cn(
              activeSection === "audit"
                ? "bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md"
                : "border-gray-300 text-gray-700 hover:bg-blue-50"
            )}
          >
            <Database className="w-4 h-4 mr-2" />
            Audit Trail
          </Button>
        </div>

        {/* Users Section */}
        {activeSection === "users" && (
          <div className="space-y-4">
            {/* Search and Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              {isEditMode && (
                <Button className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>

            {/* Users Table */}
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Login
                      </th>
                      {isEditMode && (
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-[#00338D]">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded text-xs font-medium",
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{user.lastLogin}</div>
                        </td>
                        {isEditMode && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" className="text-[#00338D] hover:bg-blue-50">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Roles Section */}
        {activeSection === "roles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Managing {roles.length} roles</p>
              {isEditMode && (
                <Button className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card 
                  key={role.id} 
                  className="p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#00338D]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{role.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <p className="text-xs text-gray-500">{role.userCount} users assigned</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-[#00338D]" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs bg-blue-50 text-[#00338D]"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <Button variant="outline" size="sm" className="flex-1 border-[#00338D] text-[#00338D] hover:bg-blue-50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail Section */}
        {activeSection === "audit" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Recent system activity and changes</p>
            
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLog.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-[#00338D]">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.user}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{log.target}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{log.timestamp}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{log.details}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <Card className="p-8 bg-white border border-gray-200 shadow-sm text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-[#00338D]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.02em', lineHeight: '1.3' }}>System Settings</h3>
              <p className="text-sm text-gray-600" style={{ letterSpacing: '0.01em', lineHeight: '1.5' }}>
                Configure system-wide settings, email templates, and notification preferences.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}