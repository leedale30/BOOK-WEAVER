import React, { useState, useCallback } from 'react';
import { AppState, Book, PageData } from './types';
import { processPdf } from './services/pdfProcessor';
import { structureBookContent } from './services/geminiService';
import PdfUploader from './components/PdfUploader';
import ProcessingView from './components/ProcessingView';
import BookView from './components/BookView';
import Background3D from './components/Background3D';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [activeThemeColor, setActiveThemeColor] = useState<string>('#38bdf8'); // Default accent
  
  const resetApp = () => {
    setAppState(AppState.IDLE);
    setBook(null);
    setError(null);
    setProcessingMessage('');
    setActiveThemeColor('#38bdf8');
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    setBook(null);
    setActiveThemeColor('#ffffff'); // Processing state is white/bright

    try {
      setProcessingMessage('Analyzing document layers...');
      const pagesData: PageData[] = await processPdf(file);
      
      if (pagesData.length === 0) {
        throw new Error("Could not extract content.");
      }

      setProcessingMessage(`Weaving ${pagesData.length} pages into digital structure...`);
      const structuredBook = await structureBookContent(pagesData);
      
      setBook(structuredBook);
      setAppState(AppState.READY);
      setActiveThemeColor('#38bdf8');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Extraction failed. ${errorMessage}`);
      setAppState(AppState.ERROR);
      setActiveThemeColor('#ef4444'); // Error state is red
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <ProcessingView message={processingMessage} />;
      case AppState.READY:
        return book ? (
          <BookView 
            book={book} 
            onReset={resetApp} 
            onThemeColorChange={setActiveThemeColor} 
          />
        ) : <div />;
      case AppState.ERROR:
        return (
          <div className="text-center p-8 glass-panel rounded-2xl max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Weave Interrupted</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={resetApp}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all font-medium"
            >
              Restart Weaver
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return <PdfUploader onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col items-center">
      <Background3D appState={appState} themeColor={activeThemeColor} />
      
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col h-screen px-4 py-6 md:px-8">
        <header className="w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <LogoIcon className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase italic leading-none">
                Book <span className="text-accent">Weaver</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] tracking-widest text-slate-500 font-bold uppercase">v2.0 Immersive AI</p>
                <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                <p className="text-[10px] tracking-widest text-accent font-black uppercase">SCHOOLCLASS.NET</p>
              </div>
            </div>
          </div>
          {appState === AppState.READY && (
             <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold animate-pulse">
               LIVE_HOLOGRAPH
             </div>
          )}
        </header>

        <main className="flex-grow flex items-center justify-center w-full overflow-hidden">
          {renderContent()}
        </main>

        <footer className="mt-6 py-4 text-center flex flex-col items-center gap-1">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Powered by Gemini 3 Flash & Three.js Technology
          </p>
          <a 
            href="https://schoolclass.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-accent font-black tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            SCHOOLCLASS.NET
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;