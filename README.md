# 📖 PDF Book Weaver 2.0 (Immersive AI)

**PDF Book Weaver** is a high-performance web application that transforms static PDF manuscripts into dynamic, interactive, and beautifully structured digital reading experiences. Leveraging the latest **Gemini 3 Flash** AI and **Three.js**, it reconstructs document hierarchy while providing a stunning 3D visual backdrop.

![Project Status](https://img.shields.io/badge/Status-Beta-blueviolet)
![Engine](https://img.shields.io/badge/AI-Gemini_3_Flash-blue)
![Frontend](https://img.shields.io/badge/Frontend-React_19-teal)
![Graphics](https://img.shields.io/badge/Graphics-Three.js-black)

## ✨ Features

- **🧠 Advanced AI Synthesis**: Uses `gemini-3-flash-preview` for sophisticated document layout analysis.
- **🌀 Immersive 3D Environment**: A custom Three.js particle system that reacts to application states (Idle, Processing, Ready).
- **🪟 Glassmorphism UI**: High-end frosted glass aesthetic with deep dark themes and glowing accents.
- **⚡ Batched Processing**: Efficiently handles large PDFs by processing pages in intelligent batches.
- **📱 Responsive Design**: Fully optimized for mobile and desktop reading.
- **🔒 Privacy First**: PDF rendering happens locally in your browser via `pdf.js`.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Graphics**: [Three.js](https://threejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini 3 Flash](https://ai.google.dev/)
- **PDF Engine**: [PDF.js](https://mozilla.github.io/pdf.js/)

## 🚀 Getting Started

### Prerequisites

- An API Key from [Google AI Studio](https://aistudio.google.com/).
- A modern browser with WebGL support.

### Environment Variables

Ensure you have your Gemini API key available in your environment:
```env
API_KEY=your_gemini_api_key_here
```

## 📂 Architecture

```text
├── components/
│   ├── Background3D.tsx    # Three.js particle engine
│   ├── BookView.tsx        # Structured reader component
│   ├── PdfUploader.tsx     # Drag-and-drop interface
│   └── Icons.tsx           # SVG component library
├── services/
│   ├── geminiService.ts    # AI logic & Prompt engineering
│   └── pdfProcessor.ts     # PDF.js extraction logic
├── types.ts                # TypeScript interfaces
└── App.tsx                 # Core application controller
```

## 🎨 Design Philosophy

The 2.0 version follows a "Cyber-Elegant" design language. The goal was to make the process of "weaving" a book feel as advanced as the AI technology powering it. The 3D background isn't just decoration—it provides vital visual feedback during intensive AI processing tasks.

---
*Created with ❤️ by Senior Frontend Engineering Team.*