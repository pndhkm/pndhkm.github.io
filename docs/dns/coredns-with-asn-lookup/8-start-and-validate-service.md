# Start and Validate Service

#### Reload systemd

Input:

```
systemctl daemon-reload
```

#### Enable and start CoreDNS

Input:

```
systemctl enable --now coredns
```

#### Check runtime status

Input:

```
systemctl status coredns
```

Output:

```
Active: active (running)
```

Indicates CoreDNS is now managed by systemd.

---

