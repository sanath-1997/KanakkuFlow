import { MetadataRoute } from 'next'
import { PlaceHolderImages } from '@/lib/placeholder-images'
 
export default function manifest(): MetadataRoute.Manifest {
  const iconLarge = PlaceHolderImages.find(img => img.id === 'pwa-icon-large');
  const iconSmall = PlaceHolderImages.find(img => img.id === 'pwa-icon-small');

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
        src: iconSmall?.imageUrl || '/public/Expenses.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: iconLarge?.imageUrl || '/public/Expenses.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
