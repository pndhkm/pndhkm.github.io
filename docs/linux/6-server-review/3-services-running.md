# Services Running

Verify whether essential services are active and operating normally.

Input:

```
systemctl --type=service --state=running
```

Output:

```
sshd.service          loaded active running OpenBSD Secure Shell server
cron.service          loaded active running Regular background program processing daemon
systemd-logind.service loaded active running Login Service
```

Lists all running services under systemd.

References:

* [https://man7.org/linux/man-pages/man1/systemctl.1.html](https://man7.org/linux/man-pages/man1/systemctl.1.html)

---

Input:

```
ss -tulpn
```

Output:

```
tcp LISTEN 0 128 0.0.0.0:22 0.0.0.0:* users:(("sshd",pid=811,fd=3))
udp LISTEN 0 128 0.0.0.0:123 0.0.0.0:* users:(("ntpd",pid=512,fd=4))
```

Shows active listening sockets and associated services.

References:

* [https://man7.org/linux/man-pages/man8/ss.8.html](https://man7.org/linux/man-pages/man8/ss.8.html)

---


