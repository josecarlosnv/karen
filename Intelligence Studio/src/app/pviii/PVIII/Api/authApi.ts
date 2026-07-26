import { http } from "./http";

export async function getClaims() {
    const { data } = await http.get("/api/Auth/claims");
    return data;
}