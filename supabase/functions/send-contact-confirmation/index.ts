import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: max emails per email address in time window
const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_EMAILS_PER_WINDOW = 3;

// Sanitize string to prevent XSS in email HTML
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate required environment variables
    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const { message_id } = body;

    // Validate message_id is provided and is a valid UUID
    if (!message_id || typeof message_id !== "string" || !isValidUUID(message_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role to verify the message exists
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the contact message from the database
    const { data: message, error: fetchError } = await supabase
      .from("contact_messages")
      .select("id, name, email, created_at")
      .eq("id", message_id)
      .single();

    if (fetchError || !message) {
      console.error("Message not found:", message_id);
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the message was created recently (within last 5 minutes) to prevent replay attacks
    const messageAge = Date.now() - new Date(message.created_at).getTime();
    const maxAgeMs = 5 * 60 * 1000; // 5 minutes
    if (messageAge > maxAgeMs) {
      console.error("Message too old for email confirmation:", message_id);
      return new Response(
        JSON.stringify({ error: "Request expired" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limiting: check how many messages from this email in the time window
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("email", message.email)
      .gte("created_at", windowStart);

    if (countError) {
      console.error("Rate limit check error:", countError);
    } else if (count && count > MAX_EMAILS_PER_WINDOW) {
      console.error("Rate limit exceeded for email:", message.email);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize sender name for HTML email
    const sanitizedSenderName = sanitizeHtml(message.name.trim().substring(0, 100));

    // Fetch portfolio owner's name from profile
    const { data: profile } = await supabase
      .from("profile")
      .select("name")
      .limit(1)
      .single();
    
    const ownerName = profile?.name ? sanitizeHtml(profile.name.trim()) : "The Portfolio Owner";

    // Send the confirmation email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${ownerName} <onboarding@resend.dev>`,
        to: [message.email],
        subject: "Thank you for reaching out!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #6366f1; margin: 0; font-size: 28px; }
              .content { background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
              .content p { margin: 0 0 15px 0; }
              .highlight { color: #6366f1; font-weight: 600; }
              .footer { text-align: center; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Message Received!</h1>
              </div>
              <div class="content">
                <p>Hi <span class="highlight">${sanitizedSenderName}</span>,</p>
                <p>Thank you so much for reaching out! I've received your message and I'm excited to learn more about your project.</p>
                <p>I typically respond within <strong>24 hours</strong>, so you'll hear back from me soon.</p>
                <p>In the meantime, feel free to check out my portfolio to see more of my work.</p>
                <p>Looking forward to connecting with you!</p>
                <p>Best regards,<br><span class="highlight">${ownerName}</span></p>
              </div>
              <div class="footer">
                <p>This is an automated confirmation email. Please don't reply to this message.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    console.log("Confirmation email sent successfully for message:", message_id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send confirmation email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
