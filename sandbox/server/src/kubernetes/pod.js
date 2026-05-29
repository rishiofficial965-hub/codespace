import { k8sCoreV1Api } from "./config.js";

let resolvedImages = null;

async function resolveSandboxImages() {
    if (resolvedImages) return resolvedImages;
    resolvedImages = { templateImage: 'template', agentImage: 'agent' };
    try {
        const podName = process.env.HOSTNAME;
        if (podName) {
            console.log(`Resolving images using pod: ${podName}`);
            const response = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: 'default'
            });
            console.log("K8s readNamespacedPod response keys:", Object.keys(response || {}));
            const spec = response.spec || (response.body && response.body.spec);
            const initContainers = spec ? (spec.initContainers || []) : [];
            const dummyTemplate = initContainers.find(c => c.name === 'dummy-template');
            const dummyAgent = initContainers.find(c => c.name === 'dummy-agent');
            if (dummyTemplate) resolvedImages.templateImage = dummyTemplate.image;
            if (dummyAgent) resolvedImages.agentImage = dummyAgent.image;
            console.log(`Successfully resolved dynamic sandbox images from pod spec: template=${resolvedImages.templateImage}, agent=${resolvedImages.agentImage}`);
        }
    } catch (error) {
        console.error("Failed to resolve dynamic sandbox images from pod spec, using fallbacks:", error.message);
    }
    return resolvedImages;
}

export async function createPod(sandboxId) {
    const { templateImage, agentImage } = await resolveSandboxImages();
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                sandboxId: sandboxId
            }
        },
        spec: {
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            initContainers: [
                {
                    name: 'init-container',
                    image: templateImage,
                    imagePullPolicy: 'IfNotPresent',
                    command: ['sh', '-c', 'cp -r /workspace/. /seed/'],
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]
                }
            ],
            containers: [{
                name: `sandbox-container`,
                image: templateImage,
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: 5173, name: "http" }],
                resources: {
                    requests: {
                        memory: "512Mi",
                        cpu: "1000m"
                    },

                    limits: {
                        memory: "1Gi",
                        cpu: "2000m"
                    }
                },
                volumeMounts: [
                    {
                        name: "workspace-volume",
                        mountPath: "/workspace"
                    }
                ]
            }, {
                name: `agent-container`,
                image: agentImage,
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: 3000, name: "http" }],
                resources: {
                    requests: {
                        memory: "512Mi",
                        cpu: "1000m"
                    },

                    limits: {
                        memory: "1Gi",
                        cpu: "2000m"
                    }
                },
                volumeMounts: [
                    {
                        name: "workspace-volume",
                        mountPath: "/workspace"
                    }
                ]
            }]
        }
    }

    const response = await k8sCoreV1Api.createNamespacedPod(
        { namespace: 'default', body: podManifest }
    )
    return response;
}

export async function deletePod(sandboxId) {
    try {
        const response = await k8sCoreV1Api.deleteNamespacedPod({
            namespace: "default",
            name: `sandbox-pod-${sandboxId}`
        }, {
            gracePeriodSeconds: 0
        })
        return response
    } catch (error) {
        console.log(`failed to delete pod ${error.body.message}`)
    }

}

export async function deleteService(sandboxId) {
    try {
        const response = await k8sCoreV1Api.deleteNamespacedService({
            namespace: "default",
            name: `sandbox-service-${sandboxId}`
        })
        return response
    } catch (error) {
        console.log(`failed to delete service ${error.body.message}`)
    }
}