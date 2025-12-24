import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    // 開発用Cookieがあるかチェック
    const isDevLogin = request.cookies.get('dev_session')?.value === 'true';

    // ログインページへのアクセスはそのまま通す
    if (request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.next();
    }

    // 開発ログインしていない場合はログイン画面へ
    if (!isDevLogin) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};
