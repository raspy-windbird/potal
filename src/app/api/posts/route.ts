import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encrypt } from '@/utils/crypto';

export async function POST(request: Request) {
    try {
        // フォーム送信(form-data)とJSON両方に対応
        const formData = await request.formData().catch(() => null);
        const body = formData
            ? Object.fromEntries(formData)
            : await request.json();

        const { thread_id, display_name, content } = body;

        // 1. 現在のレス数を取得して次の番号を決定
        const { data: thread, error: tError } = await supabaseAdmin
            .from('threads')
            .select('post_count, is_archived')
            .eq('id', thread_id)
            .single();

        if (tError || !thread) throw new Error('スレッドが見つかりません');
        if (thread.is_archived || thread.post_count >= 1000) {
            throw new Error('このスレッドは終了しています');
        }

        const nextNumber = thread.post_count + 1;

        // 2. 本文を暗号化
        const encryptedContent = encrypt(content as string);

        // 3. 投稿の挿入
        const { error: pError } = await supabaseAdmin
            .from('posts')
            .insert([{
                thread_id,
                display_name: display_name || '名無し',
                content: encryptedContent,
                post_number: nextNumber
            }]);

        if (pError) throw pError;


        // 4. スレッドの更新
        await supabaseAdmin
            .from('threads')
            .update({
                post_count: nextNumber,
                last_posted_at: new Date().toISOString(),
                is_archived: nextNumber >= 1000
            })
            .eq('id', thread_id);

        // 【修正点】リダイレクト先を絶対パスの文字列で指定する
        // Codespaces環境では相対パス "/bbs/..." を指定するのが最も安全です
        // リダイレクト処理を削除し、成功レスポンスを返す
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("投稿エラー:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}