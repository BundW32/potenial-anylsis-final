
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  // Vercel and Vite standard: Look for VITE_API_KEY.
  const apiKey = env.VITE_API_KEY || process.env.VITE_API_KEY || '';

  // Log for build debugging (only logs the presence, not the key itself for security)
  console.log(`[Vite Build] VITE_API_KEY present: ${apiKey ? 'YES' : 'NO'}`);

  return {
    plugins: [react()],
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    define: {
      // This "bakes" the key into the code at build time.
      // In the app, we can now access it via `process.env.API_KEY`
      'process.env.API_KEY': JSON.stringify(apiKey),
      
      // Polyfill process.env to avoid runtime crashes
      'process.env': {}
    },
    server: {
      port: 3000,
      strictPort: true,
    }
  };
});
