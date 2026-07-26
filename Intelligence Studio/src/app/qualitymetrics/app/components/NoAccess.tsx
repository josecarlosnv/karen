import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ShieldAlert, ArrowLeft } from "lucide-react";

type NoAccessProps = {
  title?: string;
  message?: string;
  showBackButton?: boolean;   // nuevo
};

export function NoAccess({
  title = "No cuentas con permisos",
  message = "Tu perfil no tiene acceso a esta sección. Si crees que es un error, contacta al administrador de Quality Metrics.",
  showBackButton = true,      // nuevo
}: NoAccessProps) {

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-950">
      {/* Acentos azules KPMG */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(30,73,226,0.18) 0%, rgba(30,73,226,0) 50%),
            radial-gradient(circle at 82% 78%, rgba(0,94,184,0.16) 0%, rgba(0,94,184,0) 48%)
          `,
        }}
      />
      <div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(30,73,226,0.14)" }}
      />
      <div
        className="absolute right-0 bottom-0 h-80 w-80 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(0,51,141,0.16)" }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-[28px] p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >
          {/* Ícono */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45, type: "spring", stiffness: 180 }}
            className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(30,73,226,0.30) 0%, rgba(0,51,141,0.20) 100%)",
              border: "1px solid rgba(30,73,226,0.45)",
              boxShadow: "0 0 40px rgba(30,73,226,0.25)",
            }}
          >
            <ShieldAlert className="h-9 w-9 text-white" strokeWidth={1.75} />
          </motion.div>

          <h1
            className="mb-3"
            style={{
              color: "#FFFFFF",
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h1>

          <p
            className="mb-8"
            style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              letterSpacing: "-0.005em",
            }}
          >
            {message}
          </p>

          {showBackButton && (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 transition-all"
              style={{
                background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                boxShadow: "0 14px 30px rgba(30,73,226,0.35)",
              }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2} />
              Volver al inicio
            </motion.button>
          )}

        </motion.div>
      </div>
    </div>
  );
}
