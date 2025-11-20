# Prepare Systemd Deployment

#### Create dedicated service account

Input:

```
useradd -r -s /usr/sbin/nologin coredns
```

#### Install Corefile

Input:

```
mkdir -p /etc/coredns
```

Input:

```
cp Corefile /etc/coredns/Corefile
```

#### Fix ownership

Input:

```
chown -R coredns:coredns /etc/coredns /opt/geoip2/db
```

---


