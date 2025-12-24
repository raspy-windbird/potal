import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('dev_user_id')?.value; // 開発用ID

        // 1. カウンターを+1更新 (RPCを使うか、直接update)
        const { data: counter } = await supabaseAdmin
            .from('counters')
            .select('count')
            .eq('id', 'main')
            .single();

        const nextCount = (counter?.count || 0) + 1;

        await supabaseAdmin
            .from('counters')
            .update({ count: nextCount })
            .eq('id', 'main');

        // 2. キリ番判定 (例: 下二桁が00、またはゾロ目など)
        const isLucky = nextCount % 100 === 0 || nextCount % 111 === 0;

        if (isLucky && userId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('username')
                .eq('id', userId)
                .single();

            // キリ番記録テーブルに保存
            await supabaseAdmin.from('lucky_numbers').insert({
                user_id: userId,
                username: profile?.username || '名無し',
                number: nextCount
            });
        }

        return NextResponse.json({ count: nextCount, isLucky });
    } catch (error) {
        return NextResponse.json({ error: 'Counter Error' }, { status: 500 });
    }
}
