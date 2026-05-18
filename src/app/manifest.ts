
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kanakku Flow - Smart Expense Manager',
    short_name: 'Kanakku',
    description: 'Manage your finances with clarity and ease.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2855BF',
    icons: [
      {
        src: 'https://picsum.photos/seed/wallet-app/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/wallet-app/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
