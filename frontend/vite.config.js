import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    cors: {
      origin: /^https?:\/\/(?:.+\.)?localhost(?::\d+)?$/
    },

    proxy: {
      // Static API routes (Kubernetes Ingress → sandbox server / ai server)
      "/api": {
        target: "http://127.0.0.1",
        changeOrigin: true,
        secure: false,
        headers: {
          Host: "localhost"
        }
      },

      // Dynamic agent proxy: /sandbox-agent/{sandboxId}/... → http://{sandboxId}.agent.localhost/...
      // This avoids all browser CORS issues by routing through the Vite dev server.
      "/sandbox-agent": {
        target: "http://127.0.0.1",       // Route directly to local ingress (127.0.0.1)
        changeOrigin: true,
        secure: false,
        ws: true,                         // enable WebSocket proxying for socket.io / xterm
        router: (req) => {
          // Parse sandboxId from originalUrl or url and attach to req for subsequent event listeners
          const originalUrl = req.originalUrl || req.url || '';
          const match = originalUrl.match(/^\/sandbox-agent\/([^/]+)/);
          if (match) {
            req.sandboxId = match[1];
          } else {
            const referer = req.headers.referer || '';
            const refMatch = referer.match(/\/sandbox\/([^/]+)/) || referer.match(/\/sandbox-agent\/([^/]+)/);
            if (refMatch) {
              req.sandboxId = refMatch[1];
            }
          }
          return 'http://127.0.0.1';
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const originalUrl = req.originalUrl || req.url || '';
            const match = originalUrl.match(/^\/sandbox-agent\/([^/]+)/) || (req.headers.referer || '').match(/\/sandbox\/([^/]+)/) || (req.headers.referer || '').match(/\/sandbox-agent\/([^/]+)/);
            const sandboxId = req.sandboxId || (match ? match[1] : null);
            if (sandboxId) {
              proxyReq.setHeader('Host', `${sandboxId}.agent.localhost`);
            }
          });
          proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
            const originalUrl = req.originalUrl || req.url || '';
            const match = originalUrl.match(/^\/sandbox-agent\/([^/]+)/) || (req.headers.referer || '').match(/\/sandbox\/([^/]+)/) || (req.headers.referer || '').match(/\/sandbox-agent\/([^/]+)/);
            const sandboxId = req.sandboxId || (match ? match[1] : null);
            if (sandboxId) {
              proxyReq.setHeader('Host', `${sandboxId}.agent.localhost`);
            }
          });
        },
        rewrite: (path) => path.replace(/^\/sandbox-agent\/[^/]+/, '')
      }
    }
  }
})