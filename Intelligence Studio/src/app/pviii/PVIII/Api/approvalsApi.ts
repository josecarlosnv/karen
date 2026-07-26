import { http } from "./http";

export async function getApprovalsAccess() {
    const { data } = await http.get("/api/ApprovalsSeg");
    return data;
}
