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

  try {
    await client.calls.create({
      to: number,
      from: twilioNumber,
      twiml: '<Response><Pause length="5"/></Response>',
    })
    res.status(200).send('Call placed')
  } catch (err) {
    console.error('Twilio error:', err)
    res.status(500).send('Failed to call')
  }
}

console.log("Calling from:", twilioNumber)


