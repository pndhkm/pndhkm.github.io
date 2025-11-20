# Adding Disks

New disks must be partitioned, formatted, and mounted before use.

### Listing new block devices

Input:

```
lsblk
```

Output:

```
sdb      8:16   0   50G  0 disk
```

Shows the detected disk before partitioning.

References:

* [https://man7.org/linux/man-pages/man8/lsblk.8.html](https://man7.org/linux/man-pages/man8/lsblk.8.html)
* [https://man7.org/linux/man-pages/man8/fdisk.8.html](https://man7.org/linux/man-pages/man8/fdisk.8.html)

---


