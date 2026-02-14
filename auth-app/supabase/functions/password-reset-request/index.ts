
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request data
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code in Supabase
    await supabase
      .from("email_verification_codes")
      .insert({
        email,
        code,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiry
      });

    // Initialize Postmark client
    const postmarkToken = Deno.env.get("POSTMARK_API_TOKEN");
    
    // Send email with Postmark
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken || "",
      },
      body: JSON.stringify({
        From: "verification@biblenow.io",
        To: email,
        Subject: "BibleNOW Password Reset Code",
        HtmlBody: `
          <html>
            <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #3E2723; padding: 20px; text-align: center;">
                <h1 style="color: #d4af37; margin: 0;">BibleNOW</h1>
              </div>
              <div style="padding: 20px; background-color: #f5f5dc; border: 1px solid #d4af37;">
                <h2>Password Reset Code</h2>
                <p>You have requested to reset your BibleNOW password. Please use the following code:</p>
                <div style="background-color: #3E2723; color: #d4af37; font-size: 24px; padding: 10px; text-align: center; letter-spacing: 5px; margin: 20px 0; font-weight: bold;">
                  ${code}
                </div>
                <p>This code will expire in 15 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
              </div>
              <div style="padding: 10px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; ${new Date().getFullYear()} BibleNOW. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
        TextBody: `Your BibleNOW password reset code is: ${code}. This code will expire in 15 minutes.`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Postmark error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send password reset email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
