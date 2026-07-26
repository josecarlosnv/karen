import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ExcludedItem {
  index: number;
  competency: string;
  subCompetency: string;
  description: string;
  markedBy: "self" | "evaluator" | "both";
}

interface ExcludedItemsAccordionProps {
  items: ExcludedItem[];
  onRestore?: (index: number) => void;
  showRestoreButton?: boolean;
}

export function ExcludedItemsAccordion({
  items,
  onRestore,
  showRestoreButton = true,
}: ExcludedItemsAccordionProps) {
  if (items.length === 0) return null;

  return (
    <Card
      className="border-l-4 border-red-400"
      style={{
        background: "linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <CardContent className="p-6">
        <Accordion type="single" collapsible defaultValue="excluded-items" className="w-full">
          <AccordionItem value="excluded-items" className="border-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)" }}
                >
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">
                    Excluded Items (N/A)
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {items.length} {items.length === 1 ? "item" : "items"} marked as Not Applicable
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-red-100 text-red-700 border-red-300"
                >
                  {items.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 mt-4">
                <p className="text-xs text-muted-foreground border-l-4 border-red-300 pl-3 py-2 bg-white/50 rounded">
                  Items marked N/A are excluded from competency and final averages.
                </p>

                {items.map((item) => (
                  <div
                    key={item.index}
                    className="bg-white rounded-lg p-4 space-y-3 border border-red-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className="text-white font-medium text-xs"
                            style={{ background: "var(--gradient-primary)" }}
                          >
                            Competency
                          </Badge>
                          <span className="font-semibold text-sm" style={{ color: "var(--kpmg-blue)" }}>
                            {item.competency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            Sub-Competency:
                          </span>
                          <span className="text-xs font-medium">{item.subCompetency}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 border-orange-300 text-xs"
                          >
                            Marked N/A 
                          </Badge>
                        </div>
                      </div>

                      {/*{showRestoreButton && (*/}
                      {/*  <Button*/}
                      {/*    size="sm"*/}
                      {/*    variant="outline"*/}
                      {/*    onClick={() => onRestore?.(item.index)}*/}
                      {/*    className="hover:bg-primary hover:text-white"*/}
                      {/*  >*/}
                      {/*    <RotateCcw className="h-3 w-3 mr-1" />*/}
                      {/*    Restore*/}
                      {/*  </Button>*/}
                      {/*)}*/}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
