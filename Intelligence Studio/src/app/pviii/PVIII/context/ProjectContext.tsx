
/*==================================================================================
    NUEVA FUNCION DE STEPS (SIN in_progress)
==================================================================================*/
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { useParams } from "react-router";
import { pviiiApi } from "../api/pviiiApi";

/* =========================
   TIPOS
========================= */
export type StepStatus = "not_started" | "completed";
export type ProjectStatus = "draft" | "pending" | "approved";

export interface StepData {
    stepNumber: number;
    status: StepStatus;
    data: Record<string, any>;
    savedAt?: Date;
}

export interface ProjectState {
    projectId?: string;
    projectStatus: ProjectStatus;
    steps: Record<number, StepData>;
}

interface ProjectContextType {
    projectState: ProjectState;
    getStepStatus: (stepNumber: number) => StepStatus;
    isStepCompleted: (stepNumber: number) => boolean;


    shouldShowCheck: (stepNumber: number) => boolean;

    areAllSteps1to7Completed: () => boolean;
    canCompleteStep8: () => boolean;
    saveStep: (
        stepNumber: number,
        data: Record<string, any>,
        isComplete: boolean
    ) => Promise<void>;
    markStepInProgress: (stepNumber: number) => void;
    editStep: (stepNumber: number) => void;
    getStepData: (stepNumber: number) => Record<string, any>;
    resetProject: () => void;
}

/* =========================
   CONTEXT
========================= */
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/* =========================
   ESTADO INICIAL
========================= */
const initialProjectState: ProjectState = {
    projectStatus: "draft",
    steps: {
        1: { stepNumber: 1, status: "not_started", data: {} },
        2: { stepNumber: 2, status: "not_started", data: {} },
        3: { stepNumber: 3, status: "not_started", data: {} },
        4: { stepNumber: 4, status: "not_started", data: {} },
        5: { stepNumber: 5, status: "not_started", data: {} },
        6: { stepNumber: 6, status: "not_started", data: {} },
        7: { stepNumber: 7, status: "not_started", data: {} },
        8: { stepNumber: 8, status: "not_started", data: {} },
    },
};

/* =========================
   PROVIDER
========================= */
export function ProjectProvider({ children }: { children: ReactNode }) {
    const params = useParams();
    const p8Id =
        params?.p8Id ??
        window.location.pathname.split("/").find(p =>
            /^[0-9a-fA-F-]{36}$/.test(p)
        );

    const [activeP8Id, setActiveP8Id] = useState<string | null>(null);
    const [initializedFromApi, setInitializedFromApi] = useState(false);
    const [projectState, setProjectState] =
        useState<ProjectState>(initialProjectState);

    /* -------------------------
       RESET CUANDO CAMBIA p8Id
    ------------------------- */
    useEffect(() => {
        if (!p8Id) return;

        if (activeP8Id && activeP8Id !== p8Id) {
            setProjectState(initialProjectState);
            setInitializedFromApi(false);
        }

        setActiveP8Id(p8Id);
    }, [p8Id, activeP8Id]);

    /* -------------------------
       INIT DESDE API
       (LA API ES LA ÚNICA
        FUENTE DE VERDAD)
    ------------------------- */
    useEffect(() => {
        if (!p8Id || initializedFromApi) return;

        let cancelled = false;

        async function initFromApi() {
            try {
                const data = await pviiiApi.getById(p8Id);
                if (!data?.stepperStatus || cancelled) return;

                const map: Record<string, number> = {
                    step1Context: 1,
                    step2Details: 2,
                    step3Quality: 3,
                    step4Entities: 4,
                    step5Staffing: 5,
                    step6Specialists: 6,
                    step7Valuation: 7,
                    step8Review :8
                };

                const steps = { ...initialProjectState.steps };

                Object.entries(data.stepperStatus).forEach(([key, completed]) => {
                    const step = map[key];
                    if (!step) return;

                    steps[step] = {
                        ...steps[step],
                        status: completed ? "completed" : "not_started",
                        savedAt: completed ? new Date() : undefined,
                    };
                });

                setProjectState({
                    ...initialProjectState,
                    steps,
                });

                setInitializedFromApi(true);
            } catch (error) {
                console.error("Error initializing stepper:", error);
            }
        }

        initFromApi();
        return () => {
            cancelled = true;
        };
    }, [p8Id, initializedFromApi]);

    /* -------------------------
       SYNC DESDE API
       (SOBREESCRIBE TODO)
    ------------------------- */
    const syncStepperFromApi = async () => {
        if (!p8Id) return;

        const data = await pviiiApi.getById(p8Id);
        if (!data?.stepperStatus) return;

        const map: Record<string, number> = {
            step1Context: 1,
            step2Details: 2,
            step3Quality: 3,
            step4Entities: 4,
            step5Staffing: 5,
            step6Specialists: 6,
            step7Valuation: 7,
            step8Review: 8

        };

        setProjectState(prev => {
            const steps = { ...prev.steps };

            Object.entries(data.stepperStatus).forEach(([key, completed]) => {
                const step = map[key];
                if (!step) return;

                steps[step] = {
                    ...steps[step],
                    status: completed ? "completed" : "not_started",
                    savedAt: completed ? new Date() : undefined,
                };
            });

            return { ...prev, steps };
        });
    };

    /* -------------------------
       HELPERS
    ------------------------- */
    const getStepStatus = (stepNumber: number): StepStatus =>
        projectState.steps[stepNumber]?.status ?? "not_started";

    const isStepCompleted = (stepNumber: number): boolean =>
        projectState.steps[stepNumber]?.status === "completed";

    const areAllSteps1to7Completed = (): boolean =>
        [1, 2, 3, 4, 5, 6, 7,8].every(isStepCompleted);

    const canCompleteStep8 = (): boolean => areAllSteps1to7Completed();
    const shouldShowCheck = (stepNumber: number): boolean =>
        projectState.steps[stepNumber]?.status === "completed";
    /* -------------------------
       SAVE STEP
       (NO CAMBIA STATUS)
    ------------------------- */
    const saveStep = async (
        stepNumber: number,
        data: Record<string, any>,
        _isComplete: boolean
    ) => {
        setProjectState(prev => ({
            ...prev,
            steps: {
                ...prev.steps,
                [stepNumber]: {
                    ...prev.steps[stepNumber],
                    data,
                    savedAt: new Date(),
                },
            },
        }));

        await syncStepperFromApi();
    };

    /* -------------------------
       PLACEHOLDERS
    ------------------------- */
    const markStepInProgress = (_stepNumber: number) => { };
    const editStep = (_stepNumber: number) => { };

    const getStepData = (stepNumber: number): Record<string, any> =>
        projectState.steps[stepNumber]?.data ?? {};

    const resetProject = () => {
        setProjectState(initialProjectState);
        setInitializedFromApi(false);
    };

    return (
        <ProjectContext.Provider
            value={{
                projectState,
                getStepStatus,
                isStepCompleted,

                shouldShowCheck,

                areAllSteps1to7Completed,
                canCompleteStep8,
                saveStep,
                markStepInProgress,
                editStep,
                getStepData,
                resetProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

/* =========================
   HOOK
========================= */
export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error("useProject must be used within ProjectProvider");
    }
    return ctx;
}