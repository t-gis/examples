import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
// import mkcert from 'vite-plugin-mkcert';

export default ({ mode }) => {

  const isGHPages = (mode === "ghpages");

  return defineConfig({
    base: isGHPages ? "/examples/" : "./",
    build: {
      rollupOptions: {
        external: ["esm.js", "js", "jsx", "tsx", "ts", "gif", "json", "png", "jpg", "jpeg"]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "src"),
      }
    },
    plugins: [
      react(),
      // mkcert()
    ],
    // server: {
    //   https: true
    // }
  })
}
