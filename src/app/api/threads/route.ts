import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encrypt } from '@/utils/crypto';

export async function POST(request: Request) {
    try {
        const { title, content, display_name, user_id } = await request.json();

        // 1. スレッド親レコードの作成 (タイトルは平文)
        const { data: thread, error: tError } = await supabaseAdmin
            .from('threads')
            .insert([{ title, post_count: 1 }])
            .select()
            .single();

        if (tError) throw tError;

        // 2. 本文の暗号化
        const encryptedContent = encrypt(content);

        // 3. 最初のレス (post_number: 1) の作成
        const { error: pError } = await supabaseAdmin
            .from('posts')
            .insert([
                {
                    thread_id: thread.id,
                    user_id: user_id || null,
                    display_name: display_name || '名無し',
                    content: encryptedContent,
                    post_number: 1,
                },
            ]);

        if (pError) throw pError;

        return NextResponse.json({ success: true, threadId: thread.id });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
