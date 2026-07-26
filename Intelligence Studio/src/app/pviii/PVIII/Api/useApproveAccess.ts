import { useEffect, useState } from "react";
import { getApprovalsAccess } from "./approvalsApi";
import { useNavigate } from "react-router";

export function useApproverAccess() {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [practice, setPractice] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [data, setData] = useState<any>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const res = await getApprovalsAccess();

                setData(res);
                setHasAccess(true);
                const username = res.name?.split("\\")[1]?.toLowerCase() ?? "";
                const fullEmail = username ? `${username}@kpmg.com.mx` : "";

                setEmail(fullEmail);
                
                const detectedRoles = [];

                if (res.level === "vMaster") detectedRoles.push("vMaster");

                if (res.level === "Level3") detectedRoles.push("Level3");

                if (res.level === "Level4") detectedRoles.push("Level4");

                if (res.level === "lead-partner") detectedRoles.push("lead-partner");

                setRoles(detectedRoles);
                setPractice(res.practice ?? null);

            } catch (err: any) {
                if (err.response?.status === 403) {
                    setHasAccess(false);
                    navigate("/unauthorized");
                } else {
                    console.error("Error getting access", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAccess();
    }, [navigate]);

    return {
        loading,
        hasAccess,
        practice,
        email,
        data
    };
}
