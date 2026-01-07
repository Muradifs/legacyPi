import { type NextRequest, NextResponse } from "next/server"

/**
 * Pi Network Payment Completion Endpoint
 * Called by Pi servers after successful blockchain transaction
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid, user, amount } = await request.json()

    // Validate completion data
    if (!paymentId || !txid) {
      return NextResponse.json({ error: "Invalid completion data" }, { status: 400 })
    }

    console.log("[v0] Payment completed:", { paymentId, txid, user, amount })

    // Here you would:
    // 1. Verify the transaction on Pi blockchain
    // 2. Update payment status to completed
    // 3. Credit the user's contribution
    // 4. Update vault statistics
    // 5. Grant badges to donor

    // Mark payment as complete in your database
    // await database.payments.update({ paymentId }, { status: 'completed', txid })

    return NextResponse.json({
      success: true,
      paymentId,
      txid,
      message: "Payment completed and recorded",
    })
  } catch (error) {
    console.error("[v0] Payment completion error:", error)
    return NextResponse.json({ error: "Completion failed" }, { status: 500 })
  }
}
