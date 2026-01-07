import { type NextRequest, NextResponse } from "next/server"

/**
 * Pi Network Payment Cancellation Endpoint
 * Called when user cancels payment or payment fails
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentId, user } = await request.json()

    if (!paymentId) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 })
    }

    console.log("[v0] Payment cancelled:", { paymentId, user })

    // Update payment status to cancelled
    // await database.payments.update({ paymentId }, { status: 'cancelled' })

    return NextResponse.json({
      success: true,
      paymentId,
      message: "Payment cancelled",
    })
  } catch (error) {
    console.error("[v0] Payment cancellation error:", error)
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 })
  }
}
