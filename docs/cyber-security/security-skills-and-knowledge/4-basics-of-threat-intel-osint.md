# Threat Intelligence and OSINT

Threat intelligence (CTI — Cyber Threat Intelligence) is the process of collecting, analyzing, and operationalizing information about threats to inform security decisions. OSINT (Open Source Intelligence) is the subset of CTI derived from publicly available sources.

---

## The Intelligence Lifecycle

```
1. Planning    → Define intelligence requirements (what do we need to know?)
2. Collection  → Gather raw data from sources (logs, feeds, OSINT)
3. Processing  → Normalize and structure raw data
4. Analysis    → Convert data into actionable intelligence
5. Dissemination → Share with stakeholders (SOC, IR team, management)
6. Feedback    → Evaluate effectiveness, refine collection
```

---

## Types of Threat Intelligence

| Type | Description | Consumers |
| --- | --- | --- |
| **Strategic** | High-level trends, actor motivations, geopolitical context | CISO, management |
| **Operational** | Upcoming campaigns, actor TTPs, attack timelines | IR leads, threat hunters |
| **Tactical** | Specific IOCs: IPs, domains, hashes | SIEM, firewalls, EDR |
| **Technical** | Malware samples, exploits, vulnerability details | Malware analysts, red team |

---

## Indicators of Compromise (IOCs)

IOCs are observable artifacts that indicate a system may have been compromised.

| IOC Type | Example | Confidence |
| --- | --- | --- |
| IP Address | 198.51.100.44 | Low (easily rotated) |
| Domain | evil-c2.example.com | Medium |
| URL | http://evil.com/payload.exe | Medium |
| File Hash (MD5/SHA256) | `d41d8cd98f00b204e9800998ecf8427e` | High |
| Registry Key | `HKCU\Software\Microsoft\Windows\Run` | High |
| Mutex | `Global\{a1b2c3d4}` | High |
| User-Agent | `python-requests/2.28.0` (unusual context) | Low–Medium |
| YARA Rule | Pattern match on binary | High |

### IOC Lookup Workflow

```bash
# Check IP reputation
curl -s "https://www.abuseipdb.com/api/v2/check?ipAddress=198.51.100.44" \
  -H "Key: YOUR_API_KEY" | jq '.data.abuseConfidenceScore'

# Check file hash against VirusTotal
curl -s "https://www.virustotal.com/api/v3/files/SHA256_HASH" \
  -H "x-apikey: YOUR_VT_KEY" | jq '.data.attributes.last_analysis_stats'

# Check domain category
curl -s "https://dns.google/resolve?name=suspicious-domain.com&type=A" | jq '.Answer'
```

---

## OSINT Techniques

### Infrastructure Fingerprinting

**Whois** — identify registrant, ASN, and network range:

```bash
whois 198.51.100.44 | grep -E "OrgName|Country|CIDR|NetRange"
```

Output:
```
CIDR:      198.51.100.0/24
OrgName:   Example Hosting LLC
Country:   RU
NetRange:  198.51.100.0 - 198.51.100.255
```

**ASN Lookup** — identify all IPs owned by the same actor:

```bash
whois -h whois.radb.net -- '-i origin AS12345' | grep route:
```

### Passive DNS

Identify historically associated IPs for a domain (useful for C2 tracking):

```bash
# Using crt.sh for certificate transparency
curl -s "https://crt.sh/?q=%.example.com&output=json" | \
  jq '.[].name_value' | sort -u | grep -v "^\*\."
```

Output:
```
"api.example.com"
"dev.example.com"
"vpn.example.com"
"staging-db.example.com"
```

This reveals hidden subdomains not listed in DNS records — valuable attack surface intelligence.

### Shodan — Exposed Services

Shodan indexes internet-facing services by banner and metadata.

```bash
# Install the CLI
pip install shodan
shodan init YOUR_API_KEY

# Find all nginx servers in an ASN running PHP 5.x (likely vulnerable)
shodan search --fields ip_str,port,org "asn:AS12345 nginx php/5"

# Find exposed Kibana instances
shodan search 'product:"Kibana" country:"ID"'
```

### Certificate Transparency (CT) Logs

CT logs record every TLS certificate issued — exposing subdomains attackers use:

```bash
curl -s "https://crt.sh/?q=example.com&output=json" | \
  jq -r '.[].name_value' | sort -u | \
  grep -v "^\*" | \
  tee subdomains.txt
```

Then resolve them:
```bash
while read sub; do
  host "$sub" 2>/dev/null | grep "has address" && echo "$sub"
done < subdomains.txt
```

---

## Threat Actor Profiling

When investigating an intrusion or threat campaign, build an actor profile:

| Attribute | Questions to Answer |
| --- | --- |
| **Infrastructure** | What IPs/ASNs/hosting providers? Any reuse across campaigns? |
| **TTPs** | What ATT&CK techniques? What tools? |
| **Targets** | What sector, country, technology stack? |
| **Motivation** | Financial, espionage, hacktivism, disruption? |
| **Attribution** | Private group, state-sponsored, known APT? |

### Pivoting on Infrastructure

When you find one IOC, pivot to find related infrastructure:

```bash
# Step 1: Actor uses IP 198.51.100.44 as C2
# Step 2: Whois → ASN AS12345
# Step 3: What other IPs in AS12345 are they using?
whois -h whois.radb.net -- '-i origin AS12345' | grep "^route:" | awk '{print $2}'

# Step 4: Reverse DNS on those IPs
for ip in $(cat as_ips.txt); do
  host "$ip" 2>/dev/null | grep "domain name"
done

# Step 5: Check if those domains share the same registrar / email
whois evil-domain.com | grep -E "Registrant|Registrar|Email"
```

### MITRE ATT&CK Group Mapping

```bash
# Look up known APT groups targeting your sector
# Example: Using the ATT&CK Python library
pip install mitreattack-python
python3 -c "
from mitreattack.stix20 import MitreAttackData
data = MitreAttackData('enterprise-attack.json')
groups = data.get_groups()
for g in groups:
    print(g['name'])
"
```

---

## Threat Feed Integration

| Feed | Type | Use Case |
| --- | --- | --- |
| AlienVault OTX | IP/domain/hash IOCs | SIEM enrichment |
| Abuse.ch (URLhaus, MalwareBazaar) | URLs, malware hashes | Email / endpoint filtering |
| Shodan | Infrastructure scanning | Asset discovery, exposure mapping |
| MITRE ATT&CK | TTP framework | Detection rule mapping |
| CIRCL MISP | Structured threat sharing | Multi-org intelligence sharing |
| GreyNoise | Internet noise classification | Reducing scanner-based FPs |

### Consuming a TAXII Feed

```bash
# Install taxii2-client
pip install taxii2-client

# Fetch IOCs from a MISP TAXII server
python3 -c "
from taxii2client.v21 import Server
server = Server('https://misp.example.com/taxii/', user='user', password='pass')
for api_root in server.api_roots:
    for collection in api_root.collections:
        print(collection.title, collection.id)
"
```

---

## OSINT Toolchain Summary

| Tool | Purpose |
| --- | --- |
| `whois` | Domain / IP registration data |
| `dig` / `host` | DNS resolution and records |
| `shodan` | Internet-wide service scanning |
| `theHarvester` | Email, domain, host enumeration |
| `amass` | Subdomain enumeration |
| `crt.sh` | Certificate transparency subdomain discovery |
| `spiderfoot` | Automated OSINT aggregation |
| `maltego` | Visual link analysis and pivoting |
| `recon-ng` | Modular OSINT framework |

---
