# Subnetting

Subnetting divides IP networks using netmasks to control address ranges and broadcast domains.

### Display interface addresses and masks

Input:

```
ip addr show
```

Output:

```
inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
```

Shows prefix length defining network size.

References:

* [https://man7.org/linux/man-pages/man8/ip-address.8.html](https://man7.org/linux/man-pages/man8/ip-address.8.html)

---


