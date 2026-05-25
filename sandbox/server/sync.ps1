docker build -t sandbox:v1 .

docker save sandbox:v1 -o sandbox.tar

docker cp sandbox.tar desktop-control-plane:/sandbox.tar

docker exec desktop-control-plane ctr -n k8s.io images import /sandbox.tar

kubectl delete pod -l app=sandbox