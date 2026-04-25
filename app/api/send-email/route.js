// app/api/send-email/route.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TYPE_COLORS = {
  "New Revenue": "#4a9eff",
  "Revenue Recovery": "#10b981",
  "Market Expansion": "#f59e0b",
  "Retention & Expansion": "#a78bfa",
};
const EFFORT_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

function buildEmailHTML(name, company, results) {
  const opps = results.opportunities || [];

  const oppRows = opps
    .map((o) => {
      const color = TYPE_COLORS[o.type] || "#4a9eff";
      const effortColor = EFFORT_COLORS[o.effort] || "#64748b";
      return `
      <tr><td style="padding:0 0 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1f35;border-radius:10px;overflow:hidden;border:1px solid ${color}25;">
          <tr><td style="height:3px;background:linear-gradient(90deg,${color},transparent);font-size:0;">&nbsp;</td></tr>
          <tr><td style="padding:22px 26px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 8px 0;">
                    <span style="font-size:10px;color:${color};background:${color}18;padding:3px 10px;border-radius:4px;letter-spacing:0.08em;text-transform:uppercase;font-family:Helvetica,sans-serif;">${o.type}</span>
                    ${o.effort ? `<span style="font-size:10px;color:${effortColor};background:${effortColor}18;padding:3px 10px;border-radius:4px;margin-left:6px;font-family:Helvetica,sans-serif;">${o.effort} effort</span>` : ""}
                    ${o.timeToRevenue ? `<span style="font-size:10px;color:#475569;font-family:Helvetica,sans-serif;margin-left:8px;">${o.timeToRevenue}</span>` : ""}
                  </p>
                  <p style="margin:0 0 6px 0;font-size:20px;color:#f1f5f9;font-family:Georgia,serif;font-weight:400;">${o.title}</p>
                </td>
                <td width="60" style="text-align:right;vertical-align:top;">
                  <p style="margin:0;font-size:28px;color:${color};font-family:monospace;line-height:1;">${o.score}</p>
                  <p style="margin:2px 0 0;font-size:9px;color:#334155;letter-spacing:0.1em;font-family:Helvetica,sans-serif;">SIGNAL</p>
                </td>
              </tr>
            </table>
            ${o.headline ? `<p style="margin:10px 0 8px;font-size:14px;color:#94a3b8;font-style:italic;font-family:Helvetica,sans-serif;line-height:1.5;">${o.headline}</p>` : ""}
            <p style="margin:0 0 12px;font-size:13px;color:#64748b;line-height:1.65;font-family:Helvetica,sans-serif;">${o.description}</p>
            ${o.immediacy ? `<p style="margin:0;font-size:12px;font-family:Helvetica,sans-serif;padding:8px 12px;background:${color}10;border-left:2px solid ${color}40;border-radius:0 4px 4px 0;"><span style="color:${color};text-transform:uppercase;letter-spacing:0.05em;font-size:10px;">Why now · </span><span style="color:#64748b;">${o.immediacy}</span></p>` : ""}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
              <tr><td>
                <p style="margin:0 0 4px;font-size:11px;color:#334155;font-family:Helvetica,sans-serif;">Opportunity strength</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:3px;height:5px;overflow:hidden;">
                  <tr><td width="${o.score}%" style="background:${color};height:5px;border-radius:3px;font-size:0;">&nbsp;</td><td></td></tr>
                </table>
              </td>
              <td width="40" style="text-align:right;vertical-align:bottom;padding-left:10px;">
                <p style="margin:0;font-size:11px;color:${color};font-family:monospace;font-weight:700;">${o.score}%</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Revenue Opportunity Map — Predicta</title>
</head>
<body style="margin:0;padding:0;background:#050d1a;font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050d1a;">
  <tr><td align="center" style="padding:40px 20px;">
  <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

    <!-- Header -->
    <tr><td style="padding:0 0 36px 0;">
      <p style="margin:0 0 6px;font-size:11px;color:#4a9eff;letter-spacing:0.15em;text-transform:uppercase;font-family:Helvetica,sans-serif;">Predicta.au · AI Revenue Discovery</p>
      <h1 style="margin:0 0 8px;font-size:36px;color:#f1f5f9;font-family:Georgia,serif;font-weight:400;line-height:1.15;">Your AI Revenue<br><em style="color:#4a9eff;">Opportunity Map</em></h1>
      ${name || company ? `<p style="margin:0;font-size:13px;color:#475569;font-family:Helvetica,sans-serif;">${name || ""}${name && company ? " · " : ""}${company || ""}</p>` : ""}
    </td></tr>

    <!-- Divider -->
    <tr><td style="padding:0 0 28px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:linear-gradient(90deg,#1e3a5c,transparent);font-size:0;">&nbsp;</td></tr></table></td></tr>

    ${
      results.executiveSummary
        ? `<!-- Key Insight -->
    <tr><td style="padding:0 0 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;border-left:3px solid #4a9eff;overflow:hidden;">
        <tr><td style="padding:22px 26px;">
          <p style="margin:0 0 8px;font-size:10px;color:#4a9eff;letter-spacing:0.15em;text-transform:uppercase;font-family:Helvetica,sans-serif;">Key Insight</p>
          <p style="margin:0;font-size:16px;color:#cbd5e1;line-height:1.65;font-style:italic;font-family:Georgia,serif;">${results.executiveSummary}</p>
        </td></tr>
      </table>
    </td></tr>`
        : ""
    }

    <!-- Opportunities -->
    ${oppRows}

    <!-- Risk + First Move -->
    ${
      results.biggestRisk || results.recommendedFirstMove
        ? `<tr><td style="padding:0 0 16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${
            results.biggestRisk
              ? `<td width="48%" valign="top" style="padding-right:8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;border-left:3px solid #ef4444;">
              <tr><td style="padding:18px 20px;">
                <p style="margin:0 0 6px;font-size:10px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;font-family:Helvetica,sans-serif;">⚠ Biggest Risk</p>
                <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;font-family:Helvetica,sans-serif;">${results.biggestRisk}</p>
              </td></tr>
            </table>
          </td>`
              : ""
          }
          ${
            results.recommendedFirstMove
              ? `<td width="48%" valign="top" style="padding-left:8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;border-left:3px solid #10b981;">
              <tr><td style="padding:18px 20px;">
                <p style="margin:0 0 6px;font-size:10px;color:#10b981;letter-spacing:0.12em;text-transform:uppercase;font-family:Helvetica,sans-serif;">→ First Move (30 days)</p>
                <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;font-family:Helvetica,sans-serif;">${results.recommendedFirstMove}</p>
              </td></tr>
            </table>
          </td>`
              : ""
          }
        </tr>
      </table>
    </td></tr>`
        : ""
    }

    ${
      results.closingThought
        ? `<!-- Closing Thought -->
    <tr><td style="padding:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;border-left:3px solid #f59e0b;">
        <tr><td style="padding:22px 26px;">
          <p style="margin:0;font-size:16px;color:#cbd5e1;line-height:1.7;font-style:italic;font-family:Georgia,serif;">"${results.closingThought}"</p>
        </td></tr>
      </table>
    </td></tr>`
        : ""
    }

    <!-- CTA -->
    <tr><td style="padding:0 0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1f35;border-radius:12px;text-align:center;border:1px solid #4a9eff20;">
        <tr><td style="padding:32px 28px;">
          <p style="margin:0 0 8px;font-size:10px;color:#4a9eff;letter-spacing:0.15em;text-transform:uppercase;font-family:Helvetica,sans-serif;">Ready to Go Deeper?</p>
          <p style="margin:0 0 10px;font-size:22px;color:#f1f5f9;font-family:Georgia,serif;font-weight:400;">AI Revenue Diagnostic Session</p>
          <p style="margin:0 0 22px;font-size:14px;color:#64748b;line-height:1.65;font-family:Helvetica,sans-serif;max-width:420px;display:inline-block;">A focused 90-minute session with Louis to map your top opportunities in detail, build the business case, and identify your first implementation play.</p>
          <br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://predicta.au"}" style="display:inline-block;background:#4a9eff;color:#050d1a;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:Helvetica,sans-serif;">Book a Session with Louis →</a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="text-align:center;padding-bottom:20px;border-top:1px solid #0f1f35;padding-top:20px;">
      <p style="margin:0 0 4px;font-size:12px;color:#334155;font-family:Helvetica,sans-serif;">Generated by <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://predicta.au"}" style="color:#4a9eff;text-decoration:none;">Predicta.au</a> · AI Revenue Generation</p>
      <p style="margin:0;font-size:11px;color:#1e293b;font-family:Helvetica,sans-serif;">Louis Nonis · louis@predicta.au</p>
    </td></tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const { name, company, email, results } = await request.json();

    if (!email) {
      return Response.json({ error: "Email address required" }, { status: 400 });
    }

    const html = buildEmailHTML(name, company, results);

    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "Louis Nonis"} <${process.env.RESEND_FROM_EMAIL || "hello@predicta.au"}>`,
      to: [email],
      bcc: process.env.LEAD_BCC_EMAIL ? [process.env.LEAD_BCC_EMAIL] : [],
      subject: `Your AI Revenue Opportunity Map — ${company || name || "Predicta"}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("send-email error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
