import React from 'npm:react@18.3.1';

type InviteEmailProps = {
  email: string;
  sign_up_url: string;
  web_fallback_url?: string;
  invited_by?: string;
};

export default function InviteEmail({ email, sign_up_url, web_fallback_url, invited_by }: InviteEmailProps) {
  const ctaUrl = web_fallback_url || sign_up_url;

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ backgroundColor: '#3E2723', padding: 20, textAlign: 'center' }}>
          <h1 style={{ color: '#d4af37', margin: 0 }}>BibleNOW</h1>
        </div>
        <div style={{ padding: 20, backgroundColor: '#f5f5dc', border: '1px solid #d4af37' }}>
          <h2>{invited_by ? `${invited_by} invited you!` : "You're Invited!"}</h2>
          <p>You've been invited to join BibleNOW. Click the button below to accept the invitation:</p>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <a href={ctaUrl} style={{ backgroundColor: '#3E2723', color: '#d4af37', padding: '12px 24px', textDecoration: 'none', borderRadius: 4, display: 'inline-block' }}>
              Accept Invitation
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style={{ wordBreak: 'break-all' }}>{ctaUrl}</p>
        </div>
      </body>
    </html>
  );
} 