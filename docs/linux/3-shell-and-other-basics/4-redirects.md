# Redirects

Redirection allows input and output of commands to be sent to files instead of the screen.
It is used to save results or read data from a file.

| Symbol | Description                           | Example                    |
| ------ | ------------------------------------- | -------------------------- |
| `>`    | Redirect output to a file (overwrite) | `ls > list.txt`            |
| `>>`   | Append output to a file               | `echo "data" >> notes.txt` |
| `<`    | Read input from a file                | `sort < names.txt`         |
| `2>`   | Redirect errors to a file             | `ls /root 2> error.log`    |

