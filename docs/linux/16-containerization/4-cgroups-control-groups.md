# cgroups (Control Groups)

cgroups provide fine-grained resource control for containers and processes, including CPU, memory, and I/O limits.

### Key Concepts
- **Memory limit**: Prevents a container from using more RAM than allowed.
- **CPU shares**: Allocates CPU bandwidth among containers.
- **blkio**: Limits block device I/O throughput.

Input:

```
cat /sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes
```

Output:
```
536870912
```

Indicates memory limit in bytes for a container (512MB here).  

Input:

```
docker run -d --memory=512m --cpus=1 nginx
```

Restricts container to 512MB RAM and 1 CPU core.

References:
- https://man7.org/linux/man-pages/man7/cgroups.7.html  
- https://man7.org/linux/man-pages/man7/namespaces.7.html  

---

