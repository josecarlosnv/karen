//By ISAAC
const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type BUOfficeRow = {
  Office_ID: string;
  Office_Desc: string;
  BU_ID: number;
  BU_Desc: string;
};
export type BUOption = {
  id: number;
  value: string;
  label: string;
};

export type OfficeOption = {
  id: string;
  value: string;
  label: string;
};
export const BuOfficeApi = {
  async list(): Promise<BUOfficeRow[]> {
    const res = await fetch(`${BASE}/EMT_dim_BU/Office`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const rows: BUOfficeRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    return rows;
  },

  async listBUs(): Promise<BUOption[]> {
    const rows = await this.list();

    const unique = new Map<number, BUOption>();

    rows.forEach(r => {
      if (!unique.has(r.BU_ID)) {
        unique.set(r.BU_ID, {
          id: r.BU_ID,
          value: r.BU_Desc,
          label: r.BU_Desc,
        });
      }
    });

    return Array.from(unique.values());
  },

  async listOfficesByBU(buId: number): Promise<OfficeOption[]> {
    const rows = await this.list();

    return rows
      .filter(r => r.BU_ID === buId)
      .map(r => ({
        id: r.Office_ID,
        value: r.Office_Desc,
        label: r.Office_Desc,
      }));
  }
};
