
interface TemplateData {
  email: string;
  url: string;
  code?: string;
}

export const emailTemplates = {
  SIGNUP: ({ email, url }: TemplateData) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3E2723; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">BibleNOW</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5dc; border: 1px solid #d4af37;">
          <h2>Welcome to BibleNOW!</h2>
          <p>Thank you for signing up. Please click the button below to confirm your email address:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="background-color: #3E2723; color: #d4af37; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${url}</p>
        </div>
      </body>
    </html>
  `,

  INVITE: ({ email, url }: TemplateData) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3E2723; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">BibleNOW</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5dc; border: 1px solid #d4af37;">
          <h2>You're Invited!</h2>
          <p>You've been invited to join BibleNOW. Click the button below to accept the invitation:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="background-color: #3E2723; color: #d4af37; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${url}</p>
        </div>
      </body>
    </html>
  `,

  RESET_PASSWORD: ({ email, url, code }: TemplateData) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3E2723; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">BibleNOW</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5dc; border: 1px solid #d4af37;">
          <h2>Reset Your Password</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #3E2723; color: #d4af37; font-size: 24px; padding: 10px; text-align: center; letter-spacing: 5px; margin: 20px 0; font-weight: bold;">
            ${code}
          </div>
          <p>Once you've entered the code, click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="background-color: #3E2723; color: #d4af37; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      </body>
    </html>
  `,

  CHANGE_EMAIL: ({ email, url, code }: TemplateData) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3E2723; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">BibleNOW</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f5dc; border: 1px solid #d4af37;">
          <h2>Confirm Your New Email</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #3E2723; color: #d4af37; font-size: 24px; padding: 10px; text-align: center; letter-spacing: 5px; margin: 20px 0; font-weight: bold;">
            ${code}
          </div>
          <p>Enter this code to confirm your new email address. If you didn't request this change, please ignore this email.</p>
        </div>
      </body>
    </html>
  `,
};

