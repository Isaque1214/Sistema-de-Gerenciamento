import { NextResponse } from 'next/server';


const BACKEND = process.env.BACKEND_URL || 'http://192.168.0.17:5050';

export async function GET() {
  

  try {
    const res = await fetch(`${BACKEND}/api/cron/status`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ultima_sincronizacao: null });
  }
}