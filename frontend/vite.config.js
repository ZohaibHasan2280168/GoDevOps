import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => ({
  // Environment-specific optimizations
  define: {
    __DEV__: mode === 'development',
  },
  plugins: [
    react({
      // Optimize React refresh
      fastRefresh: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    // Optimize build for performance
    minify: 'esbuild',
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          // UI library chunks
          'ui-icons': ['lucide-react'],
          'ui-components': ['@radix-ui/react-slot'],
          // Page chunks - split by functionality
          'pages-auth': ['./src/pages/Login.jsx', './src/pages/Register.jsx'],
          'pages-main': ['./src/pages/Dashboard.jsx', './src/pages/Profile.jsx'],
          'pages-labs': ['./src/pages/Labs.jsx', './src/pages/LabDetail.jsx'],
          'pages-rooms': ['./src/pages/Rooms.jsx', './src/pages/RoomDetail.jsx'],
          'pages-other': ['./src/pages/Leaderboard.jsx', './src/pages/Premium.jsx', './src/pages/Settings.jsx'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Performance optimizations
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 2048,
    // Enable tree shaking
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false
    },
  },
  server: {
    // Optimize dev server
    hmr: {
      overlay: false,
    },
    host: true,
    port: 5173,
    // Enable HTTP/2
    https: false,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'lucide-react'
    ],
    // Force pre-bundling
    force: false,
  },
  // Performance hints
  esbuild: {
    // Remove debugger statements
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      // Optimize CSS processing
    }
  }
}))