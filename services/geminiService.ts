import { GoogleGenAI, Type } from "@google/genai";
import { NewsCategory, FetchNewsResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

export const fetchAndRewriteNews = async (category: NewsCategory): Promise<FetchNewsResponse> => {
  try {
    const prompt = `
      Actúa como editor jefe de un diario minimalista.
      1. Busca noticias actuales (última hora) sobre: "${category}".
      2. Selecciona 4 historias distintas.
      3. Escribe un resumen breve (máx 30 palabras) informativo y directo.
      4. Define una keyword en inglés para la imagen.
      
      Output JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
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
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FetchNewsResponse;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("News fetch error:", error);
    return { articles: [] };
  }
};

export const generateDeepDive = async (title: string, contextSummary: string): Promise<string> => {
  try {
    const prompt = `
      Escribe un artículo periodístico detallado y profundo (aprox. 300 palabras) sobre esta noticia: "${title}".
      Contexto inicial: "${contextSummary}".
      
      Estilo:
      - Periodismo de datos serio y objetivo.
      - Estructurado en 3 párrafos.
      - Usa formato Markdown para subtítulos o negritas si es necesario.
      - NO inventes datos, usa tu conocimiento general y razonamiento.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // We allow the model to think/reason for better quality writing
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    return "Error al generar el análisis profundo. Intente nuevamente.";
  }
};