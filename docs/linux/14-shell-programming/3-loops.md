# Loops

Loops allow repeated execution of commands.

| Loop Type | Syntax Example                                                     | Notes                         |
| --------- | ------------------------------------------------------------------ | ----------------------------- |
| `for`     | `for i in 1 2 3; do echo $i; done`                                 | Iterates over a list          |
| `while`   | `while [ $count -lt 5 ]; do echo $count; count=$((count+1)); done` | Executes while condition true |
| `until`   | `until [ $count -ge 5 ]; do echo $count; count=$((count+1)); done` | Executes until condition true |

Input:

```bash
count=1
while [ $count -le 3 ]; do
  echo "Count: $count"
  count=$((count+1))
done
```

Output:

```
Count: 1
Count: 2
Count: 3
```

Explanation: Loops increment `count` and stop when the condition fails.

References:

* [https://man7.org/linux/man-pages/man1/bash.1.html](https://man7.org/linux/man-pages/man1/bash.1.html)

---


