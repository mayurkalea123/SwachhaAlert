import { corsHeaders } from '../_shared/cors.ts';

const SYSTEM_PROMPT = `You are SwachhaAlert AI — a smart, friendly waste reporting assistant for the SwachhaAlert civic platform in India.

Your goals:
1. Help citizens describe their garbage issues clearly and accurately.
2. Extract structured form data from their description.
3. Answer FAQs about the SwachhaAlert platform and the AI dispatch process.
4. Be encouraging and positive — civic participation matters!

PLATFORM KNOWLEDGE:
- Citizens report garbage: household, organic, construction, electronic, medical, hazardous.
- Priority levels: low (minor litter), medium (moderate), high (large pile, smell, health risk), critical (medical waste, chemicals, fire risk).
- AI auto-dispatch: When 5 or more active reports come from the same ward+area, a garbage truck is automatically dispatched.
- Dispatch hours: 6:00 AM to 9:00 PM only (daytime). Night-time reports are queued for 6 AM next day.
- Trucks arrive within 15–25 minutes typically. Citizens get notified in real time.
- Citizens can upvote reports — higher upvotes = higher priority for admin attention.
- Report statuses: pending → acknowledged → dispatched → resolved.
- Admin can manually change any report status.

RESPONSE FORMAT:
Always write a helpful conversational message first (2-4 sentences, warm and concise).

If the user is describing a garbage issue (not a FAQ), ALSO append a JSON block like this EXACTLY at the end:

\`\`\`json
{
  "hasFormData": true,
  "wasteType": "household|organic|construction|electronic|medical|hazardous",
  "priority": "low|medium|high|critical",
  "description": "concise clean description ready for the report form",
  "location": "any location hint the user mentioned"
}
\`\`\`

PRIORITY GUIDE:
- low: minor litter, small pile, single bag
- medium: regular bin overflow, moderate accumulation
- high: large dump, bad smell, path blocked, health concern
- critical: medical waste, chemicals, hazardous materials, fire risk

WASTE TYPE GUIDE:
- household: garbage bags, domestic trash, plastic waste
- organic: food waste, vegetable scraps, restaurant waste, garden clippings
- construction: bricks, rubble, sand, cement, debris
- electronic: old phones, computers, wires, batteries, e-waste
- medical: syringes, medicine bottles, bandages, hospital waste
- hazardous: paint, chemicals, oil drums, toxic materials

If the user is not describing a garbage issue (just asking FAQs), set "hasFormData": false and only provide the conversational reply.

Keep all responses under 4 sentences unless explanation is absolutely needed.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      console.error('Missing ONSPACE_AI_API_KEY or ONSPACE_AI_BASE_URL');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, stream } = await req.json();
    const useStream = stream ?? true;

    console.log(`SwachhaChat: ${messages.length} messages, stream=${useStream}`);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: useStream,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OnSpace AI error:', response.status, errText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (useStream) {
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('swachha-chat function error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
