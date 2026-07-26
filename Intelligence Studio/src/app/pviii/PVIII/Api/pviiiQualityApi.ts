import { http } from "./http";

export const pviiiQualityApi = {
    async updateQuality(payload: any) {
        const { data } = await http.put("/api/pviii/quality", payload);
        return data;
    },
    listRisk: async () => {
        const { data } = await http.get("api/RiskLevel/RiskLevel");
        return data;
    },
};