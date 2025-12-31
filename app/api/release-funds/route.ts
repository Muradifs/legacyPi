import { NextResponse } from "next/server"
import { piLegacyVault } from "@/lib/temp-vault"
import type { ConsensusDecision } from "@/lib/temp-vault"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const consensusDecision: ConsensusDecision = body.consensusDecision

    // Validate consensus decision structure
    if (
      !consensusDecision ||
      typeof consensusDecision.isValid !== "boolean" ||
      !consensusDecision.purpose ||
      !consensusDecision.requestedAmount
    ) {
      return NextResponse.json({ error: "Invalid consensus decision format" }, { status: 400 })
    }

    const result = await piLegacyVault.releaseFunds(consensusDecision)

    return NextResponse.json({
      success: true,
      data: result,
      message: "Funds released successfully",
    })
  } catch (error) {
    console.error("[v0] Release funds API error:", error)

    // Return the specific error message (especially for time-lock violations)
    const errorMessage = error instanceof Error ? error.message : "Failed to release funds"

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { status: error instanceof Error && error.message.includes("ACCESS DENIED") ? 403 : 500 },
    )
  }
}
