import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, errors: { send_mail: "Method not allowed" } }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.json();
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "The name field is required.";
    }
    if (!formData.email || formData.email.trim() === "") {
      errors.email = "The email field is required.";
    }
    if (!formData.text || formData.text.trim() === "") {
      errors.text = "The text field is required.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "The email format is not valid.";
    }

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = formData.name.trim();
    const lastname = (formData.lastname || "").trim();
    const email = formData.email.trim();
    const phone = (formData.phone || "").trim();
    const message = formData.text.trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      lastname,
      email,
      phone,
      message,
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, errors: { send_mail: "An error occurred, the message was not sent." } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification in background (non-blocking)
    const sendEmailUrl = `${supabaseUrl}/functions/v1/send-email-notification`;
    EdgeRuntime.waitUntil(
      fetch(sendEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ name, lastname, email, phone, message }),
      }).catch(() => {})
    );

    return new Response(
      JSON.stringify({ success: true, message: "Your message has been sent successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (_e) {
    return new Response(
      JSON.stringify({ success: false, errors: { send_mail: "An error occurred, the message was not sent." } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
