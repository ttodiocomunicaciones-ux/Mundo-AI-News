# Mundo AI News (Hybrid Edition)

Esta versión combina la fiabilidad de **NewsAPI** con la inteligencia de **Google Gemini**.

## 🔑 Configuración en Vercel

Debes añadir dos variables de entorno en tu panel de Vercel:

1.  **`API_KEY`**: Tu clave de Google Gemini (AI Studio).
2.  **`NEWS_API_KEY`**: Tu clave de [newsapi.org](https://newsapi.org/).

## 🛠️ Cómo funciona
1.  **Captura**: El sistema solicita los últimos titulares a NewsAPI.
2.  **Refinado**: Gemini recibe esos titulares y los reescribe para que sean minimalistas y consistentes.
3.  **Visuales**: Gemini Flash Image genera una ilustración única para la noticia.
4.  **Profundidad**: Si el usuario lo pide, Gemini genera un artículo extenso bajo demanda.

## 🕒 Actualizaciones
La página se refresca automáticamente cada 60 minutos mientras esté abierta. Las noticias antiguas se guardan en el historial local del navegador.
