'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileEditFormProps {
    id: string;
    initialUsername: string;
    initialBio: string;
}

export default function ProfileEditForm({ id, initialUsername, initialBio }: ProfileEditFormProps) {
    const router = useRouter();

    // サーバーから渡された復号済みデータを初期値にセット
    const [username, setUsername] = useState(initialUsername || '');
    const [bio, setBio] = useState(initialBio || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // API Route (/api/profile/route.ts など) へデータを送信
            // サーバー側で暗号化してDBに保存する処理を想定
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    username,
                    bio_content: bio
                }),
            });

            if (res.ok) {
                alert('プロフィールを更新しました。');
                router.push(`/profile/${id}`);
                router.refresh(); // 最新情報を取得し直す
            } else {
                const errorData = await res.json();
                alert(`保存に失敗しました: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            alert('通信エラーが発生しました。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="profile-edit-container">
            <h2 style={{ fontSize: '1.1rem', borderBottom: '1px solid #000', paddingBottom: '5px' }}>
                プロフィールの編集
            </h2>

            {/*
               注意: <form> の入れ子を防ぐため、ここだけに form タグを記述します。
               親の page.tsx や layout.tsx で form を使っていないことを確認してください。
            */}
            <form onSubmit={handleSave} style={{ marginTop: '20px' }}>
                <table style={{ fontSize: 'small', width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '120px', padding: '10px 0' }}>名前:</td>
                            <td>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '250px', padding: '5px' }}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ verticalAlign: 'top', padding: '10px 0' }}>自己紹介:</td>
                            <td>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={12}
                                    style={{ width: '90%', minWidth: '350px', padding: '5px', lineHeight: '1.5' }}
                                    placeholder="自己紹介を書いてください（保存時に自動で暗号化されます）"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td style={{ padding: '20px 0' }}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        padding: '8px 20px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {isSubmitting ? '保存中...' : '設定を更新する'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    style={{ marginLeft: '10px', padding: '8px 20px', cursor: 'pointer' }}
                                >
                                    戻る
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
