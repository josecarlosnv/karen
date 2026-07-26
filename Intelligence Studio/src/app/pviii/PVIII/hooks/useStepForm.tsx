import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { toast } from "sonner";

export function useStepForm<T extends Record<string, any>>(
  stepNumber: number,
  defaultData: T
) {
  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();

  const savedData = getStepData(stepNumber);
  const initialData = Object.keys(savedData).length > 0 ? savedData : defaultData;

  const [formData, setFormData] = useState<T>(initialData as T);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    markStepInProgress(stepNumber);
  }, []);

  useEffect(() => {
    if (isStepCompleted(stepNumber)) {
      const currentData = JSON.stringify(formData);
      const savedDataStr = JSON.stringify(savedData);
      if (currentData !== savedDataStr) {
        editStep(stepNumber);
        setHasUnsavedChanges(true);
      }
    }
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = (isComplete: boolean, showToast: boolean = true) => {
    saveStep(stepNumber, formData, isComplete);
    setHasUnsavedChanges(false);

    if (showToast) {
      toast.success(
        isComplete
          ? `Step ${stepNumber} completed and saved`
          : `Step ${stepNumber} saved as draft`
      );
    }
  };

  const handleSaveAndNavigate = (
    isComplete: boolean,
    navigateFn: () => void
  ) => {
    handleSave(isComplete, false);
    navigateFn();
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSave,
    handleSaveAndNavigate,
    hasUnsavedChanges,
    isCompleted: isStepCompleted(stepNumber),
    getStepStatus,
    isStepCompleted,
  };
}
