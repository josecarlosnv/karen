


import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { FileCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { FinalConclusionSection } from "@/app/components/conclusion/FinalConclusionSection";
import { EmployeeInfoPanel } from "@/app/components/conclusion/EmployeeInfoPanel";
import { Employee } from "@/app/components/conclusion/EmployeeSelector";

import { finalConclusionApi } from "../../app/api/finalConclusionApi";

type SectionState = "edit" | "view" | "locked";
type SectionStatus = "pending" | "in-progress" | "completed";

interface SectionStateData {
    state: SectionState;
    status: SectionStatus;
    data?: any;
    editorName?: string;
    lastUpdated?: string;
}

export function FinalConclusion() {


    const fy = 2026;

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [noEmployees, setNoEmployees] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee | null>(null);
    const [consolidatedRatings, setConsolidatedRatings] = useState(null);

    const [performanceManagerSection, setPerformanceManagerSection] = useState<SectionStateData>({
        state: "edit",
        status: "pending",
    });

    const [committeeSection, setCommitteeSection] = useState<SectionStateData>({
        state: "locked",
        status: "pending",
    });

    const [calibrationSection, setCalibrationSection] = useState<SectionStateData>({
        state: "locked",
        status: "pending",
    });

    const [userSecurity, setUserSecurity] = useState(null);


    //const isCommittee =
    //    userSecurity?.roles?.includes("COMMITTE");

    //const isPM =
    //    userSecurity?.roles?.includes("MANAGER") ||
    //    userSecurity?.roles?.includes("PM_VIEW");

    //const isAll =
    //    userSecurity?.roles?.includes("ALL");


    const roles = userSecurity?.roles ?? [];

    const canEditPM =
        roles.includes("MANAGER") ||
        roles.includes("PM_VIEW") ||
        roles.includes("KEY") ||                 // ✅ KEY puede PM
        roles.includes("RESOURCE_MANAGER") ||     // ✅ RM puede PM
        roles.includes("ALL");

    const canEditCommittee =
        roles.includes("COMMITTE") ||
        roles.includes("KEY") ||                 // ✅ KEY puede Committee
        roles.includes("RESOURCE_MANAGER") ||     // ✅ RM puede Committee
        roles.includes("ALL");

        const canEditResource = 
            roles.includes("KEY");




    useEffect(() => {
        async function loadSecurity() {
            try {
                const sec = await finalConclusionApi.getMySecurity();
                setUserSecurity(sec);
            } catch {
                setUserSecurity(null); // ← usuario no está en seguridad
            }
        }
        loadSecurity();
    }, []);

    // ✅ 1. Cargar catálogo real de empleados
    useEffect(() => {
        async function loadEmployees() {
            try {
                const data = await finalConclusionApi.getCatalog();


                if (!data || data.length === 0) {
                    setNoEmployees(true);
                    setEmployees([]);
                    return;
                }

                setEmployees(data);
            } catch (err) {
                console.error(err);
                setNoEmployees(true);
            }
        }
        loadEmployees();
    }, []);


    useEffect(() => {
        if (!selectedEmployee) return;

        // ✅ RESET OBLIGATORIO AL CAMBIAR EMPLEADO
        setPerformanceManagerSection({
            state: "edit",
            status: "pending",
            data: undefined,
            editorName: undefined,
            lastUpdated: undefined,
        });

        setCommitteeSection({
            state: "locked",
            status: "pending",
            data: undefined,
            editorName: undefined,
            lastUpdated: undefined,
        });

        setCalibrationSection({
            state: "locked",
            status: "pending",
            data: undefined,
            editorName: undefined,
            lastUpdated: undefined,
        });

        setConsolidatedRatings(null);


        async function loadFull() {
            try {
                const full = await finalConclusionApi.getFull(
                    Number(selectedEmployee),
                    fy
                );

                const pmExists = !!full.performanceManager;
                
                const workflow = await finalConclusionApi.getWorkflow(
                    Number(selectedEmployee),
                    fy
                );

                // ✅ EMPLOYEE INFO
                const [firstName, ...rest] = full.employee.fullName.split(" ");
                setSelectedEmployeeData({
                    id: full.employee.employeeId.toString(),
                    fullName: full.employee.fullName,
                    firstName,
                    lastName: rest.join(" "),
                    office: full.employee.office,
                    category: full.employee.category,
                });

                // ✅ PM SECTION (IMPORTANTE: pasar .data)
                // ✅ PERFORMANCE MANAGER SECTION

                if (!pmExists && !canEditPM) {
                    // No existe PM y el usuario NO puede capturar
                    setPerformanceManagerSection({
                        state: "locked",
                        status: "pending",
                        data: undefined,
                    });
                } else {
                    setPerformanceManagerSection({
                        state: workflow.pmCompleted ? "view" : "edit",
                        status: workflow.pmCompleted ? "completed" : "in-progress",
                        data: full.performanceManager?.data,
                        editorName: full.performanceManager?.editor,
                        lastUpdated: full.performanceManager?.lastUpdate,
                    });
                }


                const pmCompleted = !!full.performanceManager;
                const committeeExists = !!full.committee;
                const canEditCommittee =
                    userSecurity?.roles?.includes("COMMITTE") ||
                    userSecurity?.roles?.includes("ALL") ||
                    userSecurity?.roles?.includes("KEY");

                // ✅ COMMITTEE SECTION

                if (!pmCompleted) {
                    setCommitteeSection({
                        state: "locked",
                        status: "pending",
                        data: undefined,
                    });
                }
                else if (!committeeExists) {
                    if (canEditCommittee) {
                        setCommitteeSection({
                            state: "edit",
                            status: "in-progress",
                            data: undefined,
                        });
                    } else {
                        setCommitteeSection({
                            state: "locked",
                            status: "pending",
                            data: undefined,
                        });
                    }
                }
                else {
                    setCommitteeSection({
                        state: "view",
                        status: "completed",
                        data: full.committee.data,
                        editorName: full.committee.editor,
                        lastUpdated: full.committee.lastUpdate,
                    });
                }


                // ✅ CALIBRATION SECTION
                

                setCalibrationSection({
                    state: committeeExists
                        ? (workflow.calibrationCompleted ? "view" : "edit")
                        : "locked",

                    status: workflow.calibrationCompleted
                        ? "completed"
                        : committeeExists
                            ? "in-progress"
                            : "pending",

                    data: full.calibration?.data,
                    editorName: full.calibration?.editor,
                    lastUpdated: full.calibration?.lastUpdate,
                });

                setConsolidatedRatings(full.consolidated);
            } catch (err) {
                console.error(err);
            }
        }

        loadFull();
    }, [selectedEmployee]);


    const rebuildSections = (full: any, workflow: any) => {
        const pmCompleted = workflow.pmCompleted;
        const committeeCompleted = workflow.committeeCompleted;

        const canEditCommittee =
            userSecurity?.roles?.includes("COMMITTE") ||
            userSecurity?.roles?.includes("ALL") ||
            userSecurity?.roles?.includes("KEY");

        // ✅ PM

        setPerformanceManagerSection({
            state: workflow.pmCompleted ? "view" : "edit",
            status: workflow.pmCompleted ? "completed" : "in-progress",
            data: full.performanceManager?.data,
            editorName: full.performanceManager?.editor,
            lastUpdated: full.performanceManager?.lastUpdate,
        });

        //setPerformanceManagerSection({
        //    state: pmCompleted ? "view" : "edit",
        //    status: pmCompleted ? "completed" : "in-progress",
        //    data: full.performanceManager,
        //    editorName: full.performanceManager?.editor,
        //    lastUpdated: full.performanceManager?.lastUpdate,
        //});

        // ✅ COMMITTEE
        if (!pmCompleted) {
            setCommitteeSection({
                state: "locked",
                status: "pending",
                data: undefined
            });
        }
        else if (!committeeCompleted) {
            if (canEditCommittee) {
                setCommitteeSection({
                    state: "edit",
                    status: "in-progress",
                    data: undefined
                });
            } else {
                setCommitteeSection({
                    state: "locked",
                    status: "pending",
                    data: undefined
                });
            }
        }
        else {
            setCommitteeSection({
                state: "view",
                status: "completed",
                data: full.committee,
                editorName: full.committee?.editor,
                lastUpdated: full.committee?.lastUpdate,
            });
        }

        // ✅ CALIBRATION (igual que tienes)

        setCalibrationSection({
            state: committeeCompleted ? "edit" : "locked",
            status: committeeCompleted ? "in-progress" : "pending",
            data: full.calibration?.data,
            editorName: full.calibration?.editor,
            lastUpdated: full.calibration?.lastUpdate,
        });


        // ✅ Consolidated
        setConsolidatedRatings(full.consolidated);
    };


    const reloadWorkflowAndSections = async () => {
        if (!selectedEmployee) return;

        // ✅ Llamar Full
        const full = await finalConclusionApi.getFull(Number(selectedEmployee), fy);

        // ✅ Llamar workflow
        const workflow = await finalConclusionApi.getWorkflow(Number(selectedEmployee), fy);

        // ✅ RECONSTRUIR todas las secciones (incluye bloqueos por rol)
        rebuildSections(full, workflow);
    };

    // ✅ 3. Save PM
    const handlePerformanceManagerSave = async (data: any) => {
        try {
            await finalConclusionApi.savePM(Number(selectedEmployee), fy, data);

            setPerformanceManagerSection({
                state: "view",
                status: "completed",
                data,
            });


            const sec = await finalConclusionApi.getMySecurity();
            setUserSecurity(sec);

            // ✅ Volver a evaluar permisos y estados del workflow
            await reloadWorkflowAndSections();

            toast.success("Performance Manager section saved");
        } catch (err) {
            toast.error("Error saving Performance Manager");
        }
    };

    // ✅ 4. Save Committee
    const handleCommitteeSave = async (data: any) => {
        try {
            await finalConclusionApi.saveCommittee(Number(selectedEmployee), fy, data);

            setCommitteeSection({
                state: "view",
                status: "completed",
                data,
            });

            setCalibrationSection({
                state: "edit",
                status: "in-progress",
            });

            const full = await finalConclusionApi.getFull(Number(selectedEmployee), fy);
            setConsolidatedRatings(full.consolidated);


            toast.success("Committee section saved");
        } catch (err) {
            toast.error("Error saving Committee");
        }
    };

    // ✅ 5. Save Calibration
    const handleCalibrationSave = async (data: any) => {
        try {
            await finalConclusionApi.saveCalibration(
                Number(selectedEmployee),
                fy,
                data
            );
            
             //✅ RECONSTRUIR ESTADO (esto la cerrará)
            await reloadWorkflowAndSections();

            setCalibrationSection({
                state: "view",
                status: "completed",
                data,
            });

            toast.success("Calibration section saved");
        } catch (err) {
            toast.error("Error saving Calibration");
        }
    };

    const handleDeleteSection = async (section: "performance-manager" | "committee" | "calibration") => {
        if (!selectedEmployee) return;

        await finalConclusionApi.deleteSection(
            section,
            Number(selectedEmployee),
            fy
        );

        // 🔄 Recargar workflow y secciones
        await reloadWorkflowAndSections();
    };

    const handlePerformanceManagerDelete = async () => {
        await finalConclusionApi.deleteSection("performance-manager", Number(selectedEmployee), fy);

        setPerformanceManagerSection({
            state: "edit",
            status: "pending",
            data: undefined,
            editorName: undefined,
            lastUpdated: undefined,
        });

        setCommitteeSection({ state: "locked", status: "pending" });
        setCalibrationSection({ state: "locked", status: "pending" });

        toast.success("Performance Manager section deleted");
    };

    const handleCommitteeDelete = async () => {
        await finalConclusionApi.deleteSection("performance-manager", Number(selectedEmployee), fy);

        setCommitteeSection({
            state: "edit",
            status: "pending",
            data: undefined,
            editorName: undefined,
            lastUpdated: undefined,
        });

        setCommitteeSection({ state: "locked", status: "pending" });
        setCalibrationSection({ state: "locked", status: "pending" });

        toast.success("Performance Manager section deleted");
    };

    const allCompleted =
        performanceManagerSection.status === "completed" &&
        committeeSection.status === "completed";




    if (userSecurity === null) {
        return (
            <div className="h-full w-full min-h-screen flex items-center justify-center bg-white">
                <p>Unauthorized</p>
            </div>
        );
    }


    if (noEmployees) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground">
                    No tienes empleados asignados para evaluar.
                </h2>
                <p className="text-muted-foreground mt-2">
                    Si crees que esto es un error, por favor contacta al administrador.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                        Final Conclusion
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Consolidate and finalize evaluation assessments through structured workflow
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: PM */}
                    <FinalConclusionSection
                        key={`pm-${selectedEmployee}`}
                        title="Performance Manager Conclusion"
                        subtitle="Step 1 of 3"
                        sectionType="performance-manager"
                        state={performanceManagerSection.state}
                        status={performanceManagerSection.status}
                        data={performanceManagerSection.data}
                        onSave={handlePerformanceManagerSave}
                        onEdit={() =>
                            setPerformanceManagerSection({
                                ...performanceManagerSection,
                                state: "edit",
                                status: "in-progress",
                            })
                        }
                        onDelete={() => handleDeleteSection("performance-manager")}
                        canEdit={canEditPM || canEditResource}
                        editorName={performanceManagerSection.editorName}
                        lastUpdated={performanceManagerSection.lastUpdated}
                        employeeLevel={selectedEmployeeData?.category || null}
                        hasEmployee={!!selectedEmployeeData}
                    />

                    {/* Step 2: Committee */}
                    <FinalConclusionSection
                        key={`committee-${selectedEmployee}`}
                        title="Evaluation Committee Conclusion"
                        subtitle="Step 2 of 3"
                        sectionType="committee"
                        state={committeeSection.state}
                        status={committeeSection.status}
                        data={committeeSection.data}
                        onSave={handleCommitteeSave}
                        onEdit={() =>
                            setCommitteeSection({
                                ...committeeSection,
                                state: "edit",
                                status: "in-progress",
                            })
                        }
                        onDelete={() => handleDeleteSection("committee")}
                        canEdit={canEditCommittee || canEditResource} 
                        editorName={committeeSection.editorName}
                        lastUpdated={committeeSection.lastUpdated}
                        hasEmployee={!!selectedEmployeeData}
                    />

                    {/* Step 3: Calibration */}
                    <FinalConclusionSection
                        key={`calibration-${selectedEmployee}`}
                        title="Calibration"
                        subtitle="Step 3 of 3"
                        sectionType="calibration"
                        state={calibrationSection.state}
                        status={calibrationSection.status}
                        data={calibrationSection.data}
                        onSave={handleCalibrationSave}
                        onEdit={() =>
                            setCalibrationSection({
                                ...calibrationSection,
                                state: "edit",
                                status: "in-progress",
                            })
                        }
                        canEdit={canEditCommittee || canEditResource} 
                        onDelete={() => handleDeleteSection("calibration")}
                        editorName={calibrationSection.editorName}
                        lastUpdated={calibrationSection.lastUpdated}
                        hasEmployee={!!selectedEmployeeData}
                    />



                    {allCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card
                                className="border-0"
                                style={{
                                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
                                    boxShadow: "var(--shadow-xl)",
                                }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-white">
                                        Consolidated Ratings
                                    </CardTitle>
                                    <p className="text-sm text-blue-200 mt-1">
                                        Final performance ratings across all evaluation stages
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    Rating Cards
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div
                                            className="p-4 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
                                        >
                                            <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                                                Performance Manager
                                            </p>
                                            <p className="text-4xl font-bold mt-2 text-white">{consolidatedRatings.pmRating}</p>
                                            <p className="text-sm text-blue-200 mt-1">/ 5</p>
                                        </div>

                                        <div
                                            className="p-4 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
                                        >
                                            <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                                                Committee
                                            </p>
                                            <p className="text-4xl font-bold mt-2 text-white">{consolidatedRatings.committeeRating}</p>
                                            <p className="text-sm text-blue-200 mt-1">/ 5</p>
                                        </div>

                                        <div
                                            className="p-4 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}
                                        >
                                            <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                                                Final Calibration
                                            </p>
                                            <p className="text-4xl font-bold mt-2 text-white">{consolidatedRatings.calibrationRating ?? "-"}</p>
                                            <p className="text-sm text-blue-200 mt-1">/ 5</p>
                                        </div>
                                    </div>

                                    {/* Comparison */}
                                    <div className="space-y-3">
                                        <div
                                            className="flex items-center justify-between p-3 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.1)" }}
                                        >
                                            <span className="text-sm text-blue-100">PM vs Committee</span>
                                            <div className="flex items-center gap-2 text-white font-semibold">
                                                {consolidatedRatings.committeeRating! > consolidatedRatings.pmRating! ? (
                                                    <>
                                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                                        <span className="text-green-400">+{consolidatedRatings.committeeRating! - consolidatedRatings.pmRating!}</span>
                                                    </>
                                                ) : consolidatedRatings.committeeRating! < consolidatedRatings.pmRating! ? (
                                                    <>
                                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                                        <span className="text-red-400">{consolidatedRatings.committeeRating! - consolidatedRatings.pmRating!}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Minus className="h-4 w-4" />
                                                        <span>0</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center justify-between p-3 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.1)" }}
                                        >
                                            <span className="text-sm text-blue-100">Committee vs Calibration</span>
                                            <div className="flex items-center gap-2 text-white font-semibold">
                                                {consolidatedRatings.calibrationRating! > consolidatedRatings.committeeRating! ? (
                                                    <>
                                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                                        <span className="text-green-400">
                                                            +{consolidatedRatings.calibrationRating! - consolidatedRatings.committeeRating!}
                                                        </span>
                                                    </>
                                                ) : consolidatedRatings.calibrationRating! < consolidatedRatings.committeeRating! ? (
                                                    <>
                                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                                        <span className="text-red-400">
                                                            {consolidatedRatings.calibrationRating! - consolidatedRatings.committeeRating!}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Minus className="h-4 w-4" />
                                                        <span>0</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    {/*<Button*/}
                                    {/*    className="w-full bg-white text-[var(--kpmg-blue)] hover:bg-blue-50 font-semibold"*/}
                                    {/*    size="lg"*/}
                                    {/*    onClick={() => toast.success("Final conclusion submitted")}*/}
                                    {/*>*/}
                                    {/*    <FileCheck className="mr-2 h-5 w-5" />*/}
                                    {/*    Submit Final Conclusion*/}
                                    {/*</Button>*/}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <EmployeeInfoPanel
                        employee={selectedEmployeeData}
                        employees={employees}
                        onEmployeeChange={(employeeId, employee) => {
                            setSelectedEmployee(employeeId);
                            setSelectedEmployeeData(employee);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}