# Deployments 

A Deployment is a **higher-level controller** that manages ReplicaSets, which in turn manage Pods.

Deployments provide **declarative updates**, **scaling**, and **rollback**.

## Deployments vs ReplicaSets vs Pods

| Object     | Responsibility                  |
| ---------- | ------------------------------- |
| Pod        | Runs containers                 |
| ReplicaSet | Ensures Pod count               |
| Deployment | Manages ReplicaSets and updates |

Hierarchy:

```
Deployment → ReplicaSet → Pods
```

You should **never manage ReplicaSets directly**.

## Why Deployments Exist

Deployments solve:

* Zero-downtime updates
* Version tracking
* Safe rollbacks
* Horizontal scaling

Without Deployments, updates are destructive.

## Deployment Strategies

| Strategy      | Behavior                      |
| ------------- | ----------------------------- |
| RollingUpdate | Gradual replacement (default) |
| Recreate      | Stop all, then start new      |

RollingUpdate parameters:

* `maxSurge`
* `maxUnavailable`

## Hands-on: Deploy nginx

### Create Deployment

Input:

```
kubectl create deployment nginx --image=nginx:1.25
```

Output:

```
deployment.apps/nginx created
```

This creates a Deployment with one ReplicaSet.

### Inspect Deployment

Input:

```
kubectl get deployment nginx
```

Output:

```
NAME    READY   UP-TO-DATE   AVAILABLE
nginx   1/1     1            1
```

This shows desired vs available replicas.

### Inspect ReplicaSets

Input:

```
kubectl get rs
```

Output:

```
NAME               DESIRED   CURRENT
nginx-6c8bdfc8c9   1         1
```

ReplicaSet is automatically created.

## Scaling Applications

### Scale Up

Input:

```
kubectl scale deployment nginx --replicas=3
```

Output:

```
deployment.apps/nginx scaled
```

This increases Pod replicas.

### Verify Pods

Input:

```
kubectl get pods -l app=nginx
```

Output:

```
nginx-xxxx   Running
nginx-yyyy   Running
nginx-zzzz   Running
```

Deployment maintains replica count.

### Scale Down

Input:

```
kubectl scale deployment nginx --replicas=1
```

Output:

```
deployment.apps/nginx scaled
```

Extra Pods are terminated gracefully.

## Rolling Update

### Update Image Version

Input:

```
kubectl set image deployment/nginx nginx=nginx:1.26
```

Output:

```
deployment.apps/nginx image updated
```

This triggers a rolling update.

### Watch Rollout

Input:

```
kubectl rollout status deployment/nginx
```

Output:

```
Waiting for deployment "nginx" rollout to finish: 1 old replicas are pending termination...
deployment "nginx" successfully rolled out
```

Pods are replaced gradually.

### Check ReplicaSets After Update

Input:

```
kubectl get rs
```

Output:

```
nginx-7f9cbbf9f6   1   1
nginx-6c8bdfc8c9   0   0
```

Old ReplicaSet is scaled down.

## Rollback Deployment

### Rollback to Previous Version

Input:

```
kubectl rollout undo deployment/nginx
```

Output:

```
deployment.apps/nginx rolled back
```

This restores the previous ReplicaSet.

### Verify Image

Input:

```
kubectl describe deployment nginx | grep Image
```

Output:

```
Image: nginx:1.25
```

Rollback completed successfully.

## Deployment YAML Structure

Core fields:

| Field    | Purpose            |
| -------- | ------------------ |
| replicas | Desired Pod count  |
| selector | Pod label selector |
| template | Pod spec           |
| strategy | Update strategy    |

Example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
```

## Key Takeaways

| Concept        | Meaning                       |
| -------------- | ----------------------------- |
| Deployment     | Application lifecycle manager |
| ReplicaSet     | Pod count enforcer            |
| Rolling update | Zero-downtime upgrade         |
| Rollback       | Safe version recovery         |
| Scaling        | Declarative replica control   |

Deployments turn **manual releases** into **repeatable, safe operations**.
