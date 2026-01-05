import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Loader from './components/Loader';
import { fetchAndRewriteNews } from './services/geminiService';
import { NewsArticle, NewsCategory } from './types';

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.WORLD);
  const [error, setError] = useState<string | null>(null);

  const getNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAndRewriteNews(category);
      setArticles(data.articles);
    } catch (err) {
      setError("No se pudieron cargar las noticias. Verifica la conexión o la API Key.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
            Noticias reescritas por Inteligencia Artificial
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Obtenemos los titulares globales y usamos Gemini para crear resúmenes imparciales y concisos.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {Object.values(NewsCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={getNews}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <NewsCard key={`${article.title}-${index}`} article={article} />
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Mundo AI News. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;