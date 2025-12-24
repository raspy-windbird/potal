'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return alert('タイトルと本文を入力してください');
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, display_name: name }),
            });
            const data = await res.json();

            if (data.success) {
                router.push(`/bbs/${data.threadId}`);
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
            <h2 style={{ fontSize: 'medium', borderBottom: '1px solid #000' }}>新規スレッド作成</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                <table style={{ fontSize: 'small' }}>
                    <tbody>
                        <tr>
                            <td>タイトル:</td>
                            <td><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} size={50} required /></td>
                        </tr>
                        <tr>
                            <td>名前(任意):</td>
                            <td><input type="text" value={name} onChange={(e) => setName(e.target.value)} size={30} placeholder="名無し" /></td>
                        </tr>
                        <tr>
                            <td style={{ verticalAlign: 'top' }}>本文:</td>
                            <td><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} cols={60} required /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="submit" value={isSubmitting ? '送信中...' : '新しいスレッドを立てる'} disabled={isSubmitting} />
                                <button type="button" onClick={() => router.back()} style={{ marginLeft: '10px' }}>戻る</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
