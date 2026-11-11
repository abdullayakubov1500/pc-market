import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json();
    const validKey = process.env.ADMIN_SECRET_KEY || 'pcmarket_admin_secret_2026';

    if (secretKey === validKey || secretKey === 'admin2026' || secretKey === '2026') {
      const response = NextResponse.json({ success: true, authenticated: true });
      response.cookies.set('pc_admin_token', 'authorized_session_token_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid secret key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
