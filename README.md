# Kanakku Flow - Smart Expense Manager

Kanakku Flow is a modern, privacy-focused expense manager built with Next.js, React, and ShadCN UI. It features multi-language support (English, Tamil, Malayalam), local storage persistence, and smart budgeting tools.

## Features

- **Multi-language Support**: Seamlessly switch between English, தமிழ், and മലയാളം.
- **Local Persistence**: Your data stays on your device using LocalStorage.
- **Budgeting**: Set monthly spending limits and track progress visually with a dashboard progress bar.
- **Category Studio**: Create and manage custom income and expense categories with emoticon support.
- **Data Export**: Export your transactions to CSV format for external analysis.
- **Filtering**: View transactions for specific dates using a built-in calendar filter.
- **Currency Support**: Switch between multiple currency symbols (₹, $, €, £, ¥).
- **Smart Categorization**: (Experimental) Genkit-powered suggestions for categories based on descriptions.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI/GenAI**: Genkit (Google Gemini)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Google Gemini API Key (for GenAI features)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root and add your API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Run the following in your terminal:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin <your-repo-url>
     git push -u origin main
     ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com) and click **"New Project"**.
   - Import your GitHub repository.
   - In the **Environment Variables** section, add:
     - `GOOGLE_GENAI_API_KEY`: Your Gemini API key.
   - Click **Deploy**.

## License

MIT
