import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

//@ts-ignore
const mode = import.meta.env.MODE;
const isGitHubPages = (mode === "githubpages");

// https://vitejs.dev/config/
export default defineConfig({
  base: isGitHubPages ? "/" : "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
    }
  },
  plugins: [react()]
})
