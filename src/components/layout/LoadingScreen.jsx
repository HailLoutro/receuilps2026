import { Clock } from "lucide-react";
import { BRAND } from "../../config/constants";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-500">
      <div className="flex items-center gap-3 text-white">
        <Clock size={24} className="animate-spin" />
        <span className="text-lg font-semibold">{BRAND.name}</span>
      </div>
    </div>
  );
}
