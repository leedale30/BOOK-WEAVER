import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        className={`w-full max-w-2xl p-16 glass-panel rounded-3xl border-2 border-dashed transition-all duration-300 group ${
          isDragging 
            ? 'border-accent bg-accent/10 scale-[1.02]' 
            : 'border-white/10 hover:border-accent/40 hover:bg-white/5'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`p-6 rounded-full transition-all duration-500 mb-6 ${
            isDragging ? 'bg-accent text-white scale-110' : 'bg-white/5 text-accent group-hover:bg-accent/20'
          }`}>
            <UploadIcon className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">Initiate Weave</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Drop your PDF manuscript here to transform it into a structured digital experience.
          </p>
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-10 py-4 bg-accent hover:bg-accent/80 text-primary font-bold rounded-2xl transition-all shadow-lg shadow-accent/20 active:scale-95"
          >
            Select Document
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="flex gap-8 mt-12 opacity-50">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-tighter text-accent">AI Analysis</p>
            <p className="text-[10px]">Gemini 3 Flash</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-tighter text-accent">Renderer</p>
            <p className="text-[10px]">Three.js v160</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-tighter text-accent">Security</p>
            <p className="text-[10px]">Local Privacy</p>
          </div>
      </div>
    </div>
  );
};

export default PdfUploader;