# Bareos Client

Bareos File Daemon (FD) is the client-side agent responsible for reading files and sending backup data securely to the Bareos Storage Daemon, authenticated by the Director. This guide converts your Ansible logic into pure native Linux commands.

---

## Server Side Preparation

The server prepares TLS material and client definitions before installing the agent.

### Generate Client Private Key and CSR

Input:

```
openssl req -new -nodes -out /etc/bareos/tls/client01.csr -keyout /etc/bareos/tls/client01.key -subj "/CN=client01"
```

This generates a client key and certificate signing request.

### Sign Client Certificate

Input:

```
openssl x509 -req -in /etc/bareos/tls/client01.csr -CA /etc/bareos/tls/ca.crt -CAkey /etc/bareos/tls/ca.key -CAcreateserial -out /etc/bareos/tls/client01.crt -days 3650 -sha256
```

This signs the client certificate using the Bareos CA.

### Create Client Definition on Director

Input:

```
nano /etc/bareos/bareos-dir.d/client/client01.conf
```

```
Client {
  Name = client01
  Address = <ip-address-client>
  Password = "DIRECTOR_PASSWORD"
  TLS Enable = yes
  TLS Require = yes
  TLS Certificate = "/etc/bareos/tls/client01.crt"
  TLS CA Certificate File = "/etc/bareos/tls/ca.crt"
  TLS Key = "/etc/bareos/tls/client01.key"
}
```

This registers the client with the Director.

### Fix Ownership Recursively

Input:

```
chown -R bareos:bareos /etc/bareos
```

### Restart Bareos DIR

Input:

```
systemctl restart bareos-dir
```

---

## Client Side Installation

The client installs Bareos FD, deploys TLS material, and configures authentication.

### Install Prerequisites

Input:

```
apt update && apt install -y gnupg curl
```

This ensures cryptographic and repository tools are present.

### Add Bareos Repository

Input:

```
curl -fsSL https://download.bareos.org/current/Debian_12/add_bareos_repositories.sh | bash
```

This adds the official Bareos package repository.

### Install Bareos File Daemon

Input:

```
apt update && apt install -y bareos-filedaemon
```

This installs the Bareos agent service.

### Create TLS Directory 

Input:

```
mkdir -p /etc/bareos/tls
chown bareos:bareos /etc/bareos/tls
chmod 0750 /etc/bareos/tls
```

This prepares a secure directory for TLS credentials.

### Pull Client Certificate, Private Key, and CA Certificate from Bareos Server

Input:

```
rsync -avz root@bareos-server:/etc/bareos/tls/{client01.crt,client01.key,ca.crt} /etc/bareos/tls/
```

This will pull the client certificate, private key, and CA certificate from bareos server.


### Set Permissions

Input:

```
chmod 0644 /etc/bareos/tls/*.crt
chmod 0600 /etc/bareos/tls/client01.key
```

This enforces secure ownership and access control.

### Configure Client Identity

Input:

```
nano /etc/bareos/bareos-fd.d/client/myself.conf
```

```
Client {
  Name = client01
}
```

This defines the client identity and TLS behavior.

### Configure Director Authentication

Input:

```
nano /etc/bareos/bareos-fd.d/director/bareos-dir.conf
```

```
Director {
  Name = bareos-dir         
  Password = "DIRECTOR_PASSWORD"
  TLS Enable = yes
  TLS Require = yes
  TLS Certificate = "/etc/bareos/tls/client01.crt"
  TLS CA Certificate File = "/etc/bareos/tls/ca.crt"
  TLS Key = "/etc/bareos/tls/client01.key"
}
```

This allows the Director to authenticate securely.

### Fix Ownership Recursively

Input:

```
chown -R bareos:bareos /etc/bareos
```

This ensures Bareos can read all configuration files.

### Restart Bareos File Daemon

Input:

```
systemctl restart bareos-fd
```

This reloads configuration and activates TLS.

### Verify Service Status

Input:

```
systemctl status bareos-fd
```

Output:

```
Active: active (running)
```

This confirms the agent is running correctly.

---

## Test Client Connection from Director

Input:

```
bconsole
```

```
status client=client01
```

Output:

```
You have messages.
*status client=client01   
Connecting to Client client01 at 192.168.1.207:9102
 Handshake: Immediate TLS, Encryption: TLS_CHACHA20_POLY1305_SHA256 TLSv1.3

client01 Version: 25.0.2~pre13.add249aa9 (16 December 2025) Debian GNU/Linux 12 (bookworm)
Daemon started 18-Dec-25 03:20. Jobs: run=0 running=0, Bareos community binary
 Sizeof: boffset_t=8 size_t=8 debug=0 trace=0 bwlimit=0kB/s
```

This validates Director-to-client communication over TLS.

---