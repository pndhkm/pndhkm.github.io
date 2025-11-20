# Packet Analysis

Packet analysis inspects raw network traffic to diagnose complex network issues, detect anomalies, or debug protocols. Tools include `tcpdump` and `wireshark`.

Input:

```
tcpdump -i eth0 -c 10 icmp
```

Output:

```
14:21:10.123456 IP 192.168.1.100 > 8.8.8.8: ICMP echo request, id 12345, seq 1, length 64
14:21:10.135678 IP 8.8.8.8 > 192.168.1.100: ICMP echo reply, id 12345, seq 1, length 64
```

Explanation: Captures 10 ICMP packets on `eth0` to analyze network requests and responses.

References:

* [https://man7.org/linux/man-pages/man8/tcpdump.8.html](https://man7.org/linux/man-pages/man8/tcpdump.8.html)
* [https://www.wireshark.org/docs/man-pages/](https://www.wireshark.org/docs/man-pages/)

---
