import { http } from "./http";

export const catalogoSegmentoApi = {
    listSegmentos: async () => {
        const { data } = await http.get("api/CatalogoSegmento/segmentos");
        return data;
    },
};