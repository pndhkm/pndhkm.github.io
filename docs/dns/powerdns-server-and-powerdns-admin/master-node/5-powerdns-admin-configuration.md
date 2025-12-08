# PowerDNS Admin Configuration

#### Edit DB configuration

Input:

```
cat << EOF > /opt/web/powerdns-admin/powerdnsadmin/default_config.py
import os
from flask_session import Session
from redis import Redis

basedir = os.path.abspath(os.path.dirname(__file__))

# Server settings
BIND_ADDRESS = '0.0.0.0'
PORT = 9191
SECRET_KEY = '6914b035-22eb-4914-8962-817eabef5393'

# CAPTCHA settings
CAPTCHA_ENABLE = True
CAPTCHA_HEIGHT = 60
CAPTCHA_LENGTH = 6
CAPTCHA_WIDTH = 160
CAPTCHA_SESSION_KEY = 'captcha_image'

# Security / cookies
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
HSTS_ENABLED = False

# SAML Authnetication
SAML_ENABLED = False
SAML_ASSERTION_ENCRYPTED = True

# Redis session
SESSION_TYPE = 'redis'
SESSION_REDIS = Redis.from_url("redis://localhost:6379")  
SESSION_PERMANENT = False

# Database (MySQL)
SQLA_DB_USER = 'powerdns'
SQLA_DB_PASSWORD = 'dbpassword'
SQLA_DB_HOST = 'localhost'
SQLA_DB_NAME = 'powerdns'

SQLALCHEMY_DATABASE_URI = 'mysql://'+SQLA_DB_USER+':'+SQLA_DB_PASSWORD+'@'+SQLA_DB_HOST+'/'+SQLA_DB_NAME
SQLALCHEMY_TRACK_MODIFICATIONS = False

### SMTP config
#MAIL_SERVER = 
#MAIL_PORT = 
#MAIL_DEBUG = 
#MAIL_USE_TLS = 
#MAIL_USE_SSL = 
#MAIL_USERNAME = 
#MAIL_PASSWORD = 
#MAIL_DEFAULT_SENDER = 

EOF
```

---

#### Prepare DB migrations

Input:

```
export FLASK_APP=powerdnsadmin/__init__.py
flask db init
flask db migrate -m "Init DB"
```
---

#### Build assets

Input:

```
npm install -g yarn@1
/usr/local/bin/yarn install --pure-lockfile
flask assets build
```

#### Create a new group for PowerDNS-Admin

```
groupadd powerdnsadmin
```

Create a user for PowerDNS-Admin:

```
useradd --system -g powerdnsadmin powerdnsadmin
```

:::info `--system` creates a user without login-shell and password, suitable for running system services.
:::

---

#### Create runtime directory on boot

Input:

```
cat << 'EOF' > /etc/tmpfiles.d/powerdns-admin.conf
d /run/powerdns-admin 0770 powerdnsadmin www-data -
EOF
```

This creates `/run/powerdns-admin` at boot owned by user **powerdnsadmin** and group **www-data**.

---

#### Create Gunicorn service

Input:

```
cat << 'EOF' > /etc/systemd/system/powerdns-admin.service
[Unit]
Description=PowerDNS-Admin
Requires=powerdns-admin.socket
After=network.target

[Service]
User=powerdnsadmin
Group=powerdnsadmin
WorkingDirectory=/opt/web/powerdns-admin
PIDFile=/run/powerdns-admin/pid
Environment=TMPDIR=/tmp

ExecStart=/opt/web/powerdns-admin/pdns/bin/gunicorn \
    --pid /run/powerdns-admin/pid \
    --bind unix:/run/powerdns-admin/socket \
    "powerdnsadmin:create_app()"

ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s TERM $MAINPID

PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
```

Gunicorn runs as user **powerdnsadmin** for correct ownership and security.

---

#### Create socket unit

Input:

