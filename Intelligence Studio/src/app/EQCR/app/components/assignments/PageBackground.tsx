export default function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden relative"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage: `
          radial-gradient(900px 400px at 0% 20%, rgba(30, 73, 226, 0.10), transparent 70%),
          radial-gradient(800px 350px at 100% 60%, rgba(114, 19, 234, 0.08), transparent 70%),
          radial-gradient(700px 300px at 50% 100%, rgba(0, 51, 141, 0.06), transparent 70%),

          repeating-linear-gradient(
            110deg,
            rgba(0, 51, 141, 0.035) 0px,
            rgba(0, 51, 141, 0.035) 2px,
            transparent 2px,
            transparent 50px
          ),

          linear-gradient(180deg, #f8faff 0%, #eef3ff 100%)
        `,
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat, no-repeat",
        backgroundSize: "auto, auto, auto, auto, auto",
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

