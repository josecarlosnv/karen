import { http } from "./http";

export const catalogorevisores = {
    listrevisores: async () => {
        const { data } = await http.get("api/LSQCR_EQCR/LSQCR&EQCR");
        return data;
    },
};