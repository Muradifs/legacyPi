import { type NextRequest, NextResponse } from "next/server"
import { piLegacyVault } from "@/lib/pi-legacy-vault"

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, message } = await request.json()

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation parameters" }, { status: 400 })
    }

    // Process donation through PiLegacyVault
    const result = await piLegacyVault.donateToVault(
      userId,
      amount,
      message || "Supporting LegacyPi humanitarian mission",
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Donation API error:", error)
    return NextResponse.json({ error: "Donation failed", message: (error as Error).message }, { status: 500 })
  }
}
