import { NextResponse } from 'next/server';
import { getTelegramConfigServer } from '../../../data/telegramService';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const config = getTelegramConfigServer() as any;
    const apiKey = config.geminiApiKey;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured in settings.' }, { status: 400 });
    }

    const { action, text, image, weight, name, description } = await req.json();

    let proxyBaseUrl = config.geminiProxyUrl || 'https://generativelanguage.googleapis.com';
    if (proxyBaseUrl && !/^https?:\/\//i.test(proxyBaseUrl)) {
      proxyBaseUrl = 'https://' + proxyBaseUrl;
    }
    const baseUrl = proxyBaseUrl.endsWith('/') ? proxyBaseUrl.slice(0, -1) : proxyBaseUrl;
    const url = `${baseUrl}/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    if (action === 'translate') {
      const { name: transName, description } = text || {};
      if (!transName && !description) {
        return NextResponse.json({ error: 'Nothing to translate.' }, { status: 400 });
      }

      // We'll prompt Gemini to translate
      const prompt = `You are a professional restaurant translator. Translate the following dish details from Russian (or detect the language) into English (en) and Chinese (zh).
Translate the values accurately and professionally for a premium restaurant menu catalog.
Source Russian Name: "${transName || ''}"
Source Russian Description: "${description || ''}"

Return the translation exactly in the requested JSON structure. Do not output anything outside JSON.`;

      const responseSchema = {
        type: "OBJECT",
        properties: {
          name: {
            type: "OBJECT",
            properties: {
              en: { type: "STRING" },
              zh: { type: "STRING" }
            },
            required: ["en", "zh"]
          },
          description: {
            type: "OBJECT",
            properties: {
              en: { type: "STRING" },
              zh: { type: "STRING" }
            },
            required: ["en", "zh"]
          }
        },
        required: ["name", "description"]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Gemini API Error:', err);
        return NextResponse.json({ error: 'Gemini translation request failed.' }, { status: 500 });
      }

      const resJson = await response.json();
      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      
      try {
        const result = JSON.parse(rawText);
        return NextResponse.json(result);
      } catch (e) {
        console.error('Failed to parse Gemini output:', rawText);
        return NextResponse.json({ error: 'Invalid JSON response from Gemini model.' }, { status: 500 });
      }
    }

    if (action === 'estimate-kbju') {
      if (!image) {
        return NextResponse.json({ error: 'Image is required for KBJU estimation.' }, { status: 400 });
      }

      let mimeType = 'image/jpeg';
      let data = '';

      if (image.startsWith('data:')) {
        // Parse base64 string
        const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
        if (matches) {
          mimeType = matches[1];
          data = matches[2];
        } else {
          data = image;
        }
      } else {
        // It is a local file path (e.g. /images/interior-4.jpg) or web url
        if (image.startsWith('http://') || image.startsWith('https://')) {
          try {
            const imgRes = await fetch(image);
            if (imgRes.ok) {
              const buffer = await imgRes.arrayBuffer();
              data = Buffer.from(buffer).toString('base64');
              mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
            }
          } catch (fetchErr) {
            console.error('Failed to fetch image URL:', fetchErr);
          }
        } else {
          // Local file on disk
          const relativePath = image.startsWith('/') ? image.substring(1) : image;
          const filePath = path.join(process.cwd(), 'public', relativePath);
          if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            data = fileBuffer.toString('base64');
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.png') mimeType = 'image/png';
            else if (ext === '.webp') mimeType = 'image/webp';
            else mimeType = 'image/jpeg';
          }
        }
      }

      if (!data) {
        return NextResponse.json({ error: 'Could not load or decode the dish image.' }, { status: 400 });
      }

      const prompt = `Analyze this image of a restaurant dish.
Name of the dish (optional context): "${name || ''}"
Specified portion weight: "${weight || 'not specified'}"

Estimate its KBJU nutritional values per typical serving size, calibrated to the specified portion weight of "${weight || '300g'}":
1. Calories (calories) in kcal (integer value)
2. Proteins (proteins) in grams (can be decimal)
3. Fats (fats) in grams (can be decimal)
4. Carbohydrates (carbs) in grams (can be decimal)

