import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl w-full space-y-8 mt-10 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-yellow-500">Terms of Service</h1>
        <p className="text-slate-400">Last Updated: January 1, 2026</p>
      </div>

      <div className="space-y-6 text-slate-300 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <section>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-500" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing LegacyPi, you agree to be bound by these Terms of Service and all applicable laws and regulations governing the Pi Network.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">2. Donations</h2>
          <p>
            All contributions to the LegacyPi Vault are final and non-refundable. The funds are locked via smart contract logic until the Consensus Date (2030).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">3. Disclaimer</h2>
          <p>
            LegacyPi is a community-driven initiative. We are not a bank or financial institution. The value of Pi is subject to market volatility.
          </p>
        </section>
      </div>
    </div>
  );
}