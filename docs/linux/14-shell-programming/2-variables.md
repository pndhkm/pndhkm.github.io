# Variables

Variables store data that scripts can reference and manipulate.

* Declaration: `var=value`
* Access: `$var` or `${var}`
* Types: Strings, integers, arrays
* Read-only: `readonly var`
* Environment export: `export var`

Input:

```bash
name="Pandu"
echo "User: $name"
readonly name
```

Output:

```
User: Pandu
```

Explanation: `name` is a string variable; `readonly` prevents reassignment.

References:

* [https://man7.org/linux/man-pages/man1/bash.1.html](https://man7.org/linux/man-pages/man1/bash.1.html)

---


