import { useEffect, useState } from "react";
import { AlertTriangle, Zap, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function UnderConstruction() {
  const [checkAgain, setCheckAgain] = useState(false);
  const [, setLocation] = useLocation();

  const handleCheckAgain = async () => {
    setCheckAgain(true);
    try {
      const res = await fetch("/api/settings");
      const settings = await res.json();
      if (!settings.maintenanceMode) {
        // Redirect to home if maintenance is off
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error checking maintenance status:", err);
    } finally {
      setCheckAgain(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center px-6 py-12 relative">
      {/* Admin Login Button - Bottom Left */}
      <button
        onClick={() => setLocation("/admin")}
        className="fixed bottom-6 left-6 p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-primary/50 text-zinc-400 hover:text-primary rounded-xl transition-all"
        title="Admin Login"
      >
        <Lock className="w-5 h-5" />
      </button>

      <div className="max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
          Website Under Construction
        </h1>

        <p className="text-xl text-zinc-400 mb-8 font-medium">
          We're making improvements to better serve you. We'll be back online soon!
        </p>

        <div className="bg-[#101218] border border-zinc-800 rounded-2xl p-8 mb-8">
          <p className="text-zinc-500 text-sm mb-4">
            In the meantime, you can still reach us on:
          </p>
          <a
            href="https://discord.gg/tZ92ykfkXa"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold uppercase tracking-widest rounded-xl transition-colors"
          >
            <Zap className="w-5 h-5" /> Discord Server
          </a>
        </div>

        <button
          onClick={handleCheckAgain}
          disabled={checkAgain}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-black uppercase tracking-wider rounded-xl transition-colors"
        >
          {checkAgain ? "Checking..." : "Check Again"}
        </button>
      </div>
    </div>
  );
}
