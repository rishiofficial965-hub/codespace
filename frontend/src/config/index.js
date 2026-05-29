// Global Application Configurations
export const API_BASE_URL = '';

// Agent API calls go through the Vite dev-server proxy to avoid CORS.
// In production the requests go directly through the Nginx ingress to *.agent.localhost.
export const agentUrl = (sandboxId, path = '') =>
  import.meta.env.DEV
    ? `/sandbox-agent/${sandboxId}${path}`
    : `http://${sandboxId}.agent.localhost${path}`;

// For socket.io we use the same proxy path as the base.
// socket.io connects to the origin + the namespace path.
export const agentSocketOrigin = (sandboxId) =>
  import.meta.env.DEV
    ? window.location.origin
    : `http://${sandboxId}.agent.localhost`;

export const agentSocketPath = (sandboxId) =>
  import.meta.env.DEV
    ? `/sandbox-agent/${sandboxId}/socket.io`
    : '/socket.io';

