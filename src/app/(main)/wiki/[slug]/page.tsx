import { supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/utils/crypto";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WikiDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    // スラッグで記事を検索
    const { data: page } = await supabaseAdmin
        .from('wiki_pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!page) notFound();

    return (
        <div>
            {/* 記事タイトル */}
            <h1 style={{ fontSize: '1.5rem', borderBottom: '3px double #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                {page.title}
            </h1>

            {/* 記事本文：サーバー側で復号 */}
            <article style={{
                lineHeight: '1.8',
                fontSize: '1rem',
                backgroundColor: '#fff',
                padding: '15px',
                border: '1px inset #eee',
                whiteSpace: 'pre-wrap'
            }}>
                {decrypt(page.content)}
            </article>

            {/* 編集ボタン（将来用） */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>
                    最終更新: {new Date(page.updated_at).toLocaleString('ja-JP')}
                </span>
            </div>

            <hr style={{ marginTop: '30px', border: '0', borderTop: '1px dashed #ccc' }} />

            <div style={{ marginTop: '20px' }}>
                <Link href="/wiki" style={{ fontSize: 'small' }}>■Wiki一覧に戻る</Link>
            </div>
        </div>
    );
}
