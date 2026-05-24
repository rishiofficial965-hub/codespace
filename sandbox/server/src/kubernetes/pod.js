import { k8sApi } from "./config.js";
import { v4 as uuidv4 } from "uuid";

export async function createPod(sandboxId) {
    try {
        const podManifest = {
            metadata: {
                name: `sandbox-pod-${sandboxId}`,
                labels: {
                    app: "sandbox",
                    sandboxId: sandboxId
                }
            },
            spec: {
                containers: [
                    {
                        name: "sandbox-container",
                        image: "template:latest",
                        imagePullPolicy: "IfNotPresent",
                        ports: [
                            {
                                containerPort: 5173,
                                name: "http"
                            }
                        ],
                        resources: {
                            limits: { cpu: "500m", memory: "1Gi" },
                            requests: { cpu: "250m", memory: "500Mi" }
                        }
                    }
                ]
            }
        }

        const response = await k8sApi.createNamespacedPod("default", podManifest);
        return response;

    } catch (error) {
        console.log(error);
        throw error;
    }
}