//By ISAAC
const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type SectorTypeRow = {
  Sector_ID: number;
  Sector_Desc: string;
  Is_Current: boolean;
};

export type SectorTypeOption = {
  id: number;
  value: string;
  label: string;
};

export const sectorTypesApi = {
  async list(): Promise<SectorTypeOption[]> {
    const res = await fetch(`${BASE}/EMT_dim_SectorType`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const rows: SectorTypeRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    return rows
      .filter(r => r.Is_Current)
      .map(r => ({
        id: r.Sector_ID,
        value: r.Sector_Desc,
        label: r.Sector_Desc,
      }));
  }
};