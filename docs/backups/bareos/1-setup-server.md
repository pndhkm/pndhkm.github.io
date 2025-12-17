# Bareos Server

:::info Tested With Debian 12
:::

---

## Package Installation and System Preparation

Install required base packages using APT.

Input:

```
apt update && apt upgrade -y && apt install -y wget openssl ca-certificates gnupg lsb-release
```

This installs tools required for repository setup and TLS generation.

---

## TLS Setup

### TLS Directory Setup

Create a directory to store BareOS TLS keys and certificates.

Input:

```
install -d -m 0755 /etc/bareos/tls
```

This creates the TLS directory with safe default permissions.

### TLS CA Generation

Create a self-signed Certificate Authority for BareOS components.

Input:

```
openssl req -new -x509 -days 3650 -nodes \
  -out /etc/bareos/tls/ca.crt \
  -keyout /etc/bareos/tls/ca.key \
  -subj "/CN=BareOS CA"
```

This generates a long-lived CA certificate and private key.

### Director Certificate

Generate Director private key and certificate signing request.

Input:

```
openssl req -new -nodes \
  -out /etc/bareos/tls/director.csr \
  -keyout /etc/bareos/tls/director.key \
  -subj "/CN=bareos-dir"
```

Sign the Director certificate with the CA.

Input:

```
openssl x509 -req -days 3650 \
  -in /etc/bareos/tls/director.csr \
  -CA /etc/bareos/tls/ca.crt \
  -CAkey /etc/bareos/tls/ca.key \
  -CAcreateserial \
  -out /etc/bareos/tls/director.crt
```

This creates a trusted Director TLS certificate.

### Storage Daemon Certificate

Generate Storage Daemon key and CSR.

Input:

```
openssl req -new -nodes \
  -out /etc/bareos/tls/storage.csr \
  -keyout /etc/bareos/tls/storage.key \
  -subj "/CN=bareos-sd"
```

Sign the Storage Daemon certificate.

Input:

```
openssl x509 -req -days 3650 \
  -in /etc/bareos/tls/storage.csr \
  -CA /etc/bareos/tls/ca.crt \
  -CAkey /etc/bareos/tls/ca.key \
  -CAcreateserial \
  -out /etc/bareos/tls/storage.crt
```

### TLS Key Permissions

Restrict private key access.

Input:

```
chmod 600 /etc/bareos/tls/*.key
```

This prevents non-privileged access to TLS private keys.

### BareOS Repository Setup 

Add the BareOS APT repository for Debian.

Input:

```
wget -qO- https://download.bareos.org/current/Debian_12/add_bareos_repositories.sh | bash
```

This installs the BareOS APT repository and signing keys.

---

## System Upgrade

Update all system packages.

Input:

```
apt update && apt upgrade -y
```

This ensures compatibility with BareOS packages.

---

## Setup Bareos

### PostgreSQL Installation and Initialization

Install PostgreSQL server and client.

Input:

```
apt install -y postgresql postgresql-client
```

Enable and start PostgreSQL.

Input:

```
systemctl enable --now postgresql
```

This ensures PostgreSQL is running for the BareOS catalog.

Define PostgreSQL for cataolog on `/etc/bareos/bareos-dir.d/catalog/MyCatalog.conf`

```
Catalog {
  Name = MyCatalog
  dbname = "bareos"
  dbuser = "bareos"
  dbpassword = "STRONGPASSWORD"
}

```

### BareOS Package Installation

Install BareOS Director, Storage Daemon, and File Daemon.

Input:

```
apt install -y bareos bareos-database-postgresql bareos-storage bareos-filedaemon
```

This installs all core BareOS services.

Forces password auth for all socket users on `pg_hba.conf`

Replace `peer` with  `scram-sha-256`:

Before:

```
local   all   all   peer
```

After:

```
local   all   all   scram-sha-256
```

Reload postgresql

```
systemctl reload postgresql
```

### BareOS Database Creation

Create the BareOS PostgreSQL database when database not exist.

Input:

```
su - postgres -c "/usr/lib/bareos/scripts/create_bareos_database"
```

This initializes the BareOS catalog database.

### BareOS Tables Creation

Create BareOS schema tables.

Input:

```
su - postgres /usr/lib/bareos/scripts/make_bareos_tables
```

This populates required catalog tables.

### Grant BareOS Database Privileges

Grant database permissions to the BareOS user.

Input:

```
su - postgres /usr/lib/bareos/scripts/grant_bareos_privileges
```

This allows BareOS daemons to access the catalog.

Change password for bareos user

Input:
```
su - postgres -c "psql -c \"ALTER USER bareos WITH PASSWORD 'STRONGPASSWORD';\""
```

### Configuration for File Daemon

Edit the File Daemon Director config and paste values manually.

Input:

```
nano /etc/bareos/bareos-fd.d/director/bareos-dir.conf
```

Manual content:

```
Director {
  Name = bareos-dir
  Password = "<get-me>"
  TLS Enable = yes
  TLS Require = yes
  TLS Certificate = "/etc/bareos/tls/director.crt"
  TLS CA Certificate File = "/etc/bareos/tls/ca.crt"
  TLS Key = "/etc/bareos/tls/director.key"
}
```

This allows the Director to authenticate to the File Daemon using TLS.

### Configuration for Storage Daemon

Edit the Storage Daemon Director config.

Input:

```
nano /etc/bareos/bareos-sd.d/director/bareos-dir.conf
```

Manual content:

```
Director {
  Name = bareos-dir
  Password = "<get-me>"
  TLS Enable = yes
  TLS Require = yes
  TLS Certificate = "/etc/bareos/tls/director.crt"
  TLS CA Certificate File = "/etc/bareos/tls/ca.crt"
  TLS Key = "/etc/bareos/tls/director.key"
}
```

This ensures the Storage Daemon trusts and authenticates the Director.

### Ownership and Permissions

Ensure correct ownership after manual edits.

Input:

```
chown bareos:bareos \
  /etc/bareos/bareos-fd.d/director/bareos-dir.conf \
  /etc/bareos/bareos-sd.d/director/bareos-dir.conf
```

BareOS daemons require read access to these files.

### Password Synchronization

Replace Director passwords across BareOS configs.

Input:

```
find /etc/bareos -type f ! -name "admin.conf" \
  -exec sed -i "s/Password = \".*\"/Password = \"$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 50)\"/g" {} +
```

This ensures consistent authentication credentials.

### Fix Ownership and Permissions

Set BareOS ownership on configuration files.

Input:

```
chown -R bareos:bareos /etc/bareos
```

### Apply Changes

Restart daemons to load the new configuration.

Input:

```
systemctl restart bareos-dir bareos-fd bareos-sd
```

---