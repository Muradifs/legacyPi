import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Globalna varijabla za pohranu (radi na serverlessu dok je instanca živa)
// U produkciji bi ovo bio Redis, ali za demo je ovo dovoljno.
if (!global.nonceStore) {
  global.nonceStore = new Map<string, string>();
}

export async function GET() {
  try {
    const nonceBytes = randomBytes(32);
    const nonce = nonceBytes.toString("base64");
    const nonceId = randomBytes(8).toString("hex");

    global.nonceStore.set(nonceId, nonce);
    
    // Briši nakon 2 min
    setTimeout(() => global.nonceStore.delete(nonceId), 120000);

    return NextResponse.json({ nonce, nonceId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}

// Deklaracija za TypeScript da ne viče
declare global {
  var nonceStore: Map<string, string>;
}