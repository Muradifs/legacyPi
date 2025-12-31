import { NextResponse } from "next/server"
import { piLegacyVault } from "@/lib/temp-vault"

export async function GET() {
  try {
    const impactSummary = piLegacyVault.getImpactSummary()

    return NextResponse.json({
      success: true,
      data: impactSummary,
    })
  } catch (error) {
    console.error("[v0] Impact summary API error:", error)
    return NextResponse.json({ error: "Failed to retrieve impact summary" }, { status: 500 })
  }
}
