<?php
/**
 * EC Tool Crate お問い合わせメール送信 API (文字化け完全対策版)
 * 受信用アドレス: support@mimihokuro.com
 */

// セキュリティヘッダー設定
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

// オリジンチェック (CORS)
$allowed_origins = [
    "https://ec-tool-crate.com",
    "http://ec-tool-crate.com",
    "http://localhost:5173",
    "http://localhost:3000"
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// PREFLIGHT (OPTIONS) リクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POST 以外のメソッドを拒否
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// リクエストボディ (JSON) の取得とデコード
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "無効なリクエストデータです。"]);
    exit;
}

// 1. スパムボット対策（ハニーポットチェック）
if (!empty($data['website_hp'])) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "送信が完了しました。"]);
    exit;
}

// 2. 入力値の抽出とサニタイズ
$name     = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email    = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$category = isset($data['category']) ? trim(strip_tags($data['category'])) : '一般';
$subject  = isset($data['subject']) ? trim(strip_tags($data['subject'])) : '';
$message  = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

$category_map = [
    'general'  => '全般・ご意見・ご感想',
    'request'  => '機能追加・新ツールのリクエスト',
    'bug'      => 'バグ・不具合のご報告',
    'business' => 'ビジネス・お仕事に関するご相談'
];
$category_label = isset($category_map[$category]) ? $category_map[$category] : $category;

// 3. バリデーション
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "必須項目が入力されていません。"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "有効なメールアドレスを入力してください。"]);
    exit;
}

// ヘッダーインジェクション対策（改行コード除去）
$name    = str_replace(["\r", "\n"], '', $name);
$email   = str_replace(["\r", "\n"], '', $email);
$subject = str_replace(["\r", "\n"], '', $subject);

// 4. 文字エンコーディング設定
mb_language("uni");
mb_internal_encoding("UTF-8");

// 管理者受信用メール作成
$to = "support@mimihokuro.com";
$raw_subject = "【EC Tool Crate お問い合わせ】" . $subject;
$encoded_subject = "=?UTF-8?B?" . base64_encode($raw_subject) . "?=";

$mail_body = "EC Tool Crate Webサイトより以下のお問い合わせがありました。\n\n";
$mail_body .= "--------------------------------------------------\n";
$mail_body .= "【種　別】: " . $category_label . "\n";
$mail_body .= "【お名前】: " . $name . " 様\n";
$mail_body .= "【メール】: " . $email . "\n";
$mail_body .= "【件　名】: " . $subject . "\n";
$mail_body .= "【送信日時】: " . date("Y-m-d H:i:s") . "\n";
$mail_body .= "--------------------------------------------------\n\n";
$mail_body .= "【お問い合わせ内容】:\n" . $message . "\n\n";
$mail_body .= "--------------------------------------------------\n";
$mail_body .= "送信元IP: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '不明') . "\n";

// ヘッダー構築 (完全UTF-8 8bit)
$from_name_encoded = "=?UTF-8?B?" . base64_encode("EC Tool Crate") . "?=";
$reply_name_encoded = "=?UTF-8?B?" . base64_encode($name) . "?=";

$headers_str = "From: " . $from_name_encoded . " <support@mimihokuro.com>\r\n";
$headers_str .= "Reply-To: " . $reply_name_encoded . " <" . $email . ">\r\n";
$headers_str .= "MIME-Version: 1.0\r\n";
$headers_str .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers_str .= "Content-Transfer-Encoding: 8bit\r\n";
$headers_str .= "X-Mailer: PHP/" . phpversion();

// 5. 送信実行 (mail関数による直接UTF-8送信)
$success = mail($to, $encoded_subject, $mail_body, $headers_str);

if ($success) {
    // ユーザーへの自動返信メール (サンクスメール)
    $raw_reply_subject = "【EC Tool Crate】お問い合わせを受け付けいたしました";
    $encoded_reply_subject = "=?UTF-8?B?" . base64_encode($raw_reply_subject) . "?=";

    $reply_body = $name . " 様\n\n";
    $reply_body .= "EC Tool Crate へお問い合わせいただき誠にありがとうございます。\n";
    $reply_body .= "以下の内容でメッセージを受け付けいたしました。\n\n";
    $reply_body .= "--------------------------------------------------\n";
    $reply_body .= "【件名】: " . $subject . "\n";
    $reply_body .= "--------------------------------------------------\n\n";
    $reply_body .= "内容を確認の上、担当者よりご連絡させていただきます。\n";
    $reply_body .= "今しばらくお待ちいただけますようお願い申し上げます。\n\n";
    $reply_body .= "--------------------------------------------------\n";
    $reply_body .= "EC Tool Crate (https://ec-tool-crate.com)\n";
    $reply_body .= "お問い合わせ窓口: support@mimihokuro.com\n";
    $reply_body .= "--------------------------------------------------\n";

    $reply_headers_str = "From: " . $from_name_encoded . " <support@mimihokuro.com>\r\n";
    $reply_headers_str .= "MIME-Version: 1.0\r\n";
    $reply_headers_str .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $reply_headers_str .= "Content-Transfer-Encoding: 8bit\r\n";
    $reply_headers_str .= "X-Mailer: PHP/" . phpversion();

    mail($email, $encoded_reply_subject, $reply_body, $reply_headers_str);

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "お問い合わせを送信いたしました。"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "メール送信処理に失敗しました。時間をおいて再度お試しください。"]);
}
