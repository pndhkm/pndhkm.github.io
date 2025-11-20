# Process Forking

Forking creates a child process that duplicates the parent’s context.

### Display process tree

Input:

```
pstree -p
```

Output:

```
systemd(1)─┬─sshd(802)─┬─sshd(900)──bash(901)
           │           └─sshd(910)──bash(911)
```

Shows parent-child relationships.

References:

* [https://man7.org/linux/man-pages/man2/fork.2.html](https://man7.org/linux/man-pages/man2/fork.2.html)
* [https://man7.org/linux/man-pages/man1/pstree.1.html](https://man7.org/linux/man-pages/man1/pstree.1.html)

