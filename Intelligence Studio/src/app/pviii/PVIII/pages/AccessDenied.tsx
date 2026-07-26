
import { motion } from "motion/react";

export default function AccessDenied() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-navy-950">
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
                    className="w-full max-w-xl rounded-[28px] p-10 text-center"
                    style={{
                        background: "rgba(255,255,255,0.9)", 
                        border: "1px solid rgba(0,0,0,0.1)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
                    }}
                >
                    <h1
                        className="mb-4"
                        style={{
                            color: "#000000",
                            fontSize: "1.6rem",
                            fontWeight: 600,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Acceso no autorizado
                    </h1>

                    <p
                        className="mb-4"
                        style={{
                            color: "#1f2937",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                        }}
                    >
                        El perfil con el que se intenta ingresar no cuenta con autorización
                        para acceder a P8.
                    </p>

                    <p
                        style={{
                            color: "#4b5563",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                        }}
                    >
                        En caso de requerir acceso, favor de gestionarlo a través del proceso
                        establecido.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}