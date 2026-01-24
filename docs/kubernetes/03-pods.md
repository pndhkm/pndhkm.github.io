# Pods

A Pod is the **smallest schedulable unit** in Kubernetes.
Kubernetes does **not** manage containers directly — it manages Pods.

## What Is a Pod and Why Not Just Containers

A Pod is a wrapper around one or more containers that must run together.

| Aspect          | Container Only | Pod                |
| --------------- | -------------- | ------------------ |
| Scheduling      | Manual         | Kubernetes-managed |
| IP address      | Per container  | Shared             |
| Storage         | Isolated       | Shared volumes     |
| Lifecycle       | Independent    | Unified            |
| Kubernetes unit | No             | Yes                |

Kubernetes schedules **Pods**, not containers, to enable co-located processes.

## Pod Lifecycle and States

Pods are **ephemeral** and expected to be replaced.

| Phase     | Meaning                              |
| --------- | ------------------------------------ |
| Pending   | Waiting for scheduling or image pull |
| Running   | Containers are running               |
| Succeeded | All containers exited successfully   |
| Failed    | One or more containers failed        |
| Unknown   | Node communication lost              |

Pods are recreated by controllers, not repaired.

## Multi-Container Pods (Sidecar Pattern)

Multiple containers can live inside a single Pod.

They:

* Share the same IP
* Share volumes
* Communicate via `localhost`

Common patterns:

| Pattern    | Purpose              |
| ---------- | -------------------- |
| Sidecar    | Logging, proxy, sync |
| Ambassador | Network proxy        |
| Adapter    | Data transformation  |

Example: application + log shipper.

## Pod Networking Basics

Each Pod gets **one IP address**.

```mermaid
graph LR
    A[App Container :8080] -->|localhost| B[Sidecar :9000]
```

Key rules:

* Containers talk via `localhost`
* No NAT inside a Pod
* Pods communicate via cluster networking (CNI)

## Pod YAML Structure Explained

Core YAML fields:

| Field      | Purpose               |
| ---------- | --------------------- |
| apiVersion | API group/version     |
| kind       | Resource type         |
| metadata   | Name, labels          |
| spec       | Desired state         |
| containers | Container definitions |

Minimal Pod YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo
spec:
  containers:
  - name: app
    image: nginx
```

## Hands-on: Single-Container Pod

### Create Pod

Input:

```
kubectl run single-pod --image=nginx
```

Output:

```
pod/single-pod created
```

This creates a Pod with one container.

### Check Pod Status

Input:

```
kubectl get pods
```

Output:

```
NAME         READY   STATUS    AGE
single-pod   1/1     Running   20s
```

This confirms the Pod is running.

### View Pod Logs

Input:

```
kubectl logs single-pod
```

Output:

```
...
/docker-entrypoint.sh: Configuration complete; ready for start up
...
```

This shows container stdout/stderr.

### Exec Into Pod

Input:

```
kubectl exec -it single-pod -- sh
```

This opens a shell inside the container.

## Hands-on: Multi-Container Pod (Sidecar)

### Create Multi-Container Pod

Input:

```
kubectl apply -f multi-pod.yaml
```

Output:

```
pod/multi-pod created
```

This applies a Pod manifest with two containers.

Example `multi-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-pod
spec:
  containers:
  - name: app
    image: nginx
  - name: sidecar
    image: busybox
    command: ["sh", "-c", "while true; do echo sidecar running; sleep 5; done"]
```

### Verify Containers

Input:

```
kubectl get pod multi-pod
```

Output:

```
READY   STATUS    AGE
2/2     Running   30s
```

This shows both containers are healthy.

### View Sidecar Logs

Input:

```
kubectl logs multi-pod -c sidecar
```

Output:

```
sidecar running
sidecar running
```

This confirms sidecar execution.

### Exec Into Specific Container

Input:

```
kubectl exec -it multi-pod -c app -- sh
```

This opens a shell inside the selected container.

## Key Takeaways

| Concept    | Meaning                       |
| ---------- | ----------------------------- |
| Pod        | Smallest Kubernetes unit      |
| Containers | Always run inside Pods        |
| Networking | Shared per Pod                |
| Lifecycle  | Disposable                    |
| Sidecar    | Common multi-container design |

Pods are **designed to be destroyed and recreated**, not patched or upgraded in place.
