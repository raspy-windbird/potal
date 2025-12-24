import { createServerClient } from '@supabase/ssr'; // サーバー用クライアント
import { cookies } from 'next/headers';
import { decrypt } from '@/utils/crypto';
import ProfileEditForm from './ProfileEditForm'; // 切り分けたUI
import { use } from 'react';

export default async function ProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // サーバーサイドで Supabase から取得
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );

    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();

    if (!data) return <div>ユーザーが見つかりません</div>;

    // サーバーサイドで安全に復号
    let decryptedBio = data.bio_content;
    if (data.bio_content) {
        try {
            decryptedBio = decrypt(data.bio_content);
        } catch (e) {
            console.error("復号エラー:", e);
        }
    }

    // 復号済みのデータをクライアントコンポーネントに渡す
    return (
        <ProfileEditForm
            id={id}
            initialUsername={data.username}
            initialBio={decryptedBio}
        />
    );
}
