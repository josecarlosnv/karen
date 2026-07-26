import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Slider } from "@/app/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { toast } from "sonner";
import { Save, Send, User, Briefcase, Calendar } from "lucide-react";
import { useState } from "react";

const competencies = [
  { id: "1", name: "Technical Skills", selfScore: 75, description: "Proficiency in required technical areas" },
  { id: "2", name: "Communication", selfScore: 80, description: "Effective verbal and written communication" },
  { id: "3", name: "Teamwork", selfScore: 85, description: "Collaboration and team contribution" },
  { id: "4", name: "Problem Solving", selfScore: 70, description: "Analytical thinking and solution development" },
];

export function EvaluationDetail() {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleSave = () => {
    toast.success("Evaluation saved as draft");
  };

  const handleSubmit = () => {
    toast.success("Evaluation submitted successfully");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Manager Evaluation</h1>
        <p className="text-muted-foreground mt-2">Sarah Johnson - Digital Transformation Project</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Employee:</span>
            <span className="font-medium">Sarah Johnson</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Project:</span>
            <span className="font-medium">Digital Transformation Project</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Period:</span>
            <span className="font-medium">Q4 2025</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="evaluation">
        <TabsList>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="self-eval">Self-Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manager Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {competencies.map((competency) => (
                <div key={competency.id} className="space-y-4">
                  <div>
                    <Label className="text-base">{competency.name}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competency.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Rating</span>
                      <span className="font-medium">{scores[competency.id] || 50}</span>
                    </div>
                    <Slider
                      value={[scores[competency.id] || 50]}
                      onValueChange={(value) =>
                        setScores({ ...scores, [competency.id]: value[0] })
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`comments-${competency.id}`}>Manager Comments</Label>
                    <Textarea
                      id={`comments-${competency.id}`}
                      placeholder="Provide specific feedback and examples..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Summarize overall performance, strengths, areas for improvement, and development goals..."
                rows={6}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="self-eval" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Self-Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {competencies.map((competency) => (
                <div key={competency.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{competency.name}</Label>
                    <span className="font-medium">{competency.selfScore}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${competency.selfScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 sticky bottom-0 bg-background py-4 border-t">
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit}>
          <Send className="mr-2 h-4 w-4" />
          Submit Final Evaluation
        </Button>
      </div>
    </div>
  );
}
