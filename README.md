# exp-state

Tiny app to handle counter state.

## Run it!

To run it locally, run:

```bash
npm install exp-state
npm start
curl http://localhost:3000/
```

## Deploy to K8s cluster

Requirements:

- A running Kubernetes cluster with `kubectl` configured;
  - The cluster must have metrics-server installed for HPA to work;
- Access to the built Docker image;
  - Push the image to where your cluster can pull.
- This app assumes you have a Redis instance running in your cluster and anonymous accessible through the host `redis` and port `6379`.

To deploy to a local Kubernetes cluster, run:

```bash
docker build -t exp-state:0.1.1 .
kubectl apply -f deploy/
```
