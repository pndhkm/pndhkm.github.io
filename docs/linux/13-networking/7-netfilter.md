# Netfilter

Netfilter handles packet filtering, NAT, and connection tracking via kernel hooks.

### List firewall rules

Input:

```
iptables -L -v -n
```

Output:

```
Chain INPUT (policy ACCEPT)
pkts bytes target prot opt in out source destination
```

Shows configured rules, counters, and default policy.

References:

* [https://man7.org/linux/man-pages/man8/iptables.8.html](https://man7.org/linux/man-pages/man8/iptables.8.html)

---


