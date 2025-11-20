# Soft Links or Hard Links

Links allow multiple filenames to point to the same data.

| Type                      | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| Soft Link (Symbolic Link) | Shortcut to another file; can point to directories; breaks if target removed |
| Hard Link                 | Exact reference to file data; only for files on same filesystem              |

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `ln -s target linkname` | Create soft link                          |
| `ln target linkname`    | Create hard link                          |
| `ls -l`                 | Identify links (soft links show → target) |

Example:

```
ln -s /var/log logs
```

This creates a shortcut named `logs`.
