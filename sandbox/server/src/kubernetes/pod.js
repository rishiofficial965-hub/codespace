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
            volumes:[
                {
                    name:"workspace-volume",
                    emptyDir: {}
                }
            ],
            initContainers: [
                {
                    name: 'init-container',
                    image: 'template',
                    imagePullPolicy: 'IfNotPresent',
                    command: ['sh', '-c', 'cp -r /workspace/. /seed/'],
                    volumeMounts: [
                        {
                            name:"workspace-volume",
                            mountPath:"/seed"
                        }
                    ]
                }
            ],
            containers: [{
                name: `sandbox-container`,
                image: 'template',
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: 5173, name: "http" }],
                resources: {
                    requests: {
                        memory: "256Mi",
                        cpu: "500m"
                    },

                    limits: {
                        memory: "512Mi",
                        cpu: "1000m"
                    }
                },
                volumeMounts:[
                    {
                        name:"workspace-volume",
                        mountPath:"/workspace"
                    }
                ]
            },{
                name: `agent-container`,
                image: 'agent',
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: 3000, name: "http" }],
                resources: {
                    requests: {
                        memory: "256Mi",
                        cpu: "500m"
                    },

                    limits: {
                        memory: "512Mi",
                        cpu: "1000m"
                    }
                },
                volumeMounts:[
                    {
                        name:"workspace-volume",
                        mountPath:"/workspace"
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