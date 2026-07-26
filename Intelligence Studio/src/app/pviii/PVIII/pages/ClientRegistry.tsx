import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Building2, Plus } from "lucide-react";
import { StatusChip } from "../components/StatusChip";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion } from "motion/react";

const clients = [
  {
    id: "1",
    name: "Acme Corporation",
    segment: "Large Cap",
    office: "New York",
    partner: "John Smith",
    entities: 3,
    activeP8s: 2,
    lastActivity: "Feb 3, 2026",
    status: "approved" as const,
  },
  {
    id: "2",
    name: "TechStart Solutions",
    segment: "Mid Market",
    office: "Chicago",
    partner: "Maria Garcia",
    entities: 2,
    activeP8s: 1,
    lastActivity: "Feb 1, 2026",
    status: "draft" as const,
  },
  {
    id: "3",
    name: "Global Industries Ltd",
    segment: "Enterprise",
    office: "London",
    partner: "David Chen",
    entities: 8,
    activeP8s: 3,
    lastActivity: "Jan 30, 2026",
    status: "submitted" as const,
  },
  {
    id: "4",
    name: "Innovation Labs Inc",
    segment: "Small Business",
    office: "Boston",
    partner: "Emily Brown",
    entities: 1,
    activeP8s: 1,
    lastActivity: "Jan 28, 2026",
    status: "approved" as const,
  },
  {
    id: "5",
    name: "MegaCorp Inc",
    segment: "Enterprise",
    office: "New York",
    partner: "John Smith",
    entities: 12,
    activeP8s: 4,
    lastActivity: "Feb 5, 2026",
    status: "submitted" as const,
  },
];

export default function ClientRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.partner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment =
      segmentFilter === "all" || client.segment === segmentFilter;
    const matchesOffice = officeFilter === "all" || client.office === officeFilter;
    return matchesSearch && matchesSegment && matchesOffice;
  });

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                Client Registry
              </h1>
              <p className="text-sm text-slate-600">
                Manage client information and entities
              </p>
            </div>
            <Link to="/clients/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Client
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-600 mb-1">Total Clients</p>
            <p className="text-2xl font-semibold text-slate-900">
              {clients.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-600 mb-1">Active P8s</p>
            <p className="text-2xl font-semibold text-[#00338D]">
              {clients.reduce((sum, c) => sum + c.activeP8s, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-600 mb-1">Total Entities</p>
            <p className="text-2xl font-semibold text-slate-900">
              {clients.reduce((sum, c) => sum + c.entities, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-600 mb-1">New This Month</p>
            <p className="text-2xl font-semibold text-emerald-600">3</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by client name or partner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Large Cap">Large Cap</SelectItem>
                <SelectItem value="Mid Market">Mid Market</SelectItem>
                <SelectItem value="Small Business">Small Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={officeFilter} onValueChange={setOfficeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Offices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Offices</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Boston">Boston</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/clients/${client.id}`} className="block group">
                <div className="bg-white rounded-xl border border-slate-200 p-6 transition-all hover:shadow-lg hover:border-slate-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-[#00338D] transition-colors mb-1">
                          {client.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {client.segment} • {client.office}
                        </p>
                      </div>
                    </div>
                    <StatusChip status={client.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Lead Partner</p>
                      <p className="text-sm font-medium text-slate-900">
                        {client.partner}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Entities</p>
                      <p className="text-sm font-medium text-slate-900">
                        {client.entities}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Active P8s</p>
                      <p className="text-sm font-medium text-[#00338D]">
                        {client.activeP8s}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Activity</p>
                      <p className="text-sm font-medium text-slate-900">
                        {client.lastActivity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-[#00338D] group-hover:text-[#1E49E2] pt-4 border-t border-slate-200">
                    View Details →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Filter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No clients found
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <Link to="/clients/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Client
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
