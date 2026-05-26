docker build -t agent:latest .

docker save agent:latest -o agent.tar

docker cp agent.tar desktop-control-plane:/agent.tar

docker exec desktop-control-plane ctr -n k8s.io images import /agent.tar

kubectl delete pod -l app=agent