import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // 環境変数チェック
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error("メール送信環境変数が設定されていません:", {
        hasEmailUser: !!emailUser,
        hasEmailPassword: !!emailPassword,
      });
      return NextResponse.json(
        { error: "メールサーバーの設定エラー" },
        { status: 500 }
      );
    }

    // メール送信設定
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // メール本文
    const mailOptions = {
      from: emailUser,
      to: "fruits.hatake@gmail.com",
      subject: `【お問い合わせ】${subject}`,
      text: `
お問い合わせがありました。

【お名前】
${name}

【メールアドレス】
${email}

【電話番号】
${phone || "未入力"}

【お問い合わせ内容】
${subject}

【メッセージ】
${message}

---
このメールはフルーツとやさい畑のウェブサイトから送信されました。
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #7bcd64;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 0 0 5px 5px;
    }
    .field {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
      color: #7bcd64;
      display: block;
      margin-bottom: 5px;
    }
    .value {
      padding: 10px;
      background-color: #f5f5f5;
      border-left: 3px solid #7bcd64;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>お問い合わせフォーム</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">お名前</span>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <span class="label">メールアドレス</span>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <span class="label">電話番号</span>
        <div class="value">${phone || "未入力"}</div>
      </div>
      <div class="field">
        <span class="label">お問い合わせ内容</span>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <span class="label">メッセージ</span>
        <div class="value">${message.replace(/\n/g, "<br>")}</div>
      </div>
      <div class="footer">
        このメールはフルーツとやさい畑のウェブサイトから送信されました。
      </div>
    </div>
  </div>
</body>
</html>
      `.trim(),
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "お問い合わせを受け付けました",
    });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
