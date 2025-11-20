# Debugging

Debugging helps identify errors in shell scripts.

* **Syntax check:** `bash -n script.sh`
* **Trace execution:** `bash -x script.sh` (shows commands and expansions)
* **Verbose:** `bash -v script.sh` (prints lines as they are read)
* **Set options:**

  * `set -e` exit on error
  * `set -u` exit on undefined variable
  * `set -o pipefail` catch errors in pipelines

Input:

```bash
set -x
name="Pandu"
echo "User: $name"
```

Output:

```
+ name='Pandu'
+ echo 'User: Pandu'
User: Pandu
```

Explanation: `set -x` prints each command before execution, showing variable expansions.

References:

* [https://man7.org/linux/man-pages/man1/bash.1.html](https://man7.org/linux/man-pages/man1/bash.1.html)

