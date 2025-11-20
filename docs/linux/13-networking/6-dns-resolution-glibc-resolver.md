# DNS Resolution (glibc resolver)

DNS resolution in Linux uses `/etc/resolv.conf`, NSS modules, and caching resolvers.

### Show resolver configuration

Input:

```
cat /etc/resolv.conf
```

Output:

```
nameserver 1.1.1.1
```

Shows system resolver addresses.

References:

* [https://man7.org/linux/man-pages/man5/resolv.conf.5.html](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

---


