import { http } from "./http";

export const pviiiApi = {
    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },
};
