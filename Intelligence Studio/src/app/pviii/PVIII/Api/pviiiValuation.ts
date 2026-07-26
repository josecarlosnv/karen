import { http } from "./http";

export const pviiiValuation = {
    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },

    async update(
        p8Id: string,
        payload: any
    ) {
        const { data } = await http.put(
            `/api/Pviii/valuation/${p8Id}`,
            payload
        );
        return data;
    }
}

