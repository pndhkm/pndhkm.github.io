# Creating, Deleting, Updating Accounts

User accounts are managed through system databases stored in `/etc/passwd`, `/etc/shadow`, and `/etc/group`.

### Creating a User

Input:

```
useradd -m alice
```

This creates user *alice* with a home directory.

References:

* [https://man7.org/linux/man-pages/man8/useradd.8.html](https://man7.org/linux/man-pages/man8/useradd.8.html)

### Setting a Password

Input:

```
passwd alice
```

Prompts for a new password and stores a hashed value in `/etc/shadow`.

References:

* [https://man7.org/linux/man-pages/man1/passwd.1.html](https://man7.org/linux/man-pages/man1/passwd.1.html)

### Modifying User Attributes

Input:

```
usermod -c "Application User" alice
```

Updates gecos/comment field for the user.

References:

* [https://man7.org/linux/man-pages/man8/usermod.8.html](https://man7.org/linux/man-pages/man8/usermod.8.html)

### Deleting a User

Input:

```
userdel -r alice
```

Removes user *alice* and deletes the home directory.

References:

* [https://man7.org/linux/man-pages/man8/userdel.8.html](https://man7.org/linux/man-pages/man8/userdel.8.html)

---


