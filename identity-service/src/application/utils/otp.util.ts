export const OTP_SUBJECT = "Skillsphere - OTP";

export enum otpType {
  register = "register",
  reset = "reset",
}

export function buildOtpEmailHtml(otp: string, type: otpType) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SkillSphere OTP</title>
  <style>
    /* Use neutral/zinc-like palette with inline-safe CSS */
    :root {
      --bg: #f8fafc;        /* zinc-50 */
      --card: #ffffff;      /* white */
      --border: #e4e4e7;    /* zinc-200/300 */
      --muted: #71717a;     /* zinc-500 */
      --text: #18181b;      /* zinc-900 */
      --subtle: #3f3f46;    /* zinc-700 */
      --btn: #18181b;       /* zinc-900 */
      --btn-text: #ffffff;  /* white */
      --code-bg: #f4f4f5;   /* zinc-100 */
    }
    body { margin:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
    .container { width:100%; padding:24px; }
    .card { max-width:560px; margin:0 auto; background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
    .header { padding:20px 24px; border-bottom:1px solid var(--border); }
    .brand { font-weight:700; font-size:18px; color:var(--text); letter-spacing:.2px; }
    .body { padding:24px; }
    .h1 { font-size:20px; font-weight:700; margin:0 0 8px; color:var(--text); }
    .p { margin:0 0 12px; line-height:1.6; color:var(--subtle); }
    .otp-wrap { margin:16px 0 20px; }
    .otp-code { display:inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:22px; letter-spacing:3px; padding:12px 16px; border-radius:12px; background:var(--code-bg); border:1px solid var(--border); color:var(--text); }
    .btn { display:inline-block; margin-top:16px; padding:12px 16px; background:var(--btn); color:var(--btn-text) !important; text-decoration:none; border-radius:10px; font-weight:600; }
    .divider { height:1px; background:var(--border); margin:24px 0; }
    .muted { color:var(--muted); font-size:12px; }
    .footer { padding:16px 24px; border-top:1px solid var(--border); text-align:center; }
    @media (max-width: 480px) {
      .body { padding:20px; }
      .header, .footer { padding:16px 20px; }
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
        <p class="p">Your OTP for SkillShpere is:</p>
        <div class="otp-wrap">
          <span class="otp-code">${otp}</span>
        </div>
        <p class="p">It’s valid for <strong>5 minutes</strong>. For your security, don’t share this code with anyone.</p>
        <div class="divider"></div>
        <p class="muted">Didn’t request this? You can safely ignore this email.</p>
      </div>
      <div class="footer">
        <span class="muted">© ${new Date().getFullYear()} SkillSphere. All rights reserved.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}
