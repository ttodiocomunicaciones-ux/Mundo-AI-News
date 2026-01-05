import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  // Use Picsum or Unsplash source for reliable images based on keywords
  // Real news images often break due to hotlinking protections.
  const imageUrl = `https://picsum.photos/seed/${article.imageKeyword + article.title}/600/400`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
          {article.category}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span className="font-medium text-blue-800">{article.source}</span>
          <span>{article.publishedTime}</span>
        </div>
        
        <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight mb-3">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {article.summary}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <span>Reescrito por IA</span>
          </div>
          {article.url && (
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center group"
            >
              Leer más
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;