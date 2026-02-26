import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory session store (resets on cold start, acceptable for admin-only use)
const sessions = new Map<string, number>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, token } = await req.json();

    if (action === "login") {
      const adminPassword = Deno.env.get("ADMIN_PASSWORD");
      if (!adminPassword) {
        return new Response(JSON.stringify({ error: "Admin password not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (password === adminPassword) {
        const sessionToken = crypto.randomUUID();
        sessions.set(sessionToken, Date.now() + 3600000); // 1 hour expiry
        return new Response(JSON.stringify({ success: true, token: sessionToken }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify") {
      if (!token) {
        return new Response(JSON.stringify({ valid: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const expiry = sessions.get(token);
      const valid = !!expiry && expiry > Date.now();
      if (!valid) sessions.delete(token);
      return new Response(JSON.stringify({ valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "logout") {
      if (token) sessions.delete(token);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
