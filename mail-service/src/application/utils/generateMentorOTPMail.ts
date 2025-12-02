export const APPROVE_SUBJECT = "Mentor request Approved";
export function buildMentorApprovalEmailHtml(username: string) {
	return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="dark">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mentorship Request Approved</title>
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
    .btn { display:inline-block; margin-top:16px; padding:12px 16px; background:var(--btn); color:var(--btn-text) !important; text-decoration:none; border-radius:10px; font-weight:600; transition:background 0.2s; }
    .btn:hover { background:var(--btn-hover); }
    .divider { height:1px; background:var(--border); margin:24px 0; }
    .muted { color:var(--muted); font-size:12px; }
    .footer { padding:16px 24px; border-top:1px solid var(--border); text-align:center; }
    .highlight { color:var(--accent); font-weight:600; }
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
        <div class="brand">Upstride</div>
      </div>
      <div class="body">
        <h1 class="h1">Congratulations, ${username}!</h1>
        <p class="p">Your request to join as a mentor on <span class="highlight">Upstride</span> has been approved 🎉</p>
        <p class="p">You can now build your mentor profile, connect with mentees, and start sharing your expertise.</p>
        <a class="btn" href="https://Upstride.com/mentor/dashboard" target="_blank">Go to Mentor Dashboard</a>
        <div class="divider"></div>
        <p class="muted">If you did not request to become a mentor, please contact our support team immediately.</p>
      </div>
      <div class="footer">
        <span class="muted">© ${new Date().getFullYear()} Upstride. All rights reserved.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}
