import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Loader from './components/Loader';
import ArticleModal from './components/ArticleModal';
import { fetchAndRewriteNews, generateDeepDive } from './services/geminiService';
import { NewsArticle, NewsCategory } from './types';

const App: React.FC = () => {
  // Stores all news fetched (current and past)
  const [history, setHistory] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.WORLD);
  
  // Modal State
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [modalContent, setModalContent] = useState<string>("");
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  
  // Filter State (Timeframe)
  const [timeFilter, setTimeFilter] = useState<'latest' | 'past'>('latest');

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mundo_ai_news_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('mundo_ai_news_history', JSON.stringify(history.slice(0, 50))); // Limit storage
    }
  }, [history]);

  const getNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAndRewriteNews(category);
      
      const newArticles: NewsArticle[] = data.articles.map((a, i) => ({
        ...a,
        id: `${Date.now()}-${i}`,
        timestamp: Date.now(),
        fullAnalysis: undefined,
        generatedImage: undefined
      }));

      setHistory(prev => {
        // Avoid duplicates based on title
        const existingTitles = new Set(prev.map(p => p.title));
        const distinctNew = newArticles.filter(a => !existingTitles.has(a.title));
        return [...distinctNew, ...prev];
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Initial fetch
  useEffect(() => {
    getNews();
  }, [getNews]);

  // Auto-update every 1 hour (3600000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-updating news...");
      getNews();
    }, 3600000); 
    return () => clearInterval(interval);
  }, [getNews]);

  // Handle Deep Dive Analysis
  const handleAnalyze = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setLoadingModal(true);
    
    // Check if we already have it cached
    if (article.fullAnalysis) {
      setModalContent(article.fullAnalysis);
      setLoadingModal(false);
      return;
    }

    // Generate new content
    const analysis = await generateDeepDive(article.title, article.summary);
    setModalContent(analysis);
    
    // Update local history with the cached analysis
    setHistory(prev => prev.map(a => a.id === article.id ? { ...a, fullAnalysis: analysis } : a));
    
    setLoadingModal(false);
  };

  const handleImageGenerated = (id: string, imageData: string) => {
    setHistory(prev => prev.map(a => a.id === id ? { ...a, generatedImage: imageData } : a));
  };

  // Filter Logic
  const oneHourAgo = Date.now() - 3600000;
  
  const displayedArticles = history.filter(article => {
    const isLatest = article.timestamp > oneHourAgo;
    const matchesCategory = article.category === category;
    
    if (!matchesCategory) return false;
    return timeFilter === 'latest' ? isLatest : !isLatest;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-100 pb-4 space-y-4 md:space-y-0">
          
          <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {Object.values(NewsCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
             <span className="text-xs font-mono text-gray-400 uppercase">Filtrar por:</span>
             <button 
               onClick={() => setTimeFilter('latest')}
               className={`text-xs px-3 py-1 rounded-full border ${timeFilter === 'latest' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
             >
               Última Hora
             </button>
             <button 
               onClick={() => setTimeFilter('past')}
               className={`text-xs px-3 py-1 rounded-full border ${timeFilter === 'past' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
             >
               Anteriores
             </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading && timeFilter === 'latest' && displayedArticles.length === 0 ? (
          <Loader />
        ) : (
          <>
            {displayedArticles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 font-serif italic text-xl">
                  {timeFilter === 'latest' 
                    ? "No hay noticias en la última hora. Revisa las anteriores o espera a la actualización." 
                    : "No hay noticias archivadas todavía."}
                </p>
                {timeFilter === 'latest' && (
                   <button onClick={getNews} className="mt-4 text-xs font-bold underline">Forzar Actualización</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {displayedArticles.map((article) => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    onAnalyze={handleAnalyze}
                    onImageGenerated={handleImageGenerated}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <ArticleModal 
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || ""}
        content={modalContent}
        loading={loadingModal}
      />

      <footer className="border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Mundo.AI &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;