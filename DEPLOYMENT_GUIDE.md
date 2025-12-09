# Firebase App Hosting デプロイガイド

## 環境変数の設定

Firebase App Hostingでは、環境変数をFirebase CLIを使って設定します。

### 1. Firebase CLI環境変数設定コマンド

```bash
# Firebase CLIで環境変数を設定
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY --data-file service-account-key.json

# または、直接値を設定
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY
# プロンプトでJSONの値を貼り付け

# 本番環境のURLを設定
firebase apphosting:secrets:set NEXT_PUBLIC_APP_URL --value "https://your-production-domain.com"
```

### 2. サービスアカウントキーファイルの準備

```bash
# サービスアカウントキーをJSONファイルとして保存
# Firebase Console → プロジェクト設定 → サービスアカウント → 秘密キーの生成
# ダウンロードしたJSONファイルを service-account-key.json として保存
```

### 3. 環境変数一覧

以下の環境変数をFirebase App Hostingで設定してください：

#### 必須の秘匿変数（firebase apphosting:secrets:set）
```
FIREBASE_SERVICE_ACCOUNT_KEY
```

#### 公開環境変数（.env.productionまたはNext.js設定で管理）
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_VAPID_KEY
NEXT_PUBLIC_APP_URL
```

### 4. next.config.js での環境変数管理

Next.jsの設定ファイルでも環境変数を管理できます：

```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : 'https://localhost:3000',
  },
}
```

### 5. デプロイコマンド

```bash
# Firebase App Hostingにデプロイ
firebase deploy --only apphosting

# 特定の環境にデプロイ
firebase use production
firebase deploy --only apphosting
```

### 6. 環境変数の確認

```bash
# 設定済みの環境変数を確認
firebase apphosting:secrets:list

# 特定の環境変数の詳細を確認
firebase apphosting:secrets:describe FIREBASE_SERVICE_ACCOUNT_KEY
```

### 7. トラブルシューティング

#### 環境変数が読み込まれない場合
1. Firebase CLIで正しく設定されているか確認
2. デプロイ後に反映されるまで少し時間がかかる場合があります
3. ブラウザキャッシュをクリア

#### デプロイエラーの場合
1. `firebase login` でログインしているか確認
2. 正しいプロジェクトが選択されているか確認（`firebase use`）
3. Firebase App Hostingが有効化されているか確認

### 8. セキュリティベストプラクティス

- サービスアカウントキーは絶対にコードにコミットしない
- `.env.local` はローカル開発用のみ使用
- 本番環境では必ずFirebase CLIで秘匿情報を管理
- 定期的にサービスアカウントキーを更新

### 9. 既知の問題と回避策

#### Firebase App Hostingの環境変数読み込み問題

**問題**: Firebase App HostingでGitHubからの自動デプロイを使用した場合、`apphosting.yaml`で設定した環境変数がランタイムで正しく読み込まれないバグがあります。

**影響**:
- **クライアントサイド**: `process.env.NEXT_PUBLIC_FIREBASE_*`が全て`undefined`になり、Firebaseの初期化に失敗
- **サーバーサイド**: `process.env.EMAIL_USER`と`process.env.EMAIL_PASSWORD`が`undefined`になり、メール送信に失敗

**現在の回避策**:

1. **Firebase設定** - [src/lib/firebase.ts](src/lib/firebase.ts)にフォールバック値を設定:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC...",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fruits-hatake",
  // ...
};
```

2. **メール送信設定** - [src/app/api/contact/route.ts](src/app/api/contact/route.ts)にフォールバック値を設定:
```typescript
const emailUser = process.env.EMAIL_USER || "fruits.hatake@gmail.com";
const emailPassword = process.env.EMAIL_PASSWORD || "lusvqakydtchcxsi";
```

**参考情報**:
- [GitHub Issue #8307](https://github.com/firebase/firebase-tools/issues/8307)
- [Firebase Studio Community Discussion](https://community.firebasestudio.dev/t/16270)

**将来の対応**: Firebaseチームがこのバグを修正したら、フォールバック値を削除し、環境変数のみを使用するように変更してください。