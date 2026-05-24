# Privilege Escalation

Privilege escalation is the process of gaining higher privileges (usually root) from a lower-privileged user by abusing system mechanisms.

It commonly involves:

* SUID exploitation
* Capability abuse
* Writable services
* PATH hijacking
* LD_PRELOAD injection
* Kernel vulnerabilities
* Weak file permissions

### Capability Abuse (UID Escalation)

Linux capabilities split root privileges into fine-grained permissions.
Only specific capabilities can change user identity.

| Capability    | Can escalate UID |
| ------------- | ---------------- |
| `cap_setuid`  | Yes              |
| `cap_setgid`  | Partial          |
| `cap_net_raw` | No               |

#### Check for UID-changing capabilities

Input:

```
getcap -r / 2>/dev/null | grep cap_setuid
```

No output means:

* No binary can call `setuid(0)`
* Capability-based UID escalation is **not possible**

#### Actual capability state on this system

Input:

```
getcap -r /
```

Output:

```
/usr/bin/ping cap_net_raw=ep
```

`cap_net_raw` only allows raw sockets (ICMP).
It **cannot change UID** and **cannot escalate to root**.

#### Example (when capability escalation exists)

Input:

```
getcap -r / 2>/dev/null | grep cap_setuid
```

Output:

```
/usr/local/bin/debug-tool cap_setuid+ep
```

This binary can escalate privileges **without SUID** because it is allowed to change UID.

### SUID Exploitation

SUID binaries execute with the file owner’s UID (usually root).

#### Enumerate SUID binaries

Input:

```
find / -type f -perm -4000 2>/dev/null
```

Output:

```
/usr/lib/polkit-1/polkit-agent-helper-1
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/su
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/umount
...
```

These are **expected system SUID binaries** and represent the **primary escalation surface**.

#### Example (high-risk SUID case)

Input:

```
find / -type f -perm -4000 2>/dev/null
```

Output:

```
/usr/local/bin/custom-suid
```

Custom SUID binaries are **high-risk** and commonly lead to privilege escalation.

### Final Assessment

| Vector                          | Status                                       |
| ------------------------------- | -------------------------------------------- |
| Capability-based UID escalation | Not possible                                 |
| `cap_setuid` present            | No                                           |
| Other capabilities              | `cap_net_raw` only (low risk)                |
| SUID exploitation               | Possible and relevant                        |
| Primary escalation focus        | SUID misuse, sudo/polkit config, kernel bugs |

This system is configured to **avoid capability-based UID escalation** and relies on **controlled SUID binaries** for privilege elevation.

---