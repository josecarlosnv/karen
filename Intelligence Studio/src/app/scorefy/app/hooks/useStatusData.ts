
//import { useEffect, useMemo, useState } from "react";

//export type EvalRow = Record<string, any>;

//export type ProjectOption = { id: string; name: string };
//export type EmployeeOption = {
//    employeeId: string;
//    employeeName: string;
//    evaluatorName?: string | null;
//    keyReport: string;
//};

//function pick<T = string>(row: EvalRow, keys: string[], fallback: T | "" = "" as any): T {
//    for (const k of keys) {
//        if (row[k] !== undefined && row[k] !== null) return row[k] as T;
//        const key = Object.keys(row).find((kk) => kk.toLowerCase() === k.toLowerCase());
//        if (key && row[key] !== undefined && row[key] !== null) return row[key] as T;
//    }
//    return fallback as T;
//}

////export function useStatusData() {
////    const [loading, setLoading] = useState(false);
////    const [rows, setRows] = useState<EvalRow[]>([]);
////    const [error, setError] = useState<string | null>(null);

////    // Carga inicial
////    useEffect(() => {
////        const load = async () => {
////            try {
////                setLoading(true);
////                setError(null);
////                const res = await fetch("/api/status-reminders", { credentials: "include" });
////                if (!res.ok) throw new Error(await res.text());
////                const data = await res.json();

////                //  endpoint regresa { [...] }  o lista directa
////                const evaluations: EvalRow[] =
////                    Array.isArray(data) ? data :
////                        data?.evaluations ?? data?.Evaluations ?? [];

////                setRows(evaluations);
////            } catch (e: any) {
////                console.error(e);
////                setError(e?.message || "No se pudo cargar la información");
////            } finally {
////                setLoading(false);
////            }
////        };
////        load();
////    }, []);

////    // Proyectos (agrupa por ClientName/Project/Client)
////    const projects: ProjectOption[] = useMemo(() => {
////        const map = new Map<string, string>();
////        for (const r of rows) {
////            const clientName = pick<string>(r, ["clientName", "ClientName", "projectClient", "ProjectClient"], "");
////            if (!clientName) continue;
////            if (!map.has(clientName)) map.set(clientName, clientName);
////        }
////        return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
////    }, [rows]);

////    // Empleados por proyecto
////    const getEmployeesByProject = (projectId: string): EmployeeOption[] => {
////        const result: EmployeeOption[] = [];
////        const seen = new Set<string>();
////        for (const r of rows) {
////            const clientName = pick<string>(r, ["clientName", "ClientName", "projectClient", "ProjectClient"], "");
////            if (clientName !== projectId) continue;

////            const employeeId = pick<string>(r, ["employeeId", "EmployeeId", "empId"], "");
////            const employeeName = pick<string>(r, ["employeeName", "EmployeeName"], "");
////            const evaluatorName = pick<string>(r, ["evaluatorName", "EvaluatorName"], "");
////            const keyReport = pick<string>(r, ["keyReport", "KeyReport"], "");

////            if (!employeeId || !keyReport) continue;

////            const uniq = `${employeeId}::${keyReport}`;
////            if (seen.has(uniq)) continue;
////            seen.add(uniq);

////            result.push({ employeeId, employeeName, evaluatorName, keyReport });
////        }
////        return result.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
////    };

////    return { loading, error, projects, getEmployeesByProject, reload: () => { } };
////}
//export function useStatusData() {
//    const [projects, setProjects] = useState<ProjectOption[]>([]);
//    const [employeesByProject, setEmployeesByProject] = useState<Record<string, EmployeeOption[]>>({});
//    const [loading, setLoading] = useState(true);

//    useEffect(() => {
//        async function load() {
//            try {
//                setLoading(true);
//                const res = await fetch("/api/status-reminders", { credentials: "include" });
//                const data = await res.json();
//                const projectMap = new Map<string, string>();
//                const empMap: Record<string, EmployeeOption[]> = {};

//                data.results.forEach((item: any) => {
//                    projectMap.set(item.projectClient, item.projectClient);

//                    if (!empMap[item.projectClient]) {
//                        empMap[item.projectClient] = [];
//                    }

//                    empMap[item.projectClient].push({
//                        employeeId: item.id,
//                        employeeName: item.employeeName,
//                        keyReport: item.keyReport,
//                        evaluatorName: item.evaluatorName ?? ""
//                    });
//                });

//                setProjects(
//                    Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }))
//                );
//                setEmployeesByProject(empMap);

//            } catch (err) {
//                console.error("Error loading status data:", err);
//            } finally {
//                setLoading(false);
//            }
//        }

//        load();
//    }, []);

//    const getEmployeesByProject = (projectId: string) => {
//        return employeesByProject[projectId] || [];
//    };

