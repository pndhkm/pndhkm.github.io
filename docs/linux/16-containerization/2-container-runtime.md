# Container Runtime

Container runtimes provide the low-level tools for running containers using OS primitives like namespaces and cgroups. Examples: **containerd**, **CRI-O**, **runc**. Docker uses containerd as its runtime.  

Input:

```
crictl ps
```

Output:
```
CONTAINER       IMAGE               CREATED          STATE
123abc456def    nginx:latest        10 minutes ago   Running
```

Lists containers managed by a runtime using CRI (Kubernetes standard).  

References:
- https://man7.org/linux/man-pages/man7/namespaces.7.html  

---


