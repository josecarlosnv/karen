import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { BarChart3, PieChart, TrendingUp, Users, ExternalLink } from "lucide-react";

const reportCards = [
  {
    title: "Evaluation Completion Rate",
    description: "Track completion status across all evaluations",
    icon: BarChart3,
    color: "var(--kpmg-blue)",
    metrics: { completed: "85%", pending: "15%" },
  },
  {
    title: "Performance Distribution",
    description: "View score distribution across competencies",
    icon: PieChart,
    color: "var(--cobalt-blue)",
    metrics: { average: "78", high: "12%" },
  },
  {
    title: "Trend Analysis",
    description: "Analyze performance trends over time",
    icon: TrendingUp,
    color: "var(--pacific-blue)",
    metrics: { trend: "+5%", period: "YoY" },
  },
  {
    title: "Team Overview",
    description: "Comprehensive team performance summary",
    icon: Users,
    color: "var(--purple)",
    metrics: { members: "24", evaluated: "20" },
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Analyze evaluation data and performance trends
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Filters</CardTitle>
          <CardDescription>
            Apply filters to customize report views
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Evaluation Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
                <SelectItem value="q3-2025">Q3 2025</SelectItem>
                <SelectItem value="q2-2025">Q2 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital">Digital Transformation</SelectItem>
                <SelectItem value="cloud">Cloud Migration</SelectItem>
                <SelectItem value="portal">Customer Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {reportCards.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <report.icon className="h-5 w-5" style={{ color: report.color }} />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(report.metrics).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-sm text-muted-foreground capitalize">{key}</p>
                      <p className="text-2xl font-semibold" style={{ color: report.color }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>
            Download reports in various formats for further analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline">Export to PDF</Button>
          <Button variant="outline">Export to Excel</Button>
          <Button variant="outline">Export to CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}
