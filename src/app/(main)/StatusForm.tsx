'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // 【最重要】ブラウザが直接APIへ飛ぶのを防ぎます
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch('/api/status', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                (e.target as HTMLFormElement).reset();
                // サーバーコンポーネントを再読込し、UserStatus.tsxを更新させる
                router.refresh();
            } else {
                alert('更新に失敗しました');
            }
        } catch (err) {
            alert('通信エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            marginTop: '40px',
            padding: '10px',
            border: '2px inset #fff',
            backgroundColor: '#eeeeee',
            maxWidth: '500px'
        }}>
            <form onSubmit={handleSubmit}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>[1行BBS更新]</span><br />
                <input
                    name="content"
                    type="text"
                    maxLength={30}
                    placeholder="いま何してる？"
                    style={{ fontSize: '12px', width: '300px', margin: '5px 0' }}
                    disabled={isSubmitting}
                    required
                />
                <button type="submit" style={{ fontSize: '12px', cursor: 'pointer', marginLeft: '5px' }} disabled={isSubmitting}>
                    {isSubmitting ? '...' : '更新'}
                </button>
            </form>
        </div>
    );
}
