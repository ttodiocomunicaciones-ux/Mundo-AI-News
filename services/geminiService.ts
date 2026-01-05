import { GoogleGenAI, Type } from "@google/genai";
import { NewsCategory, FetchNewsResponse } from "../types";

// Initialize Gemini Client
// NOTE: Ideally, the key should be in a secure backend for production.
// For this SPA demo, we use the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchAndRewriteNews = async (category: NewsCategory): Promise<FetchNewsResponse> => {
  try {
    const model = 'gemini-3-flash-preview'; 

    // We use Gemini's Google Search grounding to find the news AND the generative capabilities
    // to rewrite it in one go. This avoids needing a separate NewsAPI subscription.
    const prompt = `
      Actúa como un periodista experto de "Mundo AI News".
      
      TAREA:
      1. Busca las noticias más importantes y recientes sobre: "${category}".
      2. Selecciona las 6 historias más impactantes de las últimas 24 horas.
      3. Para cada historia, escribe un resumen ORIGINAL y atractivo en español. 
         - El resumen debe ser único para evitar plagio.
         - Usa un tono profesional pero accesible.
         - Máximo 40 palabras por resumen.
      4. Proporciona una "keyword" (palabra clave) en inglés para buscar una imagen relacionada.
      
      Devuelve la respuesta estrictamente en formato JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Search Grounding
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
                  url: { type: Type.STRING, description: "Link to the source if found" }
                },
                required: ["title", "summary", "category", "source", "publishedTime", "imageKeyword"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as FetchNewsResponse;
      return data;
    }
    
    throw new Error("No data returned from Gemini");

  } catch (error) {
    console.error("Error fetching news with Gemini:", error);
    // Fallback data in case of API failure or quota limits
    return {
      articles: [
        {
          title: "Servicio de Noticias No Disponible",
          summary: "No pudimos conectar con la red neuronal de noticias en este momento. Por favor verifica tu API Key o intenta más tarde.",
          category: category,
          source: "Sistema",
          publishedTime: "Ahora",
          imageKeyword: "error"
        }
      ]
    };
  }
};