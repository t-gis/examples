import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
// import mkcert from 'vite-plugin-mkcert';

export default ({ mode }) => {

  const isGHPages = (mode === "ghpages");

  return defineConfig({
    base: isGHPages ? "/examples/" : "./",
    server: {
      host: "localhost",
      https: false,
      port: 3001,
      proxy: {
        "/api": {
          // target: "http://192.168.3.95:9999",
          target: "http://192.168.3.169:6060",
          // target: "http://10.223.178.107",
          changeOrigin: true,
          rewrite: path => path
        }
      }
    },
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
