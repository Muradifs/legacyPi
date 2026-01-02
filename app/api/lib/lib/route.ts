import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
// Koristimo relativnu putanju za sigurnost
import { nonces } from "./";

export async function GET() {
  try {
    // Generiraj nasumični nonce
    const nonceBytes = randomBytes(32);
    const nonce = nonceBytes.toString("base64");
    const nonceId = randomBytes(8).toString("hex");

    // Spremi ga u memoriju
    nonces.set(nonceId, nonce);

    // Obriši ga automatski nakon 2 minute (da se memorija ne puni)
    setTimeout(() => nonces.delete(nonceId), 2 * 60 * 1000);

    return NextResponse.json({ nonce, nonceId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}