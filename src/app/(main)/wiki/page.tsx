import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export default async function WikiListPage() {
    // Wiki記事一覧を更新順に取得
    const { data: pages } = await supabaseAdmin
        .from('wiki_pages')
        .select('slug, title, updated_at')
        .order('updated_at', { ascending: false });

    return (
        <div>
            <h1 style={{ fontSize: '1.2rem', color: '#000', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
                まとめ百科 (Wiki) 一覧
            </h1>

            <div style={{ margin: '15px 0' }}>
                <Link href="/wiki/create" style={{
                    fontSize: 'small',
                    padding: '2px 5px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    textDecoration: 'none',
                    color: '#000'
                }}>
                    [ 新規記事作成 ]
                </Link>
            </div>

            <ul className="menu-list" style={{ marginTop: '20px' }}>
                {pages && pages.length > 0 ? (
                    pages.map((page) => (
                        <li key={page.slug} style={{ marginBottom: '8px' }}>
                            <Link href={`/wiki/${page.slug}`} style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                {page.title}
                            </Link>
                            <span style={{ fontSize: '0.7rem', color: '#666', marginLeft: '10px' }}>
                                (更新: {new Date(page.updated_at).toLocaleDateString('ja-JP')})
                            </span>
                        </li>
                    ))
                ) : (
                    <li>記事がまだありません。</li>
                )}
            </ul>

            <div style={{ marginTop: '40px' }}>
                <Link href="/" style={{ fontSize: 'small' }}>■トップページへ戻る</Link>
            </div>
        </div>
    );
}
