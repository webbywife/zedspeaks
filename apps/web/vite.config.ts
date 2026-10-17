import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered in main.tsx, with self-updating
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'ZedSpeaks – AAC Communication Board',
        short_name: 'ZedSpeaks',
        description: 'Free, offline-capable AAC communication board for non-verbal individuals',
        theme_color: '#db2777',
        background_color: '#f1f5f9',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,mp3,json,jpg,webp}'],
        // The Mulberry library (~3,000 SVGs) is fetched on demand; our own small zs-*.webp pictures
        // are on the cards, so they're downloaded up front and work offline
        globIgnores: ['symbols/*.svg', 'symbols/index.json'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/symbols/'),
            handler: 'CacheFirst',
            options: { cacheName: 'library-symbols', expiration: { maxEntries: 4000 } },
          },
          {
            urlPattern: /^https:\/\/static\.arasaac\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'arasaac-symbols',
              expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})
