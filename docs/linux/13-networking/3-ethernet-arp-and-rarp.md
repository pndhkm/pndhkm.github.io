# Ethernet, ARP, and RARP

Ethernet operates at Layer 2 carrying frames. ARP resolves IPv4 addresses to MAC addresses. RARP is obsolete.

### Inspect ARP neighbor table

Input:

```
ip neigh
```

Output:

```
192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE
```

Shows L2 address resolution for IPv4 peers.

References:

* [https://man7.org/linux/man-pages/man8/ip-neighbour.8.html](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)

---


