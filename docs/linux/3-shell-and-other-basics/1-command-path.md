# Command Path

Every Linux command is stored in a specific directory.
The system searches these directories (listed in the `$PATH` variable) to find and execute a command.

| Command         | Description                                     |
| --------------- | ----------------------------------------------- |
| `which command` | Show the full path of a command                 |
| `echo $PATH`    | Display directories where commands are searched |

Example:

```
which ls
```

Output:

```
/usr/bin/ls
```
