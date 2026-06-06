docker build -t notification .

docker save notification -o notification.tar

docker cp notification.tar desktop-control-plane:/notification.tar

docker exec desktop-control-plane ctr -n k8s.io images import /notification.tar

kubectl delete pod -l app=notification