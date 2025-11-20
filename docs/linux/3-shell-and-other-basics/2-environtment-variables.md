# Environment Variables

Environment variables store system and user information used by the shell.
They define settings like user name, home directory, and paths.

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `printenv`         | Show all environment variables |
| `echo $USER`       | Display the current user       |
| `echo $HOME`       | Show the home directory path   |
| `export VAR=value` | Create or change a variable    |

Example:

```
export EDITOR=nano
echo $EDITOR
```

Output:

```
nano
```
