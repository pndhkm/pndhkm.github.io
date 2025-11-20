# IP Routing

Routing determines next hop based on kernel routing tables.

### Show routing table

Input:

```
ip route show
```

Output:

```
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10
```

Shows default gateway and connected routes.

References:

* [https://man7.org/linux/man-pages/man8/ip-route.8.html](https://man7.org/linux/man-pages/man8/ip-route.8.html)

---


