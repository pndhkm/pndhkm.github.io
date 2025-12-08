# PowerDNS Admin Configuration

#### PowerDNS Main Configuration

Input:

```bash
cat << EOF > /etc/powerdns/pdns.conf
daemon=yes
disable-axfr=no
guardian=yes
include-dir=/etc/powerdns/pdns.d
launch=
local-address=0.0.0.0
local-port=53
log-dns-details=on
log-dns-queries=yes
log-timestamp=yes
loglevel=4
master=no
security-poll-suffix=
setgid=pdns
setuid=pdns
slave=yes
version-string=powerdns
resolver=8.8.8.8
EOF
```

#### Configure PowerDNS Admin to Use MySQL Backend

```bash
cat << EOF > /etc/powerdns/pdns.d/pdns.local.gmysql.conf
launch+=gmysql
gmysql-host=localhost
gmysql-port=3306
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=password
gmysql-dnssec=yes
EOF
```

---
