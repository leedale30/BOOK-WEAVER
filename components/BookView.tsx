import React, { useState, useMemo } from 'react';
import { Book, ContentBlock, ContentType, Section } from '../types';
import { ResetIcon } from './Icons';

interface BookViewProps {
  book: Book;
  onReset: () => void;
}

const ContentView: React.FC<{ section: Section }> = ({ section }) => (
  <div className="prose prose-invert prose-blue max-w-4xl mx-auto p-8 lg:p-16 animate-in fade-in duration-700">
    {section.content.map((block: ContentBlock, index: number) => {
      switch (block.type) {
        case ContentType.HEADING1:
          return <h1 key={index} className="text-5xl font-black mb-12 tracking-tight text-white">{block.content}</h1>;
        case ContentType.HEADING2:
          return <h2 key={index} className="text-3xl font-bold mt-16 mb-6 text-accent">{block.content}</h2>;
        case ContentType.HEADING3:
          return <h3 key={index} className="text-xl font-semibold mt-10 mb-4 text-slate-200">{block.content}</h3>;
        case ContentType.PARAGRAPH:
          return <p key={index} className="text-lg leading-relaxed text-slate-400 mb-6">{block.content}</p>;
        case ContentType.LIST_ITEM:
            return <li key={index} className="text-lg text-slate-400 mb-2 list-disc ml-6">{block.content}</li>;
        case ContentType.IMAGE:
          return (
            <div key={index} className="relative group my-12">
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

const BookView: React.FC<BookViewProps> = ({ book, onReset }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeSection = useMemo(() => {
    return book.sections[activeSectionIndex];
  }, [book.sections, activeSectionIndex]);

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
          <ContentView section={activeSection} />
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