// app/api/employeeDirectoryApi.ts
const API_BASE = import.meta.env.VITE_SCOREFY_API_URL ?? "";



export const employeeDirectoryApi = {
    async search(term: string) {
        const q = new URLSearchParams();
        if (term) q.set("term", term);

        const res = await fetch(`${API_BASE}/api/employees/search?${q.toString()}`, {
            credentials: "include", mode: "cors",
            
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },
};
