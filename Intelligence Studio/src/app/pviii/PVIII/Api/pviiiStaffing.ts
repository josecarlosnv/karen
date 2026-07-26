import { http } from "./http";

export const staffing = {
    

    async createUpStaffin(p8Id: string, payload: any) {
        const cutoffDate = new Date().toISOString();
        
        const { data } = await http.put(
            `/api/Pviii/staffing/${p8Id}?cutoffDate=${encodeURIComponent(cutoffDate)}`,
            payload
        );

        return data;
    },

    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },

    async calculatePreview(payload: any[]) {
        const { data } = await http.post(
            `api/Pviii/staffing/calculate`,
            payload
        );
        return data;
    },

    listTasas: async () => {
        const { data } = await http.get("/api/TasasBu/TasasBu");
        return data;
    },

    async suggestedCollaborator() {
        const { data } = await http.get(
            "/api/SuggestedCollaboratord/SuggestedCollaboratord"
        );
        return data;
    },

};