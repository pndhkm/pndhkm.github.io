# Managing Permissions

Linux uses POSIX file permissions with owner, group, and other classes.

### Viewing Permissions

Input:

```
ls -l /tmp/testfile
```

Output:

```
-rw-r----- 1 alice ops 120 Jan 10 12:00 /tmp/testfile
```

Shows read/write for owner, read for group, none for others.

References:

* [https://man7.org/linux/man-pages/man1/ls.1.html](https://man7.org/linux/man-pages/man1/ls.1.html)

### Changing File Ownership

Input:

```
chown alice:ops /tmp/testfile
```

Sets owner *alice* and group *ops*.

References:

* [https://man7.org/linux/man-pages/man1/chown.1.html](https://man7.org/linux/man-pages/man1/chown.1.html)

### Changing File Permissions

Input:

```
chmod 640 /tmp/testfile
```

Sets rw for owner, r for group, no permission for others.

References:

* [https://man7.org/linux/man-pages/man1/chmod.1.html](https://man7.org/linux/man-pages/man1/chmod.1.html)

