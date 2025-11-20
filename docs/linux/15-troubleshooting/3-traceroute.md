# Traceroute

`traceroute` maps the path packets take from source to destination, showing each hop’s IP, latency, and potential network issues. It uses ICMP or UDP probes.

Input:

```
traceroute 8.8.8.8
```

Output:

```
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1  0.345 ms  0.289 ms  0.268 ms
 2  10.10.0.1    1.120 ms  1.101 ms  1.089 ms
 3  8.8.8.8     12.300 ms 12.250 ms 12.400 ms
```

Explanation: Identifies network hops and latency, helps detect routing loops or slow segments.

References:

* [https://man7.org/linux/man-pages/man8/traceroute.8.html](https://man7.org/linux/man-pages/man8/traceroute.8.html)

---


