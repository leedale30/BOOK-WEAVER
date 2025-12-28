import { GoogleGenAI, Type } from "@google/genai";
import { Book, PageData, Section, ContentBlock, ContentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const sectionSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The main title or chapter heading of the page."
        },
        content: {
            type: Type.ARRAY,
            description: "An array of content blocks found on the page.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "Type of content block.",
                        enum: [
                            ContentType.HEADING1,
                            ContentType.HEADING2,
                            ContentType.HEADING3,
                            ContentType.PARAGRAPH,
                            ContentType.LIST_ITEM,
                            ContentType.IMAGE
                        ]
                    },
                    content: {
                        type: Type.STRING,
                        description: "The text content or image description."
                    }
                },
                required: ["type", "content"]
            }
        }
    },
    required: ["title", "content"]
};

const batchedResponseSchema = {
    type: Type.ARRAY,
    items: sectionSchema,
};

const BATCH_SIZE = 8; // Optimized for gemini-3-flash-preview multi-image tokens

export const structureBookContent = async (pages: PageData[]): Promise<Book> => {
    const allSections: Section[] = [];

    for (let i = 0; i < pages.length; i += BATCH_SIZE) {
        const batch = pages.slice(i, i + BATCH_SIZE);
        const parts: any[] = [
            {
                text: "Analyze these book pages. Extract all text and structure them as a JSON array of objects. Each object must have a 'title' and a 'content' array of blocks (types: heading1, heading2, heading3, paragraph, list_item, image). If you see an image, provide a brief description in 'content'. Preserve reading order.",
            }
        ];

        batch.forEach(pageData => {
            const base64Data = pageData.pageAsImageBase64.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data,
                },
            });
        });

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: { parts: parts },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: batchedResponseSchema,
                },
            });

            if (!response || !response.text) {
                throw new Error("AI synthesis failed to produce results.");
            }

            const parsedBatchSections: any[] = JSON.parse(response.text.trim());

            parsedBatchSections.forEach((parsedSection, index) => {
                const originalPageData = batch[index];
                if (!originalPageData) return;

                const finalContent: ContentBlock[] = [];
                const imageForPage = originalPageData.pageAsImageBase64;
                
                if (parsedSection.content && Array.isArray(parsedSection.content)) {
                    for (const block of parsedSection.content) {
                        if (block.type === ContentType.IMAGE) {
                            finalContent.push({
                                type: ContentType.IMAGE,
                                content: imageForPage,
                            });
                        } else {
                            finalContent.push(block);
                        }
                    }
                }
                
                allSections.push({ 
                    title: parsedSection.title || `Chapter ${originalPageData.pageNumber}`, 
                    content: finalContent 
                });
            });

        } catch (error) {
            console.error(`AI Batch Error:`, error);
            throw new Error(`The Weaver encountered a knot in pages ${i+1}-${i+batch.length}.`);
        }
    }

    return {
        title: allSections[0]?.title || "Synthesized Volume",
        sections: allSections
    };
};