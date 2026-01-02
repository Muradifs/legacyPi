import { NextResponse } from "next/server";

// Ova ruta se poziva kada Pi SDK zatraži odobrenje plaćanja
export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    console.log("Processing approval for:", paymentId);

    // OVDJE BI IŠAO PRAVI POZIV PREMA PI SERVERU
    // Potreban je PI_API_KEY u .env datoteci
    
    if (!process.env.PI_API_KEY) {
        console.warn("Missing PI_API_KEY. Simulation mode.");
        // Vraćamo grešku da frontend zna da mora koristiti fallback simulaciju
        return NextResponse.json({ error: "Server API Key missing" }, { status: 500 });
    }

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Pi approval failed:", error);
      return NextResponse.json({ error: "Approval failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}