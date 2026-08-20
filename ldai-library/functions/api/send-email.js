const json = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Staff-Email',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
})

const isAllowedStaff = (email, env) => {
  const allowList = String(env.STAFF_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  return allowList.length > 0 && allowList.includes(String(email ?? '').trim().toLowerCase())
}

const isDemoRecipient = (email) => email.endsWith('@example.org')
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const onRequestOptions = async () => json({}, 204)

export const onRequestPost = async ({ request, env }) => {
  if (!env.EMAILJS_PUBLIC_KEY || !env.EMAILJS_SERVICE_ID || !env.EMAILJS_TEMPLATE_ID || !env.STAFF_EMAILS) {
    return json({ error: 'Email service is not configured. Add EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and STAFF_EMAILS to the deployment secrets.' }, 503)
  }
  if (!isAllowedStaff(request.headers.get('X-Staff-Email'), env)) {
    return json({ error: 'Staff authorisation is required to send outreach email.' }, 403)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400)
  }

  const recipients = Array.isArray(body.recipients)
    ? [...new Set(body.recipients
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))]
    : []
  const subject = String(body.subject ?? '').trim()
  const text = String(body.text ?? '').trim()

  if (recipients.length < 1 || recipients.length > 10) return json({ error: 'Choose between 1 and 10 valid recipients.' }, 400)
  if (recipients.some((email) => !isDemoRecipient(email))) return json({ error: 'This demonstration only sends to example.org recipients.' }, 400)
  if (!subject || subject.length > 160 || !text || text.length > 5000) return json({ error: 'Subject or message length is invalid.' }, 400)
  if (body.attachment) return json({ error: 'Attachments are disabled for the current EmailJS plan.' }, 400)

  const accessToken = String(env.EMAILJS_PRIVATE_KEY ?? '').trim()
  const results = []

  for (const [index, email] of recipients.entries()) {
    if (index > 0) await wait(1100)

    const payload = {
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        subject,
        name: 'MindBridge',
        time: new Date().toISOString(),
        message: text,
        email: 'support@example.org',
      },
      ...(accessToken ? { accessToken } : {}),
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return json({ error: `EmailJS rejected the message (HTTP ${response.status}).` }, 502)
    results.push(email)
  }

  return json({ queued: results.length }, 202)
}
