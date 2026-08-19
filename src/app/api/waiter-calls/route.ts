import { NextResponse } from 'next/server';
import { serverDb } from '../../../data/serverDb';
import { WaiterCall } from '../../../types';

export async function GET() {
  try {
    const calls = serverDb.getWaiterCalls();
    return NextResponse.json(calls);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'updateStatus') {
      const calls = serverDb.getWaiterCalls();
      const index = calls.findIndex(c => c.id === data.id);
      if (index === -1) return NextResponse.json({ error: 'Call not found' }, { status: 404 });

      calls[index].status = data.status;
      serverDb.saveWaiterCalls(calls);
      return NextResponse.json(calls[index]);
    }

    if (action === 'clearAll') {
      serverDb.saveWaiterCalls([]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