Provide a realistic, scientific estimation based on portion weight, visual ingredients, and preparation style.
Return the result exactly matching the requested JSON structure. Do not output anything outside JSON.`;

      const responseSchema = {
        type: "OBJECT",
        properties: {
          calories: { type: "INTEGER" },
          proteins: { type: "NUMBER" },
          fats: { type: "NUMBER" },
          carbs: { type: "NUMBER" }
        },
        required: ["calories", "proteins", "fats", "carbs"]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: data
                  }
                },
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Gemini API Error:', err);
        return NextResponse.json({ error: 'Gemini visual estimation request failed.' }, { status: 500 });
      }

      const resJson = await response.json();
      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

      try {
        const result = JSON.parse(rawText);
        return NextResponse.json(result);
      } catch (e) {
        console.error('Failed to parse Gemini output:', rawText);
        return NextResponse.json({ error: 'Invalid JSON response from Gemini model.' }, { status: 500 });
      }
    }

    if (action === 'generate-image-by-photo') {
      if (!image) {
        return NextResponse.json({ error: 'Image is required for image generation.' }, { status: 400 });
      }

      // 1. Decode image (copy logic from kbju estimation)
      let mimeType = 'image/jpeg';
      let data = '';

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
        if (matches) {
          mimeType = matches[1];
          data = matches[2];
        } else {
          data = image;
        }
      } else {
        if (image.startsWith('http://') || image.startsWith('https://')) {
          try {
            const imgRes = await fetch(image);
            if (imgRes.ok) {
              const buffer = await imgRes.arrayBuffer();
              data = Buffer.from(buffer).toString('base64');
              mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
            }
          } catch (fetchErr) {
            console.error('Failed to fetch image URL:', fetchErr);
          }
        } else {
          const relativePath = image.startsWith('/') ? image.substring(1) : image;
          const filePath = path.join(process.cwd(), 'public', relativePath);
          if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            data = fileBuffer.toString('base64');
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.png') mimeType = 'image/png';
            else if (ext === '.webp') mimeType = 'image/webp';
            else if (ext === '.heic') mimeType = 'image/heic';
            else if (ext === '.heif') mimeType = 'image/heif';
            else mimeType = 'image/jpeg';
          }
        }
      }

      if (!data) {
        return NextResponse.json({ error: 'Could not load or decode the dish image.' }, { status: 400 });
      }

      // 2. Call Gemini to analyze the image, name, and description and generate the Imagen prompt
      const geminiPrompt = `You are a professional food stylist and photographer.
Analyze the following details of a restaurant dish:
- Name: "${name || 'Unnamed dish'}"
- Description: "${description || 'No description provided'}"

And study the uploaded raw kitchen photo of this dish.

Based on the name, description, and the raw visual elements (shape, ingredients, colors) of the uploaded photo, write a highly detailed, descriptive prompt for an image generator (like Imagen 4) to generate a premium, professional food photography version of this dish.

Design and style requirements (must be consistent with the restaurant's luxury dark aesthetic):
- Style: Premium dark luxury restaurant aesthetic.
- Lighting: Warm ambient, dramatic low-key lighting, soft highlights.
- Presentation: Fine dining plating, served on a beautiful high-end ceramic plate or bowl that complements the food.
- Camera: Professional close-up food photography, shallow depth of field, sharp focus on the details of the food, soft blurred background.
- Atmosphere: Dark, atmospheric, high-end, extremely appetizing, clean and elegant presentation (no kitchen clutter, no hands, no background mess).
- Realism: Must look like a real photograph from a Michelin-starred restaurant.

Write the prompt in English. Return ONLY the prompt text, without any introductory words, quotes, or code blocks.`;

      const geminiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: data
                  }
                },
                { text: geminiPrompt }
              ]
            }
          ]
        })
      });

      if (!geminiResponse.ok) {
        const err = await geminiResponse.text();
        console.error('Gemini API Error:', err);
        return NextResponse.json({ error: 'Gemini visual analysis failed.' }, { status: 500 });
      }

      const resJson = await geminiResponse.json();
      const generatedPrompt = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedPrompt) {
        return NextResponse.json({ error: 'Failed to generate prompt from Gemini.' }, { status: 500 });
      }

      console.log('Generated prompt for Imagen 4.0:', generatedPrompt.trim());

      // 3. Call Google Imagen 4.0 with the generated prompt
      const imagenModel = 'imagen-4.0-generate-001';
      const imagenUrl = `${baseUrl}/v1beta/models/${imagenModel}:predict?key=${apiKey}`;

      const googleResponse = await fetch(imagenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: generatedPrompt.trim()
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            outputMimeType: 'image/png'
          }
        })
      });

      if (!googleResponse.ok) {
        const err = await googleResponse.text();
        console.error('Google Imagen 4.0 Error:', err);
        return NextResponse.json({ error: 'Google Imagen image generation failed.' }, { status: 500 });
      }

      const googleJson = await googleResponse.json();
      const base64Image = googleJson.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Image) {
        return NextResponse.json({ error: 'No image returned from Google Imagen.' }, { status: 500 });
      }

      // 4. Save generated image as file under public/uploads
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `ai_gen_${Date.now()}.png`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, Buffer.from(base64Image, 'base64'));

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    return NextResponse.json({ error: 'Invalid AI action.' }, { status: 400 });
  } catch (e) {
    console.error('AI Route error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
