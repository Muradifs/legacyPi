import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.error('PI_API_KEY not set!');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pi approve failed:', data);
      return NextResponse.json({ error: 'Approval failed', details: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Approve error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}