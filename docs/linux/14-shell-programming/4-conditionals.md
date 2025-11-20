# Conditionals

Conditionals control execution flow based on test results.

* `if-then-else`:

```bash
if [ $age -ge 18 ]; then
  echo "Adult"
else
  echo "Minor"
fi
```

* `test` or `[ ]` evaluate expressions.
* `[[ ]]` offers extended tests (pattern matching, regex).
* `case` matches patterns:

```bash
case $option in
  start) echo "Starting";;
  stop) echo "Stopping";;
  *) echo "Unknown";;
esac
```

Input:

```bash
age=20
if [[ $age -ge 18 ]]; then
  echo "Adult"
else
  echo "Minor"
fi
```

Output:

```
Adult
```

Explanation: `[[ $age -ge 18 ]]` checks numeric comparison.

References:

* [https://man7.org/linux/man-pages/man1/bash.1.html](https://man7.org/linux/man-pages/man1/bash.1.html)

---


