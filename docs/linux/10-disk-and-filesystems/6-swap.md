# Swap

Swap extends RAM using disk space. It can be configured as a partition or file.

### Checking swap usage

Input:

```
swapon --show
```

Output:

```
NAME      TYPE      SIZE  USED PRIO
/dev/sda2 partition 2G     0B   -2
```

This lists swap devices and their usage.

References:

* [https://man7.org/linux/man-pages/man8/swapon.8.html](https://man7.org/linux/man-pages/man8/swapon.8.html)
* [https://man7.org/linux/man-pages/man2/mmap.2.html](https://man7.org/linux/man-pages/man2/mmap.2.html)

