import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler, { validateContactBody } from '../../api/contact'

// ── Mock Resend ─────────────────────────────────────────────────────

const mockSend = vi.fn()

vi.mock('resend', () => {
  class MockResend {
    emails = { send: mockSend }
  }
  return { Resend: MockResend }
})

// ── Helpers ─────────────────────────────────────────────────────────

function createMockReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    body: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello there!',
    },
    ...overrides,
  } as unknown as VercelRequest
}

function createMockRes(): VercelResponse & {
  _status: number
  _json: unknown
  _headers: Record<string, string>
} {
  const res = {
    _status: 200,
    _json: null as unknown,
    _headers: {} as Record<string, string>,
    status(code: number) {
      res._status = code
      return res
    },
    json(data: unknown) {
      res._json = data
      return res
    },
    setHeader(key: string, value: string) {
      res._headers[key] = value
      return res
    },
  }
  return res as unknown as VercelResponse & {
    _status: number
    _json: unknown
    _headers: Record<string, string>
  }
}

// ── Tests: validateContactBody ──────────────────────────────────────

describe('validateContactBody', () => {
  it('accepts a valid body', () => {
    const [data, errors] = validateContactBody({
      name: 'Jane',
      email: 'jane@test.com',
      message: 'Hello!',
    })
    expect(errors).toBeNull()
    expect(data).toEqual({
      name: 'Jane',
      email: 'jane@test.com',
      message: 'Hello!',
    })
  })

  it('trims whitespace from fields', () => {
    const [data] = validateContactBody({
      name: '  Jane  ',
      email: '  jane@test.com  ',
      message: '  Hello!  ',
    })
    expect(data).toEqual({
      name: 'Jane',
      email: 'jane@test.com',
      message: 'Hello!',
    })
  })

  it('rejects null / undefined body', () => {
    const [data, errors] = validateContactBody(null)
    expect(data).toBeNull()
    expect(errors).toHaveLength(1)
    expect(errors![0].field).toBe('body')
  })

  it('rejects empty name', () => {
    const [, errors] = validateContactBody({
      name: '',
      email: 'a@b.com',
      message: 'hi',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'name')).toBe(true)
  })

  it('rejects name over 100 characters', () => {
    const [, errors] = validateContactBody({
      name: 'A'.repeat(101),
      email: 'a@b.com',
      message: 'hi',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'name')).toBe(true)
  })

  it('rejects invalid email format', () => {
    const [, errors] = validateContactBody({
      name: 'Jane',
      email: 'not-an-email',
      message: 'hi',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'email')).toBe(true)
  })

  it('rejects empty email', () => {
    const [, errors] = validateContactBody({
      name: 'Jane',
      email: '',
      message: 'hi',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'email')).toBe(true)
  })

  it('rejects email over 254 characters', () => {
    const [, errors] = validateContactBody({
      name: 'Jane',
      email: 'a'.repeat(250) + '@b.com',
      message: 'hi',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'email')).toBe(true)
  })

  it('rejects empty message', () => {
    const [, errors] = validateContactBody({
      name: 'Jane',
      email: 'a@b.com',
      message: '',
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'message')).toBe(true)
  })

  it('rejects message over 2000 characters', () => {
    const [, errors] = validateContactBody({
      name: 'Jane',
      email: 'a@b.com',
      message: 'A'.repeat(2001),
    })
    expect(errors).not.toBeNull()
    expect(errors!.some((e) => e.field === 'message')).toBe(true)
  })

  it('collects multiple errors at once', () => {
    const [, errors] = validateContactBody({
      name: '',
      email: '',
      message: '',
    })
    expect(errors).toHaveLength(3)
  })

  it('rejects whitespace-only fields', () => {
    const [, errors] = validateContactBody({
      name: '   ',
      email: '   ',
      message: '   ',
    })
    expect(errors).toHaveLength(3)
  })
})

// ── Tests: handler ──────────────────────────────────────────────────

describe('handler', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV, RESEND_API_KEY: 'test_key_123' }
  })

  it('rejects non-POST methods with 405', async () => {
    const req = createMockReq({ method: 'GET' })
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(405)
    expect(res._json).toEqual({ error: 'Method not allowed' })
    expect(res._headers['Allow']).toBe('POST')
  })

  it('returns 400 for invalid body', async () => {
    const req = createMockReq({ body: { name: '', email: '', message: '' } })
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(400)
    expect((res._json as { error: string }).error).toBe('Validation failed')
  })

  it('returns 500 when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const req = createMockReq()
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(500)
    expect((res._json as { error: string }).error).toBe(
      'Server configuration error'
    )
  })

  it('returns 200 on successful email send', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'msg_123' }, error: null })
    const req = createMockReq()
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res._json).toEqual({ success: true })
    expect(mockSend).toHaveBeenCalledOnce()

    // Verify the email payload
    const sendArgs = mockSend.mock.calls[0][0]
    expect(sendArgs.to).toBe('reyneratiraprasetyo@gmail.com')
    expect(sendArgs.replyTo).toBe('john@example.com')
    expect(sendArgs.subject).toContain('John Doe')
  })

  it('returns 502 when Resend returns an error', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Rate limit exceeded' },
    })
    const req = createMockReq()
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(502)
    expect((res._json as { error: string }).error).toBe('Failed to send email')
  })

  it('returns 500 when Resend throws an exception', async () => {
    mockSend.mockRejectedValueOnce(new Error('Network failure'))
    const req = createMockReq()
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(500)
    expect((res._json as { error: string }).error).toBe('Internal server error')
  })

  it('escapes HTML in email content', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'msg_456' }, error: null })
    const req = createMockReq({
      body: {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        message: 'Hello <b>world</b>',
      },
    })
    const res = createMockRes()

    await handler(req, res)

    expect(res._status).toBe(200)
    const html = mockSend.mock.calls[0][0].html as string
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<b>')
    expect(html).toContain('&lt;b&gt;')
  })
})
