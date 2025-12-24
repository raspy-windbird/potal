import { supabaseAdmin } from "@/lib/supabase";

export default async function BBSPage() {
    // スレッド一覧を最新投稿順で取得
    const { data: threads } = await supabaseAdmin
        .from('threads')
        .select('*')
        .order('last_posted_at', { ascending: false });

    return (
        <div>
            <h1 style={{ fontSize: '1.2rem', color: '#000', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>
                掲示板メニュー
            </h1>

            <div style={{ margin: '15px 0' }}>
                <a href="/bbs/create" style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    backgroundColor: '#ddd',
                    border: '2px outset #fff',
                    textDecoration: 'none',
                    color: '#000',
                    fontSize: 'small'
                }}>
                    [ 新規スレッド作成 ]
                </a>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'small', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eeeeee', textAlign: 'left' }}>
                        <th style={{ border: '1px solid #ccc', padding: '5px' }}>スレッドタイトル</th>
                        <th style={{ border: '1px solid #ccc', padding: '5px', width: '60px', textAlign: 'center' }}>レス</th>
                        <th style={{ border: '1px solid #ccc', padding: '5px', width: '150px' }}>最終更新日時</th>
                    </tr>
                </thead>
                <tbody>
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <tr key={thread.id}>
                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                                    <a href={`/bbs/${thread.id}`} style={{ fontWeight: 'bold' }}>
                                        {thread.title}
                                    </a>
                                    {thread.is_archived && (
                                        <span style={{ color: 'red', marginLeft: '5px', fontSize: '10px' }}>[終了]</span>
                                    )}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>
                                    {thread.post_count}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '5px', color: '#666' }}>
                                    {new Date(thread.last_posted_at).toLocaleString('ja-JP')}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
                                スレッドが存在しません。
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
                <a href="/" style={{ fontSize: 'small' }}>■トップページへ戻る</a>
            </div>
        </div>
    );
}
