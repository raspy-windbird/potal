'use client';

import { useEffect, useState } from 'react';

export default function AccessCounter() {
    const [count, setCount] = useState<string>('......');
    const [isLucky, setIsLucky] = useState(false);

    useEffect(() => {
        // ページロード時にカウントアップAPIを叩く
        const increment = async () => {
            const res = await fetch('/api/counter', { method: 'POST' });
            const data = await res.json();
            if (data.count) {
                // 6桁のゼロパディング (例: 000425)
                setCount(data.count.toString().padStart(6, '0'));
                setIsLucky(data.isLucky);
            }
        };
        increment();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px double #ccc', paddingTop: '15px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                あなたは本日
                <span style={{
                    display: 'inline-block',
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '2px 5px',
                    fontFamily: 'Courier New, monospace',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    margin: '0 5px'
                }}>
                    {count}
                </span>
                番目の訪問者です。
            </div>
            {isLucky && (
                <div style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>
                    祝！キリ番おめでとうございます！記録されました。
                </div>
            )}
        </div>
    );
}
