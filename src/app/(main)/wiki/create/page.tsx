'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WikiCreatePage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/wiki', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, slug, content }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push(`/wiki/${data.slug}`);
                router.refresh();
            } else {
                alert('エラー: ' + data.error);
            }
        } catch (err) {
            alert('通信エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.2rem', borderBottom: '1px solid #000', paddingBottom: '5px' }}>
                百科事典 新規記事作成
            </h1>

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <table style={{ fontSize: 'small', width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '120px' }}>記事タイトル:</td>
                            <td><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '300px' }} placeholder="例：田中事件" required /></td>
                        </tr>
                        <tr>
                            <td>スラッグ(URL):</td>
                            <td>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ width: '200px' }} placeholder="例：tanaka-incident" pattern="^[a-zA-Z0-9-_]+$" title="半角英数字、ハイフン、アンダーバーのみ" required />
                                <br /><span style={{ fontSize: '10px', color: '#666' }}>※URLの一部になります（例: /wiki/tanaka-incident）</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ verticalAlign: 'top' }}>内容:</td>
                            <td><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={15} style={{ width: '100%', minWidth: '400px' }} required /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit" disabled={isSubmitting} style={{ padding: '5px 20px', cursor: 'pointer' }}>
                                    {isSubmitting ? '保存中...' : '記事を保存する'}
                                </button>
                                <button type="button" onClick={() => router.back()} style={{ marginLeft: '10px' }}>戻る</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
