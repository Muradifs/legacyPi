import React from "react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-gray-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-yellow-500/30 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-yellow-500">Last Updated: December 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to LegacyPi ("the Application"). By accessing or using our Application within the Pi Network ecosystem, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. The 2030 Pledge</h2>
            <p>
              LegacyPi is a humanitarian and community-driven initiative. By sending Pi to the Vault, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Your transaction is a <strong>donation</strong> and is irreversible.</li>
              <li>The funds are intended to be locked until January 1st, 2030.</li>
              <li>You do not expect any financial profit or return on investment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. No Financial Advice</h2>
            <p>
              The content provided in this Application does not constitute financial advice, investment advice, or trading advice. LegacyPi is a social experiment and charity fund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p>
              In no event shall LegacyPi, nor its developers, be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Pi Network Compliance</h2>
            <p>
              This Application operates within the Pi Network ecosystem and complies with Pi Network's terms of service. Any violation of Pi Network policies by the user may result in restricted access.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 flex justify-center">
          {/* Koristimo standardni <a> tag umjesto Link komponente radi kompatibilnosti u preview-u */}
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