# Install Requirements
:::info Tested with Debian 12
:::
###### Install packages required for PowerDNS + MySQL backend

Input:

```
apt update -y && apt install -y mariadb-server pdns-server pdns-backend-mysql \
net-tools curl git python3-dev python3-pip dnsutils libmariadb-dev-compat \
libsasl2-dev libldap2-dev libssl-dev libxml2-dev libxslt1-dev \
libxmlsec1-dev libffi-dev pkg-config apt-transport-https \
libpq-dev python3-dev build-essential npm \
python3-venv python3-full build-essential nodejs nginx certbot python3-certbot-nginx
```

Output:

```
Reading package lists...
Installing...
```

These packages install PDNS, DB server, compiler tools, and dependencies for PDNS-Admin.

---

#### Stop systemd-resolved before changing configuration
Input:
```
systemctl stop systemd-resolved
```

---

#### Link resolv.conf to the systemd managed file
Input:
```
ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

---

#### Restart systemd-resolved so the new link is active
Input:
```
systemctl restart systemd-resolved
```

---

#### Enable and start PowerDNS on system boot
Input:
```
systemctl enable --now pdns
```
---


