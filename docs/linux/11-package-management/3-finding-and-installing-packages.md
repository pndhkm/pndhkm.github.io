# Finding and Installing Packages

APT uses indexed metadata to search for available packages.

### Search for a package

Input:

```
apt search nginx
```

Output:

```
nginx/jammy-updates,jammy-security 1.18.0-6ubuntu14.4 amd64
  small, powerful, scalable web/proxy server
```

This shows matching package names and descriptions.

### Install a package

Input:

```
sudo apt install nginx
```

References:

* [https://man7.org/linux/man-pages/man8/apt.8.html](https://man7.org/linux/man-pages/man8/apt.8.html)

---


