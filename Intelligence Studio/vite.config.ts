import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  base: '/IntelligenceStudio/',
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
federation({
    name: 'shell',
    remotes: {},
    shared: ['react', 'react-dom'],
}),

  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app/scorefy'),
      '@qm': path.resolve(__dirname, './src/app/qualitymetrics'),
    },
  },


  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
