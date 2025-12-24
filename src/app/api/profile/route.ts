import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encrypt } from '@/utils/crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, bio_content } = await request.json();
        const cookieStore = await cookies();
        const userId = cookieStore.get('dev_user_id')?.value;

        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 自己紹介を暗号化
        const encryptedBio = bio_content ? encrypt(bio_content) : null;

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                username: username,
                bio_content: encryptedBio
            })
            .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
