import { k8sApi } from "./config.js";


export async function createService(sandboxId){
    try{
        const serviceManifest = {
            metadata:{
                name: `sandbox-service-${sandboxId}`,
                labels:{
                    app:"sandbox",
                    sandboxId: sandboxId
                }
            },
            spec:{
                selector:{
                    app:"sandbox",
                    sandboxId: sandboxId
                },
                ports:[
                    {
                        port: 80,
                        targetPort: 5173,
                        name: "http"
                    }
                ],
                type: "ClusterIP"
            }
        }
        const response = await k8sApi.createNamespacedService("default",serviceManifest);
        return response;

    }catch(error){
        console.log(error);
        throw error;
    }
}