# Authentication Logs

Authentication logs reveal login attempts, brute-force activity, and session audits.

Input:

```
grep "Failed password" /var/log/auth.log | tail
```

Output:

```
Nov 18 13:48 server sshd[2331]: Failed password for root from 203.0.113.10 port 54022 ssh2
```

Shows recent failed SSH login attempts.

References:

* [https://man7.org/linux/man-pages/man1/grep.1.html](https://man7.org/linux/man-pages/man1/grep.1.html)
* [https://man7.org/linux/man-pages/man8/sshd.8.html](https://man7.org/linux/man-pages/man8/sshd.8.html)

---

Input:

```
last -n 5
```

Output:

```
pandu    pts/0        198.51.100.55    Tue Nov 18 11:05   still logged in
root     pts/1        203.0.113.44     Mon Nov 17 22:11 - 22:20  (00:09)
```

Shows recent successful logins.

References:

* [https://man7.org/linux/man-pages/man1/last.1.html](https://man7.org/linux/man-pages/man1/last.1.html)

---


