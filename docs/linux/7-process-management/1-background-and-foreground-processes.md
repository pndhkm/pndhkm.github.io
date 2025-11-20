# Background and Foreground Processes

Foreground processes occupy the terminal and block input until completion. Background processes run detached, allowing continued shell use.

### Start a process in background

Input:

```
sleep 60 &
```

### Move running job to background

Input:

```
bg %1
```

### Bring job to foreground

Input:

```
fg %1
```

References:

* [https://man7.org/linux/man-pages/man1/bash.1.html](https://man7.org/linux/man-pages/man1/bash.1.html)
* [https://man7.org/linux/man-pages/man3/exec.3.html](https://man7.org/linux/man-pages/man3/exec.3.html)

---


