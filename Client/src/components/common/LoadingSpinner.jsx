import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading...", fullScreen }) {
  const content = (
    <div className="flex items-center gap-2 text-gray-500">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
