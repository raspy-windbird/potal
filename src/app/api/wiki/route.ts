import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encrypt } from '@/utils/crypto';

export async function POST(request: Request) {
    try {
        const { title, slug, content } = await request.json();

        if (!title || !slug || !content) {
            return NextResponse.json({ error: '全項目入力してください' }, { status: 400 });
        }

        // 1. 本文をサーバーサイドで暗号化
        const encryptedContent = encrypt(content);

        // 2. Supabaseへ保存 (タイトルとスラッグは平文)
        const { data, error } = await supabaseAdmin
            .from('wiki_pages')
            .insert([
                {
                    title,
                    slug,
                    content: encryptedContent,
                    updated_at: new Date().toISOString(),
                },
            ]);

        if (error) {
            if (error.code === '23505') return NextResponse.json({ error: 'そのスラッグは既に使用されています' }, { status: 400 });
            throw error;
        }

        return NextResponse.json({ success: true, slug });
    } catch (error: any) {
        console.error("Wiki保存エラー:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
