import axios from 'axios';
import { API_BASE_URL, agentUrl } from '../../../config';

export async function startSandboxApi() {
  const response = await axios.post(`${API_BASE_URL}/api/sandbox/start`);
  return response.data;
}

export async function listFilesApi(sandboxId) {
  const response = await axios.get(agentUrl(sandboxId, '/list-files'));
  return response.data;
}

export async function readFileApi(sandboxId, filePath) {
  const response = await axios.get(agentUrl(sandboxId, '/read-files'), {
    params: { files: filePath }
  });
  return response.data;
}

export async function createFileOrFolderApi(sandboxId, file, content) {
  const response = await axios.post(agentUrl(sandboxId, '/create-files'), {
    files: [{ file, content }]
  });
  return response.data;
}

export async function deletePathApi(sandboxId, path) {
  const response = await axios.delete(agentUrl(sandboxId, '/delete-path'), {
    data: { path }
  });
  return response.data;
}

export async function updateFilesApi(sandboxId, updates) {
  const response = await axios.patch(agentUrl(sandboxId, '/update-files'), {
    updates
  });
  return response.data;
}

export function invokeAgentApi(sandboxId, prompt) {
  return fetch(`${API_BASE_URL}/api/ai/agent/invoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, projectId: sandboxId }),
  });
}
