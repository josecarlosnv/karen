// api/specialist.ts
import { http } from "./http";

export const specialistApi = {
   
    listServiceLines: async () => {
        const { data } = await http.get("/api/ServiceLine/ServiceLines");
            return data;
    },

    getById: async (p8Id: string) => {
        const { data } = await http.get(`/api/SecSpecialist/Specialist/${p8Id}`);
        return data;
    },

    getAll: async () => {
        const { data } = await http.get("/api/SecSpecialist/GetAllAhoraEsPersonal");

        console.log("RAW API:", data);

        return data;
    },
    saveConfirmation: async (p8Id: string, payload: any) => {
        const { data } = await http.post(
            `/api/SecSpecialist/confirmation/${p8Id}`,
            payload
        );
        return data;
    },
    savebreakdown: async (p8Id: string, payload: any) => {
        const { data } = await http.post(
            `/api/SecSpecialist/BreakDown/${p8Id}`,
            payload
        );
        return data;
    },
    getSpecialistRates: async () => {
        const { data } = await http.get("/api/SecSpecialist/GetSpecialistRate"); 
        return data; 
    },
};
