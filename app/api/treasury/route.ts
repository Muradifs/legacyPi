import { NextResponse } from "next/server"

export async function GET() {
  // Simulate fetching treasury data
  const treasuryData = {
    totalPi: 125847.32,
    lockDate: "2030-01-01T00:00:00Z",
    communityMembers: 8432,
    projectsSupported: 47,
    securityScore: 100,
  }

  return NextResponse.json(treasuryData)
}

export async function POST(request: Request) {
  try {
    const { amount, walletAddress } = await request.json()

    // Validate donation amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 })
    }

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Here would be Pi Network SDK integration
    // const piPayment = await Pi.createPayment({
    //   amount,
    //   memo: "LegacyPi Humanitarian Fund Donation",
    //   metadata: { purpose: "humanitarian_aid" }
    // })

    // Simulate donation processing
    const donation = {
      id: `donation_${Date.now()}`,
      amount,
      walletAddress,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    return NextResponse.json({
      success: true,
      donation,
      message: "Hvala što gradiš budućnost.",
    })
  } catch (error) {
    console.error("[v0] Donation error:", error)
    return NextResponse.json({ error: "Donation failed" }, { status: 500 })
  }
}
