# Introduction to Cyber Security

Cyber security is the discipline of protecting systems, networks, data, and people from unauthorized access, disruption, manipulation, and destruction. It is not a single technology or tool — it is a **mindset**, a **process**, and a **continuous practice**.

> *"Security is a process, not a product."* — Bruce Schneier

---

## The Threat Landscape

Modern threats range from opportunistic script kiddies running automated scanners to nation-state actors conducting multi-year targeted intrusion campaigns. Understanding who attacks and why determines how you defend.

| Threat Actor Category | Motivation | Typical TTPs |
| --- | --- | --- |
| Script Kiddie | Notoriety, curiosity | Known exploits, public tools |
| Cybercriminal | Financial gain | Ransomware, credential theft, fraud |
| Hacktivism | Ideology, political | DDoS, defacement, data leaks |
| Insider Threat | Revenge, profit, negligence | Data exfiltration, privilege abuse |
| Nation-State APT | Espionage, sabotage | Long-dwell intrusions, supply chain |

---

## Core Security Domains

Cyber security spans multiple operational and technical domains. Mastery in any one area requires awareness of all:

| Domain | What It Covers |
| --- | --- |
| Network Security | Perimeter defense, firewall rules, traffic analysis, IDS/IPS |
| Application Security | OWASP risks, secure code review, WAF, SAST/DAST |
| Endpoint Security | EDR, hardening, malware analysis, patch management |
| Identity & Access Management | Authentication, authorization, least privilege, MFA |
| Cloud Security | IAM policies, misconfigurations, container security |
| Incident Response | Detection, containment, eradication, recovery |
| Threat Intelligence | IOC tracking, actor profiling, CTI feeds |
| Forensics | Artifact collection, timeline reconstruction, chain of custody |
| Cryptography | Encryption algorithms, PKI, TLS, key management |
| Red Team / Penetration Testing | Adversary simulation, vulnerability exploitation |

---

## The Attacker Mindset

Defenders who only think defensively are always one step behind. Effective security requires understanding **how attackers think and operate**.

### The Attack Lifecycle (Cyber Kill Chain)

```
Reconnaissance → Weaponization → Delivery → Exploitation
      → Installation → C2 (Command & Control) → Actions on Objectives
```

Each phase has detection opportunities. The goal is to **break the chain as early as possible** — ideally before delivery or exploitation.

### MITRE ATT&CK Framework

The [MITRE ATT&CK](https://attack.mitre.org/) matrix maps real-world adversary behavior into:

- **Tactics** — the *why* (e.g., Persistence, Lateral Movement, Exfiltration)
- **Techniques** — the *how* (e.g., T1053 Scheduled Task, T1078 Valid Accounts)
- **Sub-techniques** — specific implementation variants

Example — detecting persistence via cron:

```bash
# Look for cron jobs added by non-root users recently
find /var/spool/cron/crontabs/ -newer /etc/passwd -ls
```

```bash
# Cross-check systemd timers for unknown units
systemctl list-timers --all | grep -v "ACTIVATES"
```

---

## The Defensive Philosophy

### Defense in Depth

No single control is sufficient. Security is built in **layers**:

```
[Internet]
    ↓
[Firewall / WAF]
    ↓
[IDS / IPS]
    ↓
[DMZ / Segmentation]
    ↓
[Application Layer Controls]
    ↓
[Host Hardening + EDR]
    ↓
[Data Encryption at Rest]
```

If any layer fails, the next one limits blast radius.

### Zero Trust Architecture

> *"Never trust, always verify."*

Zero Trust assumes **breach by default**. Every access request — even internal — must be authenticated, authorized, and continuously validated.

Key principles:
- Verify explicitly (identity + device + context)
- Use least privilege access
- Assume breach and minimize blast radius

### The Principle of Least Privilege (PoLP)

Users, services, and processes should have **only the permissions required** for their function, nothing more.

```bash
# Check for over-permissioned sudo rules
sudo -l -U username
```

```bash
# Find world-writable directories (potential privilege escalation vectors)
find / -type d -perm -0002 -not -path "/proc/*" 2>/dev/null
```

---

## Key Concepts Quick Reference

| Concept | Definition |
| --- | --- |
| Vulnerability | A weakness that can be exploited |
| Exploit | Code or technique that leverages a vulnerability |
| Payload | What executes after successful exploitation |
| IOC | Indicator of Compromise — observable artifact of an attack |
| TTP | Tactics, Techniques, and Procedures — attacker behavior patterns |
| CVE | Common Vulnerabilities and Exposures — public vulnerability identifier |
| CVSS | Common Vulnerability Scoring System — severity rating 0–10 |
| Zero-Day | Vulnerability with no public patch |
| APT | Advanced Persistent Threat — long-duration targeted intrusion |
| Lateral Movement | Moving through a network after initial access |
| Persistence | Mechanisms to survive reboot or user logout |
| Exfiltration | Unauthorized transfer of data out of a network |

---

## How to Use These Docs

This documentation is structured around real operational scenarios. Each section builds practical skills:

- **Security Skills and Knowledge** — Foundational concepts every security practitioner needs
- **Network Security** — Perimeter analysis, firewall engineering, traffic inspection
- **Exploitation** — Understanding attack techniques from the attacker's perspective
- **Hardening** — Concrete checklists to reduce attack surface
- **Incident Response** — Step-by-step playbooks when something goes wrong

> The best defenders have spent time thinking like attackers. Use the exploitation section to understand *what you are defending against*.

---