```
cat << 'EOF' > /etc/systemd/system/powerdns-admin.socket
[Unit]
Description=PowerDNS-Admin socket

[Socket]
ListenStream=/run/powerdns-admin/socket
SocketUser=powerdnsadmin
SocketGroup=www-data
SocketMode=0660

[Install]
WantedBy=sockets.target
EOF
```

The socket is readable by `powerdnsadmin` and `www-data`, allowing Nginx to connect.

---

#### Fix directory ownership and permissions

Input:

```
chown -R powerdnsadmin:powerdnsadmin /opt/web/powerdns-admin
chown -R powerdnsadmin:powerdnsadmin /run/powerdns-admin
chmod 770 /run/powerdns-admin
```

#### Fix PID file path (directory must already exist)

Input:

```
install -d -m 770 -o powerdnsadmin -g powerdnsadmin /run/powerdns-admin
```

---

#### Reload systemd and enable services

Input:

```
systemctl daemon-reload
systemctl enable --now redis-server
systemctl enable powerdns-admin.socket
systemctl restart powerdns-admin.socket
systemctl restart powerdns-admin.service
systemctl restart nginx
```

---

#### Verify services

Input:

```
systemctl status powerdns-admin.service
```

Output:
```
● powerdns-admin.service - PowerDNS-Admin
     Loaded: loaded (/etc/systemd/system/powerdns-admin.service; disabled; preset: enabled)
     Active: active (running) since Mon 2025-12-08 04:45:18 UTC; 1h 39min ago
TriggeredBy: ● powerdns-admin.socket
   Main PID: 50305 (gunicorn)
      Tasks: 2 (limit: 1030)
     Memory: 104.0M
        CPU: 1.768s
     CGroup: /system.slice/powerdns-admin.service
             ├─50305 /opt/web/powerdns-admin/pdns/bin/python3 /opt/web/powerdns-admin/pdns/bin/gunicorn --pid /run/powerdns-admin/pid --bind unix:/run/powerdns-admin/so>
             └─50308 /opt/web/powerdns-admin/pdns/bin/python3 /opt/web/powerdns-admin/pdns/bin/gunicorn --pid /run/powerdns-admin/pid --bind unix:/run/powerdns-admin/so>

Dec 08 04:45:18 maste-pdns systemd[1]: Started powerdns-admin.service - PowerDNS-Admin.
Dec 08 04:45:19 maste-pdns gunicorn[50305]: [2025-12-08 04:45:19 +0000] [50305] [INFO] Starting gunicorn 20.1.0
Dec 08 04:45:19 maste-pdns gunicorn[50305]: [2025-12-08 04:45:19 +0000] [50305] [INFO] Listening at: unix:/run/powerdns-admin/socket (50305)
Dec 08 04:45:19 maste-pdns gunicorn[50305]: [2025-12-08 04:45:19 +0000] [50305] [INFO] Using worker: sync
Dec 08 04:45:19 maste-pdns gunicorn[50308]: [2025-12-08 04:45:19 +0000] [50308] [INFO] Booting worker with pid: 50308
```

#### Verify Socket

Input:

```
systemctl status powerdns-admin.socket
```

Output:

```
● powerdns-admin.socket - PowerDNS-Admin socket
     Loaded: loaded (/etc/systemd/system/powerdns-admin.socket; enabled; preset: enabled)
     Active: active (running) since Mon 2025-12-08 04:20:18 UTC; 2h 4min ago
   Triggers: ● powerdns-admin.service
     Listen: /run/powerdns-admin/socket (Stream)
      Tasks: 0 (limit: 1030)
     Memory: 0B
        CPU: 575us
     CGroup: /system.slice/powerdns-admin.socket

Dec 08 04:20:18 maste-pdns systemd[1]: Starting powerdns-admin.socket - PowerDNS-Admin socket...
Dec 08 04:20:18 maste-pdns systemd[1]: Listening on powerdns-admin.socket - PowerDNS-Admin socket.
```

This confirms Gunicorn and its socket are active and ready.


---


