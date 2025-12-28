
export enum AppState {
  IDLE,
  PROCESSING,
  READY,
  ERROR,
}

export enum ContentType {
  HEADING1 = 'heading1',
  HEADING2 = 'heading2',
  HEADING3 = 'heading3',
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  LIST_ITEM = 'list_item'
}

export interface ContentBlock {
  type: ContentType;
  content: string;
}

export interface Section {
  title: string;
  content: ContentBlock[];
}

export interface Book {
  title: string;
  sections: Section[];
}

export interface PageData {
  pageNumber: number;
  pageAsImageBase64: string;
}
