# Standard Input, Output, and Error

Linux programs use three data streams:

| Stream   | Name            | Description                                           |
| -------- | --------------- | ----------------------------------------------------- |
| `stdin`  | Standard Input  | Input data (usually from keyboard or another command) |
| `stdout` | Standard Output | Normal output of a command                            |
| `stderr` | Standard Error  | Error messages                                        |

Example:

```
ls > files.txt
```

Redirects output (stdout) to `files.txt`.

```
ls /root 2> errors.txt
```

Redirects error messages (stderr) to `errors.txt`.