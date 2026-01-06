import { GoogleGenAI, Type } from "@google/genai";
import { NewsCategory, FetchNewsResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

// Mapeo de categorías locales a categorías de NewsAPI
const categoryMap: Record<string, string> = {
  [NewsCategory.WORLD]: 'general',
  [NewsCategory.TECHNOLOGY]: 'technology',
  [NewsCategory.BUSINESS]: 'business',
  [NewsCategory.SCIENCE]: 'science',
  [NewsCategory.SPORTS]: 'sports',
  [NewsCategory.ENTERTAINMENT]: 'entertainment'
};

export const fetchAndRewriteNews = async (category: NewsCategory): Promise<FetchNewsResponse> => {
  const newsApiKey = process.env.NEWS_API_KEY;
  
  try {
    let rawNewsData = "";

    // 1. Intentar obtener noticias de NewsAPI
    if (newsApiKey) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${categoryMap[category]}&language=es&pageSize=6&apiKey=${newsApiKey}`
        );
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles.length > 0) {
          rawNewsData = data.articles.map((a: any) => 
            `TITULO: ${a.title} | FUENTE: ${a.source.name} | URL: ${a.url} | DESC: ${a.description}`
          ).join("\n---\n");
        }
      } catch (e) {
        console.warn("NewsAPI failed, falling back to Gemini Search", e);
      }
    }

    // 2. Usar Gemini para procesar la información (sea de NewsAPI o de su propia búsqueda)
    const prompt = rawNewsData 
      ? `A continuación tienes noticias reales de NewsAPI. Tu tarea es actuar como un editor minimalista.
         Para cada noticia, crea un resumen de máximo 25 palabras en español, muy directo. 
         Mantén la fuente y la URL original.
         Genera una 'imageKeyword' en inglés para una ilustración editorial.
         DATOS:
         ${rawNewsData}`
      : `Busca noticias actuales sobre "${category}" en español. 
         Selecciona las 4 más importantes. 
         Crea resúmenes minimalistas (máx 25 palabras). 
         Genera keywords para imágenes artísticas.
         Responde en JSON.`;

    const config: any = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          articles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                category: { type: Type.STRING },
                source: { type: Type.STRING },
                publishedTime: { type: Type.STRING },
                imageKeyword: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["title", "summary", "category", "source", "publishedTime", "imageKeyword"]
            }
          }
        }
      }
    };

    // Si no tenemos datos de NewsAPI, activamos el Google Search de Gemini
    if (!rawNewsData) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: config
    });

    if (response.text) {
      return JSON.parse(response.text) as FetchNewsResponse;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Fetch error:", error);
    return { articles: [] };
  }
};

export const generateDeepDive = async (title: string, contextSummary: string): Promise<string> => {
  try {
    const prompt = `
      Escribe un análisis profundo y profesional sobre: "${title}".
      Contexto: "${contextSummary}".
      Formato: Markdown. 3 párrafos. Lenguaje elegante y minimalista.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    return response.text || "Análisis no disponible.";
  } catch (error) {
    return "Error al conectar con la neurona de análisis.";
  }
};

export const generateNewsImage = async (title: string, summary: string): Promise<string | null> => {
  try {
    const prompt = `Minimalist editorial illustration for: "${title}". Style: Noir, artistic, clean lines, professional journalism. No text.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "3:2" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};