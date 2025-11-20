# Ulimits

`ulimit` controls resource limits for processes in a shell, including containers. It restricts CPU time, file descriptors, memory, etc., to prevent resource exhaustion.

Input:

```
ulimit -a
```

Output:
```
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
file descriptors        (-n) 1024
max user processes      (-u) 4096
stack size              (kbytes, -s) 8192
```

Shows all current limits for the shell session.  

Input:

```
docker run --ulimit nofile=2048:4096 nginx
```

Sets container file descriptor limits (`soft:hard`) to prevent excessive open files.

References:
- https://man7.org/linux/man-pages/man2/getrlimit.2.html  

---


