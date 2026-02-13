import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={`h-6 w-6 animate-spin text-primary ${className || ""}`} />;
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}
