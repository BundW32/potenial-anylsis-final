
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // base: './' ensures relative paths for assets
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // Removed 'minify: terser' to use default 'esbuild' (fixes build error if terser is missing)
    },
    define: {
      // Polyfill process.env.API_KEY for the browser
      // It will look for VITE_API_KEY or API_KEY in your Vercel Environment Variables
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      // Prevent "process is not defined" errors
      'process.env': {}
    },
    server: {
      port: 3000,
      strictPort: true,
    }
  };
});
