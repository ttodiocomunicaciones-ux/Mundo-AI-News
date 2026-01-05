import React from 'react';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  loading: boolean;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, title, content, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-8 md:p-12 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-3xl font-serif font-bold mb-6 leading-tight">{title}</h2>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-32 bg-gray-50 rounded w-full mt-8"></div>
            <p className="text-center text-sm text-gray-400 font-mono mt-4">Generando análisis profundo con Gemini 3.0...</p>
          </div>
        ) : (
          <div className="prose prose-lg prose-gray max-w-none font-serif text-gray-800 leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;