export const OTP_SUBJECT = "Skillsphere - OTP";
import { OtpType } from "../../common/enums/otpTypes";

export function buildOtpEmailHtml(otp: string, type: OtpType) {
	return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="dark">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SkillSphere OTP</title>
  <style>
    :root {
      --bg: #09090b;        /* zinc-950 */
      --card: #18181b;      /* zinc-900 */
      --card-hover: #27272a; /* zinc-800 */
      --border: #27272a;    /* zinc-800 */
      --muted: #71717a;     /* zinc-500 */
      --text: #fafafa;      /* zinc-50 */
      --subtle: #a1a1aa;    /* zinc-400 */
      --btn: #3b82f6;       /* blue-500 */
      --btn-hover: #2563eb; /* blue-600 */
      --btn-text: #ffffff;  /* white */
      --code-bg: #1e293b;   /* slate-800 */
      --code-border: #3b82f6; /* blue-500 */
      --accent: #3b82f6;    /* blue-500 */
    }
    body { margin:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
    .container { width:100%; padding:24px; }
    .card { max-width:560px; margin:0 auto; background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.15); }
    .header { padding:20px 24px; border-bottom:1px solid var(--border); background:linear-gradient(to right, #18181b, #1e293b); }
    .brand { font-weight:700; font-size:18px; color:var(--text); letter-spacing:.2px; }
    .body { padding:24px; }
    .h1 { font-size:20px; font-weight:700; margin:0 0 8px; color:var(--text); }
    .p { margin:0 0 12px; line-height:1.6; color:var(--subtle); }
    .otp-wrap { margin:20px 0; text-align:center; }
    .otp-code { display:inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:24px; letter-spacing:4px; padding:16px 24px; border-radius:12px; background:var(--code-bg); border:1px solid var(--code-border); color:var(--text); font-weight:600; box-shadow:0 2px 8px rgba(59, 130, 246, 0.15); }
    .btn { display:inline-block; margin-top:16px; padding:12px 16px; background:var(--btn); color:var(--btn-text) !important; text-decoration:none; border-radius:10px; font-weight:600; transition:background 0.2s; }
    .btn:hover { background:var(--btn-hover); }
    .divider { height:1px; background:var(--border); margin:24px 0; }
    .muted { color:var(--muted); font-size:12px; }
    .footer { padding:16px 24px; border-top:1px solid var(--border); text-align:center; }
    .highlight { color:var(--accent); font-weight:600; }
    @media (max-width: 480px) {
      .body { padding:20px; }
      .header, .footer { padding:16px 20px; }
      .otp-code { font-size:20px; letter-spacing:3px; padding:14px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="brand">SkillSphere</div>
      </div>
      <div class="body">
        <h1 class="h1">Verify your ${type === "register" ? "sign-in" : "password reset"}</h1>
        <p class="p">Your OTP for <span class="highlight">SkillSphere</span> is:</p>
        <div class="otp-wrap">
          <span class="otp-code">${otp}</span>
        </div>
        <p class="p">It's valid for <strong>5 minutes</strong>. For your security, don't share this code with anyone.</p>
        <div class="divider"></div>
        <p class="muted">Didn't request this? You can safely ignore this email.</p>
      </div>
      <div class="footer">
        <span class="muted">© ${new Date().getFullYear()} SkillSphere. All rights reserved.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}
