import 'server-only';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// 1. 環境変数をBase64として読み込み、32バイトのBufferに変換
const ENCRYPTION_KEY_BASE64 = process.env.MASTER_ENCRYPTION_KEY!;
const keyBuffer = Buffer.from(ENCRYPTION_KEY_BASE64, 'base64');

// 2. GCMモード推奨のIV（初期化ベクトル）の長さ
const IV_LENGTH = 12;

// 3. バイト数チェック（エラー防止）
if (keyBuffer.length !== 32) {
    throw new Error(`暗号キーが32バイトではありません。現在のバイト数: ${keyBuffer.length}`);
}

export function encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    // 定義した keyBuffer と iv を使用
    const cipher = createCipheriv('aes-256-gcm', keyBuffer, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // IV:認証タグ:暗号文 の形式で返す
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
    try {
        // 形式チェック: コロンが2つ含まれているか
        if (!encryptedData.includes(':')) {
            return encryptedData; // 暗号化されていなければそのまま返す
        }

        const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

        // データの欠損チェック
        if (!ivHex || !authTagHex || !encryptedText) return "データ破損";

        const decipher = createDecipheriv(
            'aes-256-gcm',
            keyBuffer,
            Buffer.from(ivHex, 'hex')
        );

        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (e) {
        console.error("復号エラー:", e);
        return "復号不可データ"; // エラー時はこの文字を出してクラッシュを防ぐ
    }
}
