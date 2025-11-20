# Process Signals

Signals notify or control processes for actions such as stop, continue, or terminate.

### Send SIGTERM

Input:

```
kill -TERM 1234
```

### Send SIGKILL

Input:

```
kill -KILL 1234
```

### List available signals

Input:

```
kill -l
```

Output:

```
 1) HUP 2) INT 3) QUIT 4) ILL ...
```

Shows available signal numbers and names.

References:

* [https://man7.org/linux/man-pages/man7/signal.7.html](https://man7.org/linux/man-pages/man7/signal.7.html)

---


