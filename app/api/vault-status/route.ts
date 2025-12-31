import { NextResponse } from "next/server"
import { piLegacyVault } from "@/lib/pi-legacy-vault"

export async function GET() {
  try {
    const status = piLegacyVault.getStatus()

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error("[v0] Vault status API error:", error)
    return NextResponse.json({ error: "Failed to retrieve vault status" }, { status: 500 })
  }
}
