import { http } from "./http";

export const pviiiEntities = {
    async InUpEntiti(p8Id: string, payload: any) {
        const { data } = await http.put(`/api/pviii/entities/${p8Id}`, payload);
        return data;
    },
    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },
    listcatAudit: async () => {
        const { data } = await http.get("/api/Auditworkflow/CatAudit");
        return data;
    },
    listNature: async () => {
        const { data } = await http.get("/api/EngagementNature/Nature");
        return data;
    },

    listReportTypes: async () => {
        const { data } = await http.get("/api/ReportType/ReportType");
        return data;
    },
};