# PowerDNS Admin Installation

### Download the release archive

Input:

```
curl -LO https://github.com/PowerDNS-Admin/PowerDNS-Admin/archive/refs/tags/v0.4.2.tar.gz
```

---

### Extract the archive

Input:

```
tar -xzf v0.4.2.tar.gz -C /opt/web
```

---

### Create destination directory (if not exists)

Input:

```
mkdir -p /opt/web
```

---

### Move extracted folder to the target path

Input:

```
mv /opt/web/PowerDNS-Admin-0.4.2 /opt/web/powerdns-admin
```

---

### Enter the application directory

Input:

```
cd /opt/web/powerdns-admin
```


#### Prepare Virtuel Environment
```
python3 -m venv /opt/web/powerdns-admin/pdns
```

---

#### Activate environment and install dependencies

Input:

```
source /opt/web/powerdns-admin/pdns/bin/activate
pip3 install pymysql redis
pip3 install -r requirements.txt
```

---


