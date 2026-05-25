docker build -t router:latest .

docker save router:latest -o router.tar

docker cp router.tar desktop-control-plane:/router.tar

docker exec desktop-control-plane ctr -n k8s.io images import /router.tar

kubectl delete pod -l app=router