//    return { loading, projects, getEmployeesByProject };
//}


//codigo Isaac

//import { useEffect, useState } from "react";

//export type ProjectOption = { id: string; name: string };
//export type EmployeeOption = {
//    employeeId: string;
//    employeeName: string;
//    evaluatorName: string;
//    keyReport: string;
//    projectClient: string;
//};

//export function useStatusData() {
//    const [projects, setProjects] = useState<ProjectOption[]>([]);
//    const [employeesByProject, setEmployeesByProject] = useState<Record<string, EmployeeOption[]>>({});
//    const [loading, setLoading] = useState(true);

//    useEffect(() => {
//        async function load() {
//            try {
//                setLoading(true);
//                const res = await fetch("/api/status-reminders/", { credentials: "include" });
//                const data = await res.json();

//                const projectMap = new Map<string, string>();
//                const empMap: Record<string, EmployeeOption[]> = {};

//                data.results.forEach((item: any) => {
//                    // Registrar proyecto
//                    projectMap.set(item.projectClient, item.projectClient);

//                    // Registrar empleado en su proyecto
//                    if (!empMap[item.projectClient]) empMap[item.projectClient] = [];

//                    empMap[item.projectClient].push({
//                        employeeId: item.id,
//                        employeeName: item.employeeName,
//                        evaluatorName: item.evaluatorName ?? "",
//                        keyReport: item.keyReport,
//                        projectClient: item.projectClient
//                    });
//                });

//                setProjects([...projectMap.entries()].map(([id, name]) => ({ id, name })));
//                setEmployeesByProject(empMap);
//            } catch (err) {
//                console.error("Error loading status data:", err);
//            } finally {
//                setLoading(false);
//            }
//        }

//        load();
//    }, []);

//    const getEmployeesByProject = (projectId: string) =>
//        employeesByProject[projectId] ?? [];

//    return { loading, projects, getEmployeesByProject };
//}

//codigo Isaac

//import { useEffect, useState } from "react";

//export type ProjectOption = { id: string; name: string };
//export type EmployeeOption = {
//    employeeId: string;
//    employeeName: string;
//    evaluatorName: string;
//    keyReport: string;
//    projectClient: string;
//};

//export function useStatusData() {
//    const [projects, setProjects] = useState<ProjectOption[]>([]);
//    const [employeesByProject, setEmployeesByProject] = useState<Record<string, EmployeeOption[]>>({});
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState<string | null>(null);


//    //useEffect(() => {
//    //    let abort = false;

//    //    async function load() {
//    //        try {
//    //            setLoading(true);
//    //            setError(null);

//    //            const data = (await api.getData()) as StatusListResponse | any;
//    //            const results: StatusItem[] = Array.isArray(data) ? data : data?.results ?? [];

//    //            const projectMap = new Map<string, string>();
//    //            const empMap: Record<string, EmployeeOption[]> = {};
//    //            const seen = new Set<string>();

//    //            for (const item of results) {
//    //                const project = item.projectClient?.trim();
//    //                if (!project) continue;

//    //                projectMap.set(project, project);

//    //                const employeeId = item.id;
//    //                const keyReport = item.keyReport;
//    //                if (!employeeId || !keyReport) continue;

//    //                const uniq = `${employeeId}::${keyReport}`;
//    //                if (seen.has(uniq)) continue;
//    //                seen.add(uniq);

//    //                const emp: EmployeeOption = {
//    //                    employeeId,
//    //                    employeeName: item.employeeName ?? "",
//    //                    evaluatorName: item.evaluatorName ?? "",
//    //                    keyReport,
//    //                    projectClient: project,
//    //                };

//    //                if (!empMap[project]) empMap[project] = [];
//    //                empMap[project].push(emp);
//    //            }

//    //            if (abort) return;

//    //            setProjects([...projectMap.entries()].map(([id, name]) => ({ id, name })));
//    //            Object.values(empMap).forEach(arr => arr.sort((a, b) => a.employeeName.localeCompare(b.employeeName)));
//    //            setEmployeesByProject(empMap);
//    //        } catch (e: any) {
//    //            console.error(e);
//    //            if (!abort) setError(e?.message || "No se pudo cargar la información");
//    //        } finally {
//    //            if (!abort) setLoading(false);
//    //        }
//    //    }

//    //    load();
//    //    return () => {
//    //        abort = true;
//    //    };
//    //}, []);
//    useEffect(() => {
//        let abort = false;

//        async function load() {
//            try {
//                setLoading(true);
//                setError(null);

//                const data = await api.getData() as any;

