import { StatusChip } from "../components/StatusChip";
import { KPICard } from "../components/KPICard";
import { Stepper } from "../components/Stepper";
import { DataTable } from "../components/DataTable";
import { AuditTrail } from "../components/AuditTrail";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Palette,
  Type,
  Layout,
  Component,
} from "lucide-react";
import { motion } from "motion/react";

const wizardSteps = [
  { id: "1", title: "Client Selection" },
  { id: "2", title: "General Data" },
  { id: "3", title: "Client Entities" },
  { id: "4", title: "Staffing Schedule" },
  { id: "5", title: "Specialists" },
  { id: "6", title: "Valuation" },
];

const sampleTableData = [
  { id: "1", name: "Acme Corp", segment: "Enterprise", revenue: "$2.5M", status: "Active" },
  { id: "2", name: "TechStart", segment: "Mid Market", revenue: "$890K", status: "Active" },
];

const sampleAuditEvents = [
  {
    id: "1",
    action: "P8 Submitted",
    user: "Sarah Johnson",
    timestamp: "Feb 1, 2026 at 2:45 PM",
    status: "Submitted",
  },
  {
    id: "2",
    action: "Draft Saved",
    user: "Sarah Johnson",
    timestamp: "Feb 1, 2026 at 11:20 AM",
    status: "Draft",
  },
];

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0C233C] via-[#00338D] to-[#1E49E2] px-6 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-3">
              PVIII / P8 Design System
            </h1>
            <p className="text-lg text-blue-100">
              Premium, minimalist design system for enterprise project valuation
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 space-y-12">
        {/* Color Palette */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-[#00338D]" />
            <h2 className="text-2xl font-semibold text-slate-900">Color Palette</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">KPMG Brand Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div>
                  <div className="h-20 rounded-lg bg-[#00338D] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">KPMG Blue</p>
                  <p className="text-xs text-slate-500">#00338D</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#0C233C] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Dark Blue</p>
                  <p className="text-xs text-slate-500">#0C233C</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#1E49E2] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Cobalt</p>
                  <p className="text-xs text-slate-500">#1E49E2</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#ACEAFF] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Light Blue</p>
                  <p className="text-xs text-slate-500">#ACEAFF</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#00B8F5] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Pacific</p>
                  <p className="text-xs text-slate-500">#00B8F5</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#7213EA] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Purple</p>
                  <p className="text-xs text-slate-500">#7213EA</p>
                </div>
                <div>
                  <div className="h-20 rounded-lg bg-[#FD349C] border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Pink</p>
                  <p className="text-xs text-slate-500">#FD349C</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Status Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <div className="h-16 rounded-lg bg-slate-100 border border-slate-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Draft</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-cyan-50 border border-cyan-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Submitted</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-emerald-50 border border-emerald-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Approved</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-red-50 border border-red-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Rejected</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-amber-50 border border-amber-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Pending</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-pink-50 border border-pink-200 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Exception</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Typography */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-6 h-6 text-[#00338D]" />
            <h2 className="text-2xl font-semibold text-slate-900">Typography</h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h1>Heading 1 - The quick brown fox</h1>
              <p className="text-xs text-slate-500 mt-1">
                2rem (32px) • Semibold • -0.02em letter spacing
              </p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <h2>Heading 2 - The quick brown fox</h2>
              <p className="text-xs text-slate-500 mt-1">
                1.5rem (24px) • Semibold • -0.01em letter spacing
              </p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <h3>Heading 3 - The quick brown fox</h3>
              <p className="text-xs text-slate-500 mt-1">
                1.25rem (20px) • Semibold
              </p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <p>
                Body text - The quick brown fox jumps over the lazy dog. Premium
                design system for enterprise applications.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                0.875rem (14px) • Regular • 1.5 line height
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">
                Secondary text - Additional information and supporting details
              </p>
              <p className="text-xs text-slate-500 mt-1">
                0.875rem (14px) • Regular • text-slate-600
              </p>
            </div>
          </div>
        </motion.section>

        {/* Status Chips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Component className="w-6 h-6 text-[#00338D]" />
            <h2 className="text-2xl font-semibold text-slate-900">Status Chips</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status="draft" />
            <StatusChip status="submitted" />
            <StatusChip status="approved" />
            <StatusChip status="rejected" />
            <StatusChip status="pending" />
            <StatusChip status="exception" />
            <StatusChip status="confirmed" />
            <StatusChip status="declined" />
            <StatusChip status="needs-changes" />
          </div>
        </motion.section>

        {/* Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Buttons</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Primary</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default Button</Button>
                <Button size="sm">Small Button</Button>
                <Button size="lg">Large Button</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Secondary
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* KPI Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">KPI Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Revenue"
              value="$12.4M"
              icon={DollarSign}
              trend={{ value: "+12.5% vs PY", direction: "up" }}
            />
            <KPICard
              title="Total Hours"
              value="45,200"
              icon={Clock}
              subtitle="Across all engagements"
            />
            <KPICard
              title="Active Specialists"
              value="156"
              icon={Users}
              trend={{ value: "+8 this month", direction: "up" }}
            />
            <KPICard
              title="Margin Proxy"
              value="42.5%"
              icon={TrendingUp}
              trend={{ value: "+2.3pts", direction: "up" }}
            />
          </div>
        </motion.section>

        {/* Stepper */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Wizard Stepper
          </h2>

          <Stepper steps={wizardSteps} currentStep={2} />
        </motion.section>

        {/* Data Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Data Table</h2>

          <DataTable
            columns={[
              { key: "name", header: "Client Name" },
              { key: "segment", header: "Segment" },
              { key: "revenue", header: "Revenue" },
              { key: "status", header: "Status" },
            ]}
            data={sampleTableData}
          />
        </motion.section>

        {/* Audit Trail */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Audit Trail
          </h2>

          <AuditTrail events={sampleAuditEvents} />
        </motion.section>

        {/* Spacing & Layout */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-6 h-6 text-[#00338D]" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Spacing & Layout
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Spacing Scale</h3>
              <p className="text-sm text-slate-600 mb-3">
                8-point grid system (8px, 16px, 24px, 32px, 48px, 64px)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#00338D] rounded" />
                  <p className="text-sm text-slate-700">2 units (8px) - Tight spacing</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-[#00338D] rounded" />
                  <p className="text-sm text-slate-700">4 units (16px) - Default spacing</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-[#00338D] rounded" />
                  <p className="text-sm text-slate-700">6 units (24px) - Comfortable spacing</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#00338D] rounded" />
                  <p className="text-sm text-slate-700">8 units (32px) - Section spacing</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Border Radius</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-sm" />
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-md" />
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg" />
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-xl" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                sm (4px) • md (6px) • lg (12px) • xl (16px)
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
