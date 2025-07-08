import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../frontend/src"),
    },
  },
  server: {
    port: 5173,
    host: true, // Allow external connections
    cors: true,
    proxy: {
      // Proxy API requests to the local server during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // Increase limit to 1.5MB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Radix UI components - split into logical groups
          if (id.includes('@radix-ui')) {
            if (id.includes('dialog') || id.includes('popover') || id.includes('dropdown') || id.includes('context-menu')) {
              return 'radix-overlays';
            }
            if (id.includes('form') || id.includes('input') || id.includes('select') || id.includes('checkbox') || id.includes('radio')) {
              return 'radix-forms';
            }
            if (id.includes('navigation') || id.includes('tabs') || id.includes('accordion') || id.includes('collapsible')) {
              return 'radix-navigation';
            }
            return 'radix-ui';
          }
          
          // Form and validation libraries
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-libs';
          }
          
          // Payment libraries
          if (id.includes('stripe') || id.includes('paypal')) {
            return 'payment-libs';
          }
          
          // Animation and UI libraries
          if (id.includes('framer-motion') || id.includes('embla-carousel') || id.includes('lucide-react')) {
            return 'animation-ui';
          }
          
          // Charts and data visualization
          if (id.includes('recharts') || id.includes('date-fns')) {
            return 'charts-data';
          }
          
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // Socket.io
          if (id.includes('socket.io')) {
            return 'socket';
          }
          
          // Utility libraries
          if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge') || id.includes('cmdk')) {
            return 'utils';
          }
          
          // API related libraries (axios, etc.)
          if (id.includes('axios')) {
            return 'api-libs';
          }
          
          // Help articles - group them together
          if (id.includes('/help/articles/')) {
            return 'help-articles';
          }
          
          // Admin pages - group them together
          if (id.includes('/admin/')) {
            return 'admin-pages';
          }
          
          // Platform pages
          if (id.includes('/platform/')) {
            return 'platform-pages';
          }
          
          // Legal pages
          if (id.includes('/legal/')) {
            return 'legal-pages';
          }
          
          // Support pages
          if (id.includes('/support/')) {
            return 'support-pages';
          }
          
          // Creator pages
          if (id.includes('/creator/')) {
            return 'creator-pages';
          }
          
          // Large vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})

