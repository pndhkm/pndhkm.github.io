# Netstat

`netstat` monitors network connections, listening ports, routing tables, and interface statistics. Deprecated on some systems in favor of `ss`.

Input:

```
netstat -tulnp
```

Output:

```
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd
udp        0      0 0.0.0.0:68              0.0.0.0:*                           567/dhclient
```

Explanation: Shows listening TCP/UDP ports, associated processes, and connection states.

References:

* [https://man7.org/linux/man-pages/man8/netstat.8.html](https://man7.org/linux/man-pages/man8/netstat.8.html)

---


