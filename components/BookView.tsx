import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Book, ContentBlock, ContentType, Section } from '../types';
import { ResetIcon } from './Icons';

interface BookViewProps {
  book: Book;
  onReset: () => void;
  onThemeColorChange?: (color: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  [ContentType.HEADING1]: '#38bdf8', // Bright Cyan
  [ContentType.HEADING2]: '#0ea5e9', // Deep Cyan
  [ContentType.HEADING3]: '#818cf8', // Indigo
  [ContentType.PARAGRAPH]: '#6366f1', // Soft Violet
  [ContentType.LIST_ITEM]: '#6366f1', // Soft Violet
  [ContentType.IMAGE]: '#fbbf24',    // Amber/Gold
  'default': '#38bdf8'
};

const ContentView: React.FC<{ section: Section; onBlockVisible: (type: ContentType) => void }> = ({ section, onBlockVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const mostVisible = entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (mostVisible && mostVisible.intersectionRatio > 0.1) {
        const type = mostVisible.target.getAttribute('data-type') as ContentType;
        if (type) onBlockVisible(type);
      }
    }, { threshold: [0.1, 0.5, 0.8], rootMargin: '-10% 0px -10% 0px' });

    const elements = containerRef.current?.querySelectorAll('[data-type]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [section, onBlockVisible]);

  return (
    <div ref={containerRef} className="prose prose-invert prose-blue max-w-4xl mx-auto p-8 lg:p-16 animate-in fade-in duration-700">
      {section.content.map((block: ContentBlock, index: number) => {
        const blockProps = { "data-type": block.type, key: index };
        switch (block.type) {
          case ContentType.HEADING1:
            return <h1 {...blockProps} className="text-5xl font-black mb-12 tracking-tight text-white">{block.content}</h1>;
          case ContentType.HEADING2:
            return <h2 {...blockProps} className="text-3xl font-bold mt-16 mb-6 text-accent">{block.content}</h2>;
          case ContentType.HEADING3:
            return <h3 {...blockProps} className="text-xl font-semibold mt-10 mb-4 text-slate-200">{block.content}</h3>;
          case ContentType.PARAGRAPH:
            return <p {...blockProps} className="text-lg leading-relaxed text-slate-400 mb-6">{block.content}</p>;
          case ContentType.LIST_ITEM:
              return <li {...blockProps} className="text-lg text-slate-400 mb-2 list-disc ml-6">{block.content}</li>;
          case ContentType.IMAGE:
            return (
              <div {...blockProps} className="relative group my-12">
                 <div className="absolute -inset-1 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                 <img
                  src={block.content}
                  alt="Page Content"
                  className="relative rounded-2xl shadow-2xl border border-white/10 max-w-full h-auto mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const BookView: React.FC<BookViewProps> = ({ book, onReset, onThemeColorChange }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeSection = useMemo(() => {
    return book.sections[activeSectionIndex];
  }, [book.sections, activeSectionIndex]);

  const handleBlockVisible = (type: ContentType) => {
    if (onThemeColorChange) {
      onThemeColorChange(COLOR_MAP[type] || COLOR_MAP.default);
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-black/20 backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-sm font-black uppercase tracking-widest text-accent">Outline</h2>
           <button 
            onClick={onReset} 
            title="Reset Weave" 
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
           >
            <ResetIcon className="w-4 h-4"/>
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto p-4 space-y-1">
          {book.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSectionIndex(index)}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
                activeSectionIndex === index
                  ? 'bg-accent/20 text-accent font-bold shadow-lg shadow-accent/10 border border-accent/20'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className="block truncate opacity-80">{section.title}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-grow overflow-y-auto bg-black/10">
        {activeSection ? (
          <ContentView section={activeSection} onBlockVisible={handleBlockVisible} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600">
            Select a chapter to begin reading
          </div>
        )}
      </main>
    </div>
  );
};

export default BookView;