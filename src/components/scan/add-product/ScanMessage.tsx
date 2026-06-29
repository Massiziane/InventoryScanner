type ScanMessageProps = {
  message: string;
};

export default function ScanMessage({ message }: ScanMessageProps) {
  if (!message) return null;

  return (
    <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
      {message}
    </p>
  );
}