//
//                //const results: StatusItem[] = Array.isArray(data)
//                //    ? data
//                //    : (data?.results ?? data?.Results ?? []);
//                const results = data.results ?? data.Results ?? [];
//                // (Opcional) verifica seguridad para no confundirnos
//                const hasAccess: boolean | undefined = data?.hasAccess ?? data?.HasAccess;
//                if (hasAccess === false) {
//                    console.warn('Sin acceso. Warnings:', data?.warnings ?? data?.Warnings);
//                }

//                const projectMap = new Map<string, string>();
//                const empMap: Record<string, EmployeeOption[]> = {};
//                const seen = new Set<string>();

//                for (const item of results) {
//                    const project = item.projectClient?.trim();
//                    if (!project) continue;

//                    projectMap.set(project, project);

//
//                    const employeeId = item.id;
//                    const keyReport = item.keyReport;
//                    if (!employeeId || !keyReport) continue;

//                    const uniq = `${employeeId}::${keyReport}`;
//                    if (seen.has(uniq)) continue;
//                    seen.add(uniq);

//                    const emp: EmployeeOption = {
//                        employeeId,
//                        employeeName: item.employeeName ?? "",
//                        evaluatorName: item.evaluatorName ?? "",
//                        keyReport,
//                        projectClient: project,
//                    };

//                    if (!empMap[project]) empMap[project] = [];
//                    empMap[project].push(emp);
//                }

//                if (abort) return;

//                setProjects([...projectMap.entries()].map(([id, name]) => ({ id, name })));
//                Object.values(empMap).forEach(arr => arr.sort((a, b) => a.employeeName.localeCompare(b.employeeName)));
//                setEmployeesByProject(empMap);
//            } catch (e: any) {
//                console.error(e);
//                if (!abort) setError(e?.message || "No se pudo cargar la información");
//            } finally {
//                if (!abort) setLoading(false);
//            }
//        }

//        load();
//        return () => { abort = true; };
//    }, []);

//    const getEmployeesByProject = (projectId: string) => employeesByProject[projectId] ?? [];

//    return { loading, error, projects, getEmployeesByProject };
//}
//fin codigo Isaac



// src/app/hooks/useStatusData.ts
import { useEffect, useState } from "react";
import { statusRemindersApi, StatusItem, StatusListResponse } from "@/app/api/statusReminders";

export type ProjectOption = { id: string; name: string };
export type EmployeeOption = {
    employeeId: string;
    employeeName: string;
    evaluatorName: string;
    keyReport: string;
    projectClient: string;
};

export function useStatusData() {
    const [projects, setProjects] = useState<ProjectOption[]>([]);
    const [employeesByProject, setEmployeesByProject] = useState<Record<string, EmployeeOption[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let abort = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await statusRemindersApi.getData();
                const results: StatusItem[] = (data as any)?.results ?? (data as any)?.Results ?? [];

                const hasAccess: boolean | undefined = (data as any)?.hasAccess ?? (data as any)?.HasAccess;
                if (hasAccess === false) {
                    console.warn("Sin acceso. Warnings:", (data as any)?.warnings ?? (data as any)?.Warnings);
                }

                const projectMap = new Map<string, string>();
                const empMap: Record<string, EmployeeOption[]> = {};
                const seen = new Set<string>();

                for (const item of results) {
                    //const project = item.projectClient?.trim();
                    const project = (item.projectClient ?? item.ProjectClient ?? "").trim();
                    if (!project) continue;

                    projectMap.set(project, project);

                    //const employeeId = item.id;
                    //const keyReport = item.keyReport;
                    const employeeId = item.id ?? item.Id;
                    const keyReport = item.keyReport ?? item.KeyReport;
                    if (!employeeId || !keyReport) continue;

                    const uniq = `${employeeId}::${keyReport}`;
                    if (seen.has(uniq)) continue;
                    seen.add(uniq);

                    const emp: EmployeeOption = {
                        employeeId,
                        employeeName: item.employeeName ?? "",
                        evaluatorName: item.evaluatorName ?? "",
                        keyReport,
                        projectClient: project,
                    };

                    if (!empMap[project]) empMap[project] = [];
                    empMap[project].push(emp);
                }

                if (abort) return;

                setProjects([...projectMap.entries()].map(([id, name]) => ({ id, name })));
                Object.values(empMap).forEach(arr => arr.sort((a, b) => a.employeeName.localeCompare(b.employeeName)));
                setEmployeesByProject(empMap);
            } catch (e: any) {
                console.error(e);
                if (!abort) setError(e?.message || "No se pudo cargar la información");
            } finally {
                if (!abort) setLoading(false);
            }
        }

        load();
        return () => {
            abort = true;
        };
    }, []);

    const getEmployeesByProject = (projectId: string) => employeesByProject[projectId] ?? [];

    return { loading, error, projects, getEmployeesByProject };
}