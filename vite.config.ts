
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Prioritize VITE_API_KEY, then API_KEY. Check both the loaded env and the actual process.env
  // This ensures it works on Vercel where env vars are injected into process.env
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || '';

  console.log(`[Vite Build] API Key detected: ${apiKey ? 'YES (Length: ' + apiKey.length + ')' : 'NO'}`);

  return {
    plugins: [react()],
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    define: {
      // Inject the API Key securely as a string literal
      // This replaces 'process.env.API_KEY' in the code with "YOUR_KEY_HERE"
      'process.env.API_KEY': JSON.stringify(apiKey),
      
      // Polyfill process.env for robust handling, but ensure API_KEY is handled above by specific replacement
      'process.env': {}
    },
    server: {
      port: 3000,
      strictPort: true,
    }
  };
});
