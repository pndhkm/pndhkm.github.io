
# Archiving and Compressing

Archives combine many files into one.
Compression reduces file size.

| Command                            | Description                |
| ---------------------------------- | -------------------------- |
| `tar -cvf archive.tar folder/`     | Create archive             |
| `tar -xvf archive.tar`             | Extract archive            |
| `tar -czvf archive.tar.gz folder/` | Create compressed archive  |
| `tar -xzvf archive.tar.gz`         | Extract compressed archive |
| `gzip file`                        | Compress a single file     |
| `gunzip file.gz`                   | Decompress file            |

Example:

```
tar -czvf backup.tar.gz /home/user/data/
```
