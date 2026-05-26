docker build -t template:latest .

docker save template:latest -o template.tar

docker cp template.tar desktop-control-plane:/template.tar

docker exec desktop-control-plane ctr -n k8s.io images import /template.tar

