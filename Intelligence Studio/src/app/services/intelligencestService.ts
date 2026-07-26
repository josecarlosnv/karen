const BASE = import.meta.env.VITE_API_URL as string;

export interface StudioUpdate {
  id: number;
  type: "banner" | "recent_update";
  area: string;
  title?: string;
  message: string;
  subtitle?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ResearchLibraryItem {
  id: number;
  category: string;
  title: string;
  description?: string;
  badge?: string;
  externalLink?: string;
  isActive: boolean;
  displayOrder: number;
}

export const getUpdates = (type?: string, area?: string): Promise<StudioUpdate[]> => {
  const p = new URLSearchParams();
  if (type) p.append("type", type);
  if (area) p.append("area", area);
  return fetch(`${BASE}/api/intelligencestupdates?${p}`).then(r => r.json());
};

export const getResearchLibrary = (category?: string): Promise<ResearchLibraryItem[]> => {
  const p = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetch(`${BASE}/api/intelligencestresearchlibrary${p}`).then(r => r.json());
};
