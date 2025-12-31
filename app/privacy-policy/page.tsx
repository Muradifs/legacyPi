import React from "react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-gray-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-yellow-500/30 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-yellow-500">Last Updated: December 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              To provide the LegacyPi service within the Pi Network ecosystem, we collect the following minimal information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Pi Network Username:</strong> Used to identify your pledge and display your badge.</li>
              <li><strong>Wallet Address (Public Key):</strong> Used to verify transactions on the blockchain.</li>
              <li><strong>Transaction Data:</strong> Publicly available data regarding your donation amount and timestamp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We use the collected information solely for the operation of the LegacyPi application:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>To process and verify your donations to the Vault.</li>
              <li>To display community statistics (e.g., total donors, leaderboard).</li>
              <li>To prevent fraud and ensure the security of the application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties. Your transaction data is recorded on the public Pi Blockchain, which is transparent and immutable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. User Rights</h2>
            <p>
              You have the right to access the information we hold about you. Since LegacyPi relies on the Pi Network authentication, most of your data is managed directly through your Pi Network account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 flex justify-center">
          <a href="/">
            <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
              Back to App
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
