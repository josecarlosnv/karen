import { http } from "./http";

export const catalogoIndustrias = {
    listIndustrias: async () => {
        const { data } = await http.get("api/Industria/Industrias");
        return data;
    },
};