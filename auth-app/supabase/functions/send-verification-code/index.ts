
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type VerificationType = "SIGNUP" | "INVITE" | "RESET_PASSWORD" | "CHANGE_EMAIL";

interface RequestBody {
  email: string;
  type: VerificationType;
  url: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request data
    const { email, type, url }: RequestBody = await req.json();
    
    if (!email || !type || !url) {
      return new Response(
        JSON.stringify({ error: "Email, type and URL are required" }),
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
        type,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiry
        used: false
      });

    // Determine email provider based on type
    const provider = (type === "SIGNUP" || type === "INVITE") ? "RESEND" : "POSTMARK";
    
    // Call send-email edge function
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: email,
        type,
        code,
        url,
        provider
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Email sending error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
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
