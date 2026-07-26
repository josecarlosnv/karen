import { useState } from "react";
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
import { Bell } from "lucide-react";

interface RemindModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
  evaluatorName: string;
  employeeName: string;
  projectClient: string;
}

export function RemindModal({
  open,
  onClose,
  onConfirm,
  evaluatorName,
  employeeName,
  projectClient,
}: RemindModalProps) {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfirm(note);
    setIsLoading(false);
    setNote("");
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Bell className="h-5 w-5 text-white" />
            </div>
            <DialogTitle>Send reminder</DialogTitle>
          </div>
          <DialogDescription>
            Send reminder to <span className="font-semibold text-foreground">{evaluatorName}</span>{" "}
            for <span className="font-semibold text-foreground">{employeeName}</span> –{" "}
            <span className="font-semibold text-foreground">{projectClient}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note">Optional note</Label>
            <Input
              id="note"
              placeholder="Add a brief message (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ background: "var(--gradient-card)" }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{ background: "var(--gradient-primary)" }}
            className="text-white"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
