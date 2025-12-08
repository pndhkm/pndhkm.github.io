# Database Configuration

#### Configure MariaDB for PDNS

Input:

```
nano /etc/mysql/my.cnf
```

Example minimal MySQL config:

```
[mysqld]
bind-address = 192.168.30.2
server-id = 1
log-bin = mysql-bin
binlog-do-db = powerdns
binlog-ignore-db = mysql
binlog-ignore-db = test
```

#### Restart DB:

Input:

```
systemctl restart mariadb
```

---

#### Create PowerDNS database and user

Input:

```
mysql -u root
```

Inside MySQL:

```
CREATE DATABASE powerdns;
CREATE USER 'powerdns'@'localhost' IDENTIFIED BY 'dbpassword';
GRANT ALL PRIVILEGES ON powerdns.* TO 'powerdns'@'localhost';
FLUSH PRIVILEGES;
exit;
```

---

#### Configure PowerDNS MySQL backend

Input:
```
cat << EOF > /etc/powerdns/pdns.conf
allow-axfr-ips=192.168.30.2 192.168.30.3 
also-notify=192.168.30.2 192.168.30.3 
api=yes

api-key=6914b035-xxxx-xxxx-xxxx-xxxxxxxxxxxx
daemon=yes

default-soa-content=ns1.paha.my.id hostmaster.@ 0 1800 3600 604800 5400


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
master=yes
security-poll-suffix=
setgid=pdns
setuid=pdns
slave=no
version-string=powerdns
webserver=yes
webserver-address= #ip address of the webserver
webserver-allow-from=::/0, 0.0.0.0/0
webserver-port=8081

EOF
```

Input:

```
cat << EOF > /etc/powerdns/pdns.d/pdns.local.gmysql.conf

# MySQL Configuration
# Launch gmysql backend
launch+=gmysql
# gmysql parameters
gmysql-host=localhost
gmysql-port=3306
gmysql-dbname=powerdns
gmysql-user=powerdns
gmysql-password=dbpassword
gmysql-dnssec=yes
# gmysql-socket=

EOF
```
---
