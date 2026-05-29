docker build -t auth:latest .

docker save auth:latest -o auth.tar

docker cp auth.tar desktop-control-plane:/auth.tar

docker exec desktop-control-plane ctr -n k8s.io images import /auth.tar

