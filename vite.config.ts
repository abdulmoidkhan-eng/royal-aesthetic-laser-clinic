import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      modulePreload: {
        polyfill: false,
        resolveDependencies: (filename, deps) => {
          return deps.filter(dep => 
            !dep.includes('firebase-auth') && 
            !dep.includes('firebase-firestore') && 
            !dep.includes('firebase-core') && 
            !dep.includes('AdminPage')
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase/auth') || id.includes('@firebase/auth')) {
              return 'vendor-firebase-auth';
            }
            if (id.includes('node_modules/firebase/firestore') || id.includes('@firebase/firestore')) {
              return 'vendor-firebase-firestore';
            }
            if (id.includes('node_modules/firebase') || id.includes('@firebase')) {
              return 'vendor-firebase-core';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
