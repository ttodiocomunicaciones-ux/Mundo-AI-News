import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { generateNewsImage } from '../services/geminiService';

interface NewsCardProps {
  article: NewsArticle;
  onAnalyze: (article: NewsArticle) => void;
  onImageGenerated: (id: string, imageData: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onAnalyze, onImageGenerated }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    const imageData = await generateNewsImage(article.title, article.summary);
    if (imageData) {
      onImageGenerated(article.id, imageData);
    }
    setIsGeneratingImage(false);
  };

  const currentImageUrl = article.generatedImage || `https://picsum.photos/seed/${article.imageKeyword + article.title}/800/600?grayscale`;

  return (
    <article className="group flex flex-col h-full border-b border-gray-200 pb-8 hover:bg-gray-50 transition-colors p-4 rounded-lg">
      <div className="mb-4 overflow-hidden rounded-sm aspect-[3/2] bg-gray-100 relative group/img">
        {isGeneratingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Generando...</span>
          </div>
        ) : !article.generatedImage && (
          <button 
            onClick={handleGenerateImage}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
          >
            <div className="bg-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Generar Imagen IA</span>
            </div>
          </button>
        )}
        
        <img 
          src={currentImageUrl} 
          alt={article.title} 
          className={`w-full h-full object-cover transition-all duration-700 ${article.generatedImage ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
          loading="lazy"
        />
        <span className="absolute bottom-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
          {article.category}
        </span>
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3 uppercase tracking-wide">
          <span>{article.source}</span>
          <span>•</span>
          <span>{article.publishedTime}</span>
        </div>
        
        <h3 className="text-xl font-serif font-medium text-gray-900 leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
          {article.summary}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <button 
            onClick={() => onAnalyze(article)}
            className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-all"
          >
            Leer Análisis Profundo
          </button>
          
          {article.url && (
            <a 
              href={article.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;