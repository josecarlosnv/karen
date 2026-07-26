

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Combobox } from "@/app/components/ui/combobox";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { toast } from "sonner";
import { Save, User, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
    personalProfileApi,
    type ManagerOption,
    type PersonalProfileDto,
} from "../../app/api/personalProfileApi";

export function UserProfile() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<PersonalProfileDto | null>(null);
    const [managerOptions, setManagerOptions] = useState<ManagerOption[]>([]);
    const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
    const [graduated, setGraduated] = useState<string>("no");
    const [postalCode, setPostalCode] = useState<string>("");
    const navigate = useNavigate();
    const [originalProfile, setOriginalProfile] =
        useState<PersonalProfileDto | null>(null);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                // Carga perfil y (si quieres) todos los managers
                const [me, managers] = await Promise.all([
                    personalProfileApi.getMe(),
                    personalProfileApi.getManagerOptions() // o getManagers({ take: 50 })
                ]);

                
                setProfile(me);
                setOriginalProfile(me);
                setManagerOptions(
                    managers.map((m) => ({
                        id: m.id,
                        value: String(m.id),
                        label: `${m.name} `, // ✅ nombre + email
                        name: m.name,
                        email: m.email,
                    }))
                );

                // 1) Preseleccionar desde el backend
                const preselected = me.pmId ? String(me.pmId) : undefined;
                setSelectedManager(preselected);

                // 2) Garantizar que la opción del PM exista en el arreglo del Combobox
                if (preselected && managers) {
                    const exists = managers.some(m => String(m.id) === preselected);
                    if (!exists && me.pmName) {
                        setManagerOptions(old => [
                            { id: Number(preselected), name: me.pmName!, email: me.pmEmail ?? "", label: me.pmName!, value: preselected },
                            ...(old ?? [])
                        ]);
                    }
                }

                // otros campos
                setGraduated(me.graduated ? "yes" : "no");
                setPostalCode(
                    me.postalCode !== null && me.postalCode !== undefined
                        ? String(me.postalCode).padStart(5, "0")
                        : ""
                );
            } catch (e: any) {
                toast.error("Error al cargar el perfil");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    

    const onSearchManagers = async (q: string) => {
        try {
            const list = await personalProfileApi.getManagerOptions(q);
            setManagerOptions(list ?? []);
        } catch (e: any) {
            toast.error("Error buscando managers");
        }
    };

    //const handleSave = async () => {
    //    try {
    //        const sel = managerOptions.find(x => String(x.id) === selectedManager);
    //        await personalProfileApi.updateProfile({
    //            pmId: sel ? sel.id : null,
    //            pmName: sel ? sel.name : null,
    //            pmEmail: sel ? sel.email : null,
    //            graduated: graduated === "yes",
    //            postalCode: postalCode ? parseInt(postalCode, 10) : null,
    //        });
    //        toast.success("Profile updated successfully");

    //        navigate("/");


    //    } catch (e: any) {
    //        toast.error("Error al guardar");
    //    }
    //};
    const handleSave = async () => {
        if (isSaving) return; // ⛔ evita doble ejecución

        try {
            setIsSaving(true);

            const sel = managerOptions.find(x => String(x.id) === selectedManager);

            await personalProfileApi.updateProfile({
                pmId: sel ? sel.id : null,
                pmName: sel ? sel.name : null,
                pmEmail: sel ? sel.email : null,
                graduated: graduated === "yes",
                postalCode: postalCode ? parseInt(postalCode, 10) : null,
            });

            toast.success("Profile updated successfully");
            navigate("/");
        } catch (e: any) {
            toast.error("Error al guardar");
        } finally {
            setIsSaving(false); // ✅ re-habilita solo cuando termina
        }
    };

    const initials = useMemo(() => {
        const name = profile?.fullName ?? "";
        const p = name.trim().split(" ").filter(Boolean);
        if (p.length === 0) return "NA";
        const first = p[0][0] ?? "";
        const last = (p.length > 1 ? p[p.length - 1][0] : p[0][0]) ?? "";
        return (first + last).toUpperCase();
    }, [profile?.fullName]);

    const hasChanges = useMemo(() => {
        if (!originalProfile) return false;

        const originalPmId = originalProfile.pmId
            ? String(originalProfile.pmId)
            : undefined;

        const originalGraduated = originalProfile.graduated ? "yes" : "no";
        const originalPostalCode = originalProfile.postalCode
            ? String(originalProfile.postalCode).padStart(5, "0")
            : "";

        return (
            selectedManager !== originalPmId ||
            graduated !== originalGraduated ||
            postalCode !== originalPostalCode
        );
    }, [originalProfile, selectedManager, graduated, postalCode]);

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-4xl font-bold" style={{ color: 'var(--kpmg-blue)' }}>My profile</h1>
                <p className="mt-2 text-lg" style={{ color: 'var(--spectrum-blue)' }}>
                    View your account information and update editable fields
                </p>
            </div>

            {/* Read-Only Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" style={{ color: 'var(--kpmg-blue)' }} />
                        <CardTitle style={{ color: 'var(--kpmg-blue)' }}>Account information</CardTitle>
                    </div>
                    <CardDescription>
                        This information is managed by your organization and cannot be changed here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6 p-4 rounded-lg bg-gradient-to-br from-blue-50/30 to-transparent border border-blue-100/50">
                        <Avatar className="h-20 w-20 ring-4 ring-white/50">
                            <AvatarFallback className="text-2xl font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div>
                                <Label className="text-xs text-muted-foreground">Full name</Label>
                                <p className="text-base font-semibold text-foreground">
                                    {loading ? "..." : (profile?.fullName ?? "-")}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Email address</Label>
                                <p className="text-sm text-foreground">
                                    {loading ? "..." : (profile?.email ?? "-")}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editable Fields */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" style={{ color: 'var(--kpmg-blue)' }} />
                        <CardTitle style={{ color: 'var(--kpmg-blue)' }}>Editable information</CardTitle>
                    </div>
                    <CardDescription>
                        Update the following fields as needed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="performanceManager">Performance manager</Label>
                        <Combobox
                            value={selectedManager}
                            onValueChange={setSelectedManager}
                            options={managerOptions}
                            placeholder="Select a manager..."
                            searchPlaceholder="Search by name..."
                            emptyText="No managers found."
                            onOpen={() => { /* ya los cargamos todos al entrar */ }}
                            onSearch={onSearchManagers}

                            // opcional: filtra desde el backend
                        />
                        <p className="text-xs text-muted-foreground">
                            Select the person responsible for your performance evaluations
                        </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="space-y-2">
                        <Label htmlFor="graduated">Professional License</Label>
                        <Select value={graduated} onValueChange={setGraduated}>
                            <SelectTrigger id="graduated">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {/*Indicates whether you have completed your degree /Confirma si tienes el documento emitido por la institución que certifica que estás titulado.*/}
                            Do you hold a Mexican professional license (cédula profesional)?
                        </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="postalCode">Postal code</Label>
                            <span className="text-xs text-muted-foreground italic">(optional)</span>
                        </div>
                        <Input
                            id="postalCode"
                            placeholder="01090"
                            className="max-w-xs"
                            value={postalCode}
                            inputMode="numeric"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, "");

                                if (value.length <= 5) {
                                    setPostalCode(value);
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Used only to avoid assigning projects far from your residence. This information is kept confidential.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">

                <Button variant="outline" onClick={() => navigate("/")}>
                    Cancel
                </Button>

                <Button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    style={
                        hasChanges && !isSaving
                            ? { background: "var(--gradient-primary)" }
                            : undefined
                    }
                    className={hasChanges && !isSaving ? "text-white" : ""}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save changes"}
                </Button>
                {/*<Button*/}
                {/*    onClick={handleSave}*/}
                {/*    disabled={!hasChanges}*/}
                {/*    style={*/}
                {/*        hasChanges*/}
                {/*            ? { background: "var(--gradient-primary)" }*/}
                {/*            : undefined*/}
                {/*    }*/}
                {/*    className={hasChanges ? "text-white" : ""}*/}
                {/*>*/}
                {/*    <Save className="mr-2 h-4 w-4" />*/}
                {/*    Save changes*/}
                {/*</Button>*/}
            </div>
        </div>
    );
}