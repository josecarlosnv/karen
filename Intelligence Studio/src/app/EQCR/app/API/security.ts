export const Security = {
  canAccess: (user: any, section: string) => {
    if (!user) return false;
    if (user.NO_ACCESS) return false;

    const roles = user.roles || [];

    switch (section) {
      case "CREDENTIALS":
        return roles.some((r: string) =>
          ["All", "CPPP", "Deputy", "Team"].includes(r)
        );

      case "ASSIGNMENTS":
        return true;

      case "CONFIRMATION":
        return true;

      case "APPROVALS":
        return roles.some((r: string) =>
          ["All", "CPPP", "Deputy", "Team"].includes(r)
        );

      default:
        return false;
    }
  },

  getDataFilter: (user: any, row: any) => {
    if (!user) return false;

    const roles = user.roles || [];

    // Roles 1-4
    if (
      roles.some((r: string) =>
        ["All", "CPPP", "Deputy", "Team"].includes(r)
      )
    ) {
      return true;
    }

    // PIC
    if (roles.includes("PIC")) {
      return user.BU?.includes(row.BU);
    }

    // Sin rol (Partner / Director)
    return (
      row.Email?.toLowerCase() ===
      user.email?.toLowerCase()
    );
  },
};