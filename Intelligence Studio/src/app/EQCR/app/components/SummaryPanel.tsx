import { Card, CardContent } from "../components/ui/card";

interface SummaryPanelProps {
  data: Record<string, string | undefined>;
}

export default function SummaryPanel({ data }: SummaryPanelProps) {
  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Selected Record Summary</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(data).map(([key, value]) => (
            value && (
              <div key={key}>
                <dt className="text-xs font-medium text-gray-600">{key}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            )
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
