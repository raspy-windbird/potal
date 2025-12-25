import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton'; // ログアウト処理を分離している場合
import Link from 'next/link';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    // 1. Cookieから開発用ユーザーIDを取得
    const cookieStore = await cookies();
    const myProfileId = cookieStore.get('dev_user_id')?.value || "00000000-0000-0000-0000-000000000001";

    return (
        <div className="retro-container">
            <nav className="sidebar">
                <span style={{ fontSize: 'medium' }}><b>メニュー</b></span>
                <hr />
                <ul className="menu-list">
                    <li><Link href="/">トップページ</Link></li>
                    <li><Link href="/bbs">掲示板</Link></li>
                    <li><Link href="/wiki">まとめ百科</Link></li>
                    {/* Cookieから取得したIDでリンクを生成 */}
                    <li><Link href={`/profile/${myProfileId}`}>個人ページ</Link></li>
                </ul>
                <hr />

                <LogoutButton />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span style={{ fontSize: 'x-small' }}>since 2025/12/24</span>
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
