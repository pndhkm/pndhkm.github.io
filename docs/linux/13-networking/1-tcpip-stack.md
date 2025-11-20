# TCP/IP Stack

The TCP/IP stack defines layered packet processing from link to application. The kernel handles encapsulation, routing, and connection state.

### Understanding the TCP/IP layers

Input:

```
ss -tuna
```

Output:

```
Netid State Recv-Q Send-Q Local Address:Port Peer Address:Port 
tcp   LISTEN 0      128    0.0.0.0:22      0.0.0.0:*     
```

Shows active TCP/UDP sockets with states and endpoints.

References:

* [https://man7.org/linux/man-pages/man8/ss.8.html](https://man7.org/linux/man-pages/man8/ss.8.html)

---


