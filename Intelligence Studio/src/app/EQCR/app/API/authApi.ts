const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type Claims = {
  networkId: string;
  email: string;
  fullName: string | null;
  roles: string[];
  BU: string[];
  Segment: string[];
  Office: string[];
  isAll: boolean;
  NO_ACCESS: boolean;
};

export const authApi = {
  async getClaims(): Promise<Claims> {
    const res = await fetch(`${BASE}/auth/claims`, {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    return data as Claims;
  }
};
