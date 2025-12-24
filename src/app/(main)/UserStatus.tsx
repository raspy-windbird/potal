'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function UserStatus() {
    const [latestStatus, setLatestStatus] = useState<string>('読み込み中...');
    const [userName, setUserName] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchLatestStatus = async () => {
        const { data } = await supabase
            .from('user_statuses')
            .select('content, profiles(username)')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            setLatestStatus(data.content || '（無言）');
            setUserName((data.profiles as any)?.username || '名無し');
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchLatestStatus();

        // Realtimeがアルファ版で不安定なため、
        // ここではポーリング（一定時間ごとの再取得）に切り替えるのも手です。
        const interval = setInterval(fetchLatestStatus, 10000); // 10秒ごとに更新
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <div style={{ height: '18px', backgroundColor: '#000080' }} />;

    return (
        <div style={{ backgroundColor: '#000080', color: '#ffffff', padding: '3px', fontSize: '12px' }}>
            <div className="retro-marquee">
                <span>
                    【1行BBS】 {userName} ： {latestStatus} （更新時刻：{new Date().toLocaleTimeString()}）
                </span>
            </div>
        </div>
    );
}
