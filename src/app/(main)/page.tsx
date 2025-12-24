import { supabaseAdmin } from "@/lib/supabase";
import UserStatus from "./UserStatus";
import StatusForm from "./StatusForm";
import AccessCounter from "./AccessCounter"; // インポート忘れに注意

export default async function Home() {
  // 1. スレッド一覧の取得
  const { data: threads } = await supabaseAdmin
    .from('threads')
    .select('*')
    .order('last_posted_at', { ascending: false })
    .limit(15);

  // 2. キリ番達成者の取得 (ここが重要！)
  const { data: luckyOnes } = await supabaseAdmin
    .from('lucky_numbers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div>
      <UserStatus />

      <h2 style={{ fontSize: 'medium', borderBottom: '1px solid #000', paddingBottom: '3px', marginTop: '15px' }}>
        新着スレッド一覧
      </h2>

      {/* スレッド一覧テーブル */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: 'small' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ border: '1px solid #ccc', padding: '5px' }}>タイトル</th>
            <th style={{ border: '1px solid #ccc', padding: '5px', width: '60px' }}>レス</th>
            <th style={{ border: '1px solid #ccc', padding: '5px', width: '150px' }}>最終更新</th>
          </tr>
        </thead>
        <tbody>
          {threads && threads.length > 0 ? (
            threads.map((thread) => (
              <tr key={thread.id}>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                  <a href={`/bbs/${thread.id}`} style={{ fontWeight: 'bold' }}>
                    {thread.title}
                  </a>
                  {thread.is_archived && (
                    <span style={{ color: '#ff0000', marginLeft: '5px' }}>[終了]</span>
                  )}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>
                  {thread.post_count}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '5px', color: '#666' }}>
                  {new Date(thread.last_posted_at).toLocaleString('ja-JP')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
                スレッドがまだありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* キリ番達成者殿堂（ここでの使用エラーを解消） */}
      {luckyOnes && luckyOnes.length > 0 && (
        <div style={{ marginTop: '20px', fontSize: '11px', border: '1px solid #ffcc00', backgroundColor: '#ffffef', padding: '5px' }}>
          <b>【キリ番達成者殿堂】</b><br />
          {luckyOnes.map((l: any) => (
            <span key={l.id} style={{ marginRight: '10px' }}>
              {l.number}番: {l.username}様
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <a href="/bbs/create" style={{ display: 'inline-block', padding: '5px 15px', backgroundColor: '#ddd', border: '2px outset #fff', textDecoration: 'none', color: '#000', fontSize: 'small' }}>
          新しいスレッドを立てる
        </a>
      </div>

      <StatusForm />

      {/* アクセスカウンターコンポーネント */}
      <AccessCounter />
    </div>
  );
}
