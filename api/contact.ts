import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

// ── Validation helpers ──────────────────────────────────────────────

const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 2000

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactBody {
  name: string
  email: string
  message: string
}

interface ValidationError {
  field: string
  message: string
}

/**
 * Validates and sanitises the incoming contact form payload.
 * Returns [cleanData, null] on success or [null, errors] on failure.
 */
export function validateContactBody(
  body: unknown
): [ContactBody, null] | [null, ValidationError[]] {
  const errors: ValidationError[] = []

  if (!body || typeof body !== 'object') {
    return [null, [{ field: 'body', message: 'Request body is required' }]]
  }

  const { name, email, message } = body as Record<string, unknown>

  // Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (name.trim().length > MAX_NAME_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name must be at most ${MAX_NAME_LENGTH} characters`,
    })
  }

  // Email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (email.trim().length > MAX_EMAIL_LENGTH) {
    errors.push({
      field: 'email',
      message: `Email must be at most ${MAX_EMAIL_LENGTH} characters`,
    })
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Email format is invalid' })
  }

  // Message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required' })
  } else if (message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.push({
      field: 'message',
      message: `Message must be at most ${MAX_MESSAGE_LENGTH} characters`,
    })
  }

  if (errors.length > 0) return [null, errors]

  return [
    {
      name: (name as string).trim(),
      email: (email as string).trim(),
      message: (message as string).trim(),
    },
    null,
  ]
}

// ── Serverless handler ──────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate body
  const [data, errors] = validateContactBody(req.body)
  if (errors) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  // Ensure API key is configured
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Send email via Resend
  try {
    const resend = new Resend(apiKey)

    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'reyneratiraprasetyo@gmail.com',
      replyTo: data.email,
      subject: `Portfolio message from ${data.name}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <hr />
        <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
      `,
    })

    if (sendError) {
      console.error('Resend API error:', sendError)
      return res.status(502).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error sending email:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
