import { http } from "./http";

export interface StaffItem {
    id: string;
    name: string;
}
export const staffApi = {

    async getPartners(): Promise<StaffItem[]> {
        try {
            const res = await http.get("/api/Entity/partners");

            return (res.data || []).map((item: StaffItem) => ({
                id :String(item.id),
                name: item.name?.trim(),  
            }));
        } catch (err) {
            console.error("Error fetching partners:", err);
            return [];
        }
    },

    async getManagers(): Promise<StaffItem[]> {
        try {
            const res = await http.get("/api/Entity/managers");

            return (res.data || []).map((item: StaffItem) => ({
                id: String(item.id),

                name: item.name?.trim(),
            }));
        } catch (err) {
            console.error("Error fetching managers:", err);
            return [];
        }
    },
    async getComisario(): Promise<StaffItem[]> {
        try {
            const res = await http.get("/api/Entity/comisario");

            return (res.data || []).map((item: StaffItem) => ({
                id: String(item.id),

                name: item.name?.trim(),
            }));
        } catch (err) {
            console.error("Error fetching comisarios:", err);
            return [];
        }
    },

    async getOffices(): Promise<StaffItem[]> {
        try {
            const res = await http.get("/api/Entity/Office");

            return (res.data || []).map((item: StaffItem) => ({
                id: item.id?.trim(),
                name: item.name?.trim(),
            }));
        } catch (err) {
            console.error("Error fetching Offices:", err);
            return [];
        }
    },
    async getTeamLeaderStats(): Promise<TeamLeaderStats[]> {
        try {
            const res = await http.get("/api/Entity/EstadisticasTeamLeaders");
            return res.data || [];
        } catch (err) {
            console.error("Error fetching Team Leader Stats:", err);
            return [];
        }
    }
};
export interface TeamLeaderStats {
    catTeamLeaderId: number;
    employeeId: number;
    employeeName: string;
    levelLabel: string;
    yearsInRole: number | null;
    isFirstYear: boolean;
    qprResult: boolean;
    openPdIndicator: boolean;
}