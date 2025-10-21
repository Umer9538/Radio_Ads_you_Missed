import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@radioadsmissed.co.nz',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

interface PasswordResetEmailOptions {
  to: string
  firstName?: string
  resetUrl: string
}

export async function sendPasswordResetEmail({
  to,
  firstName,
  resetUrl,
}: PasswordResetEmailOptions) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .content { background: white; padding: 30px; border-radius: 8px; }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #ff1b6b, #ff6b00);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          .link { word-break: break-all; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #ff1b6b;">Reset Your Password</h2>
            <p>Hi ${firstName || 'there'},</p>
            <p>You requested to reset your password for your Radio Ads You Missed account. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>Radio Ads You Missed</p>
            <p>Never miss a great deal or promotion you heard on the radio again!</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to,
    subject: 'Reset Your Password - Radio Ads You Missed',
    html,
  })
}

interface VerificationEmailOptions {
  to: string
  firstName?: string
  verificationUrl: string
}

export async function sendVerificationEmail({
  to,
  firstName,
  verificationUrl,
}: VerificationEmailOptions) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .content { background: white; padding: 30px; border-radius: 8px; }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #00d4ff, #00ff88);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          .link { word-break: break-all; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #00d4ff;">Verify Your Email Address</h2>
            <p>Hi ${firstName || 'there'},</p>
            <p>Thank you for signing up for Radio Ads You Missed! Please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Radio Ads You Missed</p>
            <p>Never miss a great deal or promotion you heard on the radio again!</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to,
    subject: 'Verify Your Email - Radio Ads You Missed',
    html,
  })
}

interface ContactEmailOptions {
  from: string
  name: string
  message: string
}

export async function sendContactEmail({ from, name, message }: ContactEmailOptions) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .content { background: white; padding: 30px; border-radius: 8px; }
          .info { background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .message { background: #fff; border-left: 4px solid #00d4ff; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #ff1b6b;">New Contact Form Submission</h2>
            <div class="info">
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> ${from}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div class="message">
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: process.env.EMAIL_FROM || 'noreply@radioadsmissed.co.nz',
    subject: `Contact Form: Message from ${name}`,
    html,
  })
}
