//import { Card, CardContent } from "@/app/components/ui/card";
//import { Badge } from "@/app/components/ui/badge";
//import { Button } from "@/app/components/ui/button";
//import { Edit2, RotateCcw } from "lucide-react";
//import { motion } from "motion/react";

//interface ExceptionCardProps {
//  title: string;
//  reasonPreview: string;
//  createdOn: string;
//  createdBy: string;
//    /*exceptionType: "medical-leave" | "project-cancelled" | "not-assigned" | "other";*/
//    exceptionType: string; // "medical-leave" | "project-cancelled" | "not-assigned" | "other" | string
//  onEdit?: () => void;
//  onRestore?: () => void;
//  index: number;
//}

//const exceptionTypeLabels = {
//  "medical-leave": "Medical Leave",
//  "project-cancelled": "Project Cancelled",
//  "not-assigned": "Not Assigned",
//  other: "Other",
//};

//const exceptionTypeColors = {
//  "medical-leave": "bg-red-100 text-red-700 border-red-300",
//  "project-cancelled": "bg-orange-100 text-orange-700 border-orange-300",
//  "not-assigned": "bg-yellow-100 text-yellow-700 border-yellow-300",
//  other: "bg-gray-100 text-gray-700 border-gray-300",
//};

//export function ExceptionCard({
//  title,
//  reasonPreview,
//  createdOn,
//  createdBy,
//  exceptionType ,
//  onEdit,
//  onRestore,
//  index,
//}: ExceptionCardProps) {
//  return (
//    <motion.div
//      initial={{ opacity: 0, y: 20 }}
//      animate={{ opacity: 1, y: 0 }}
//      transition={{ duration: 0.3, delay: index * 0.05 }}
//    >
//      <Card
//        className="border-0 hover:shadow-xl transition-all duration-300"
//        style={{ boxShadow: "var(--shadow-lg)" }}
//      >
//        <CardContent className="p-6">
//          <div className="space-y-4">
//            {/* Header */}
//            <div className="flex items-start justify-between gap-4">
//              <div className="flex-1">
//                <h3 className="font-semibold text-lg text-foreground">{title}</h3>
//              </div>
//              <Badge
//                className={`${exceptionTypeColors[exceptionType]} font-medium border`}
//              >
//                {exceptionTypeLabels[exceptionType]}
//              </Badge>
//            </div>

//            {/* Reason Preview */}
//            <div className="space-y-2">
//              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
//                {reasonPreview}
//              </p>
//            </div>

//            {/* Meta Row */}
//            <div className="flex items-center justify-between pt-3 border-t border-border">
//              <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                <span>Created on {new Date(createdOn).toLocaleDateString()}</span>
//                <span>•</span>
//                <span>Created by {createdBy}</span>
//              </div>

//              {/* Actions */}
//              <div className="flex items-center gap-2">
//                <Button
//                  variant="outline"
//                  size="sm"
//                  onClick={onEdit}
//                  className="hover:bg-blue-50"
//                >
//                  <Edit2 className="h-3.5 w-3.5 mr-1.5" />
//                  Edit
//                </Button>
//                <Button
//                  variant="outline"
//                  size="sm"
//                  onClick={onRestore}
//                  className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
//                >
//                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
//                  Restore
//                </Button>
//              </div>
//            </div>
//          </div>
//        </CardContent>
//      </Card>
//    </motion.div>
//  );
//}


//CODIGO ISAAC
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Edit2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

// Si tu API puede mandar valores nuevos, deja string abierto
interface ExceptionCardProps {
    title: string;
    reasonPreview: string;
    createdOn: string;
    createdBy: string;
    exceptionType: string; // p.ej. "Medical Leave", "medical-leave", "not assigned", etc.
    onEdit?: () => void;
    onRestore?: () => void;
    index: number;
}

const exceptionTypeLabels: Record<string, string> = {
    "medical-leave": "Medical Leave",
    "project-cancelled": "Project Cancelled",
    "not-assigned": "Not Assigned",
    other: "Other",
};

const exceptionTypeColors: Record<string, string> = {
    "medical-leave": "bg-red-100 text-red-700 border-red-300",
    "project-cancelled": "bg-orange-100 text-orange-700 border-orange-300",
    "not-assigned": "bg-yellow-100 text-yellow-700 border-yellow-300",
    other: "bg-gray-100 text-gray-700 border-gray-300",
};

// --- Normalizadores & Fallbacks ---

// elimina acentos
const stripAccents = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// " Project  Cancelled  " -> "project-cancelled"
const toKey = (t: string) =>
    stripAccents((t ?? "other").toString())
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s_-]/g, "") // limpia caracteres raros
        .replace(/[\s_]+/g, "-");

// Title Case de cualquier string
const toTitleCase = (t: string) =>
    (t ?? "Other")
        .toString()
        .replace(/[-_]+/g, " ")
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

// Sinónimos / equivalencias que puedan venir de BD
const aliasToCanonical: Record<string, string> = {
    "medical leave": "medical-leave",
    "incapacidad": "medical-leave",
    "incapacidad-medica": "medical-leave",

    "project cancelled": "project-cancelled",
    "proyecto cancelado": "project-cancelled",

    "not assigned": "not-assigned",
    "no asignado": "not-assigned",
    "sin asignar": "not-assigned",
};

// Dado lo que llega del backend, devuelve la key canónica que usamos en los mapas
const resolveKey = (raw: string) => {
    const key = toKey(raw);
    if (aliasToCanonical[key]) return aliasToCanonical[key];
    // Si ya coincide con una llave válida, úsala
    if (exceptionTypeLabels[key]) return key;
    return "other"; // fallback seguro
};

export function ExceptionCard({
    title,
    reasonPreview,
    createdOn,
    createdBy,
    exceptionType,
    onEdit,
    onRestore,
    index,
}: ExceptionCardProps) {
    const key = resolveKey(exceptionType);
    const label =
        exceptionTypeLabels[key] ?? toTitleCase(exceptionType);
    const colorClass =
        exceptionTypeColors[key] ?? exceptionTypeColors["other"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card
                className="border-0 hover:shadow-xl transition-all duration-300"
                style={{ boxShadow: "var(--shadow-lg)" }}
            >
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                            </div>

                            {/* Badge con texto y color correctos SIEMPRE */}
                            <Badge className={`${colorClass} font-medium border`} title={label}>
                                {label}
                            </Badge>
                        </div>

                        {/* Reason Preview */}
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                {reasonPreview}
                            </p>
                        </div>

                        {/* Meta Row */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Created on {new Date(createdOn).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>Created by {createdBy}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                    className="hover:bg-blue-50"
                                >
                                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onRestore}
                                    className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                    Restore
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}