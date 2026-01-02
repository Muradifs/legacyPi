import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Ovdje možeš ažurirati bazu, dodijeliti reward, itd.
    console.log(`Plaćanje završeno! paymentId: ${paymentId}, txid: ${txid}`);

    // Optional: pozovi Pi /complete ako treba (za neke flowove)
    // ali za standard User-to-App obično nije potreban

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Complete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}