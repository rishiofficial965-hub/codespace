docker build -t ai-orchestration:latest .

docker save ai-orchestration:latest -o ai-orchestration.tar

docker cp ai-orchestration.tar desktop-control-plane:/ai-orchestration.tar

docker exec desktop-control-plane ctr -n k8s.io images import /ai-orchestration.tar

