
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import MagicLinkEmail from './_templates/magic-link.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      token, 
      token_hash, 
      email_action_type, 
      redirect_to 
    } = await req.json();

    // Render the email template
    const html = await renderAsync(
      React.createElement(MagicLinkEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL')!,
        token,
        token_hash,
        email_action_type,
        redirect_to
      })
    );

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'BibleNOW <onboarding@biblenow.io>',
      to: [email],
      subject: 'Your Authentication Link',
      html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json', 
        ...corsHeaders 
      },
    });
  } catch (error) {
    console.error('Error in send-auth-email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        ...corsHeaders 
      },
    });
  }
});
