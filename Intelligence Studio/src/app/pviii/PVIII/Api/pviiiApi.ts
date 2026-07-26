//este archivo es para crear el proyecto de PVIII
import { http } from "./http";

export const pviiiApi = {
    async createProject(payload: any) {
        const { data } = await http.post("/api/Pviii/create", payload);
        return data;
    },

    async getCurrentUserEmail() {
        const { data } = await http.get("/api/Pviii/user/email");
        return data.email;
    },

    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },
    async updateEngagementDetails(p8Id: string, payload: any) {
        const { data } = await http.put(`/api/Pviii/general-data/${p8Id}/engagement-details`, payload);
        return data;
    },
    async getFramework(p8Id: string) {
        try {
            const { data } = await http.get(`/api/Pviii/framework/${p8Id}`);
            return data.object;             
        } catch (err: any) {
            if (err.response?.status === 400) {
                return null;                
            }
            throw err;                      
        }
    },
    async saveFramework(p8Id: string, payload: any) {
        const { data } = await http.post(`/api/Pviii/framework/${p8Id}`, payload);
        return data;
    },
    async updateQuality(p8Id, payload) {
        const { data } = await http.put(`/api/Pviii/quality/${p8Id}`, payload);
        return data;
    },
    async searchEntities(
        query?: string,
        page: number = 1,
        pageSize: number = 20
    ) {
    const { data } = await http.get("/api/Pviii/search", {
            params: {
                query,
                page,
                pageSize
            }
        });

        return data;
    },
    async getCountry() {
        const { data } = await http.get("/api/Country/Country");
        return data;
    },
};
