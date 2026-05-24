# Understanding Network Handshakes

Network handshakes are the negotiation sequences that establish secure and reliable connections. Understanding them is essential for detecting MITM attacks, downgrade attacks, certificate abuse, and weak cipher negotiation.

---

## TCP Three-Way Handshake

Before any application data flows, TCP establishes a connection through a three-way handshake:

```
Client                       Server
  |                             |
  |------- SYN (seq=1000) ----->|   Client initiates connection
  |                             |
  |<-- SYN-ACK (seq=2000) ------|   Server acknowledges, sends its seq
  |      (ack=1001)             |
  |                             |
  |------- ACK (ack=2001) ----->|   Client acknowledges server's seq
  |                             |
  |===== Connection Open ========|
```

### Observing the Handshake

```bash
# Capture TCP handshake for a connection to port 443
tcpdump -i eth0 -n "host target.com and tcp[tcpflags] & (tcp-syn|tcp-ack) != 0" -c 10
```

Output:
```
14:00:01 IP 10.0.0.5.52341 > 93.184.216.34.443: Flags [S]  (SYN)
14:00:01 IP 93.184.216.34.443 > 10.0.0.5.52341: Flags [S.] (SYN-ACK)
14:00:01 IP 10.0.0.5.52341 > 93.184.216.34.443: Flags [.]  (ACK)
```

### SYN Flood Attack (TCP Handshake Abuse)

An attacker sends SYN packets without completing the handshake — exhausting server connection tables:

```bash
# Detecting SYN flood in traffic
tcpdump -i eth0 -n "tcp[tcpflags] == tcp-syn" | \
  awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head -10
```

If a single IP has thousands of SYNs with no corresponding ACK — it's a SYN flood.

---

## TLS Handshake (TLS 1.3)

TLS 1.3 is the modern standard. The handshake is significantly faster than TLS 1.2 (1-RTT instead of 2-RTT).

### TLS 1.3 Handshake Flow

```
Client                                Server
  |                                      |
  |------- ClientHello ----------------->|
  |   (TLS version, cipher suites,       |
  |    client random, key_share)         |
  |                                      |
  |<------ ServerHello ------------------|
  |   (chosen cipher, server random,     |
  |    key_share, certificate,           |
  |    CertificateVerify, Finished)      |
  |                                      |
  |------- Finished -------------------->|
  |                                      |
  |===== Encrypted Channel Open =========|
```

**Key difference from TLS 1.2:** Server sends certificate and Finished in one flight — reducing latency. Also, forward secrecy is mandatory.

### Inspecting a TLS Handshake

```bash
# Full TLS handshake analysis
openssl s_client -connect target.com:443 -tls1_3 2>&1 | head -40
```

Output to inspect:
```
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: (empty in TLS 1.3 session resumption uses PSK)
    Verify return code: 0 (ok)
```

```bash
# Force TLS 1.2 — check if server still accepts it (downgrade risk)
openssl s_client -connect target.com:443 -tls1_2 2>&1 | grep -E "Protocol|Cipher"
```

If the server accepts TLS 1.2 — it's still present. Check whether weak ciphers are offered:

```bash
# Check for weak ciphers (CBC, RC4, EXPORT, DES)
openssl s_client -connect target.com:443 -cipher "RC4:DES:EXPORT" 2>&1 | \
  grep -E "Cipher|alert|error"
```

---

## Certificate Chain Validation

A TLS certificate is only trustworthy if the entire chain validates to a trusted root CA.

### Certificate Chain Structure

```
[Root CA] — self-signed, in browser/OS trust store
    ↓ signs
[Intermediate CA]
    ↓ signs
[Leaf Certificate] — presented by the server
```

### Inspecting the Certificate Chain

```bash
# Full certificate chain inspection
openssl s_client -connect target.com:443 -showcerts 2>/dev/null | \
  openssl x509 -noout -text | grep -E "Subject:|Issuer:|Not After"
```

Output:
```
Subject: CN=target.com
Issuer:  CN=R3, O=Let's Encrypt
Not After: Jun 30 12:00:00 2026 GMT
```

```bash
# Verify the certificate chain manually
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt \
  -untrusted intermediate.pem leaf.pem
```

### Certificate Transparency Monitoring

Detect fraudulently issued certificates for your domain:

```bash
# Check for certificates issued for your domain (including possible phishing certs)
curl -s "https://crt.sh/?q=%.yourdomain.com&output=json" | \
  jq -r '.[] | "\(.not_before) | \(.name_value) | \(.issuer_name)"' | \
  sort | tail -20
```

Alert if you see certificates you did not issue yourself.

---

## MITM Detection

A Man-in-the-Middle attack intercepts the TLS handshake. Indicators include:

### Certificate Mismatch

```bash
# Compare certificate fingerprint to known-good
openssl s_client -connect target.com:443 2>/dev/null | \
  openssl x509 -fingerprint -noout -sha256
```

Output:
```
SHA256 Fingerprint=AA:BB:CC:DD:...
```

If the fingerprint changes unexpectedly — something intercepted the connection.

### Cipher Downgrade Detection

```bash
# Script to check which TLS versions a server accepts
for ver in tls1 tls1_1 tls1_2 tls1_3; do
  result=$(openssl s_client -connect target.com:443 -$ver 2>&1 | grep "Protocol")
  echo "$ver: $result"
done
```

Output:
```
tls1:   handshake failure    (good — TLS 1.0 rejected)
tls1_1: handshake failure    (good — TLS 1.1 rejected)
tls1_2: Protocol: TLSv1.2   (acceptable)
tls1_3: Protocol: TLSv1.3   (preferred)
```

---

## Cipher Suite Breakdown

A cipher suite defines all cryptographic algorithms used in a TLS session:

```
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  │      │     │         │        │
  │      │     │         │        └── HMAC algorithm (SHA-384)
  │      │     │         └─────────── Symmetric cipher + mode (AES-256-GCM)
  │      │     └───────────────────── Key exchange (RSA authentication)
  │      └─────────────────────────── Key establishment (ECDHE — provides PFS)
  └────────────────────────────────── Protocol
```

### PFS — Perfect Forward Secrecy

`ECDHE` (Ephemeral Diffie-Hellman) means each session generates a unique key. If the server's private key is compromised later, **past sessions cannot be decrypted**. This is why PFS is critical.

### Recommended Cipher Suites (TLS 1.3)

```
TLS_AES_256_GCM_SHA384      ← preferred
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
```

### Weak Ciphers to Reject

```bash
# nginx: disable weak ciphers
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK';
ssl_prefer_server_ciphers on;
```

---

## SSH Handshake

SSH also performs a cryptographic handshake before establishing a session.

```bash
# Inspect SSH server's supported host key algorithms and ciphers
ssh -vvv user@target.com 2>&1 | grep -E "kex|cipher|mac|host key"
```

Output:
```
debug2: peer server KEXINIT proposal
debug2: KEX algorithms: curve25519-sha256,diffie-hellman-group14-sha256
debug2: host key algorithms: ecdsa-sha2-nistp256,ssh-ed25519
debug2: ciphers ctos: aes256-ctr,aes256-gcm@openssh.com
```

Weak signals: `diffie-hellman-group1` (1024-bit DH), `arcfour`, `3des-cbc` — these should not appear.

---
