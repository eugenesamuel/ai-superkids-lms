// SendGrid email helper.
// Activates when SENDGRID_API_KEY is set + SENDGRID_FROM is a verified sender.

let cached: unknown = null;

async function getClient() {
  if (cached) return cached;
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return null;
  const mod = await import("@sendgrid/mail");
  const sg = mod.default;
  sg.setApiKey(key);
  cached = sg;
  return sg;
}

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; via: "sendgrid" | "noop"; error?: string }> {
  const sg = await getClient();
  const from = process.env.SENDGRID_FROM ?? "noreply@digitalscholar.in";
  if (!sg) {
    console.warn("[sendgrid] not configured — skipping send");
    return { ok: false, via: "noop", error: "not configured" };
  }
  try {
    await (sg as { send: (m: unknown) => Promise<unknown> }).send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text ?? payload.html.replace(/<[^>]+>/g, ""),
    });
    return { ok: true, via: "sendgrid" };
  } catch (err) {
    console.error("[sendgrid] send failed:", err);
    return { ok: false, via: "sendgrid", error: err instanceof Error ? err.message : String(err) };
  }
}

/* ─── Templates ────────────────────────────────────────────────────────── */

export function welcomeEmail(opts: {
  childName: string;
  parentEmail: string;
  loginUrl: string;
}) {
  return {
    to: opts.parentEmail,
    subject: `Welcome to AI SuperKids — ${opts.childName}'s account is ready`,
    html: `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A1A2E">
  <div style="text-align:center;margin-bottom:24px">
    <div style="display:inline-block;background:#FF6B35;color:white;font-weight:bold;width:56px;height:56px;line-height:56px;border-radius:14px;font-size:18px">DS</div>
  </div>
  <h1 style="font-size:24px;color:#1A1A2E;margin:16px 0">Welcome to AI SuperKids 🚀</h1>
  <p style="font-size:16px;line-height:1.55;color:#4a4a6a">
    Hi! ${opts.childName}'s enrollment in AI SuperKids by Digital Scholar is confirmed.
  </p>
  <p style="font-size:16px;line-height:1.55;color:#4a4a6a">
    Click the button below to set a password and start the first mission:
  </p>
  <div style="text-align:center;margin:32px 0">
    <a href="${opts.loginUrl}" style="background:#FF6B35;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block">
      Open AI SuperKids
    </a>
  </div>
  <p style="font-size:14px;line-height:1.5;color:#7a7a96">
    Live classes happen on Zoom. Recordings, assignments, and projects all live in your AI SuperKids dashboard.
  </p>
  <hr style="border:none;border-top:1px solid #E4E6EC;margin:32px 0">
  <p style="font-size:12px;color:#9a9aae;text-align:center">
    Digital Scholar · digitalscholar.in<br>
    Questions? Reply to this email.
  </p>
</body></html>`.trim(),
  };
}

export function announcementEmail(opts: {
  to: string[];
  title: string;
  body: string;
}) {
  return {
    to: opts.to,
    subject: `AI SuperKids — ${opts.title}`,
    html: `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A1A2E">
  <div style="text-align:center;margin-bottom:16px">
    <div style="display:inline-block;background:#FF6B35;color:white;font-weight:bold;width:48px;height:48px;line-height:48px;border-radius:12px;font-size:16px">DS</div>
  </div>
  <h1 style="font-size:22px;color:#1A1A2E;margin:8px 0 16px">${opts.title}</h1>
  <div style="font-size:16px;line-height:1.6;color:#4a4a6a;white-space:pre-wrap">${escapeHtml(opts.body)}</div>
  <hr style="border:none;border-top:1px solid #E4E6EC;margin:24px 0">
  <p style="font-size:12px;color:#9a9aae;text-align:center">
    Digital Scholar · AI SuperKids
  </p>
</body></html>`.trim(),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
