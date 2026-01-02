import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
// Apsolutna putanja za sigurnost
import { nonces } from "@/app/lib/nonce-store";

export async function GET() {
  try {
    const nonceBytes = randomBytes(32);
    const nonce = nonceBytes.toString("base64");
    const nonceId = randomBytes(8).toString("hex");

    nonces.set(nonceId, nonce);
    setTimeout(() => nonces.delete(nonceId), 120000); // 2 min

    return NextResponse.json({ nonce, nonceId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}