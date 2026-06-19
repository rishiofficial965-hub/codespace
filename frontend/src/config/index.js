// Global Application Configurations
export const API_BASE_URL = '';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Agent API calls go through the Vite dev-server proxy to avoid CORS in development.
// In production the requests go directly through the Nginx ingress to *.agent.localhost.
export const agentUrl = (sandboxId, path = '') =>
  isDev
    ? `/sandbox-agent/${sandboxId}${path}`
    : `http://${sandboxId}.agent.localhost${path}`;

// For socket.io we use the same proxy path as the base.
export const agentSocketOrigin = (sandboxId) =>
  isDev
    ? window.location.origin
    : `http://${sandboxId}.agent.localhost`;

export const agentSocketPath = (sandboxId) =>
  isDev
    ? `/sandbox-agent/${sandboxId}/socket.io`
    : "/socket.io";


