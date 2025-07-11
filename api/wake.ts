import type { VercelRequest, VercelResponse } from '@vercel/node'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioNumber = process.env.TWILIO_PHONE_NUMBER!

const client = twilio(accountSid, authToken)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const number = req.query.number as string

  if (!number) {
    return res.status(400).send('Missing phone number')
  }

  console.log("🔔 [wake.ts] Calling from:", twilioNumber)
  console.log("📞 [wake.ts] Calling to:", number)

  try {
    await client.calls.create({
      to: number,
      from: twilioNumber,
      timeout: 5, // Ring for 5 seconds max
      twiml: '<Response><Hangup/></Response>', // Immediately hang up if answered
    })

    console.log("✅ [wake.ts] Call placed successfully")
    res.status(200).send('Call placed')
  } catch (err) {
    console.error('❌ [wake.ts] Twilio error:', err)
    res.status(500).send('Failed to call')
  }
}
