# ICMP (Internet Control Message Protocol)

ICMP is used for error reporting and diagnostics in IP networks. It communicates network issues such as unreachable hosts, TTL expiry, or congestion.

* Type examples:

  * `Echo Request (8)` / `Echo Reply (0)` – used by `ping`.
  * `Destination Unreachable (3)` – host or port unreachable.
  * `Time Exceeded (11)` – TTL expired (used by traceroute).

Input:

```
ping -c 4 8.8.8.8
```

Output:

```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=12.2 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=12.4 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 12.123/12.250/12.400/0.123 ms
```

Explanation: Verifies IP reachability and measures latency and packet loss.

References:

* [https://man7.org/linux/man-pages/man8/ping.8.html](https://man7.org/linux/man-pages/man8/ping.8.html)
* [https://man7.org/linux/man-pages/man7/icmp.7.html](https://man7.org/linux/man-pages/man7/icmp.7.html)

---


