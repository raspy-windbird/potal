'use client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleDevLogin = () => {
        // 開発用のダミーCookieをセット（1日有効）
        document.cookie = "dev_session=true; path=/; max-age=86400";
        // トップページへ移動
        router.push('/');
        router.refresh();
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>友人交流ポータル (2025) [開発モード]</h1>
            <p>Google設定をスキップしてログインします。</p>
            <hr style={{ width: '300px' }} />
            <button onClick={handleDevLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                デバッグ用ログイン（自動）
            </button>
        </div>
    );
}
