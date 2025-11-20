# Listing and Finding Processes

Processes can be viewed system-wide or filtered by user or pattern.

### List all processes

Input:

```
ps aux
```

Output:

```
USER   PID %CPU %MEM VSZ   RSS TTY   STAT START   TIME COMMAND
root     1  0.0  0.1 1712  1028 ?     Ss   10:00   0:01 /sbin/init
```

This displays all processes with CPU, memory, and state fields.

### Find processes by pattern

Input:

```
pgrep sshd
```

Output:

```
1234
```

This returns PIDs matching the pattern.

References:

* [https://man7.org/linux/man-pages/man1/ps.1.html](https://man7.org/linux/man-pages/man1/ps.1.html)
* [https://man7.org/linux/man-pages/man1/pgrep.1.html](https://man7.org/linux/man-pages/man1/pgrep.1.html)

---


