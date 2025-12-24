import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const content = formData.get('content') as string;

        // 1. 現在のログインユーザーを取得
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // 開発用モック（dev_session）の場合、CookieからユーザーIDを特定
        // ※profilesテーブルに手動で作成した自分のIDと紐付ける必要があります
        const devUserId = cookieStore.get('dev_user_id')?.value;
        const userId = user?.id || devUserId;

        if (!userId) {
            return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
        }

        // 2. user_statusesテーブルを更新 (upsert: なければ作成、あれば更新)
        const { error } = await supabaseAdmin
            .from('user_statuses')
            .upsert({
                user_id: userId,
                content: content,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
