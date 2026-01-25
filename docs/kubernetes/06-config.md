# ConfigMaps and Secrets

ConfigMaps and Secrets allow you to **separate configuration from application code**, so you can change behavior **without rebuilding images**.

This is one of the most important patterns in real-world Kubernetes.

## Why Config Must Be Separated from Code

| Problem               | Without Config Separation  | With ConfigMaps / Secrets    |
| --------------------- | -------------------------- | ---------------------------- |
| Hardcoded values      | Rebuild image every change | Update config only           |
| Multiple environments | Different images per env   | Same image, different config |
| Secrets in images     | Security leak              | Secure runtime injection     |
| Scaling deployments   | Manual inconsistencies     | Declarative + repeatable     |

Rule of thumb:

* **ConfigMaps → non-sensitive data**
* **Secrets → sensitive data (passwords, tokens, keys)**

---

## ConfigMaps

ConfigMaps store **plain text configuration** (key-value pairs or files).

### Create ConfigMap from literals

Input:

```bash
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=APP_DEBUG=false
```

Output:

```
configmap/app-config created
```

### Inspect ConfigMap

Input:

```bash
kubectl get configmap app-config -o yaml
```

Output:

```yaml
data:
  APP_DEBUG: "false"
  APP_ENV: production
```

ConfigMap content is **not encrypted**.

---

## Using ConfigMap as Environment Variables

Create file: `pod-cm-env.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cm-env
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
    envFrom:
    - configMapRef:
        name: app-config
```

Apply:

```bash
kubectl apply -f pod-cm-env.yaml
```

### Verify env inside Pod

```bash
kubectl exec -it cm-env -- env 
```

Output:

```
APP_ENV=production
APP_DEBUG=false
```

This is the **same mechanism used in production clusters**.

---

## Using ConfigMap as Files

### Create ConfigMap from file

```bash
echo "port=8080" > app.conf
kubectl create configmap app-file --from-file=app.conf
```

### Pod mounting ConfigMap as files

Create: `pod-cm-file.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cm-file
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: cfg
      mountPath: /config
  volumes:
  - name: cfg
    configMap:
      name: app-file
```

Apply:

```bash
kubectl apply -f pod-cm-file.yaml
```

Verify:

```bash
kubectl exec cm-file -- cat /config/app.conf
```

Output:

```
port=8080
```

---

## Secrets

Secrets work exactly like ConfigMaps, but intended for **sensitive data**.

### Create Secret

```bash
kubectl create secret generic db-secret \
  --from-literal=DB_USER=admin \
  --from-literal=DB_PASS=supersecret
```

### Inspect Secret

```bash
kubectl get secret db-secret -o yaml
```

Output:

```yaml
data:
  DB_PASS: c3VwZXJzZWNyZXQ=
  DB_USER: YWRtaW4=
```

:::warning ⚠️ 
Base64 encoding ≠ encryption
Encryption depends on **etcd encryption config**
:::

---

## Using Secret as Environment Variables

Create: `pod-secret-env.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
    envFrom:
    - secretRef:
        name: db-secret
```

Apply:

```bash
kubectl apply -f pod-secret-env.yaml
```

Verify:

```bash
kubectl exec -it secret-env -- env 
```

Output:

```
DB_USER=admin
DB_PASS=supersecret
```

---

## Using Secret as Files (More Secure Pattern)

Create: `pod-secret-file.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-file
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: secret
      mountPath: /secrets
  volumes:
  - name: secret
    secret:
      secretName: db-secret
```

Apply:

```bash
kubectl apply -f pod-secret-file.yaml
```

Verify:

```bash
kubectl exec secret-file -- ls /secrets
```

Output:

```
DB_PASS
DB_USER
```

---

## Env vs File Mounting

| Method            | When to Use                            |
| ----------------- | -------------------------------------- |
| Env vars          | Simple flags, small config             |
| Files             | TLS certs, API keys, structured config |
| Secrets via files | **Recommended for production**         |

---

## Best Practices

| Practice                        | Why                                                     |
| ------------------------------- | ------------------------------------------------------- |
| Do not commit Secrets           | Avoid leaks                                             |
| Use RBAC                        | Control who can read Secrets                            |
| Enable etcd encryption          | Protect data at rest                                    |
| Use external secret managers    | (Vault, AWS Secrets Manager, External Secrets Operator) |
| Prefer Deployment over raw Pods | Reconciliation and resilience                           |

---

## Cleanup

```bash
kubectl delete pod cm-env cm-file secret-env secret-file
kubectl delete configmap app-config app-file
kubectl delete secret db-secret
```

---

## Key Takeaways

| Concept          | Meaning                  |
| ---------------- | ------------------------ |
| ConfigMap        | Non-sensitive config     |
| Secret           | Sensitive config         |
| Declarative YAML | Production standard      |
| Env injection    | Simple usage             |
| File mounting    | Secure and flexible      |
| Separation       | Enables immutable images |

---

