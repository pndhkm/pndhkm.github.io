# Filesystems

Filesystems define how data and metadata are structured on block devices. Common types include ext4, xfs, and btrfs.

### Identifying filesystem type

Input:

```
lsblk -f
```

Output:

```
NAME FSTYPE LABEL UUID                                 MOUNTPOINT
sda
└─sda1 ext4         1a23bcd1-9f2e-4c77-afc2-b26a7f903b55 /
```

This lists devices with filesystem type, label, and UUID.

References:

* [https://man7.org/linux/man-pages/man8/lsblk.8.html](https://man7.org/linux/man-pages/man8/lsblk.8.html)
* [https://man7.org/linux/man-pages/man5/filesystems.5.html](https://man7.org/linux/man-pages/man5/filesystems.5.html)

---


