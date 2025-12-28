
import { PageData } from '../types';

// pdfjs-dist is loaded from a CDN in index.html, so we need to declare the global
declare const pdfjsLib: any;

export const processPdf = async (file: File): Promise<PageData[]> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read file.'));
      }

      try {
        const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const numPages = pdf.numPages;
        const pagesData: PageData[] = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if(!context) {
            console.warn(`Could not get canvas context for page ${i}`);
            continue;
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const pageAsImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          pagesData.push({
            pageNumber: i,
            pageAsImageBase64,
          });
        }
        resolve(pagesData);
      } catch (error) {
        console.error('Error processing PDF with pdf.js:', error);
        reject(new Error('Could not parse the PDF file. It might be corrupted or in an unsupported format.'));
      }
    };

    fileReader.onerror = () => {
      reject(new Error('Error reading the file.'));
    };

    fileReader.readAsArrayBuffer(file);
  });
};
