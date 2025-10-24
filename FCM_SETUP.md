# FCM (Firebase Cloud Messaging) セットアップガイド

このプロジェクトでWebプッシュ通知を有効にするために、以下の環境変数を設定する必要があります。

## 必要な環境変数

### .env.local ファイルに追加する環境変数

```env
# Firebase設定（既存のものを使用）
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# FCM用の追加設定
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_json_string
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Firebase Consoleでの設定手順

### 1. VAPID キーの生成

1. Firebase Console → プロジェクト設定 → Cloud Messaging タブ
2. 「ウェブ設定」セクションで「キーペアを生成」をクリック
3. 生成されたキーを `NEXT_PUBLIC_FIREBASE_VAPID_KEY` に設定

### 2. サービスアカウントキーの作成

1. Firebase Console → プロジェクト設定 → サービス アカウント タブ
2. 「新しい秘密キーの生成」をクリック
3. JSONファイルをダウンロード
4. JSONファイルの内容を1行の文字列に変換して `FIREBASE_SERVICE_ACCOUNT_KEY` に設定

### 3. Firebase Service Workerの設定更新

`public/firebase-messaging-sw.js` ファイルの firebaseConfig を実際の設定値で更新してください：

```javascript
const firebaseConfig = {
  apiKey: "実際のAPI Key",
  authDomain: "実際のAuth Domain",
  projectId: "実際のProject ID",
  storageBucket: "実際のStorage Bucket",
  messagingSenderId: "実際のSender ID",
  appId: "実際のApp ID"
};
```

## 使用方法

1. ページにアクセス
2. 「通知を受け取る」ボタンをクリック
3. ブラウザの通知許可ダイアログで「許可」を選択
4. 通知送信フォームでテスト通知を送信

## 注意事項

- VAPIDキーとサービスアカウントキーは秘匿情報なので、適切に管理してください
- プロダクション環境では適切なセキュリティ対策を実施してください
- Service Workerは HTTPS 環境でのみ動作します（localhost除く）

## トラブルシューティング

- 通知が表示されない → ブラウザの通知設定を確認
- Service Worker登録エラー → HTTPS環境で実行しているか確認
- Firebase初期化エラー → 環境変数の設定値を確認