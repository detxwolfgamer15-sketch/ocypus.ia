import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio = '1:1', style = 'cyberpunk' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não fornecido.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave GEMINI_API_KEY não configurada.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build-ocypus' }
      }
    });

    const enrichedPrompt = `High quality, ultra-detailed ${style} illustration: ${prompt}. Midnight black background with deep blood red (#dc2626) highlights, crisp cinematic lighting, 8k resolution, aggressive artistic finish.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: enrichedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: '1K'
          }
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return NextResponse.json({
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              prompt,
              aspectRatio,
              source: 'gemini-image'
            });
          }
        }
      }
    } catch (imageModelError: any) {
      console.warn('Tentativa com gemini-3.1-flash-image falhou, tentando fallback com flash-lite-image:', imageModelError?.message);
      
      try {
        const responseLite = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: enrichedPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        });

        if (responseLite.candidates && responseLite.candidates[0]?.content?.parts) {
          for (const part of responseLite.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              return NextResponse.json({
                imageUrl: `data:${mime};base64,${part.inlineData.data}`,
                prompt,
                aspectRatio,
                source: 'gemini-lite-image'
              });
            }
          }
        }
      } catch (liteError: any) {
        console.warn('Tentativa com gemini-3.1-flash-lite-image falhou:', liteError?.message);
      }
    }

    // Fallback: Generate dynamic high-tech generative SVG graphic with Blood Red & Midnight Black aesthetic
    const safePromptEscaped = prompt.replace(/[<>&"]/g, '');
    const svgGraphic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#08080a"/>
          <stop offset="60%" stop-color="#120507"/>
          <stop offset="100%" stop-color="#050507"/>
        </linearGradient>
        <linearGradient id="bloodRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="50%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#dc2626" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#dc2626" flood-opacity="0.5"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="800" fill="url(#bg)"/>
      <circle cx="400" cy="380" r="320" fill="url(#glow)"/>
      
      <!-- Tech Grid lines -->
      <g stroke="#261014" stroke-width="1" opacity="0.6">
        <line x1="100" y1="0" x2="100" y2="800"/>
        <line x1="250" y1="0" x2="250" y2="800"/>
        <line x1="400" y1="0" x2="400" y2="800"/>
        <line x1="550" y1="0" x2="550" y2="800"/>
        <line x1="700" y1="0" x2="700" y2="800"/>
        <line x1="0" y1="100" x2="800" y2="100"/>
        <line x1="0" y1="250" x2="800" y2="250"/>
        <line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="0" y1="550" x2="800" y2="550"/>
        <line x1="0" y1="700" x2="800" y2="700"/>
      </g>
      
      <!-- Geometric Wolf Insignia / Emblem -->
      <g filter="url(#shadow)" transform="translate(400, 360)">
        <!-- Outer hexagon shield -->
        <polygon points="0,-180 155,-90 155,90 0,180 -155,90 -155,-90" fill="none" stroke="url(#bloodRed)" stroke-width="3"/>
        <polygon points="0,-160 138,-80 138,80 0,160 -138,80 -138,-80" fill="#0d0406" stroke="#b91c1c" stroke-width="1" opacity="0.8"/>
        
        <!-- Wolf head facets -->
        <!-- Ears -->
        <polygon points="-80,-140 -30,-60 -100,-50" fill="#ef4444"/>
        <polygon points="80,-140 30,-60 100,-50" fill="#dc2626"/>
        <polygon points="-40,-120 -20,-60 -70,-50" fill="#7f1d1d"/>
        <polygon points="40,-120 20,-60 70,-50" fill="#991b1b"/>
        
        <!-- Forehead and crown -->
        <polygon points="0,-120 -30,-50 30,-50" fill="#dc2626"/>
        <polygon points="-30,-50 0,20 30,-50" fill="#b91c1c"/>
        <polygon points="-30,-50 -80,-10 -50,30" fill="#991b1b"/>
        <polygon points="30,-50 80,-10 50,30" fill="#7f1d1d"/>
        
        <!-- Glowing Eyes -->
        <polygon points="-45,-20 -20,-15 -35,-5" fill="#ffffff" filter="url(#shadow)"/>
        <polygon points="45,-20 20,-15 35,-5" fill="#ffffff" filter="url(#shadow)"/>
        <polygon points="-42,-18 -22,-14 -34,-7" fill="#ff1f3d"/>
        <polygon points="42,-18 22,-14 34,-7" fill="#ff1f3d"/>
        
        <!-- Muzzle and Snout -->
        <polygon points="0,20 -30,20 0,110" fill="#b91c1c"/>
        <polygon points="0,20 30,20 0,110" fill="#ef4444"/>
        <polygon points="0,90 -15,110 15,110" fill="#0a0a0c"/>
        
        <!-- Jaw & Mane spikes -->
        <polygon points="-50,30 -90,60 -40,80" fill="#7f1d1d"/>
        <polygon points="50,30 90,60 40,80" fill="#991b1b"/>
        <polygon points="-40,80 -70,120 -15,110" fill="#581014"/>
        <polygon points="40,80 70,120 15,110" fill="#7f1d1d"/>
      </g>
      
      <!-- Brand & Prompt Overlay -->
      <text x="400" y="630" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ef4444" text-anchor="middle" letter-spacing="8">OCYPUS AI ART</text>
      <text x="400" y="665" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#9ca3af" text-anchor="middle" letter-spacing="3">${style.toUpperCase()} RENDERING</text>
      <text x="400" y="705" font-family="system-ui, sans-serif" font-size="13" fill="#ef4444" opacity="0.8" text-anchor="middle">"${safePromptEscaped.slice(0, 65)}${safePromptEscaped.length > 65 ? '...' : ''}"</text>
      
      <!-- Corner Accents -->
      <path d="M 40,70 L 40,40 L 70,40" stroke="#dc2626" stroke-width="3" fill="none"/>
      <path d="M 760,70 L 760,40 L 730,40" stroke="#dc2626" stroke-width="3" fill="none"/>
      <path d="M 40,730 L 40,760 L 70,760" stroke="#dc2626" stroke-width="3" fill="none"/>
      <path d="M 760,730 L 760,760 L 730,760" stroke="#dc2626" stroke-width="3" fill="none"/>
    </svg>`;

    const base64Svg = Buffer.from(svgGraphic).toString('base64');
    return NextResponse.json({
      imageUrl: `data:image/svg+xml;base64,${base64Svg}`,
      prompt,
      aspectRatio,
      source: 'ocypus-generative-engine'
    });

  } catch (err: any) {
    console.error('Erro na rota de imagem:', err);
    return NextResponse.json({ error: err?.message || 'Falha ao gerar imagem' }, { status: 500 });
  }
}
