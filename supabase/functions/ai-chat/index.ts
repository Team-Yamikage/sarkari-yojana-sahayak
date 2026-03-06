import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, data, lang = "hi" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "eligibility") {
      systemPrompt = lang === "hi"
        ? "तुम एक सरकारी योजना विशेषज्ञ AI हो। उपयोगकर्ता की जानकारी के आधार पर बताओ कि वे कौन-कौन सी सरकारी योजनाओं के लिए पात्र हैं। हर योजना के लिए बताओ: 1) योजना का नाम 2) संक्षिप्त विवरण 3) आवश्यक दस्तावेज 4) आवेदन कैसे करें 5) आम गलतियां जो बचनी चाहिए। सरल हिंदी में जवाब दो।"
        : "You are a government scheme expert AI. Based on user details, suggest eligible government schemes. For each: 1) Scheme name 2) Brief description 3) Required documents 4) How to apply 5) Common mistakes to avoid. Keep it simple.";
      userPrompt = `User Details: Name: ${data.name}, Age: ${data.age}, Gender: ${data.gender}, State: ${data.state}, District: ${data.district}, Category: ${data.category}, Occupation: ${data.occupation}, Annual Income: ₹${data.annual_income}, Disability: ${data.has_disability ? "Yes" : "No"}`;
    } else if (type === "explain") {
      systemPrompt = lang === "hi"
        ? "तुम एक सरकारी योजना विशेषज्ञ हो। उपयोगकर्ता जो योजना पूछे उसके बारे में सरल हिंदी में बताओ: 1) योजना का उद्देश्य 2) कौन आवेदन कर सकता है 3) आवश्यक दस्तावेज 4) अंतिम तारीख 5) आवेदन कैसे करें।"
        : "You are a government scheme expert. Explain the scheme the user asks about: 1) Purpose 2) Who can apply 3) Required documents 4) Deadline 5) How to apply.";
      userPrompt = `Explain this scheme: ${data.scheme_name}`;
    } else if (type === "letter") {
      systemPrompt = lang === "hi"
        ? "तुम एक हिंदी पत्र लेखक AI हो। उपयोगकर्ता के कारण के अनुसार एक प्रोफेशनल हिंदी आवेदन पत्र बनाओ। पत्र में तारीख, विषय, संबोधन, मुख्य विषय और हस्ताक्षर शामिल हों।"
        : "You are a Hindi letter writing AI. Generate a professional Hindi application letter based on the user's reason. Include date, subject, salutation, body, and signature.";
      userPrompt = `Reason: ${data.reason}, Name: ${data.name}, Details: ${data.details || "None"}`;
    } else if (type === "chat") {
      systemPrompt = lang === "hi"
        ? "तुम सरकारी योजना मित्र AI हो। तुम सरकारी योजनाओं, पात्रता, दस्तावेज़ों और आवेदन प्रक्रिया के बारे में सरल हिंदी में मदद करते हो। संक्षिप्त और उपयोगी जवाब दो।"
        : "You are Sarkari Yojana Mitra AI. You help with government schemes, eligibility, documents, and application process. Give concise, helpful answers.";
      userPrompt = data.message || "";
    } else {
      throw new Error("Invalid type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const result = aiData.choices?.[0]?.message?.content || "No response";

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
