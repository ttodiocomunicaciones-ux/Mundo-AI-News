import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onAnalyze: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onAnalyze }) => {
  // Black and white minimal aesthetic for images
  const imageUrl = `https://picsum.photos/seed/${article.imageKeyword + article.title}/800/600?grayscale`;

  return (
    <article className="group flex flex-col h-full border-b border-gray-200 pb-8 hover:bg-gray-50 transition-colors p-4 rounded-lg">
      <div className="mb-4 overflow-hidden rounded-sm aspect-[3/2] bg-gray-100 relative">
        <img 
          src={imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          loading="lazy"
        />
        <span className="absolute bottom-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
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