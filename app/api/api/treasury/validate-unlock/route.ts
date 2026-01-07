import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { requestedBy, action } = await request.json()

    // Hard-coded lock date - immutable in smart contract
    const LOCK_DATE = new Date("2030-01-01T00:00:00Z")
    const currentDate = new Date()

    // Critical security check
    if (action === "withdraw" || action === "unlock") {
      if (currentDate < LOCK_DATE) {
        return NextResponse.json(
          {
            allowed: false,
            message: "Treasury je zakljucan do 2030. Ni admin ne moze promijeniti.",
            lockDate: LOCK_DATE.toISOString(),
            remainingTime: LOCK_DATE.getTime() - currentDate.getTime(),
          },
          { status: 403 },
        )
      }
    }

    // If we're past the lock date, allow withdrawal
    return NextResponse.json({
      allowed: true,
      message: "Trezor je otkljucan. Zajednica moze glasati o raspodjeli.",
      unlockedAt: currentDate.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Validation error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}
