# Install Requirements

#### Install slave packages

Input:

```
apt update -y
apt install -y mariadb-server pdns-server pdns-backend-mysql \
net-tools dnsutils libmariadb-dev-compat libsasl2-dev libldap2-dev \
libssl-dev libxml2-dev libxslt1-dev libxmlsec1-dev libffi-dev \
pkg-config build-essential python3-dev python3-pip
```

Output:

```
Reading package lists...
Installing...
...
```

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


