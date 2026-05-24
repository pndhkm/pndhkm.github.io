# Web Based Attacks and OWASP Top 10 

Below is OWASP Top 10 in A1, A2, A3 format, with explanations and POSIX examples.

---

### A1: Broken Access Control

* IDOR
* Vertical/horizontal privilege escalation
* Forced browsing
* Parameter tampering

Input:

```
curl https://target/api/user/2?role=admin
```

Output:

```
{"role":"admin"}
```

This confirms access control failure.

---

### A2: Cryptographic Failures


Weak or missing encryption, outdated TLS, plaintext secrets.

Input:

```
curl -I http://target/login
```

Output:

```
HTTP/1.1 200 OK
Set-Cookie: sessionid=abcd; Secure=No; HttpOnly=No
```

This shows insecure cookie handling.

---

### A3: Injection


SQLi, NoSQLi, command injection, LDAP injection.

Input:

```
curl -G "https://target/login" --data-urlencode "user=' OR 1=1 --"
```

Output:

```
Welcome admin
```

Shows SQL injection vulnerability.

---

### A4: Insecure Design


Lack of:

* Threat modeling
* Abuse case handling
* Rate limiting
* Segmentation

This is architectural, not implementation-related.

---

### A5: Security Misconfiguration


Misconfigured:

* Headers
* Services
* CORS
* Admin panels
* Debug modes

Input:

```
curl -I https://target | grep -Ei "Server|X-Powered-By"
```

Output:

```
Server: nginx/1.14.0
X-Powered-By: PHP/5.6
```

Reveals outdated and risky server info.

---

### A6: Vulnerable and Outdated Components


Running:

* Unpatched software
* Deprecated libraries
* Known vulnerable packages

Input:

```
dpkg -l | grep openssl
```

Output:

```
openssl 1.1.1f-1ubuntu2.2
```

This may contain known CVEs.

---

### A7: Identification and Authentication Failures


Weak MFA, credential stuffing, session fixation, poor password reset flows.

Input:

```
curl -XL POST https://target/login -d "user=admin&pass=admin"
```

Output:

```
Welcome admin
```

Default credentials indicate failure.

---

### A8: Software and Data Integrity Failures


Includes:

* CI/CD pipeline trust issues
* Dependency tampering
* Unsigned packages

Input:

```
grep -R "curl http" Dockerfile
```

Output:

```
curl http://random.com/install.sh | bash
```

Unauthenticated code execution = severe integrity failure.

---

### A9: Security Logging and Monitoring Failures


Gaps in:

* Audit trails
* Alerting
* Correlation
* Forensics data retention

Input:

```
ls -l /var/log | grep auth
```

Output:

```
-rw-r--r-- 1 root root 0 auth.log
```

Zero-sized log means logging failure.

---

### A10: Server-Side Request Forgery (SSRF)


Allows attacker to make server-side requests to internal services.

Input:

```
curl "https://target/api?fetch=http://127.0.0.1:22"
```

Output:

```
SSH-2.0-OpenSSH_8.9
```

Confirms SSRF exposing internal services.

---


