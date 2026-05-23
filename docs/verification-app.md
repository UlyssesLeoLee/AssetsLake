# Verification App

独立验证服务，用于注册和改密码流程。短信和邮件共享同一套 challenge / verify
模型；不配置真实 provider 时，系统会继续使用 `verification_outbox` 本地队列。

## 配置

- `VERIFICATION_APP_KEY=assetslake`
- `VERIFICATION_OWNER_EMAIL=hanakagumi@outlook.com`
- `VERIFICATION_EMAIL_FROM=hanakagumi@outlook.com`
- `VERIFICATION_SMS_SENDER=AssetsLake`
- `VERIFICATION_CODE_DIGITS=6`
- `VERIFICATION_CODE_TTL_SECONDS=300`
- `VERIFICATION_DEV_CODE_VISIBLE=true`
- `VERIFICATION_EMAIL_PROVIDER=auto`
- `VERIFICATION_SMS_PROVIDER=local`

生产环境应将 `VERIFICATION_DEV_CODE_VISIBLE` 设为 `false`。不配置真实 provider 时，
系统会继续使用 `verification_outbox` 本地队列。

Provider 切换规则：

- 邮件：`VERIFICATION_EMAIL_PROVIDER=gmail|outlook|smtp|auto|local`
- 短信：`VERIFICATION_SMS_PROVIDER=twilio|local`
- `auto` 只用于邮件，会按 Gmail、Outlook、自定义 SMTP 的顺序选择凭证完整的配置。

## Native Email Sending

原生邮件发送支持 `gmail`、`outlook`、`smtp`、`auto` 和 `local`。
`auto` 会按 Gmail、Outlook、自定义 SMTP 的顺序选择凭证完整的 provider。
凭证只通过环境变量注入，不写入代码：

### Gmail

```powershell
$env:VERIFICATION_EMAIL_PROVIDER='gmail'
$env:VERIFICATION_DEV_CODE_VISIBLE='false'
$env:GMAIL_SMTP_HOST='smtp.gmail.com'
$env:GMAIL_SMTP_PORT='587'
$env:GMAIL_SMTP_USERNAME='lidian727@gmail.com'
$env:GMAIL_SMTP_PASSWORD = Read-Host 'Gmail app password'
$env:GMAIL_SMTP_FROM_EMAIL='lidian727@gmail.com'
$env:GMAIL_SMTP_FROM_NAME='AssetsLake'
```

也兼容短变量名：

```powershell
$env:SMTP_USER='lidian727@gmail.com'
$env:SMTP_PASS = Read-Host 'Gmail app password'
```

Gmail SMTP 使用 `smtp.gmail.com`，STARTTLS 端口为 587；如果账号启用了两步验证，
需要使用 Google 账号里的 App Password。

- Gmail SMTP: https://developers.google.com/gmail/imap/imap-smtp
- Gmail App Password: https://support.google.com/mail/answer/185833

### Outlook

```powershell
$env:VERIFICATION_EMAIL_PROVIDER='outlook'
$env:VERIFICATION_DEV_CODE_VISIBLE='false'
$env:OUTLOOK_SMTP_HOST='smtp-mail.outlook.com'
$env:OUTLOOK_SMTP_PORT='587'
$env:OUTLOOK_SMTP_USERNAME='hanakagumi@outlook.com'
$env:OUTLOOK_SMTP_PASSWORD = Read-Host 'Outlook password or app password'
$env:OUTLOOK_SMTP_FROM_EMAIL='hanakagumi@outlook.com'
$env:OUTLOOK_SMTP_FROM_NAME='AssetsLake'
```

### Custom SMTP

```powershell
$env:VERIFICATION_EMAIL_PROVIDER='smtp'
$env:SMTP_HOST='smtp.example.com'
$env:SMTP_PORT='587'
$env:SMTP_USERNAME = Read-Host 'SMTP username'
$env:SMTP_PASSWORD = Read-Host 'SMTP password'
$env:SMTP_FROM_EMAIL='no-reply@example.com'
$env:SMTP_FROM_NAME='AssetsLake'
```

Outlook.com 官方 SMTP 设置为 587 端口和 STARTTLS：
https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040

## Twilio Real SMS

真实短信发送可使用 Twilio provider。凭证只通过环境变量注入，不写入代码或文档：

```powershell
$env:VERIFICATION_SMS_PROVIDER='twilio'
$env:VERIFICATION_DEV_CODE_VISIBLE='false'
$env:TWILIO_ACCOUNT_SID = Read-Host 'Twilio Account SID'
$env:TWILIO_AUTH_TOKEN = Read-Host 'Twilio Auth Token'
$env:TWILIO_FROM_NUMBER = Read-Host 'Twilio From Number'
# 或改用 Messaging Service:
# $env:TWILIO_MESSAGING_SERVICE_SID = Read-Host 'Twilio Messaging Service SID'
```

Twilio 的发送接口是 `POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`，
参数包括 `To`、`Body`，并使用 `From` 或 `MessagingServiceSid` 指定发信来源。
见 Twilio 官方 Messages resource 文档：
https://www.twilio.com/docs/sms/api/message

## API

- `GET /api/verification/app`
- `POST /api/verification/challenges`
- `POST /api/verification/challenges/{id}/verify`
- `POST /api/verification/register`
- `POST /api/verification/password`
- `GET /api/verification/outbox?limit=20`

所有请求都支持 `app_key`，其他项目可以用不同 `app_key` 复用同一个验证服务。

## 联调

```powershell
cd frontend
pnpm run test:verification
```

测试覆盖：短信挑战、验证码校验、注册、旧密码登录、短信改密、旧密码失效、新密码登录。

真实短信只测试发送：

```powershell
$env:REAL_SMS_TO='+15558675310'
pnpm run test:verification-real
```

真实邮件只测试发送：

```powershell
$env:REAL_EMAIL_TO='your-address@example.com'
pnpm run test:verification-email-real
```

## Kubernetes

K8s 中使用独立 Deployment / Service 承载邮件验证能力：

- Deployment: `assetslake-verification-email`
- Service: `assetslake-verification-email`
- Ingress: `/api/verification/*`
- Route set: `ASSETSLAKE_SERVICE=verification`

SMTP 运行参数来自 `assetslake-config`，账号和密码来自 `assetslake-secrets`：

```powershell
$smtpUsername = 'lidian727@gmail.com'
$smtpPassword = Read-Host 'Gmail app password'
$smtpUsername64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($smtpUsername))
$smtpPassword64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($smtpPassword))
kubectl -n assetslake patch secret assetslake-secrets --type merge `
  -p "{`"data`":{`"GMAIL_SMTP_USERNAME`":`"$smtpUsername64`",`"GMAIL_SMTP_PASSWORD`":`"$smtpPassword64`"}}"
```

默认清单中不会写入真实 SMTP 密码。部署前需要把对应 provider 的用户名和密码写入
Kubernetes Secret。
