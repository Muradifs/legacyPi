import { NextResponse } from "next/server";
import { nonces } from "@/app/lib/nonce-store";
import nacl from "tweetnacl";

// Pomoćna funkcija za dekodiranje Base64
function base64ToUint8Array(s: string) {
  return Uint8Array.from(Buffer.from(s, "base64"));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nonceId, nonce, publicKey, signature } = body;

    // 1. Provjeri nedostaju li podaci
    if (!nonceId || !nonce || !publicKey || !signature) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // 2. Provjeri je li nonce valjan i postoji li u našem spremištu
    const expectedNonce = nonces.get(nonceId);
    if (!expectedNonce || expectedNonce !== nonce) {
      return NextResponse.json({ message: "Invalid or expired nonce" }, { status: 400 });
    }

    // 3. Pripremi podatke za verifikaciju (pretvori u Uint8Array)
    // Pi Network obično šalje publicKey i signature kao stringove, pa ih trebamo dekodirati.
    // Ovisno o tome šalje li Pi base64 ili hex, možda ćete morati prilagoditi dekodiranje.
    // Ovdje pretpostavljamo Base64 kako je u vašem primjeru.
    
    const msg = base64ToUint8Array(nonce);     // Poruka koja je potpisana
    const sig = base64ToUint8Array(signature); // Potpis
    const pub = base64ToUint8Array(publicKey); // Javni ključ korisnika

    // 4. Verificiraj potpis koristeći Ed25519 (tweetnacl)
    const isValid = nacl.sign.detached.verify(msg, sig, pub);

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Signature invalid" }, { status: 401 });
    }

    // 5. Uspjeh! Obriši iskorišteni nonce
    nonces.delete(nonceId);

    // Ovdje biste u pravoj aplikaciji kreirali sesiju ili JWT token
    return NextResponse.json({ 
        success: true, 
        message: "Verified", 
        user: { publicKey: publicKey } // Vraćamo podatke klijentu
    });

  } catch (err: any) {
    console.error("Verify error:", err);
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}