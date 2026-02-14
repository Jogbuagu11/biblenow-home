
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { emailTemplates } from "./_templates/emailTemplates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = "SIGNUP" | "INVITE" | "RESET_PASSWORD" | "CHANGE_EMAIL";
type EmailProvider = "RESEND" | "POSTMARK";

interface EmailRequest {
  to: string;
  type: EmailType;
  url: string;
  code?: string;
  provider: EmailProvider;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, type, url, code, provider }: EmailRequest = await req.json();

    if (!to || !type || !url || !provider) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate code presence for types that require it
    if ((type === "RESET_PASSWORD" || type === "CHANGE_EMAIL") && !code) {
      return new Response(
        JSON.stringify({ error: "Code is required for password reset and email change" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const template = emailTemplates[type]({ email: to, url, code });
    const subjects = {
      SIGNUP: "Confirm Your BibleNOW Account",
      INVITE: "You're Invited to BibleNOW",
      RESET_PASSWORD: "Reset Your Password",
      CHANGE_EMAIL: "Confirm Your New Email",
    };

    if (provider === "RESEND") {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) {
        throw new Error("Resend API key not configured");
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "no-reply@biblenow.io",
          to,
          subject: subjects[type],
          html: template,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Resend API error:", error);
        throw new Error("Failed to send email via Resend");
      }

    } else if (provider === "POSTMARK") {
      const postmarkKey = Deno.env.get("POSTMARK_API_KEY");
      if (!postmarkKey) {
        throw new Error("Postmark API key not configured");
      }

      const templateId = type === "RESET_PASSWORD" ? "password-reset" : "change-email";
      const username = to.split("@")[0];

      const response = await fetch("https://api.postmarkapp.com/email/withTemplate", {
        method: "POST",
        headers: {
          "X-Postmark-Server-Token": postmarkKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TemplateId: templateId,
          From: "no-reply@biblenow.io",
          To: to,
          TemplateModel: {
            name: username,
            code,
            action_url: url,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Postmark API error:", error);
        throw new Error("Failed to send email via Postmark");
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

