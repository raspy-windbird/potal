import { supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/utils/crypto";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    // プロフィール情報の取得
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (!profile) notFound();

    // 現在のログインユーザーIDを取得（編集ボタン表示用）
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get('dev_user_id')?.value;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', borderBottom: '1px solid #000' }}>
                {profile.username} のホームページ
            </h1>

            <table border={1} cellPadding={5} style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', borderColor: '#ccc' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '150px', backgroundColor: '#eee' }}>名前</td>
                        <td>{profile.username}</td>
                    </tr>
                    <tr>
                        <td style={{ backgroundColor: '#eee' }}>ステータス</td>
                        <td>{profile.role === 'admin' ? '管理者' : '一般市民'}</td>
                    </tr>
                    <tr>
                        <td style={{ backgroundColor: '#eee' }}>登録日</td>
                        <td>{new Date(profile.created_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                </tbody>
            </table>

            <h2 style={{ fontSize: '1.1rem', marginTop: '30px', borderLeft: '5px solid #000', paddingLeft: '10px' }}>
                自己紹介
            </h2>

            <div style={{
                marginTop: '10px',
                padding: '15px',
                backgroundColor: '#fff',
                border: '1px inset #eee',
                minHeight: '200px',
                whiteSpace: 'pre-wrap' // 2025年現在はMarkdownライブラリを入れる前段階として改行維持
            }}>
                {profile.bio_content ? decrypt(profile.bio_content) : "まだ自己紹介がありません。"}
            </div>

            {currentUserId === id && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Link href={`/profile/${id}/edit`} style={{ fontSize: 'small' }}>[ 自分のページを編集する ]</Link>
                </div>
            )}

            <div style={{ marginTop: '40px' }}>
                <Link href="/" style={{ fontSize: 'small' }}>■トップページへ戻る</Link>
            </div>
        </div>
    );
}
