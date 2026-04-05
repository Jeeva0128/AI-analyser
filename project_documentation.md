# AI Resume Analyzer — Project Documentation

## 1. Project Overview

The **AI Resume Analyzer** is a modern frontend application designed to evaluate user resumes and provide actionable feedback, including ATS (Applicant Tracking System) scores, skill breakdown, and formatting suggestions. 

The application provides a sleek, highly interactive, and responsive user interface with dynamic animations and premium glassmorphic design elements.

## 2. Technology Stack

This application is built entirely as a **Frontend Single-Page Application (SPA)** using the following technologies:

*   **React (v18)**: The core UI library.
*   **Vite**: The build tool and development server, chosen for its lightning-fast Hot Module Replacement (HMR).
*   **TypeScript**: Adds static typing to JavaScript for better developer experience and fewer runtime errors.
*   **Tailwind CSS (v4)**: Utility-first CSS framework used for all styling.
*   **Framer Motion**: Used extensively for complex, smooth page transitions, element animations, and the dynamic liquid UI effects.
*   **React Dropzone**: Handles the drag-and-drop file upload functionality.
*   **Zustand**: A small, fast, and scalable state-management library used to share state (like the uploaded file and analysis results) across different sections of the app (`src/store/useStore.ts`).
*   **Lucide React**: Provides the scalable SVG icons used throughout the interface.

## 3. How the Application Works

The application operates in a unified, single-page flow divided into functional sections:

1.  **Landing & Hero Section**: Greets the user with an animated UI and introduces the features.
2.  **Upload Section (`src/sections/UploadSection.tsx`)**: 
    *   Provides a dropzone for users to upload their resumes (PDF, DOCX).
    *   Manages the file selection state.
    *   Displays a simulated progress bar for the upload process.
    *   Once "uploaded," it triggers the analysis phase.
3.  **Dashboard & Insights**: 
    *   After analysis is complete, the `App.tsx` component reveals the `DashboardSection`, `SuggestionsSection`, and `InsightsSection`.
    *   These components consume data from the global Zustand store to display colorful charts, scores, missing keywords, and specific resume improvement suggestions.

## 4. Which AI is Used? (The "Secret")

> [!NOTE]
> **Currently, there is NO real AI integrated into the project.**

This project is currently a **Frontend UI Prototype/Mockup**. It is designed to *look and feel* exactly like a real AI application to secure the UI/UX experience before wiring up a backend.

**How the "Analysis" works right now:**
When a user uploads a file, the `UploadSection.tsx` component calls a function named `simulateUploadAndAnalysis()`. 

1.  It forces an artificial delay (`await new Promise((r) => setTimeout(r, 2800));`) to simulate network latency and AI processing time.
2.  It then calls `generateMockAnalysis()` from `src/lib/mockAnalysis.ts`.
3.  This mock function immediately returns **hardcoded, static data** (with realistic-looking scores like 78/100, specific technical suggestions, and pre-defined keywords) regardless of what file was actually uploaded.

### How to add Real AI in the Future:
To make this functional, you would need to:
1.  Extract the text from the uploaded PDF/DOCX file (either in the browser using a library like `pdf.js` or by sending the file to a backend server).
2.  Send the extracted text via an API call to a real Large Language Model (LLM) such as **OpenAI's GPT-4**, **Anthropic's Claude**, or **Google's Gemini**.
3.  Prompt the LLM to return JSON data formatted exactly like the `AnalysisResult` type required by your Zustand store.
4.  Replace the `generateMockAnalysis()` function with the actual API response data.
