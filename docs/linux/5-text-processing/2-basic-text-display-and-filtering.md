# Basic Text Display and Filtering

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `head file`          | Show first 10 lines                |
| `tail file`          | Show last 10 lines                 |
| `nl file`            | Show file with line numbers        |
| `cat file`           | Display entire file                |
| `cut -d':' -f1 file` | Extract columns (fields)           |
| `grep word file`     | Search for matching lines          |
| `sort file`          | Sort lines alphabetically          |
| `uniq file`          | Remove duplicate lines             |
| `wc file`            | Count lines, words, and characters |

Example:

```
grep error /var/log/syslog
```

Shows all lines containing the word “error”.

```
wc data.txt
```

Output example:

```
10  50  250 data.txt
```

(lines, words, characters)