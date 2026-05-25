import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId) {
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec: {
            containers: [{
                name: `sandbox-container`,
                image: 'template',
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: 5173, name: "http" }],
                resources: {
                    requests: {
                        memory: '64Mi',
                        cpu: '256m'
                    },
                    limits: {
                        memory: '128Mi',
                        cpu: '512m'
                    }
                }
            }]
        }
    }

    const response = await k8sCoreV1Api.createNamespacedPod(
        { namespace: 'default', body: podManifest }
    )
    return response;
}