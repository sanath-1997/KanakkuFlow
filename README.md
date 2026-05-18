# Kanakku Flow - Smart Expense Manager

Kanakku Flow is a modern, privacy-focused expense manager built with Next.js, React, and ShadCN UI. It features multi-language support (English, Tamil, Malayalam), local storage persistence, and smart budgeting tools.

## Features

- **PWA Ready**: Install as a standalone app on your mobile or desktop device.
- **Multi-language Support**: Seamlessly switch between English, தமிழ், and മലയാളം.
- **Local Persistence**: Your data stays on your device using LocalStorage.
- **Budgeting**: Set monthly and daily spending limits.
- **Category Studio**: Create and manage custom income and expense categories.
- **Data Export**: Export your transactions to CSV format.

## Customization

### Changing the App Icon
To use your own icons for the installed app:
1. Create a `public` directory at the root of the project if it doesn't exist.
2. Place your icon files (e.g., `icon-192.png` and `icon-512.png`) inside the `public/` folder.
3. Update the `src/app/manifest.ts` file to point to your new file paths (e.g., `src: '/icon-192.png'`).

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
