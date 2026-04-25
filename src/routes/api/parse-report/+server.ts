import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const SUBJECT_LIST = [
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'English HL',
  'English FAL',
  'Accounting',
  'Business Studies',
  'History',
  'Geography',
  'Afrikaans',
  'isiZulu / isiXhosa / Other Lang',
  'Information Technology',
  'Economics',
  'Life Orientation',
  'Computer Applications Technology',
  'Other Subject'
];

const SYSTEM_PROMPT = `You are a South African matric report card reader. Extract subject marks from the image.

Return ONLY a JSON array. Each element: {"subject": string, "mark": number, "matchedSubject": string}

Rules:
- "mark" must be a percentage (0-100). If the report shows raw marks, convert to percentage. If it shows a level (1-7), convert: 1=15, 2=35, 3=45, 4=55, 5=65, 6=75, 7=90.
- "subject" is the name exactly as written on the report card.
- "matchedSubject" must be the closest match from this list: ${JSON.stringify(SUBJECT_LIST)}. If nothing matches, use "Other Subject".
- Include Life Orientation if present.
- Exclude non-academic entries (e.g. "Total", "Average", teacher names).
- If no report card is visible, return [].`;

export const POST: RequestHandler = async ({ request }) => {
  if (!ANTHROPIC_API_KEY) {
    throw error(500, 'ANTHROPIC_API_KEY not configured');
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw error(400, 'Invalid form data');
  }

  const file = formData.get('image');
  if (!file || !(file instanceof File)) {
    throw error(400, 'No image provided');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw error(400, 'Image too large — maximum 10MB');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw error(400, 'Unsupported file type — use JPEG, PNG, or WebP');
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let responseText: string;
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 }
            },
            {
              type: 'text',
              text: 'Extract all subject marks from this report card. Return only the JSON array.'
            }
          ]
        }
      ]
    });

    const block = message.content[0];
    if (block.type !== 'text') throw new Error('Unexpected response type');
    responseText = block.text;
  } catch (e) {
    console.error('Anthropic API error:', e);
    throw error(502, 'Could not read the report card — please try again');
  }

  // Strip markdown code fences if present
  const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  let parsed: Array<{ subject: string; mark: number; matchedSubject: string }>;
  try {
    parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) throw new Error('Not an array');
  } catch {
    console.error('Failed to parse Haiku response:', responseText);
    throw error(502, 'Could not parse report card — try a clearer photo');
  }

  // Validate and sanitise each entry
  const results = parsed
    .filter(item => typeof item === 'object' && item !== null)
    .map(item => ({
      subject: String(item.subject ?? ''),
      mark: Math.min(100, Math.max(0, Math.round(Number(item.mark) || 0))),
      matchedSubject: SUBJECT_LIST.includes(item.matchedSubject) ? item.matchedSubject : 'Other Subject'
    }))
    .filter(item => item.subject.length > 0 && item.mark > 0);

  return json({ subjects: results });
};
