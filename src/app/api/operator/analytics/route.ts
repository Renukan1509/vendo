import { NextRequest, NextResponse } from 'next/server';
import { getOperatorAnalytics } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  const analytics = getOperatorAnalytics();
  return NextResponse.json({ success: true, analytics });
}
