//By ISAAC
const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type LocalJobLevelRow = {
  Local_Job_Level_Name: string;
};

export type LocalJobLevelOption = {
  id: string;
  value: string;
  label: string;
};
export const LocalJobLevelApi = {
  async list(): Promise<LocalJobLevelRow[]> {
    const res = await fetch(`${BASE}/vw_EMT_Colabs/LocalJobName`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const rows: LocalJobLevelRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    return rows;
  },

  async listOptions(): Promise<LocalJobLevelOption[]> {
    const rows = await this.list();

    const unique = new Map<string, LocalJobLevelOption>();

    rows.forEach(r => {
      if (!unique.has(r.Local_Job_Level_Name)) {
        unique.set(r.Local_Job_Level_Name, {
          id: r.Local_Job_Level_Name,
          value: r.Local_Job_Level_Name,
          label: r.Local_Job_Level_Name,
        });
      }
    });

    return Array.from(unique.values());
  }
};