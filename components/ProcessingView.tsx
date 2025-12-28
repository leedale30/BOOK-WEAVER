
import React from 'react';
import { SpinnerIcon } from './Icons';

interface ProcessingViewProps {
  message: string;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <SpinnerIcon className="h-12 w-12 text-slate-800 mb-6" />
      <h2 className="text-2xl font-semibold mb-2">Weaving your book...</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
};

export default ProcessingView;
