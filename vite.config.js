import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
      laravel(['resources/js/app.jsx']),
      react(),  // This ensures that Vite handles JSX files correctly
      
    ],
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    server: {
      host: 'localhost',
      port: 5173,  // Default Vite port
    },
});