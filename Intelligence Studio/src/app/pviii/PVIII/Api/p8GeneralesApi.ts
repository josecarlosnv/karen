//este archivo se usa la vista inicial 
import { http } from "./http";
import type { StatusType } from "../components/StatusChip";

function mapStatusById(statusId: number | null | undefined): StatusType {
    switch (statusId) {
        case 1:
            return "approved";
        case 2:
            return "draft";
        case 3:
            return "pending";
        case 4:
            return "progress";
        default:
            return "draft";
    }
}
function resolveStatus(x: any): StatusType {

    if (x.valuation === null) {
        return "needs-changes";
    }
    if (x.valuation === 0) {
        return mapStatusById(x.p8StatusId);
    }

    if (x.p8StatusId === 1) { 
        if (x.isException === null) {
            return "approved";
        }

        if (x.isException === true) {
            return "exception";
        }
    }

    return mapStatusById(x.p8StatusId);
}
export const p8GeneralesApi = {
    async list() {
        const res = await http.get("/api/P8Generales");
        const data = res.data;


        if (!data.objects || !Array.isArray(data.objects)) {
            console.warn("API no entregó objects[], entregó:", data);
            return [];
        }

        return data.objects.map((x: any) => ({
            id: x.sumClientId,
            IdP8: x.p8Id,
            name: x.clientName,
            segment: x.segmentLabel,
            partner: x.currentEngagementPartnerName?.replace(/\r?\n/g, "").trim(),
            manager: x.currentEngagementManagerName?.replace(/\r?\n/g, "").trim(),
            ingreso: x.p8revenueTypeLabel,
            lastP8: x.p8FiscalYearLabel,
            status: mapStatusById(x.p8StatusId),
            lostClient :x.isLost,
            BU: x.businessUnitIdLabel, //by ñerik
        }));
    },

    async deactivate(p8Id: string) {
        await http.put(`/api/P8Generales/desactivate/${p8Id}`);
    },
    async IsLost(p8Id: string) {
        await http.put(`/api/P8Generales/IsLost/${p8Id}`);
    }
    , async duplicate(p8Id: string) {
        return await http.post(`/api/P8Generales/Duplicate/${p8Id}`);
    }
};

