# Available Memory and Disk

Check RAM status and disk capacity to avoid resource exhaustion.

Input:

```
free -h
```

Output:

```
               total        used        free      shared  buff/cache   available
Mem:           7.7G        2.6G        1.2G        120M        3.9G        4.5G
Swap:          2.0G          0B        2.0G
```

Displays RAM usage, including buffers/cache.

References:

* [https://man7.org/linux/man-pages/man1/free.1.html](https://man7.org/linux/man-pages/man1/free.1.html)

---

Input:

```
df -h /
```

Output:

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   15G   33G  32% /
```

Shows disk space usage for the root filesystem.

References:

* [https://man7.org/linux/man-pages/man1/df.1.html](https://man7.org/linux/man-pages/man1/df.1.html)

---

Input:

```
lsblk
```

Output:

```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   50G  0 disk
├─sda1   8:1    0   48G  0 part /
└─sda2   8:2    0    2G  0 part [SWAP]
```

Displays block device layout.

References:

* [https://man7.org/linux/man-pages/man8/lsblk.8.html](https://man7.org/linux/man-pages/man8/lsblk.8.html)

