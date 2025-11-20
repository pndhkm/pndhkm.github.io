# DNS

DNS maps hostnames to IP addresses via recursive or iterative queries.

### Test DNS resolution

Input:

```
dig example.com A
```

Output:

```
example.com.  3599 IN A 93.184.216.34
```

Shows the A record for the queried domain.

References:

* [https://man7.org/linux/man-pages/man1/dig.1.html](https://man7.org/linux/man-pages/man1/dig.1.html)

---


