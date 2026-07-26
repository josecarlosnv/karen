import { http } from "./http";

export interface Client {
    id: number;
    clientNumber: string;
    name: string;
    segment: string;
}

function mapClient(x: any): Client {
    return {
        id: x.id,
        clientNumber: x.id.toString(),
        name: x.description,
        segment: x.groupDescription ?? "Unknown Segment"
    };
}

export const clientsApi = {

    async search(query: string): Promise<Client[]> {
        if (!query || query.length < 2) return [];

        const res = await http.get("/api/Entity/search", {
            params: { query }
        });

        return res.data.map(mapClient);
    },

   
    async getById(id: number): Promise<Client | null> {
        try {
            const res = await http.get(`/api/Entity/${id}`);
            if (!res.data) return null;
            return mapClient(res.data);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error; 
        }
    },
    async create(client: Client) {
        await http.post("/api/Entity", {
            id: client.id,
            description: client.name,
            groupId: 0, 
            groupDescription: "",
            sector: "",
            lob: ""
        });
    }
};