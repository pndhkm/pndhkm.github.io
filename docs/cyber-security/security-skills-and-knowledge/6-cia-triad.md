# The CIA Triad

The CIA Triad is the foundational framework of information security. Every security control, policy, and risk decision maps to one or more of its three pillars: **Confidentiality**, **Integrity**, and **Availability**.

---

## Overview

| Pillar | Core Question | Threat | Example Control |
| --- | --- | --- | --- |
| **Confidentiality** | Is data accessible only to authorized parties? | Data breach, eavesdropping | Encryption, access control, MFA |
| **Integrity** | Is data accurate and unmodified? | Tampering, corruption | Checksums, digital signatures, AIDE |
| **Availability** | Is data/service accessible when needed? | DDoS, ransomware, hardware failure | Redundancy, backups, rate limiting |

---

## Confidentiality

Confidentiality ensures that sensitive information is only accessible to **authorized users and systems**.

### Enforcement Mechanisms

**Encryption at rest:**
```bash
# Encrypt a file using AES-256
openssl enc -aes-256-cbc -pbkdf2 -in sensitive.txt -out sensitive.enc

# Decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -in sensitive.enc -out sensitive.txt
```

**Encryption in transit (TLS verification):**
```bash
# Verify TLS is enforced — should redirect HTTP → HTTPS
curl -sI http://target.com | grep -i "location\|strict-transport"
```

**Mandatory Access Control (MAC):**
```bash
# Check AppArmor enforcement status
aa-status | grep -E "profiles.*enforce|processes.*confined"

# Check SELinux enforcement
getenforce   # returns: Enforcing / Permissive / Disabled
```

**Filesystem permissions (least privilege):**
```bash
# Find world-readable sensitive files
find /etc -type f -perm -o+r 2>/dev/null | grep -E "shadow|passwd|ssl/private"

# Find files readable by non-owners
find /var/www -type f -perm /o+r -not -name "*.html" -not -name "*.css"
```

### Confidentiality Violations

| Scenario | Violation |
| --- | --- |
| Database with no encryption at rest | Attacker exfiltrates plaintext PII |
| HTTP API transmitting tokens | Network eavesdropper steals session tokens |
| World-readable `/etc/shadow` | Any local user cracks password hashes |
| Over-permissive S3 bucket | Public internet reads private files |

---

## Integrity

Integrity ensures data has **not been modified** without authorization — accidentally or maliciously.

### File Integrity Monitoring (AIDE)

AIDE (Advanced Intrusion Detection Environment) creates a baseline of filesystem state and alerts on changes.

```bash
# Initialize baseline database
aide --init
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Run check against baseline
aide --check
```

Output when tampering detected:
```
AIDE found differences between database and filesystem!!

Changed files:
f = ...Mc.. /usr/bin/ls
```

The `M` indicates the file was modified — `ls` has been trojanized.

### Immutable Log Protection

```bash
# Make auth.log append-only — cannot be modified or deleted, only appended
chattr +a /var/log/auth.log

# Verify
lsattr /var/log/auth.log
# Output: -----a--------e-- /var/log/auth.log
```

### Checksum Verification

```bash
# Compute SHA-256 of critical binaries
sha256sum /usr/bin/sudo /usr/bin/ssh /usr/sbin/sshd > /root/critical_bin_hashes.txt

# Periodic verification
sha256sum --check /root/critical_bin_hashes.txt
```

Output:
```
/usr/bin/sudo: OK
/usr/bin/ssh: OK
/usr/sbin/sshd: FAILED
```

`sshd` hash mismatch — binary may have been replaced by an attacker.

### Digital Signatures

```bash
# Sign a file
gpg --armor --sign --detach-sig release.tar.gz

# Verify signature
gpg --verify release.tar.gz.asc release.tar.gz
```

### Integrity Violations

| Scenario | Impact |
| --- | --- |
| Trojanized system binary | Attacker maintains persistence and hides activity |
| Unsigned software packages | Supply chain compromise |
| SQL injection tampering DB records | Financial fraud, data manipulation |
| Ransomware encrypting files | Complete data destruction |

---

## Availability

Availability ensures systems and data are **accessible when needed** by authorized users.

### Redundancy and High Availability

```bash
# Check load balancer health (nginx upstream)
nginx -T | grep upstream -A5

# Verify service is running with automatic restart
systemctl status nginx | grep -E "Active|Restart"

# Set automatic restart policy
# In /etc/systemd/system/myapp.service:
# [Service]
# Restart=always
# RestartSec=5
```

### DDoS Detection and Rate Limiting

```bash
# Identify traffic flood — top source IPs by connection count
ss -tn | awk 'NR>1 {print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20
```

```bash
# Rate limit with iptables — max 20 new connections/second per IP
iptables -A INPUT -p tcp --dport 80 \
  -m state --state NEW \
  -m limit --limit 20/s --limit-burst 50 \
  -j ACCEPT
iptables -A INPUT -p tcp --dport 80 \
  -m state --state NEW \
  -j DROP
```

### Backup Integrity (3-2-1 Rule)

```
3 copies of data
2 on different media types (disk + tape, or disk + cloud)
1 offsite
```

```bash
# Verify backup integrity
rsync --checksum -av /data/ /backup/data/ --dry-run

# Test restore (critical — untested backups are not backups)
tar -xzf /backup/app-backup.tar.gz -C /tmp/restore_test/
diff -r /data/ /tmp/restore_test/data/
```

### Availability Violations

| Scenario | Impact |
| --- | --- |
| Volumetric DDoS | Service unreachable for users |
| Ransomware | All files encrypted, operations halted |
| Single point of failure (no redundancy) | One hardware failure takes down the system |
| Misconfigured cron deletes logs | Ops team loses forensic capability |

---

## Threat Modeling Against the CIA Triad

Use the triad to evaluate any threat scenario:

| Threat | C | I | A |
| --- | --- | --- | --- |
| Ransomware | ✅ (encrypted by attacker) | ✅ (files corrupted) | ✅ (files inaccessible) |
| SQL injection data dump | ✅ (PII leaked) | ✅ (data possibly modified) | ❌ |
| DDoS | ❌ | ❌ | ✅ (service unavailable) |
| MITM credential theft | ✅ (credentials stolen) | ✅ (session hijacked) | ❌ |
| Insider data exfiltration | ✅ (data stolen) | ❌ | ❌ |

---

## Standards Mapping

| Standard | CIA Alignment |
| --- | --- |
| ISO/IEC 27001 | Entire framework maps to CIA controls |
| NIST SP 800-53 | Confidentiality (AC/SC), Integrity (SI), Availability (CP/IR) |
| PCI DSS | Heavy confidentiality focus (cardholder data protection) |
| HIPAA | Confidentiality + Integrity of PHI |
| GDPR | Confidentiality (personal data protection) |

---
