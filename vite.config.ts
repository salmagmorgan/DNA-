/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` + hash routing means the built `dist/` folder works from any
// static host or sub-path (Vercel, Netlify, GitHub Pages, S3, a shared drive…).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
