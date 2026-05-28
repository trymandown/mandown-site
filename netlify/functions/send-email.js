const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'hello@trymandown.com';
const NOTIFY_EMAIL = 'hello@trymandown.com';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
  } catch(e) {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  try {
    // Welcome email to user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Man Down <${FROM_EMAIL}>`,
        to: [email],
        subject: "most men never make it this far.",
        headers: {
          'List-Unsubscribe': `<mailto:hello@trymandown.com?subject=Unsubscribe>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        },
        html: `
          <div style="background:#07090F;min-height:100vh;padding:60px 24px;font-family:'DM Sans',sans-serif;">
            <div style="max-width:480px;margin:0 auto;">
              <p style="color:#C8943A;font-size:22px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:40px;">Man Down</p>
              <p style="color:#EEE9E0;font-size:24px;font-weight:200;line-height:1.4;letter-spacing:-0.03em;margin-bottom:24px;">most men never make it this far.</p>
              <p style="color:#7A8BA4;font-size:15px;line-height:1.8;margin-bottom:16px;">they feel it. they scroll past. they tell themselves they're fine.</p>
              <p style="color:#7A8BA4;font-size:15px;line-height:1.8;margin-bottom:16px;">you didn't.</p>
              <p style="color:#7A8BA4;font-size:15px;line-height:1.8;margin-bottom:16px;">we're still building. but when it's ready — you'll be the first to know.</p>
              <p style="color:#7A8BA4;font-size:15px;line-height:1.8;margin-bottom:40px;">until then, just know you're not the only one carrying it.</p>
              <p style="color:#354458;font-size:12px;line-height:1.8;">man down<br>trymandown.com</p>
              <p style="color:#2a3a50;font-size:11px;margin-top:32px;">to unsubscribe <a href="mailto:hello@trymandown.com?subject=Unsubscribe" style="color:#2a3a50;">click here</a>.</p>
            </div>
          </div>
        `
      })
    });

    // Notification to you
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Man Down Waitlist <${FROM_EMAIL}>`,
        to: [NOTIFY_EMAIL],
        subject: `new signup: ${email}`,
        html: `<p style="font-family:sans-serif;font-size:15px;color:#333;">New waitlist signup:<br><strong>${email}</strong></p>`
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
