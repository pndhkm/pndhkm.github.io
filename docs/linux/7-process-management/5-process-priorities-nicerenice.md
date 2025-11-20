# Process Priorities (nice/renice)

Niceness values (-20 to 19) influence CPU scheduling; lower values mean higher priority.

### Start with lower priority

Input:

```
nice -n 10 tar cf backup.tar /data
```

### Change priority of running process

Input:

```
renice -n -5 1234
```

Output:

```
1234 (process ID) old priority 10, new priority -5
```

Indicates priority change for the PID.

References:

* [https://man7.org/linux/man-pages/man1/nice.1.html](https://man7.org/linux/man-pages/man1/nice.1.html)
* [https://man7.org/linux/man-pages/man1/renice.1.html](https://man7.org/linux/man-pages/man1/renice.1.html)

---


