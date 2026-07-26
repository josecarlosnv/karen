import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { Home } from "lucide-react";
import { motion, AnimatePresence, number } from "motion/react";
import { useAuth } from "../../../auth/AuthContext";
import axios from "axios";
import { http } from "../../Api/http";

export default function OtherFunctions() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

/*
  const handleSubmit = () => {
    setSubmitted(true);

    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setComments("");
    }, 1200);
  };
*/



    const { loading, hasNoAccess, claims } = useAuth();

    const practica = claims?.practica;
    const buNormalized = claims?.BU; //erikChange claims?.BU.map(x => x.toLowerCase()) //claims?.BU?.toLowerCase()
    const derived = claims?.DerivedAccess;

    const location = useLocation();

      if (loading) {
        return <div>Cargando...</div>;
    }

    if (hasNoAccess) {
        return <Navigate to="/access-denied" replace />;
    }

    const path = location.pathname;

    const cleanPath = path.replace("/PVIII", "");
    const roleKey = claims
        ? Object.keys(claims).find(k => k.toLowerCase().includes("role"))
        : null;


    const isOtherfunctions =
        cleanPath.startsWith("/insight") ;
            const rawRole = roleKey ? claims[roleKey] : undefined;
    const roles = rawRole ? (Array.isArray(rawRole) ? rawRole : [rawRole])
        : [];

    const isVMaster = claims?.vMaster === "true" || roles.includes("vMaster") || roles.includes("All");
    const isKey = roles.includes("Key");
    const practicaNormalized = practica?.toLowerCase();
    const isTaxOrAdvisory =
        buNormalized === "TAX" || buNormalized === "Tax" || buNormalized === "tax" ||
        buNormalized === "ADVISORY" || buNormalized === "Advisory" || buNormalized === "advisory";


    //const quesoy = practicaNormalized !== "audit" ? isTaxOrAdvisory : "audit";

    const All = isVMaster;

    const PICAudit = (buNormalized !== "tax" || buNormalized !== "advisory") && (practicaNormalized !== "tax" || practicaNormalized !== "advisory");

    //const PICOthers = practicaNormalized === "tax" || practicaNormalized === "advisory";

    const audit = practicaNormalized !== "tax" || practicaNormalized !== "advisory";

    const others = practicaNormalized === "tax" || practicaNormalized === "advisory";


    const atsetso = isVMaster || !PICAudit || isTaxOrAdvisory || !audit || buNormalized !== "advisory";

/*
    if (!atsetso) {
        if (isOtherfunctions) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

     if (!isTaxOrAdvisory) {
        if (isOtherfunctions) {
            return <Navigate to="/unauthorized" replace />;
        }
    }
*/
/*
const handleSubmit = async () => {
  try {
    setSubmitted(true);

    
      const payload = {
        p8Id: "p8Id",
        approvalIndicator: true,
        costCenter: claims?.costCenter,
        servicesLine: claims?.serviceLineLabel,
        comments: comments ?? null,
        createBy: claims?.Email
      };


    const response = await http.post(
      "/api/SubOtherFunctions/otherFuntion",
      payload
    );

    console.log(response.data);

    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setComments("");
    }, 1200);
  } catch (error) {
    console.error("Error al guardar:", error);
    setSubmitted(false);
  }
};
*/


const handleSubmit = async () => {
  try {
    setSubmitted(true);

    const serviceLines = claims?.serviceLineLabel ?? [];
    const costCenters = claims?.costCenter ?? [];

    for (let i = 0; i < serviceLines.length; i++) {
      const payload = {
        p8Id: "",
        approvalIndicator: true,
        costCenter: Number(costCenters[i]),
        servicesLine: serviceLines[i],
        comments: comments ?? null,
        createBy: claims?.Email
      };

      await http.post(
        "/api/SubOtherFunctions/otherFuntion",
        payload
      );
    }

    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setComments("");
    }, 1200);

  } catch (error) {
    console.error("Error al guardar:", error);
    setSubmitted(false);
  }
};



if (isVMaster || isTaxOrAdvisory || practicaNormalized === "tax" || practicaNormalized === "advisory") {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06163D]">
      {/* Floating Actions */}
      <div className="absolute top-5 left-5 z-30 flex items-center gap-3 pointer-events-none">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            pointer-events-auto
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-black/20
            backdrop-blur-xl
            border border-white/10
            text-white/90
            shadow-lg
            hover:bg-black/30
            hover:border-white/20
            transition-all
          "
        >
          <Home className="w-4 h-4" />
        </button>

        {/* erik
        <div className="text-red-500">{practicaNormalized}</div>
        <div className="text-red-500">{buNormalized}</div>
        <div className="text-red-500">{claims?.Email}</div>
        */}

        {/* Confirm */}
        {practicaNormalized === "tax" || practicaNormalized === "advisory" ?
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="
            pointer-events-auto
            h-10 px-5
            rounded-full
            bg-[#00338D]/90
            backdrop-blur-xl
            border border-[#4FA3FF]/20
            text-white
            text-sm
            font-medium
            shadow-[0_8px_30px_rgba(0,51,141,0.45)]
            hover:bg-[#0046C7]
            transition-all
          "
        >
          Confirm
        </button>: <></>}
      </div>

      {/* Dashboard */}
      <iframe
        src="https://app.powerbi.com/reportEmbed?reportId=64a52e10-4430-44c5-ae1c-bf37943274b1&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2"
        title="Other Functions Dashboard"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
      />

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  w-full max-w-xl
                  rounded-2xl
                  bg-white
                  shadow-[0_40px_80px_rgba(0,0,0,0.25)]
                  overflow-hidden
                "
              >
                <div className="px-8 py-6 border-b border-slate-100">
                  <h2 className="text-[#00338D] text-lg font-semibold">
                    Confirm Resource Availability
                  </h2>
                </div>

                <div className="px-8 py-6 space-y-5">
                  <p className="text-sm leading-relaxed text-slate-600">
                    I confirm that the staffing requirements have been reviewed
                    and that the Service Line has the resources and capacity
                    required to support this engagement.
                  </p>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.08em] text-slate-400 mb-2">
                      Comments (Optional)
                    </label>

                    <textarea
                      rows={4}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add any notes or observations..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        py-3
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#00338D]/20
                        focus:border-[#00338D]
                      "
                    />
                  </div>
                </div>

                <div className="px-8 pb-8 flex justify-end gap-3">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="
                      h-10
                      px-5
                      rounded-xl
                      border
                      border-slate-200
                      text-slate-500
                      hover:bg-slate-50
                      transition-all
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitted}
                    className="
                      h-10
                      px-6
                      rounded-xl
                      text-white
                      font-medium
                      bg-gradient-to-r
                      from-[#00338D]
                      to-[#1E49E2]
                      shadow-lg
                      disabled:opacity-60
                    "
                  >
                    {submitted ? "Submitted" : "Save and Submit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
  return <Navigate to="/unauthorized" replace />;
}
