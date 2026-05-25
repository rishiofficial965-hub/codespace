import { k8sApi } from "./config.js";

export async function createService(sandboxId) {

    try {

        const serviceManifest = {
            apiVersion: "v1",
            kind: "Service",
            metadata: {
                name: `sandbox-service-${sandboxId}`,
                labels: {
                    app: "sandbox",
                    sandboxId
                }
            },
            spec: {
                selector: {
                    app: "sandbox",
                    sandboxId
                },
                ports: [{
                    port: 80,
                    targetPort: 5173,
                    name: "http"
                }],
                type: "ClusterIP"
            }
        };

        const response = await k8sApi.createNamespacedService({
            namespace: "default",
            body: serviceManifest
        });

        return response;

    } catch (error) {
        console.dir(error, { depth: null });
        throw error;
    }
}