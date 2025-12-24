'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostForm({ threadId }: { threadId: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        await fetch('/api/posts', {
            method: 'POST',
            body: formData, // FormDataとして送信
        });

        (e.target as HTMLFormElement).reset();
        router.refresh(); // これでサーバーコンポーネントが再取得され、最新レスが表示される
        setIsSubmitting(false);
    };

    return (
        <div style={{ backgroundColor: '#eee', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="thread_id" value={threadId} />
                <table>
                    <tbody>
                        <tr><td>名前:</td><td><input name="display_name" defaultValue="名無し" /></td></tr>
                        <tr><td>本文:</td><td><textarea name="content" rows={5} required /></td></tr>
                        <tr><td></td><td><button type="submit" disabled={isSubmitting}>書き込む</button></td></tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
