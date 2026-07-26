export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-4 py-1.5 rounded-md text-xs font-medium text-white bg-gradient-to-r from-[#00338d] to-[#1E49E2] shadow-sm">
      {status}
    </span>
  );
}
