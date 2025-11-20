# File Permissions

Linux uses permissions to control who can read, write, or execute a file.

| Symbol | Meaning                           |
| ------ | --------------------------------- |
| `r`    | Read (view file content)          |
| `w`    | Write (edit file content)         |
| `x`    | Execute (run as a program/script) |

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `ls -l`           | Show file permissions        |
| `chmod 755 file`  | Change permissions (numbers) |
| `chmod u+x file`  | Give user execute permission |
| `chown user file` | Change file owner            |

Example:

```
ls -l
```

Output:

```
-rw-r--r-- 1 owner group  1000 file.txt
```

```
chmod 644 document.txt
```

## Permission Number Reference

| Permission | Number |
| ---------- | ------ |
| `r--`      | 4      |
| `-w-`      | 2      |
| `--x`      | 1      |

Example:

```
chmod 755 script.sh
```

Means:

* owner: 7 → rwx
* group: 5 → r-x
* others: 5 → r-x