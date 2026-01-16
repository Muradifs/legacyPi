import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl w-full space-y-8 mt-10 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-yellow-500">Privacy Policy</h1>
        <p className="text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="space-y-6 text-slate-300 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <section>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-500" /> 1. Data Collection
          </h2>
          <p>
            LegacyPi does not store personal data on traditional servers. We use your Pi Username and unique identifier (UID) solely for authentication and blockchain transaction verification.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">2. Blockchain Transparency</h2>
          <p>
            All donations are recorded on the Pi Blockchain. This data is public and immutable. By using this service, you acknowledge that your transaction details (Wallet Address, Amount) are publicly visible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">3. Third-Party Services</h2>
          <p>
            We utilize the Pi Network SDK for authentication and payments. Please refer to the Pi Network Privacy Policy for details on how they handle your data.
          </p>
        </section>
      </div>
    </div>
  );
}