const json = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Staff-Email',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
})

const isAllowedStaff = (email, env) => {
  const allowList = String(env.STAFF_EMAILS ?? '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
  return allowList.length === 0 || allowList.includes(String(email ?? '').trim().toLowerCase())
}

export const onRequestOptions = async () => json({}, 204)

export const onRequestPost = async ({ request, env }) => {
  if (!env.SENDGRID_API_KEY || !env.SENDGRID_FROM_EMAIL) {
    return json({ error: 'Email service is not configured. Add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to the deployment secrets.' }, 503)
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
    ? [...new Set(body.recipients.map((email) => String(email).trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))]
    : []
  const subject = String(body.subject ?? '').trim()
  const text = String(body.text ?? '').trim()
  const attachment = body.attachment

  if (recipients.length < 1 || recipients.length > 10) return json({ error: 'Choose between 1 and 10 valid recipients.' }, 400)
  if (!subject || subject.length > 160 || !text || text.length > 5000) return json({ error: 'Subject or message length is invalid.' }, 400)
  if (attachment && (!attachment.filename || !attachment.content || String(attachment.content).length > 2_800_000)) return json({ error: 'Attachment is missing or larger than 2 MB.' }, 400)

  const personalizations = recipients.map((email) => ({ to: [{ email }] }))
  const payload = { personalizations, from: { email: env.SENDGRID_FROM_EMAIL, name: 'MindBridge' }, subject, content: [{ type: 'text/plain', value: text }] }
  if (attachment) payload.attachments = [{ content: attachment.content, filename: attachment.filename, type: attachment.type || 'application/octet-stream', disposition: 'attachment' }]

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) return json({ error: `SendGrid rejected the message (HTTP ${response.status}).` }, 502)
  return json({ queued: recipients.length }, 202)
}
