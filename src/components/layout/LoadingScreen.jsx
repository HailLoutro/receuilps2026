import { Clock, Layers } from "lucide-react";
import { BRAND } from "../../config/constants";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0a0e3a,#4e54c8)" }}>
      <link href={BRAND.font} rel="stylesheet" />
      <div className="flex items-center gap-3 text-white">
        <Clock size={24} className="animate-spin" />
        <span className="text-lg font-semibold">Chargement...</span>
      </div>
    </div>
  );
}
