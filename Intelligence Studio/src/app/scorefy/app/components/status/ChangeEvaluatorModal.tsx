import { useState, useMemo, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UserX, Check, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";


interface ChangeEvaluatorModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (newEvaluatorId: string, newEvaluatorName: string) => void;
    employeeName: string;
    projectClient: string;
    currentEvaluatorId: string;
    currentEvaluatorName: string;
    availableEvaluators: Array<{ id: string; name: string; role?: string }>;
}

export function ChangeEvaluatorModal({
    open,
    onClose,
    onConfirm,
    employeeName,
    projectClient,
    currentEvaluatorId,
    currentEvaluatorName,
    availableEvaluators,
}: ChangeEvaluatorModalProps) {
    const [selectedEvaluatorId, setSelectedEvaluatorId] = useState(currentEvaluatorId);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const selectedEvaluator = availableEvaluators.find((e) => e.id === selectedEvaluatorId);

    const filteredEvaluators = useMemo(() => {
        if (!searchQuery) return availableEvaluators;
        const query = searchQuery.toLowerCase();
        return availableEvaluators.filter((evaluator) =>
            evaluator.name.toLowerCase().includes(query) ||
            (evaluator.role && evaluator.role.toLowerCase().includes(query))
        );
    }, [searchQuery, availableEvaluators]);

    const handleConfirm = async () => {
        if (!selectedEvaluator || selectedEvaluatorId === currentEvaluatorId) {
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        onConfirm(selectedEvaluator.id, selectedEvaluator.name);
        setIsLoading(false);
        handleClose();
    };

    const handleClose = () => {
        setSelectedEvaluatorId(currentEvaluatorId);
        setSearchQuery("");
        onClose();
    };

    const hasChanges = selectedEvaluatorId !== currentEvaluatorId;



    useEffect(() => {
        setSelectedEvaluatorId(currentEvaluatorId);
    }, [currentEvaluatorId]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="p-2 rounded-lg"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            <UserX className="h-5 w-5 text-white" />
                        </div>
                        <DialogTitle>Change Evaluator</DialogTitle>
                    </div>
                    <DialogDescription>
                        Update evaluator for <span className="font-semibold text-foreground">{employeeName}</span>{" "}
                        – <span className="font-semibold text-foreground">{projectClient}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Search Input */}
                    {/*<div className="space-y-2">*/}
                    {/*    <Label htmlFor="search">Search Evaluators</Label>*/}
                    {/*    <div className="relative">*/}
                    {/*        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />*/}
                    {/*        <Input*/}
                    {/*            id="search"*/}
                    {/*            placeholder="Search by name or role..."*/}
                    {/*            className="pl-9"*/}
                    {/*            style={{ background: "var(--gradient-card)" }}*/}
                    {/*            value={searchQuery}*/}
                    {/*            onChange={(e) => setSearchQuery(e.target.value)}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Select Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="evaluator">Select New Evaluator</Label>
                        <Select value={selectedEvaluatorId} onValueChange={setSelectedEvaluatorId}>
                            <SelectTrigger style={{ background: "var(--gradient-card)" }}>
                                <SelectValue placeholder="Select evaluator..." />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredEvaluators.length > 0 ? (
                                    filteredEvaluators.map((evaluator) => (
                                        <SelectItem key={evaluator.id} value={evaluator.id}>
                                            <div className="flex items-center gap-2">
                                                {selectedEvaluatorId === evaluator.id && (
                                                    <Check className="h-4 w-4 text-[var(--kpmg-blue)]" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span>{evaluator.name}</span>
                                                    {evaluator.role && (
                                                        <span className="text-xs text-muted-foreground">{evaluator.role}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        No evaluators found
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        {currentEvaluatorId && (
                            <p className="text-xs text-muted-foreground">
                                Current: <span className="font-medium">{currentEvaluatorName}</span>
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !hasChanges}
                        style={{ background: "var(--gradient-primary)" }}
                        className="text-white"
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}