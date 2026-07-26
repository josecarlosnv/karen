// By ISAAC
const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type IndepenceRiskRow = {
  EMTIndepence_ID: number;
  EMTIndepence_Desc: string;
  Is_Current: boolean;
};

export type IndepenceRiskOption = {
  id: number;
  value: string;
  label: string;
};

export const indepenceRiskApi = {
  async list(): Promise<IndepenceRiskOption[]> {
    const res = await fetch(`${BASE}/EMT_dim_IndepenceRisk`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const rows: IndepenceRiskRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];
console.log("RAW DATA:", rows);

    return rows
  .filter(r => r.Is_Current)
  .map(r => ({
    id: r.EMT_Indepence_ID,
    value: r.EMT_Indepence_Desc,
    label: r.EMT_Indepence_Desc,
  }));

  }
};