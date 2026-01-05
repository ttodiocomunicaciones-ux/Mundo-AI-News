# Mundo AI News - Aplicación Web de Noticias Automatizada

Esta es una aplicación Single Page Application (SPA) moderna construida con React y TypeScript. Utiliza la API de **Google Gemini** para buscar noticias en tiempo real, procesarlas y reescribir los resúmenes para ofrecer contenido original y limpio.

## 🚀 Características

- **Motor de Búsqueda AI**: Usa Gemini (`gemini-3-flash-preview` con `googleSearch`) para encontrar noticias actuales sin necesidad de una NewsAPI de terceros.
- **Reescritura Inteligente**: La IA genera resúmenes nuevos para evitar contenido duplicado.
- **Diseño Moderno**: UI limpia con Tailwind CSS y Glassmorphism.
- **Categorías**: Filtrado por temas (Mundo, Tecnología, Deportes, etc.).

## 🔑 1. Obtener API Keys

Para que la aplicación funcione, necesitas una API Key de Google Gemini.

1. Ve a [Google AI Studio](https://aistudio.google.com/).
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en "Get API key" y luego en "Create API key in new project".
4. Copia la clave generada (empieza por `AIza...`).

## 🛠️ 2. Configuración Local

1. Clona este repositorio o descarga los archivos.
2. Crea un archivo `.env` en la raíz (si usas un bundler como Vite) o simplemente asegúrate de que tu entorno tenga la variable.
   
   *Nota: En este ejemplo de código, la API key se lee de `process.env.API_KEY`. En un entorno local con Vite, deberías usar `VITE_API_KEY` y actualizar el código en `geminiService.ts`.*

## 📦 3. Exportar a GitHub

1. Crea un nuevo repositorio en [GitHub](https://github.com/new).
2. En tu terminal, en la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/mundo-ai-news.git
   git push -u origin main
   ```

## ☁️ 4. Desplegar en Vercel

Vercel es ideal para desplegar esta app gratuitamente.

1. Ve a [Vercel.com](https://vercel.com) y regístrate con GitHub.
2. Haz clic en "Add New..." > "Project".
3. Importa el repositorio `mundo-ai-news` que acabas de crear.
4. En la configuración del despliegue, busca la sección **Environment Variables**.
5. Añade una nueva variable:
   - **Name**: `API_KEY` (o el nombre que uses en tu código).
   - **Value**: Pega tu clave de Google Gemini (AIza...).
6. Haz clic en **Deploy**.

## 🔄 5. Actualización Automática (Cron Job vs SSR)

El usuario solicitó una "Tarea Programada (Cron Job)". Dado que esta es una aplicación **Cliente (SPA)**, la lógica de actualización funciona de la siguiente manera:

### Client-Side Rendering (Método Actual)
- **Cómo funciona**: Cada vez que un usuario entra a la página, el navegador del usuario hace la petición a Gemini en tiempo real.
- **Ventaja**: Las noticias son siempre frescas en el momento exacto de la visita. No necesitas servidores complejos.
- **Costo**: Consume cuota de tu API Key cada vez que alguien visita la página.

### Server-Side Rendering (Método Avanzado con Next.js)
Si quisieras que la actualización fuera automática en el servidor (para no exponer tu API Key y cachear resultados):
1. Usarías Next.js (Server Components).
2. Crearías un endpoint `/api/cron` en Vercel.
3. Configurarías `vercel.json` para ejecutar ese cron cada hora.
4. Ese cron guardaría el JSON en una base de datos (Firebase/Postgres).
5. La web leería de la base de datos en lugar de llamar a Gemini directamente.

*Para este proyecto, hemos optado por el método Cliente (SPA) por simplicidad y facilidad de despliegue, cumpliendo el objetivo de mostrar noticias reescritas al instante.*
