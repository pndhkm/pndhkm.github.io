# Users and Groups

Groups define permission sets shared among users. Primary group is assigned at login; supplementary groups allow additional access.

### Creating a Group

Input:

```
groupadd ops
```

Creates group *ops*.

References:

* [https://man7.org/linux/man-pages/man8/groupadd.8.html](https://man7.org/linux/man-pages/man8/groupadd.8.html)

### Adding User to a Group

Input:

```
usermod -aG ops alice
```

Adds *alice* to supplementary group *ops*.

References:

* [https://man7.org/linux/man-pages/man8/usermod.8.html](https://man7.org/linux/man-pages/man8/usermod.8.html)

### Listing User Groups

Input:

```
id alice
```

Output:

```
uid=1001(alice) gid=1001(alice) groups=1001(alice),1002(ops)
```

Shows UID, primary group, and supplementary groups.

References:

* [https://man7.org/linux/man-pages/man1/id.1.html](https://man7.org/linux/man-pages/man1/id.1.html)

---


