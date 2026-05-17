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

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts

## Push to GitHub

To upload this application to your GitHub account, open your terminal in the root directory and follow these steps:

1. **Create a Repository**:
   - Go to [GitHub](https://github.com/new) and create a new repository (e.g., `kanakku-flow`).
   - Do NOT initialize it with a README or .gitignore.

2. **Initialize and Push**:
   - Execute the following commands:
     ```bash
     git init
     git add .
     git commit -m "feat: initial stable version of Kanakku Flow"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
     git push -u origin main
     ```

## Deployment to Vercel

1. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com) and click **"New Project"**.
   - Import your GitHub repository.
   - Click **Deploy**.

## License

MIT
