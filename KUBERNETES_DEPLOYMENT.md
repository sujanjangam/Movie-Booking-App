# Kubernetes Deployment Guide - Frontend

## Deployment Status ✅

Your **Movie Booking App Frontend** is successfully deployed to Kubernetes!

### Current Status
- **Pods Running**: 2 replicas (both healthy)
- **Service Type**: NodePort
- **Access Port**: 30816
- **Container Port**: 5173

---

## Access Your Application

### Local Access (Docker Desktop/Minikube/Kind)
```
http://localhost:30816
```

### Alternative Access Methods

**Via Port Forward:**
```bash
kubectl port-forward service/movie-frontend-service 5173:5173
```
Then access: `http://localhost:5173`

---

## Deployment Details

### Resources Deployed
1. **Deployment**: `movie-frontend` (2 replicas)
2. **Service**: `movie-frontend-service` (NodePort)
3. **Docker Image**: `movie-booking-app-frontend:latest`

### View Deployment
```bash
# Check pods
kubectl get pods -l app=movie-frontend

# Check service
kubectl get service movie-frontend-service

# View logs
kubectl logs -l app=movie-frontend --tail=50

# Describe deployment
kubectl describe deployment movie-frontend
```

---

## Scaling

**Scale up/down replicas:**
```bash
# Scale to 3 replicas
kubectl scale deployment movie-frontend --replicas=3

# Scale to 1 replica
kubectl scale deployment movie-frontend --replicas=1
```

---

## Update Deployment

**After code changes:**
```bash
# Rebuild image
cd frontend
docker build -t movie-booking-app-frontend:latest .

# Restart pods to use new image
kubectl rollout restart deployment movie-frontend

# Check rollout status
kubectl rollout status deployment movie-frontend
```

---

## Troubleshooting

**View pod logs:**
```bash
kubectl logs -l app=movie-frontend -f
```

**Check pod details:**
```bash
kubectl describe pod <pod-name>
```

**Exec into pod:**
```bash
kubectl exec -it <pod-name> -- /bin/sh
```

**Delete and redeploy:**
```bash
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

## Environment Configuration

The frontend connects to backend via `VITE_API_URL` environment variable.

**Current config**: `http://localhost:5000/api`

**To update for Kubernetes backend:**
Update `.env.local` to use backend service:
```
VITE_API_URL=http://movie-backend-service:5000/api
```

---

## Production Deployment

For cloud providers (AWS EKS, GKE, AKS), change service type to LoadBalancer:

```yaml
spec:
  type: LoadBalancer
```

This will provision an external load balancer with a public IP.

---

## Next Steps

1. ✅ Frontend deployed
2. Deploy backend to Kubernetes
3. Configure service mesh for inter-service communication
4. Set up ingress controller for routing
5. Add SSL/TLS certificates
6. Configure auto-scaling (HPA)
7. Set up monitoring with Prometheus/Grafana
