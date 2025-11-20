# Uptime and Load

Check how long the system has been running and review CPU load averages to identify saturation.

Input:

```
uptime
```

Output:

```
 13:50:21 up 12 days,  4:11,  2 users,  load average: 0.42, 0.36, 0.31
```

This shows system uptime, logged-in users, and 1/5/15-minute load averages.

References:

* [https://man7.org/linux/man-pages/man1/uptime.1.html](https://man7.org/linux/man-pages/man1/uptime.1.html)

---

Input:

```
top -b -n1 | head -5
```

Output:

```
top - 13:50:41 up 12 days,  4:11,  2 users,  load average: 0.38, 0.35, 0.30
Tasks: 189 total,   1 running, 188 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.2 us,  1.3 sy,  0.0 ni, 92.9 id,  0.4 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :   7856.5 total,   1203.2 free,   2694.7 used,   3958.6 buff/cache
MiB Swap:   2047.0 total,   2047.0 free,      0.0 used.   4587.8 avail Mem
```

This summarizes CPU load, task counts, and memory state.

References:

* [https://man7.org/linux/man-pages/man1/top.1.html](https://man7.org/linux/man-pages/man1/top.1.html)

---


