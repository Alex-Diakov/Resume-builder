import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false,
      },
      plugins: [
        {
          name: 'hmr-suppressor',
          enforce: 'pre',
          transform(code, id) {
            if (id.includes('@vite/client') || id.includes('vite/dist/client')) {
              return code
                .replace(
                  'reject(new Error("WebSocket closed without opened."));',
                  'resolve();'
                )
                .replace(
                  'console.error(`[vite] failed to connect to websocket',
                  'console.debug(`[vite] HMR disabled in environment'
                );
            }
          },
          transformIndexHtml: {
            order: 'pre',
            handler() {
              return [
                {
                  tag: 'script',
                  attrs: { type: 'text/javascript' },
                  children: `
(function() {
  if (typeof window === 'undefined') return;
  // Capture-phase error & rejection suppressors for HMR / WebSocket in iframe container
  window.addEventListener('unhandledrejection', function(event) {
    var reason = event && event.reason;
    var msg = (reason && reason.message) || String(reason || '');
    var stack = (reason && reason.stack) || '';
    if (
      msg.indexOf('WebSocket') !== -1 ||
      msg.indexOf('vite') !== -1 ||
      stack.indexOf('@vite/client') !== -1 ||
      stack.indexOf('createWebSocketModuleRunnerTransport') !== -1
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', function(event) {
    var msg = (event && event.message) || '';
    var file = (event && event.filename) || '';
    if (msg.indexOf('WebSocket') !== -1 || file.indexOf('@vite/client') !== -1) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  // Mock WebSocket when connecting with 'vite-hmr' protocol
  var OrigWS = window.WebSocket;
  if (!OrigWS) return;
  var MockHmrWebSocket = function(url, protocols) {
    var isHmr = protocols === 'vite-hmr' ||
      (Array.isArray(protocols) && protocols.indexOf('vite-hmr') !== -1) ||
      (typeof url === 'string' && url.indexOf('token=') !== -1 && url.indexOf('vite') !== -1);
    if (isHmr) {
      var ws = new EventTarget();
      ws.CONNECTING = 0;
      ws.OPEN = 1;
      ws.CLOSING = 2;
      ws.CLOSED = 3;
      ws.readyState = 1; // WebSocket.OPEN
      ws.url = String(url);
      ws.protocol = 'vite-hmr';
      ws.extensions = '';
      ws.bufferedAmount = 0;
      ws.binaryType = 'blob';
      ws.send = function() {};
      ws.close = function() {
        ws.readyState = 3;
      };
      setTimeout(function() {
        ws.dispatchEvent(new Event('open'));
        if (typeof ws.onopen === 'function') ws.onopen(new Event('open'));
      }, 0);
      return ws;
    }
    return new OrigWS(url, protocols);
  };
  MockHmrWebSocket.CONNECTING = 0;
  MockHmrWebSocket.OPEN = 1;
  MockHmrWebSocket.CLOSING = 2;
  MockHmrWebSocket.CLOSED = 3;
  MockHmrWebSocket.prototype = OrigWS.prototype;
  window.WebSocket = MockHmrWebSocket;
})();
                  `,
                  injectTo: 'head-prepend'
                }
              ];
            }
          }
        },
        react(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
