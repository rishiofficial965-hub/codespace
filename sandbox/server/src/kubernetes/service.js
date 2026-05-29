import { k8sCoreV1Api } from "./config.js";

export const createService = async (sandboxId) => {
    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                sandboxId: sandboxId
            }
        },
        spec: {
            selector: {
                sandboxId: sandboxId
            },
            ports: [
                { port: 80, targetPort: 5173, protocol: "TCP", name: "http" },
                { port: 3000, targetPort: 3000, protocol: "TCP", name: "agent-http" }
            ],
            type: "ClusterIP"
        }
    }
    const response = await k8sCoreV1Api.createNamespacedService({ namespace: "default", body: serviceManifest });
    return response;
}