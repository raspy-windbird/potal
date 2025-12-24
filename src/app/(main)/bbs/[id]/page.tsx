import { supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/utils/crypto";
import { notFound } from "next/navigation";
import PostForm from "./PostForm"; // 投稿フォームだけ分離

export default async function ThreadPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const { data: thread } = await supabaseAdmin.from('threads').select('*').eq('id', id).single();
    if (!thread) notFound();

    const { data: posts } = await supabaseAdmin.from('posts').select('*').eq('thread_id', id).order('post_number', { ascending: true });

    return (
        <div>
            <h1 style={{ fontSize: '1.25rem', color: '#ff0000', borderBottom: '2px solid #ccc' }}>
                【{thread.post_count}】{thread.title}
            </h1>

            <div style={{ marginTop: '20px' }}>
                {posts?.map((post) => (
                    <div key={post.id} style={{ marginBottom: '25px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {post.post_number} ：<span style={{ color: '#008000' }}>{post.display_name}</span> ：{new Date(post.created_at).toLocaleString('ja-JP')}
                        </div>
                        <div style={{ padding: '8px 0 0 15px', whiteSpace: 'pre-wrap' }}>
                            {/* サーバー側なので安全に復号可能 */}
                            {decrypt(post.content)}
                        </div>
                    </div>
                ))}
            </div>

            <hr style={{ margin: '20px 0' }} />

            {!thread.is_archived && thread.post_count < 1000 ? (
                <PostForm threadId={id} />
            ) : (
                <p style={{ color: 'red' }}>スレッド終了</p>
            )}
        </div>
    );
}
