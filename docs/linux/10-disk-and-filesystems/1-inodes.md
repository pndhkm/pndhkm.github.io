# Inodes

Inodes store metadata for files (permissions, UID/GID, timestamps, block pointers). Each filesystem has a fixed number of inodes created at format time.

### Checking inode usage

Input:

```
df -i
```

Output:

```
Filesystem     Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1     3276800  85421 3191379    3% /
```

This shows inode availability per mounted filesystem.

References:

* [https://man7.org/linux/man-pages/man1/df.1.html](https://man7.org/linux/man-pages/man1/df.1.html)
* [https://man7.org/linux/man-pages/man5/ext4.5.html](https://man7.org/linux/man-pages/man5/ext4.5.html)

---


