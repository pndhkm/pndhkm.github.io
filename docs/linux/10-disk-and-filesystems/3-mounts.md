# Mounts

Mounting attaches a filesystem to a directory tree. Persistent mounts are defined in `/etc/fstab`.

### Checking active mounts

Input:

```
mount | grep "^/"
```

Output:

```
/dev/sda1 on / type ext4 (rw,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
```

Shows current mounted filesystems and their options.

References:

* [https://man7.org/linux/man-pages/man8/mount.8.html](https://man7.org/linux/man-pages/man8/mount.8.html)
* [https://man7.org/linux/man-pages/man5/fstab.5.html](https://man7.org/linux/man-pages/man5/fstab.5.html)

---


